import React, { useMemo } from 'react';
import classNames from 'classnames';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import Panel from './components/Panel';
import SelectInput from '../select-input';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../hooks/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TagInputValue } from '../tag-input';
import { TdCascaderProps } from './interface';
import { closeIconClickEffect, handleRemoveTagEffect } from './core/effect';
import { getPanels, getSingleContent, getMultipleContent } from './core/helper';
import { getFakeArrowIconClass } from './core/className';
import { useCascaderContext } from './hooks';
import { cascaderDefaultProps } from './defaultProps';
import { StyledProps } from '../common';
import useDefaultProps from '../hooks/useDefaultProps';

export interface CascaderProps extends TdCascaderProps, StyledProps {}

const Cascader: React.FC<CascaderProps> = (originalProps) => {
  const props = useDefaultProps<CascaderProps>(originalProps, cascaderDefaultProps);
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
    if (props.suffixIcon) {
      return props.suffixIcon;
    }

    const { visible, disabled } = cascaderContext;
    return (
      <FakeArrow
        className={getFakeArrowIconClass(classPrefix, STATUS, cascaderContext)}
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
      status={props.status}
      tips={props.tips}
      suffix={props.suffix}
      suffixIcon={renderSuffixIcon()}
      popupProps={{
        ...props.popupProps,
        overlayInnerStyle: panels.length && !props.loading ? { width: 'auto' } : {},
        overlayClassName: [`${classPrefix}-cascader__popup`, props.popupProps?.overlayClassName],
      }}
      inputProps={{ size: props.size, ...(props.inputProps as TdCascaderProps['inputProps']) }}
      tagInputProps={{
        size: props.size,
        ...(props.tagInputProps as TdCascaderProps['tagInputProps']),
      }}
      tagProps={{ ...(props.tagProps as TdCascaderProps['tagProps']) }}
      onInputChange={(value, ctx) => {
        if (!visible || ctx?.trigger === 'clear') {
          return;
        }
        setInputVal(`${value}`);
        props?.selectInputProps?.onInputChange?.(value, ctx);
      }}
      onTagChange={(val: TagInputValue, ctx) => {
        if (ctx.trigger === 'enter') {
          return;
        }
        handleRemoveTagEffect(cascaderContext, ctx.index, props.onRemove);
        props?.selectInputProps?.onTagChange?.(val, ctx);
      }}
      onPopupVisibleChange={(val: boolean, context) => {
        if (props.disabled) {
          return;
        }
        setVisible(val, context);
        props?.selectInputProps?.onPopupVisibleChange?.(val, context);
      }}
      onBlur={(val, context) => {
        props.onBlur?.({
          value: cascaderContext.value,
          e: context.e,
          inputValue: inputVal,
        });
        props?.selectInputProps?.onBlur?.(val, context);
      }}
      onFocus={(val, context) => {
        props.onFocus?.({
          value: cascaderContext.value,
          e: context.e,
        });
        props?.selectInputProps?.onFocus?.(val, context);
      }}
      onClear={(context) => {
        closeIconClickEffect(cascaderContext);
        props?.selectInputProps?.onClear?.(context);
      }}
      {...omit(props.selectInputProps, [
        'onTagChange',
        'onInputChange',
        'onPopupVisibleChange',
        'onBlur',
        'onFocus',
        'onClear',
      ])}
      panel={
        <Panel
          cascaderContext={cascaderContext}
          {...pick(props, ['trigger', 'onChange', 'empty', 'loading', 'loadingText'])}
        ></Panel>
      }
    />
  );
};

Cascader.displayName = 'Cascader';

export default Cascader;
