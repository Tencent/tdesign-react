import React, { useState, useCallback, useMemo, useRef, forwardRef, ElementRef, useEffect } from 'react';

import classNames from 'classnames';
import type { TdTreeSelectProps, TreeSelectValue } from './type';
import type { StyledProps } from '../common';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';

import Tree, { TreeProps } from '../tree';
import SelectInput, { SelectInputProps } from '../select-input/SelectInput';

import { usePersistFn } from '../_util/usePersistFn';
import useSwitch from '../_util/useSwitch';
import noop from '../_util/noop';
import { useTreeSelectUtils } from './useTreeSelectUtils';
import { TreeSelectArrow } from './TreeSelectArrow';
import { useTreeSelectPassThroughProps } from './useTreeSelectPassthoughProps';
import { useTreeSelectLocale } from './useTreeSelectLocale';

export interface TreeSelectProps extends TdTreeSelectProps, StyledProps {}

export interface NodeOptions {
  label: string;
  value: string | number;
}

const useMergeFn = <T extends any[]>(...fns: Array<(...args: T) => void>) =>
  usePersistFn((...args: T) => fns.forEach((fn) => fn?.(...args)));

const TreeSelect = forwardRef((props: TreeSelectProps, ref: React.Ref<HTMLDivElement>) => {
  /* ---------------------------------config---------------------------------------- */

  // 国际化文本初始化
  const { placeholder, empty, loadingItem } = useTreeSelectLocale(props);

  const { classPrefix } = useConfig();

  /* ---------------------------------state---------------------------------------- */

  const {
    className,
    disabled,
    multiple,
    prefixIcon,
    loading,
    size,
    max,
    data,
    filter = (text, option) => option.label.includes(text),
    filterable: rawFilterable,
    onClear,
    valueDisplay,
    treeProps,
    onBlur,
    onFocus,
    onSearch,
    onRemove,
  } = props;

  const selectInputProps = useTreeSelectPassThroughProps(props);
  const [value, onChange] = useDefault(props.value, props.defaultValue ?? multiple ? [] : null, props.onChange);
  const [popupVisible, popupAction] = useSwitch();
  const [hover, hoverAction] = useSwitch();
  const [filterInput, setFilterInput] = useState<string | number>('');

  const $tree = useRef<ElementRef<typeof Tree>>();

  const { normalizeValue, formatValue, getNodeItem } = useTreeSelectUtils(props, $tree);

  /* ---------------------------------computed value---------------------------------------- */

  const filterable = useMemo(() => rawFilterable || !!props.filter, [props.filter, rawFilterable]);

  const normalizedValue = useMemo(
    () => (multiple ? (value as TreeSelectValue[]) : [value]).map(normalizeValue).filter(({ value }) => value ?? false),
    [multiple, normalizeValue, value],
  );

  const filterText = useMemo(() => String(filterInput), [filterInput]);

  const inputValue = useMemo(() => {
    if (multiple) return normalizedValue;
    // 可筛选、单选、弹框时内容为过滤值
    return filterable && popupVisible ? filterText : normalizedValue[0];
  }, [multiple, normalizedValue, filterable, popupVisible, filterText]);

  const inputPlaceholader = useMemo(() => {
    // 可筛选、单选、弹框且有值时提示当前值
    if (filterable && !multiple && popupVisible && normalizedValue.length) {
      return typeof normalizedValue[0].label === 'string' ? normalizedValue[0].label : normalizedValue[0].value;
    }
    return placeholder;
  }, [filterable, multiple, popupVisible, normalizedValue, placeholder]);

  const showLoading = useMemo(() => !disabled && loading, [loading, disabled]);

  const showFakePlaceholder = useMemo(
    // 多选不能过滤时需要展示假的 placeholder
    () => multiple && !filterable && !normalizedValue.length,
    [filterable, multiple, normalizedValue],
  );

  /* ---------------------------------handler---------------------------------------- */

  const handleFilter = useCallback<TreeProps['filter']>(
    (node) => (filterable ? filter(filterText, node) : true),
    [filter, filterText, filterable],
  );

  const handleSingleChange = usePersistFn<TreeProps['onActive']>((value, context) => {
    const $value = value.length ? value[0] : null;
    onChange(formatValue($value, context.node.label), context);
    // 单选选择后收起弹框
    popupAction.off();
  });

  const handleMultiChange = usePersistFn<TreeProps['onChange']>((value, context) => {
    (max === 0 || value.length <= max) &&
      onChange(
        value.map((value) => formatValue(value, getNodeItem(value)?.label)),
        context,
      );
  });

  const handleClear = usePersistFn<SelectInputProps['onClear']>((ctx) => {
    ctx.e.stopPropagation();
    onChange(multiple ? [] : formatValue(null), { node: null });
    onClear?.(ctx);
    // 清空后收起弹框
    popupAction.off();
  });

  const handleRemove = usePersistFn((index: number, e?: React.MouseEvent<any, any>) => {
    const node = getNodeItem(normalizedValue[index].value);
    onChange(
      normalizedValue.filter((value, i) => i !== index).map(({ value, label }) => formatValue(value, label)),
      { node },
    );
    onRemove?.({ value: node.value, data: { value: node.value, label: node.label }, e });
  });

  const handleTagChange = usePersistFn<SelectInputProps['onTagChange']>((tags, ctx) => {
    switch (ctx.trigger) {
      case 'clear':
        handleClear({ e: ctx.e as React.MouseEvent<SVGElement, MouseEvent> });
        break;
      case 'tag-remove':
        handleRemove(ctx.index, ctx.e as React.MouseEvent<SVGElement, MouseEvent>);
        break;
      case 'backspace':
        handleRemove(ctx.index);
    }
  });

  const handleBlur = usePersistFn<SelectInputProps['onBlur']>((v, ctx) => {
    onBlur?.({ value: multiple ? normalizedValue : normalizedValue[0], e: ctx.e });
  });

  const handleFocus = usePersistFn<SelectInputProps['onFocus']>((v, ctx) => {
    onFocus?.({ value: multiple ? normalizedValue : normalizedValue[0], e: ctx.e });
  });

  const handleEnter = usePersistFn<SelectInputProps['onEnter']>((text) => {
    onSearch?.(text as string);
  });

  const handleFilterChange = usePersistFn<SelectInputProps['onInputChange']>((value, { trigger }) => {
    // blur 时不应该清空值，应该当弹出框消失时清空
    if (trigger !== 'blur') {
      setFilterInput(value);
    }
  });

  /* ---------------------------------effect---------------------------------------- */

  useEffect(() => {
    // 显示时清空过滤，隐藏时清空有动画会导致闪动
    popupVisible && setFilterInput('');
  }, [popupVisible]);

  /* ---------------------------------render---------------------------------------- */

  const renderTree = () =>
    showLoading ? (
      loadingItem
    ) : (
      <Tree
        ref={$tree}
        hover
        transition
        expandAll
        filter={handleFilter}
        data={data}
        disabled={disabled}
        empty={empty}
        {...(multiple
          ? {
              checkable: true,
              onChange: handleMultiChange,
              value: normalizedValue.map(({ value }) => value),
            }
          : {
              activable: true,
              actived: normalizedValue.map(({ value }) => value),
              onActive: handleSingleChange,
            })}
        {...treeProps}
      />
    );

  const renderCollapsedItems = useMemo(
    () =>
      props.collapsedItems
        ? () =>
            props.collapsedItems({
              value: normalizedValue,
              collapsedSelectedItems: normalizedValue.slice(props.minCollapsedNum, normalizedValue.length),
              count: normalizedValue.length - props.minCollapsedNum,
            })
        : null,
    [normalizedValue, props],
  );

  const renderLabel = () =>
    showFakePlaceholder ? (
      <>
        {prefixIcon}
        <span className={`${classPrefix}-tree-select--placeholder`}>{placeholder}</span>
      </>
    ) : (
      prefixIcon
    );

  const normalizedValueDisplay = () => {
    if (multiple) return ({ onClose }) => valueDisplay({ value: normalizedValue, onClose });
    return normalizedValue.length ? (valueDisplay({ value: normalizedValue[0], onClose: noop }) as string) : '';
  };

  return (
    <SelectInput
      {...selectInputProps}
      ref={ref}
      className={classNames(
        `${classPrefix}-tree-select`,
        {
          [`${classPrefix}-tree-select--without-input`]: multiple && !filterable,
        },
        className,
      )}
      value={inputValue}
      inputValue={popupVisible ? filterText : ''}
      panel={renderTree()}
      allowInput={multiple || filterable}
      inputProps={{ size }}
      tagInputProps={{ size, excessTagsDisplayType: 'break-line' }}
      placeholder={inputPlaceholader}
      popupVisible={popupVisible && !disabled}
      onInputChange={handleFilterChange}
      onPopupVisibleChange={useMergeFn(popupAction.set)}
      onFocus={useMergeFn(handleFocus, popupAction.on)}
      onBlur={useMergeFn(handleBlur)}
      onClear={handleClear}
      onTagChange={handleTagChange}
      onEnter={handleEnter}
      onMouseenter={hoverAction.on}
      onMouseleave={hoverAction.off}
      suffixIcon={<TreeSelectArrow isActive={popupVisible} isHighlight={hover || popupVisible} disabled={disabled} />}
      collapsedItems={renderCollapsedItems}
      label={renderLabel()}
      valueDisplay={valueDisplay && normalizedValueDisplay()}
    />
  );
});

TreeSelect.displayName = 'TreeSelect';

TreeSelect.defaultProps = {
  clearable: false,
  data: [],
  disabled: false,
  filterable: false,
  loading: false,
  max: 0,
  multiple: false,
  size: 'medium',
  valueType: 'value',
  minCollapsedNum: 0,
};

export default TreeSelect;
