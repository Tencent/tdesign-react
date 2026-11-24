import { useDeepCompareEffect } from 'ahooks';
import classNames from 'classnames';
import last from 'lodash-es/last';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CloseIcon, ChevronRightIcon } from 'tdesign-icons-react';
import useDefault from '../_util/useDefault';
import { Popup } from '../popup';
import { RadioGroup } from '../radio';
import type { RadioOption } from '../radio';
import { Search } from '../search';
import Tabs from '../tabs';
import { StyledProps, TreeOptionData } from '../common';
import { usePrefixClass } from '../hooks/useClass';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useLatest from '../hooks/useLatest';
import parseTNode from '../_util/parseTNode';
import { cascaderDefaultProps } from './defaultProps';
import { CascaderFilterFunction, CascaderTriggerSource, TdCascaderProps } from './type';

type OptionsType = TreeOptionData[];

type FlatPath = {
  path: TreeOptionData[];
  indexes: number[];
  labels: string[];
  disabled: boolean;
  isLeaf: boolean;
};

type ResultFragment = { id: number; text: string; highlight: boolean };

type FilterResult = {
  indexes: number[];
  disabled: boolean;
  fragments: ResultFragment[];
};

export interface CascaderProps extends TdCascaderProps, StyledProps {}

function flattenPaths(
  options: OptionsType,
  keys: { label: string; value: string; children: string; disabled: string },
): FlatPath[] {
  const result: FlatPath[] = [];

  const walk = (list: TreeOptionData[], path: TreeOptionData[], indexes: number[]) => {
    list.forEach((item, idx) => {
      const nextPath = [...path, item];
      const nextIndexes = [...indexes, idx];
      const children = item[keys.children];
      // checkStrictly 下父节点也可被搜索选中，因此父节点同样生成一条路径并标记 isLeaf
      const isLeaf = !(Array.isArray(children) && children.length > 0);

      result.push({
        path: nextPath,
        indexes: nextIndexes,
        labels: nextPath.map((node) => String(node[keys.label] ?? '')),
        disabled: nextPath.some((node) => node[keys.disabled]),
        isLeaf,
      });

      if (!isLeaf) {
        walk(children as TreeOptionData[], nextPath, nextIndexes);
      }
    });
  };

  walk(options || [], [], []);
  return result;
}

function buildFragments(labels: string[], keyword: string): ResultFragment[] {
  const joined = labels.join(' / ');
  const push = (acc: ResultFragment[], text: string, highlight: boolean) => {
    if (!text) return;
    acc.push({ id: acc.length, text, highlight });
  };

  if (!keyword) return [{ id: 0, text: joined, highlight: false }];

  const fragments: ResultFragment[] = [];
  const haystack = joined.toLowerCase();
  const needle = keyword.toLowerCase();
  let cursor = 0;
  while (cursor < joined.length) {
    const hit = haystack.indexOf(needle, cursor);
    if (hit === -1) {
      push(fragments, joined.slice(cursor), false);
      break;
    }
    push(fragments, joined.slice(cursor, hit), false);
    push(fragments, joined.slice(hit, hit + needle.length), true);
    cursor = hit + needle.length;
  }
  return fragments.length ? fragments : [{ id: 0, text: joined, highlight: false }];
}

function defaultFilter(keyword: string, _option: TreeOptionData, path: TreeOptionData[], labelKey: string): boolean {
  const lower = keyword.toLowerCase();
  const joined = path
    .map((node) => String(node?.[labelKey] ?? ''))
    .join('')
    .toLowerCase();
  const text = String(path[path.length - 1]?.text ?? '').toLowerCase();
  return joined.includes(lower) || (!!text && text.includes(lower));
}

const Cascader: React.FC<CascaderProps> = (props) => {
  const cascaderClass = usePrefixClass('cascader');
  const globalConfig = useConfig();

  const {
    className,
    style,
    value,
    defaultValue,
    visible,
    title,
    header,
    middleContent,
    placeholder,
    theme,
    subTitles,
    options: inputOptions,
    overlayProps,
    keys,
    checkStrictly,
    closeBtn,
    load,
    filter,
    filterPlaceholder,
    filterable,
    onChange,
    onClose,
    onPick,
  } = useDefaultProps<CascaderProps>(props, cascaderDefaultProps);

  const placeholderText = placeholder ?? globalConfig?.cascader?.placeholder;
  const filterPlaceholderText = filterPlaceholder ?? globalConfig?.cascader?.filterPlaceholder;

  const [internalValue, setInternalValue] = useDefault(value, defaultValue, onChange);
  const [internalVisible, setInternalVisible] = useDefault(visible, false, () => ({}));
  const [internalSelectedValues, setInternalSelectedValues] = useState<CascaderProps['value'][]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  // 搜索相关状态
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterResults, setFilterResults] = useState<FilterResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const filterDebouncedRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedKeys = useMemo(
    () => ({
      label: keys?.label ?? 'label',
      value: keys?.value ?? 'value',
      children: keys?.children ?? 'children',
      disabled: keys?.disabled ?? 'disabled',
    }),
    [keys],
  );

  const normalizeOptionsByKeys = useCallback(
    (sourceOptions: TreeOptionData[]) => {
      const convert = (options: TreeOptionData[]): TreeOptionData[] =>
        options.map((item) => {
          const itemChildren = item[normalizedKeys.children];
          return {
            data: item,
            label: item[normalizedKeys.label],
            value: item[normalizedKeys.value],
            children: Array.isArray(itemChildren) ? convert(itemChildren) : itemChildren === true,
            disabled: item[normalizedKeys.disabled],
          };
        });

      return convert(sourceOptions);
    },
    [normalizedKeys],
  );

  const options = useMemo(() => normalizeOptionsByKeys(inputOptions), [inputOptions, normalizeOptionsByKeys]);

  const getOptionsList = useCallback((rootOptions: TreeOptionData[], selectedValues: CascaderProps['value'][]) => {
    const nextOptionsList: TreeOptionData[][] = [rootOptions];

    for (const selectedValue of selectedValues) {
      const nextOptions = last(nextOptionsList)?.find((item) => item.value === selectedValue);
      if (!nextOptions || !Array.isArray(nextOptions.children) || nextOptions.children.length === 0) break;
      nextOptionsList.push(nextOptions.children);
    }

    return nextOptionsList;
  }, []);

  const [optionsList, setOptionsList] = useState<TreeOptionData[][]>([options]);

  const labelList = useMemo(
    () =>
      optionsList.map((currentOptions, index) => {
        const target = currentOptions.find((item) => item.value === internalSelectedValues[index]);
        return target
          ? { label: target.label, isPlaceholder: false }
          : {
              label: placeholderText,
              isPlaceholder: true,
            };
      }),
    [optionsList, internalSelectedValues, placeholderText],
  );

  const selectedValuesByInterValue = useMemo(() => {
    const findValues = (items: TreeOptionData[]): CascaderProps['value'][] => {
      for (const item of items) {
        if (checkStrictly && item.value === internalValue) return [item.value];

        if (!Array.isArray(item.children) || item.children.length === 0) {
          if (item.value === internalValue) return [item.value];
          continue;
        }

        const childValues = findValues(item.children);
        if (childValues.length) return [item.value as CascaderProps['value'], ...childValues];
      }
      return [];
    };

    return findValues(options);
  }, [checkStrictly, internalValue, options]);

  useDeepCompareEffect(() => {
    setInternalSelectedValues(selectedValuesByInterValue);
    setOptionsList(getOptionsList(options, selectedValuesByInterValue));
    setStepIndex(selectedValuesByInterValue.length);
  }, [options, selectedValuesByInterValue, getOptionsList]);

  useEffect(() => {
    const revisedStepIndex = Math.max(Math.min(stepIndex, optionsList.length - 1), 0);
    if (revisedStepIndex !== stepIndex) setStepIndex(revisedStepIndex);
  }, [optionsList, stepIndex]);

  const onFinish = useCallback(
    (selectedValues: CascaderProps['value'][]) => {
      const selectedOptions = optionsList.slice(0, selectedValues.length).map((currentOptions, index) => {
        const target = currentOptions.find((item) => item.value === selectedValues[index]);
        return {
          [normalizedKeys.label]: target?.label || '',
          [normalizedKeys.value]: target?.value || '',
        };
      });

      setInternalValue(last(selectedValues), selectedOptions as any);
      setInternalVisible(false);
      onClose?.('finish');
    },
    [onClose, normalizedKeys, optionsList, setInternalValue, setInternalVisible],
  );

  // 搜索相关函数
  const flatPaths = useMemo(() => flattenPaths(inputOptions, normalizedKeys), [inputOptions, normalizedKeys]);

  const resetFilter = useCallback(() => {
    setFilterKeyword('');
    setFilterResults([]);
    setIsSearching(false);
  }, []);

  const applyFilter = useCallback(
    (rawKeyword: string) => {
      const keyword = String(rawKeyword ?? '').trim();
      if (!keyword) {
        resetFilter();
        return;
      }

      const userFilter = filter as CascaderFilterFunction | null;
      const results: FilterResult[] = [];

      flatPaths.forEach((entry: FlatPath) => {
        // 非 checkStrictly 仅保留叶子节点，checkStrictly 时父节点也可被搜索选中
        if (!checkStrictly && !entry.isLeaf) return;

        const leaf = entry.path[entry.path.length - 1];
        const matched =
          typeof userFilter === 'function'
            ? !!userFilter(keyword, leaf, entry.path)
            : defaultFilter(keyword, leaf, entry.path, normalizedKeys.label);
        if (matched) {
          results.push({
            indexes: entry.indexes,
            disabled: entry.disabled,
            fragments: buildFragments(entry.labels, keyword),
          });
        }
      });

      setFilterResults(results);
      setIsSearching(true);
    },
    [filter, normalizedKeys, flatPaths, resetFilter, checkStrictly],
  );

  const applyFilterLatest = useLatest(applyFilter);

  // options 变化时，若处于搜索态，基于最新数据重新过滤，避免结果过期
  useEffect(() => {
    if (isSearching) {
      applyFilter(filterKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatPaths]);

  const handleFilterChange = useCallback(
    (value: string) => {
      const trimmed = String(value ?? '').trim();
      setFilterKeyword(trimmed);
      if (filterDebouncedRef.current) {
        clearTimeout(filterDebouncedRef.current);
      }
      filterDebouncedRef.current = setTimeout(() => {
        applyFilterLatest.current(trimmed);
      }, 200);
    },
    [applyFilterLatest],
  );

  const handleFilterClear = useCallback(() => {
    if (filterDebouncedRef.current) {
      clearTimeout(filterDebouncedRef.current);
    }
    resetFilter();
  }, [resetFilter]);

  const handleFilterResultTap = useCallback(
    (result: FilterResult) => {
      if (result.disabled || result.indexes.length === 0) return;

      const { indexes } = result;
      const labelKey = normalizedKeys.label;
      const valueKey = normalizedKeys.value;
      const childrenKey = normalizedKeys.children;

      // 遍历路径，找到最终节点及其层级
      let current: TreeOptionData[] = inputOptions;
      let finalNode: TreeOptionData | undefined;
      let finalLevel = 0;
      const selectedValues: CascaderProps['value'][] = [];
      const selectedOptions: { [key: string]: any }[] = [];

      for (let i = 0; i < indexes.length; i++) {
        const index = indexes[i];
        const next = current[index];
        // options 可能已变化，索引失效时直接终止，避免访问越界
        if (!next) return;
        selectedValues.push(next[valueKey]);
        selectedOptions.push({
          [labelKey]: next[labelKey],
          [valueKey]: next[valueKey],
        });
        finalNode = next;
        finalLevel = i;

        const children = next[childrenKey];
        if (Array.isArray(children) && children.length > 0) {
          current = children as TreeOptionData[];
        }
      }

      onPick?.({
        value: finalNode[valueKey],
        label: String(finalNode[labelKey] || ''),
        index: indexes[indexes.length - 1],
        level: finalLevel,
      });

      if (finalNode && finalNode[childrenKey] === true && load) {
        load({ data: finalNode, value: finalNode[valueKey], label: finalNode[labelKey] })
          .then((loadedChildren) => {
            setInternalSelectedValues(selectedValues);
            setOptionsList((prev) => [...prev.slice(0, finalLevel + 1), normalizeOptionsByKeys(loadedChildren)]);
            setStepIndex(finalLevel + 1);
            resetFilter();
          })
          .catch((error) => {
            console.error('Load children failed:', error);
          });
        return;
      }

      resetFilter();
      setInternalValue(last(selectedValues), selectedOptions as any);
      setInternalVisible(false);
      onClose?.('finish');
    },
    [
      normalizedKeys,
      inputOptions,
      setInternalValue,
      setInternalVisible,
      onClose,
      resetFilter,
      onPick,
      load,
      normalizeOptionsByKeys,
    ],
  );

  // 清理防抖定时器
  useEffect(
    () => () => {
      if (filterDebouncedRef.current) {
        clearTimeout(filterDebouncedRef.current);
      }
    },
    [],
  );

  // visible 变化时重置搜索状态
  useEffect(() => {
    if (!internalVisible) {
      resetFilter();
    }
  }, [internalVisible, resetFilter]);

  // filterable 关闭时重置搜索状态
  useEffect(() => {
    if (!filterable && isSearching) {
      resetFilter();
    }
  }, [filterable, isSearching, resetFilter]);

  return (
    <Popup
      visible={internalVisible}
      placement="bottom"
      overlayProps={overlayProps}
      onVisibleChange={(nextVisible, trigger) => {
        setInternalVisible(nextVisible);
        onClose?.(trigger as CascaderTriggerSource);
      }}
    >
      <div className={classNames(cascaderClass, className)} style={style}>
        <div className={`${cascaderClass}__title`}>{parseTNode(title)}</div>
        <div
          className={`${cascaderClass}__close-btn`}
          onClick={() => {
            if (checkStrictly) {
              onFinish(internalSelectedValues);
              return;
            }
            setInternalVisible(false);
            onClose?.('close-btn');
          }}
        >
          {closeBtn === true ? <CloseIcon size={24} /> : parseTNode(closeBtn)}
        </div>
        {parseTNode(header)}
        <div className={`${cascaderClass}__content`}>
          {/* 搜索框 */}
          {filterable && (
            <div className={`${cascaderClass}__filter`}>
              <Search
                value={filterKeyword}
                placeholder={filterPlaceholderText}
                clearable
                onChange={handleFilterChange}
                onClear={handleFilterClear}
              />
            </div>
          )}

          {!isSearching ? (
            <>
              {labelList.length > 0 && (
                <div>
                  {theme === 'step' ? (
                    <div className={`${cascaderClass}__steps`}>
                      {labelList.map((labelItem, index) => (
                        <div key={index} className={`${cascaderClass}__step`} onClick={() => setStepIndex(index)}>
                          <div
                            className={classNames(`${cascaderClass}__step-dot`, {
                              [`${cascaderClass}__step-dot--active`]: !labelItem.isPlaceholder,
                              [`${cascaderClass}__step-dot--last`]: index === labelList.length - 1,
                            })}
                          />
                          <div
                            className={classNames(`${cascaderClass}__step-label`, {
                              [`${cascaderClass}__step-label--active`]: index === stepIndex,
                            })}
                          >
                            {parseTNode(labelItem.label)}
                          </div>
                          <ChevronRightIcon size={22} className={`${cascaderClass}__step-arrow`} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {theme === 'tab' && internalVisible ? (
                    <Tabs
                      list={labelList.map((item, index) => ({
                        label: item.label,
                        value: index,
                      }))}
                      spaceEvenly={false}
                      value={stepIndex}
                      onChange={(nextValue: number) => {
                        setStepIndex(nextValue);
                      }}
                    />
                  ) : null}
                </div>
              )}
              {parseTNode(middleContent)}
              {subTitles[stepIndex] ? (
                <div className={`${cascaderClass}__options-title`}>{subTitles[stepIndex]}</div>
              ) : null}
              <div
                className={`${cascaderClass}__options-container`}
                style={{
                  width: `${optionsList.length}00vw`,
                  transform: `translateX(-${stepIndex}00vw)`,
                }}
              >
                {optionsList.map((currentOptions, index) => (
                  <div className={`${cascaderClass}__options`} key={index}>
                    <div className={`${cascaderClass}-radio-group-${index}`}>
                      <RadioGroup
                        placement="right"
                        icon="line"
                        borderless
                        value={internalSelectedValues[index]}
                        options={currentOptions as RadioOption[]}
                        onChange={(nextValue: string | number) => {
                          const targetIndex = currentOptions.findIndex((item) => item.value === nextValue);
                          const target = currentOptions[targetIndex];
                          const selectedValues = [...internalSelectedValues.slice(0, index), nextValue];

                          setInternalSelectedValues(selectedValues);
                          onPick?.({
                            value: nextValue,
                            label: String(target?.label || ''),
                            index: targetIndex,
                            level: index,
                          });

                          if (target?.children === true && load) {
                            load({ data: target.data, value: target.value, label: target.label })
                              .then((loadedChildren) => {
                                setOptionsList((prev) => [
                                  ...prev.slice(0, index + 1),
                                  normalizeOptionsByKeys(loadedChildren),
                                ]);
                                setStepIndex(index + 1);
                              })
                              .catch((error) => {
                                console.error('Load children failed:', error);
                              });
                            return;
                          }

                          if (target && Array.isArray(target.children) && target.children.length > 0) {
                            const children = target.children as TreeOptionData[];
                            setOptionsList((prev) => [...prev.slice(0, index + 1), children]);
                            setStepIndex(index + 1);
                            return;
                          }

                          setOptionsList((prev) => prev.slice(0, index + 1));
                          setStepIndex(index);
                          onFinish(selectedValues);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {filterResults.length > 0 ? (
                <div className={`${cascaderClass}__filter-result`}>
                  {filterResults.map((result) => (
                    <div
                      key={result.indexes.join('-')}
                      className={classNames(`${cascaderClass}__filter-result-item`, {
                        [`${cascaderClass}__filter-result-item--disabled`]: result.disabled,
                      })}
                      onClick={() => handleFilterResultTap(result)}
                    >
                      {result.fragments.map((frag) => (
                        <span
                          key={frag.id}
                          className={classNames({
                            [`${cascaderClass}__filter-highlight`]: frag.highlight,
                          })}
                        >
                          {frag.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`${cascaderClass}__filter-empty`}>{globalConfig?.cascader?.empty}</div>
              )}
            </>
          )}
        </div>
      </div>
    </Popup>
  );
};

Cascader.displayName = 'Cascader';

export default Cascader;
