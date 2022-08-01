import React, { useMemo } from 'react';
import classNames from 'classnames';
import pick from 'lodash/pick';
import Panel from './components/Panel';
import SelectInput from '../select-input';
import FakeArrow from '../common/FakeArrow';

import useConfig from '../hooks/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import { useLocaleReceiver } from '../locale/LocalReceiver';

import { CascaderValue, TdCascaderProps } from './interface';
import { closeIconClickEffect, handleRemoveTagEffect } from './core/effect';
import { getPanels, getSingleContent, getMultipleContent } from './core/helper';
import { getFakeArrowIconClass } from './core/className';
import { useCascaderContext } from './hooks';

import { cascaderDefaultProps } from './defaultProps';
import { StyledProps } from '../common';

export interface CascaderProps extends TdCascaderProps, StyledProps {}

const Cascader = (props: CascaderProps) => {
  /**
   * global user props, config, data
   */
  const { classPrefix } = useConfig();
  const { STATUS } = useCommonClassName();
  const [global] = useLocaleReceiver('cascader');
  const COMPONENT_NAME = `${classPrefix}-cascader`;

  // 拿到全局状态的上下文
  const { cascaderContext, isFilterable } = useCascaderContext(props);

  const displayValue = useMemo(
    () => (props.multiple ? getMultipleContent(cascaderContext) : getSingleContent(cascaderContext)),
    [props.multiple, cascaderContext],
  );

  const panels = useMemo(() => getPanels(cascaderContext.treeNodes), [cascaderContext]);

  const inputPlaceholder = useMemo(
    () =>
      (cascaderContext.visible && !props.multiple && getSingleContent(cascaderContext)) ||
      (props.placeholder ?? global.placeholder),
    [props.placeholder, cascaderContext, props.multiple, global.placeholder],
  );

  const renderSuffixIcon = () => {
    const { visible, disabled } = cascaderContext;
    return (
      <FakeArrow
        overlayClassName={getFakeArrowIconClass(classPrefix, STATUS, cascaderContext)}
        isActive={visible}
        disabled={disabled}
      />
    );
  };

  const { setVisible, visible, inputVal, setInputVal } = cascaderContext;
  return (
    <SelectInput
      className={classNames(COMPONENT_NAME, props.className)}
      style={props.style}
      value={displayValue}
      inputValue={visible ? inputVal : ''}
      popupVisible={visible}
      allowInput={isFilterable}
      minCollapsedNum={props.minCollapsedNum}
      collapsedItems={props.collapsedItems as any}
      readonly={props.readonly}
      clearable={props.clearable}
      placeholder={inputPlaceholder}
      multiple={props.multiple}
      loading={props.loading}
      disabled={props.disabled}
      suffixIcon={() => renderSuffixIcon()}
      popupProps={{
        ...props.popupProps,
        overlayStyle: panels.length ? { width: 'auto' } : {},
        overlayClassName: [`${classPrefix}-cascader__popup`, props.popupProps?.overlayClassName],
      }}
      inputProps={{ size: props.size, ...(props.inputProps as TdCascaderProps['inputProps']) }}
      tagInputProps={{
        autoWidth: true,
        size: props.size,
        ...(props.tagInputProps as TdCascaderProps['tagInputProps']),
      }}
      tagProps={{ ...(props.tagProps as TdCascaderProps['tagProps']) }}
      {...props.selectInputProps}
      onInputChange={(value) => {
        if (!visible) return;
        setInputVal(`${value}`);
      }}
      onTagChange={(val: CascaderValue, ctx) => {
        handleRemoveTagEffect(cascaderContext, ctx.index, props.onRemove);
      }}
      onPopupVisibleChange={(val: boolean, context) => {
        if (props.disabled) return;
        setVisible(val, context);
      }}
      onBlur={(val, context) => {
        props.onBlur?.({
          value: cascaderContext.value,
          e: context.e,
        });
      }}
      onFocus={(val, context) => {
        props.onFocus?.({
          value: cascaderContext.value,
          e: context.e,
        });
      }}
      onClear={() => {
        closeIconClickEffect(cascaderContext);
      }}
      panel={<Panel cascaderContext={cascaderContext} {...pick(props, ['trigger', 'onChange', 'empty'])}></Panel>}
    />
  );
};

Cascader.displayName = 'Cascader';
Cascader.defaultProps = cascaderDefaultProps;

export default Cascader;
