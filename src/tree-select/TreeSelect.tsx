import React, { useCallback, useMemo, useRef, forwardRef, ElementRef, useImperativeHandle } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import type { TdTreeSelectProps, TreeSelectValue } from './type';
import type { StyledProps, TreeOptionData } from '../common';
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

export interface TreeSelectProps<DataOption extends TreeOptionData = TreeOptionData>
  extends TdTreeSelectProps<DataOption>,
    StyledProps {}

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
    panelTopContent,
    panelBottomContent,
    filter: rawFilter,
    filterable: rawFilterable,
    onClear,
    valueDisplay,
    treeProps,
    inputProps,
    valueType,
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

  const tKeys = useMemo(
    () => ({
      value: 'value',
      label: 'label',
      children: 'children',
      ...props.keys,
    }),
    [props.keys],
  );

  const { normalizeValue, formatValue, getNodeItem } = useTreeSelectUtils(props, treeRef);

  useImperativeHandle(ref, () => ({
    ...(selectInputRef.current || {}),
    ...(treeRef.current || {}),
  }));

  /* ---------------------------------computed value---------------------------------------- */

  const defaultFilter = (text, option) => {
    if (!text) return true;
    // 过滤时会有空节点影响判断
    if (!option.label && !option.value) return false;
    if (option.label && typeof option.label === 'string') {
      return option.label.includes(text);
    }
    if (option.data.text && typeof option.data.text === 'string') {
      return option.data.text.includes(text);
    }
    return true;
  };

  // priority of onSearch is higher than props.filter
  const filter = onSearch ? undefined : rawFilter || defaultFilter;
  const filterable = rawFilterable || !!props.filter;

  const normalizedValue = useMemo(() => {
    const calcValue: TreeSelectValue[] = Array.isArray(value) ? value : [value];
    return calcValue.reduce<NodeOptions[]>((result, value) => {
      const normalized = normalizeValue(value);
      typeof normalized.value !== 'undefined' && result.push(normalized);
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

  // @ts-ignore TODO: remove it
  const normalizedValueDisplay: SelectInputProps['valueDisplay'] = useMemo(() => {
    if (!valueDisplay) {
      return;
    }
    if (multiple) {
      return ({ onClose }) =>
        isFunction(valueDisplay) ? valueDisplay({ value: normalizedValue, onClose }) : valueDisplay;
    }
    const displayNode = isFunction(valueDisplay)
      ? valueDisplay({ value: normalizedValue[0], onClose: noop })
      : valueDisplay;
    return normalizedValue.length ? displayNode : '';
  }, [valueDisplay, multiple, normalizedValue]);

  const internalInputValueDisplay: SelectInputProps['valueDisplay'] = useMemo(() => {
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
    (node) => (filterable && filter ? filter(filterInput as string, node) : true),
    [filter, filterInput, filterable],
  );

  const handleSingleChange = usePersistFn<TreeProps['onActive']>((value, context) => {
    const $value = Array.isArray(value) && value.length ? value[0] : undefined;
    onChange(formatValue($value, context.node.label), {
      ...context,
      data: context.node.data,
      trigger: 'check',
    });
    // 单选选择后收起弹框
    setPopupVisible(false, { ...context, trigger: 'trigger-element-click' });
    filterInput && setFilterInput('', { trigger: 'change' });
  });

  const handleMultiChange = usePersistFn<TreeProps['onChange']>((value, context) => {
    if (max === 0 || value.length <= max) {
      onChange(
        value.map((value) => formatValue(value, getNodeItem(value)?.label)),
        {
          ...context,
          data: context.node.data,
          trigger: value.length > normalizedValue.length ? 'check' : 'uncheck',
        },
      );
      filterInput && setFilterInput('', { trigger: 'change' });
    }
  });

  const onInnerPopupVisibleChange: SelectInputProps['onPopupVisibleChange'] = (visible, ctx) => {
    !visible && filterInput && setFilterInput('', { trigger: 'clear' });
    setPopupVisible(visible, { e: ctx.e });
  };

  const handleClear = usePersistFn<SelectInputProps['onClear']>((ctx) => {
    ctx.e.stopPropagation();
    onChange(multiple ? [] : formatValue(undefined), {
      node: null,
      data: null,
      trigger: 'clear',
      e: ctx.e as React.MouseEvent<any, any>,
    });
    onClear?.(ctx);
    // 清空后收起弹框
    setPopupVisible(false, { trigger: 'clear' });
  });

  const handleTagChange = usePersistFn<SelectInputProps['onTagChange']>((tags, ctx) => {
    if (ctx.trigger === 'tag-remove' || ctx.trigger === 'backspace') {
      const { index, e, trigger } = ctx;
      const node = getNodeItem(normalizedValue[index].value);
      onChange(
        normalizedValue.filter((value, i) => i !== index).map(({ value, label }) => formatValue(value, label)),
        { node, data: node.data, trigger, e },
      );
      onRemove?.({
        value: node.value,
        node,
        index,
        data: { value: node.value, label: node.label, ...node.data },
        e,
        trigger,
      });
    }
  });

  const getTreeSelectEventValue = () => {
    const selectedOptions = Array.isArray(normalizedValue) ? normalizedValue : [normalizedValue];
    const value = selectedOptions.map((item) => (valueType === 'object' ? item : item[tKeys.value]));
    return multiple ? value : value[0];
  };

  const handleBlur = usePersistFn<SelectInputProps['onBlur']>((_, ctx) => {
    onBlur?.({ value: getTreeSelectEventValue(), ...ctx });
  });

  const handleFocus = usePersistFn<SelectInputProps['onFocus']>((_, ctx) => {
    onFocus?.({ value: getTreeSelectEventValue(), e: ctx.e });
  });

  const handleEnter = usePersistFn<SelectInputProps['onEnter']>((_, ctx) => {
    onSearch?.(ctx.inputValue, { e: ctx.e });
  });

  const handleFilterChange = usePersistFn<SelectInputProps['onInputChange']>((value, ctx) => {
    if (ctx.trigger === 'clear') return;

    setFilterInput(value, ctx);
    onSearch?.(value, { e: ctx.e });
  });

  /* ---------------------------------render---------------------------------------- */

  const renderTree = () => {
    if (readonly) return empty;
    if (showLoading) return loadingItem;
    return (
      <>
        {panelTopContent}
        <Tree
          ref={treeRef}
          hover
          transition
          filter={handleFilter}
          data={data}
          disabled={disabled}
          empty={empty}
          expandOnClickNode={true}
          allowFoldNodeOnFilter
          keys={tKeys}
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
        {panelBottomContent}
      </>
    );
  };

  const renderCollapsedItems = useMemo(
    () =>
      props.collapsedItems
        ? () =>
            isFunction(props.collapsedItems)
              ? props.collapsedItems({
                  value: normalizedValue,
                  collapsedSelectedItems: normalizedValue.slice(props.minCollapsedNum, normalizedValue.length),
                  count: normalizedValue.length - props.minCollapsedNum,
                })
              : props.collapsedItems
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
      onPopupVisibleChange={onInnerPopupVisibleChange}
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
