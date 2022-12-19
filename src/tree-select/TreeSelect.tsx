import React, { useCallback, useMemo, useRef, forwardRef, ElementRef, useEffect, useImperativeHandle } from 'react';

import classNames from 'classnames';
import type { TdTreeSelectProps, TreeSelectValue } from './type';
import type { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';

import Tree, { TreeProps } from '../tree';
import SelectInput, { SelectInputProps } from '../select-input/SelectInput';

import { usePersistFn } from '../_util/usePersistFn';
import useSwitch from '../_util/useSwitch';
import noop from '../_util/noop';
import { useTreeSelectUtils } from './useTreeSelectUtils';
import { SelectArrow } from './SelectArrow';
import { useTreeSelectPassThroughProps } from './useTreeSelectPassthoughProps';
import { useTreeSelectLocale } from './useTreeSelectLocale';
import { treeSelectDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';

export interface TreeSelectProps extends TdTreeSelectProps, StyledProps {}

export interface NodeOptions {
  label: string;
  value: string | number;
}

const useMergeFn = <T extends any[]>(...fns: Array<(...args: T) => void>) =>
  usePersistFn((...args: T) => fns.forEach((fn) => fn?.(...args)));

const TreeSelect = forwardRef((props: TreeSelectProps, ref) => {
  /* ---------------------------------config---------------------------------------- */

  // 国际化文本初始化
  const { placeholder, empty, loadingItem } = useTreeSelectLocale(props);

  const { classPrefix } = useConfig();

  /* ---------------------------------state---------------------------------------- */

  const {
    className,
    onInputChange,
    readonly,
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
    inputProps,
    onBlur,
    onFocus,
    onSearch,
    onRemove,
  } = props;

  const selectInputProps = useTreeSelectPassThroughProps(props);
  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const [popupVisible, setPopupVisible] = useControlled(props, 'popupVisible', props.onPopupVisibleChange);
  const [hover, hoverAction] = useSwitch();
  const [filterInput, setFilterInput] = useControlled(props, 'inputValue', onInputChange);

  const treeRef = useRef<ElementRef<typeof Tree>>();
  const selectInputRef = useRef();

  const { normalizeValue, formatValue, getNodeItem } = useTreeSelectUtils(props, treeRef);

  useImperativeHandle(ref, () => ({
    ...(selectInputRef.current || {}),
    ...(treeRef.current || {}),
  }));

  /* ---------------------------------computed value---------------------------------------- */

  const filterable = rawFilterable || !!props.filter;

  const normalizedValue = useMemo(() => {
    const calcValue: TreeSelectValue[] = Array.isArray(value) ? value : [value];
    return calcValue.reduce<NodeOptions[]>((result, value) => {
      const normalized = normalizeValue(value);
      normalized.value && result.push(normalized);
      return result;
    }, []);
    // data 发生变更时，normalizedValue 也需要更新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizeValue, value, data]);

  const internalInputValue = useMemo(() => {
    if (multiple) return normalizedValue;
    // 可筛选、单选、弹框时内容为过滤值
    return filterable && popupVisible ? filterInput : normalizedValue[0] || '';
  }, [multiple, normalizedValue, filterable, popupVisible, filterInput]);

  const normalizedValueDisplay = useMemo(() => {
    if (!valueDisplay) {
      return;
    }
    if (typeof valueDisplay === 'string') return valueDisplay;
    if (multiple) return ({ onClose }) => valueDisplay({ value: normalizedValue, onClose });
    return normalizedValue.length ? (valueDisplay({ value: normalizedValue[0], onClose: noop }) as string) : '';
  }, [valueDisplay, multiple, normalizedValue]);

  const internalInputValueDisplay = useMemo(() => {
    // 只有单选且下拉展开时需要隐藏 valueDisplay
    if (filterable && !multiple && popupVisible) {
      return undefined;
    }
    return normalizedValueDisplay;
  }, [filterable, popupVisible, multiple, normalizedValueDisplay]);

  const inputPlaceholder = useMemo(() => {
    // 可筛选、单选、弹框且有值时提示当前值
    if (filterable && !multiple && popupVisible && normalizedValue.length) {
      // 设置了 valueDisplay 时，优先展示 valueDisplay
      const valueDisplayPlaceholder = normalizedValueDisplay;
      if (typeof valueDisplayPlaceholder === 'string') {
        return valueDisplayPlaceholder;
      }

      return typeof normalizedValue[0].label === 'string' ? normalizedValue[0].label : String(normalizedValue[0].value);
    }
    return placeholder;
  }, [filterable, multiple, popupVisible, normalizedValue, placeholder, normalizedValueDisplay]);

  const showLoading = !disabled && loading;

  /* ---------------------------------handler---------------------------------------- */

  const handleFilter = useCallback<TreeProps['filter']>(
    (node) => (filterable ? filter(filterInput as string, node) : true),
    [filter, filterInput, filterable],
  );

  const handleSingleChange = usePersistFn<TreeProps['onActive']>((value, context) => {
    const $value = value.length ? value[0] : null;
    onChange(formatValue($value, context.node.label), { ...context, trigger: $value === null ? 'uncheck' : 'check' });
    // 单选选择后收起弹框
    setPopupVisible(false, { trigger: 'trigger-element-click' });
  });

  const handleMultiChange = usePersistFn<TreeProps['onChange']>((value, context) => {
    (max === 0 || value.length <= max) &&
      onChange(
        value.map((value) => formatValue(value, getNodeItem(value)?.label)),
        { ...context, trigger: value.length > normalizedValue.length ? 'check' : 'uncheck' },
      );
  });

  const handleClear = usePersistFn<SelectInputProps['onClear']>((ctx) => {
    ctx.e.stopPropagation();
    onChange(multiple ? [] : formatValue(null), {
      node: null,
      trigger: 'clear',
      e: ctx.e as React.MouseEvent<any, any>,
    });
    onClear?.(ctx);
    // 清空后收起弹框
    setPopupVisible(false, { trigger: 'trigger-element-click' });
  });

  const handleRemove = usePersistFn((index: number, e?: React.MouseEvent<any, any>) => {
    const node = getNodeItem(normalizedValue[index].value);
    onChange(
      normalizedValue.filter((value, i) => i !== index).map(({ value, label }) => formatValue(value, label)),
      { node, trigger: 'tag-remove', e },
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

  const handleFilterChange = usePersistFn<SelectInputProps['onInputChange']>((value) => setFilterInput(value));

  /* ---------------------------------effect---------------------------------------- */

  useEffect(() => {
    // 显示时清空过滤，隐藏时清空有动画会导致闪动
    popupVisible && setFilterInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupVisible]);

  useEffect(() => {
    // 选中值时清空过滤项
    setFilterInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* ---------------------------------render---------------------------------------- */

  const renderTree = () => {
    if (readonly) return empty;
    if (showLoading) return loadingItem;
    return (
      <Tree
        ref={treeRef}
        hover
        transition
        expandAll
        filter={handleFilter}
        data={data}
        disabled={disabled}
        empty={empty}
        allowFoldNodeOnFilter={true}
        expandOnClickNode={true}
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
  };

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

  return (
    <SelectInput
      status={props.status}
      tips={props.tips}
      {...props.selectInputProps}
      {...selectInputProps}
      ref={selectInputRef}
      className={classNames(`${classPrefix}-tree-select`, className)}
      value={internalInputValue}
      inputValue={filterInput}
      panel={renderTree()}
      allowInput={filterable}
      inputProps={{ ...inputProps, size }}
      tagInputProps={{ size, excessTagsDisplayType: 'break-line', inputProps, tagProps: props.tagProps }}
      placeholder={inputPlaceholder}
      popupVisible={popupVisible && !disabled}
      onInputChange={handleFilterChange}
      onPopupVisibleChange={useMergeFn(setPopupVisible)}
      onFocus={useMergeFn(handleFocus)}
      onBlur={useMergeFn(handleBlur)}
      onClear={handleClear}
      onTagChange={handleTagChange}
      onEnter={handleEnter}
      onMouseenter={hoverAction.on}
      onMouseleave={hoverAction.off}
      suffixIcon={
        readonly ? null : (
          <SelectArrow isActive={popupVisible} isHighlight={hover || popupVisible} disabled={disabled} />
        )
      }
      collapsedItems={renderCollapsedItems}
      label={parseTNode(prefixIcon)}
      valueDisplay={internalInputValueDisplay}
    />
  );
});

TreeSelect.displayName = 'TreeSelect';
TreeSelect.defaultProps = treeSelectDefaultProps;

export default TreeSelect;
