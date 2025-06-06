import React, { useMemo } from 'react';
import classNames from 'classnames';
import { pick, omit } from 'lodash-es';
import Panel from './components/Panel';
import SelectInput from '../select-input';
import FakeArrow from '../common/FakeArrow';
import useConfig from '../hooks/useConfig';
import useCommonClassName from '../hooks/useCommonClassName';
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
import parseTNode, { parseContentTNode } from '../_util/parseTNode';

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
  const { cascaderContext, isFilterable, innerValue, getCascaderItems } = useCascaderContext(props);

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

  // render label
  const renderLabel = () => {
    const label = parseTNode(props.label);
    if (props.multiple) return label;
    if (!label) return null;
    return <div className={`${classPrefix}-tag-input__prefix`}>{label}</div>;
  };

  // render valueDisplay
  const valueDisplayParams = useMemo(() => {
    const arrayValue = innerValue instanceof Array ? innerValue : [innerValue];
    const displayValue =
      props.multiple && props.minCollapsedNum ? arrayValue.slice(0, props.minCollapsedNum) : innerValue;
    const options = getCascaderItems(arrayValue);

    return {
      value: innerValue,
      selectedOptions: options,
      onClose: (index: number) => {
        handleRemoveTagEffect(cascaderContext, index, props.onRemove);
      },
      displayValue,
    };
  }, [cascaderContext, innerValue, props.multiple, props.minCollapsedNum, props.onRemove, getCascaderItems]);

  const renderValueDisplay = () => parseContentTNode(props.valueDisplay, valueDisplayParams);

  const { setVisible, visible, inputVal, setInputVal } = cascaderContext;

  const updateScrollTop = (content: HTMLDivElement) => {
    const cascaderMenuList = content.querySelectorAll(`.${COMPONENT_NAME}__menu`);
    requestAnimationFrame(() => {
      cascaderMenuList.forEach((menu: HTMLDivElement) => {
        const firstSelectedNode: HTMLDivElement =
          menu?.querySelector(`.${classPrefix}-is-selected`) || menu?.querySelector(`.${classPrefix}-is-expanded`);
        if (!firstSelectedNode || !menu) return;

        const { paddingBottom } = getComputedStyle(firstSelectedNode);
        const { marginBottom } = getComputedStyle(menu);
        const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);

        const updateValue =
          firstSelectedNode.offsetTop -
          menu.offsetTop -
          (menu.clientHeight - firstSelectedNode.clientHeight) +
          elementBottomHeight;
        // eslint-disable-next-line no-param-reassign
        menu.scrollTop = updateValue;
      });
    });
  };

  return (
    <SelectInput
      className={classNames(COMPONENT_NAME, props.className)}
      style={props.style}
      value={displayValue}
      borderless={props.borderless}
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
      label={renderLabel()}
      valueDisplay={renderValueDisplay()}
      suffix={props.suffix}
      suffixIcon={renderSuffixIcon()}
      updateScrollTop={updateScrollTop}
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
        if (ctx.trigger === 'enter' || ctx.trigger === 'clear') {
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
        props.onClear?.(context);
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
        <>
          {props.panelTopContent && parseTNode(props.panelTopContent)}
          <Panel
            cascaderContext={cascaderContext}
            {...pick(props, ['trigger', 'onChange', 'empty', 'loading', 'loadingText', 'option'])}
          ></Panel>
          {props.panelBottomContent && parseTNode(props.panelBottomContent)}
        </>
      }
    />
  );
};

Cascader.displayName = 'Cascader';

export default Cascader;
