import React, { useMemo } from 'react';
import classNames from 'classnames';
import { omit, pick } from 'lodash-es';
import parseTNode, { parseContentTNode } from '../_util/parseTNode';
import FakeArrow from '../common/FakeArrow';
import useCommonClassName from '../hooks/useCommonClassName';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import SelectInput from '../select-input';
import Panel from './components/Panel';
import { getFakeArrowIconClass } from './core/className';
import { closeIconClickEffect, handleRemoveTagEffect } from './core/effect';
import { getMultipleContent, getPanels, getSingleContent } from './core/helper';
import { cascaderDefaultProps } from './defaultProps';
import { useCascaderContext } from './hooks';

import type { StyledProps } from '../common';
import type { TagInputValue } from '../tag-input';
import type { TdCascaderProps } from './interface';

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

        // 只取第一个选中的节点进行滚动对齐
        if (!firstSelectedNode || !menu) return;

        // 计算节点在菜单中的相对位置
        const nodeTop = firstSelectedNode.offsetTop;
        const nodeHeight = firstSelectedNode.offsetHeight;
        const menuHeight = menu.clientHeight;
        const currentScrollTop = menu.scrollTop;

        // 计算节点在可视区域中的位置
        const nodeVisibleTop = nodeTop - currentScrollTop;
        const nodeVisibleBottom = nodeVisibleTop + nodeHeight;

        const isNodeFullyVisible = nodeVisibleTop >= 0 && nodeVisibleBottom <= menuHeight;
        // 如果节点已经完全可见，则不需要滚动
        if (isNodeFullyVisible) return;

        let targetScrollTop = currentScrollTop;

        if (nodeVisibleTop < 0) {
          // 如果节点在可视区域上方，滚动到节点顶部
          targetScrollTop = nodeTop;
        } else if (nodeVisibleBottom > menuHeight) {
          // 如果节点在可视区域下方，滚动到节点底部对齐菜单底部
          targetScrollTop = nodeTop - menuHeight + nodeHeight;
        }

        // 确保滚动位置不会超出边界
        const maxScrollTop = menu.scrollHeight - menuHeight;
        targetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

        // eslint-disable-next-line no-param-reassign
        menu.scrollTop = targetScrollTop;
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
