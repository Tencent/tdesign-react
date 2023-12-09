import React, { useMemo, useState } from 'react';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import { TdSelectInputProps } from './type';
import { TdPopupProps, PopupVisibleChangeContext } from '../popup';

export type overlayStyleProps = Pick<
  TdSelectInputProps,
  'popupProps' | 'autoWidth' | 'readonly' | 'onPopupVisibleChange' | 'disabled' | 'allowInput' | 'popupVisible'
>;

// 单位：px
const MAX_POPUP_WIDTH = 1000;

export default function useOverlayInnerStyle(
  props: overlayStyleProps,
  extra?: {
    afterHidePopup?: (ctx: PopupVisibleChangeContext) => void;
  },
) {
  const { popupProps, autoWidth, readonly, disabled, onPopupVisibleChange, allowInput } = props;
  const [innerPopupVisible, setInnerPopupVisible] = useState(false);

  const matchWidthFunc = (triggerElement: HTMLElement, popupElement: HTMLElement) => {
    if (!triggerElement || !popupElement) return;

    // 设置display来可以获取popupElement的宽度
    // eslint-disable-next-line no-param-reassign
    popupElement.style.display = '';
    // popupElement的scrollBar宽度
    const overlayScrollWidth = popupElement.offsetWidth - popupElement.scrollWidth;

    /**
     * issue：https://github.com/Tencent/tdesign-react/issues/2642
     *
     * popupElement的内容宽度不超过triggerElement的宽度，就使用triggerElement的宽度减去popup的滚动条宽度，
     * 让popupElement的宽度加上scrollBar的宽度等于triggerElement的宽度；
     *
     * popupElement的内容宽度超过triggerElement的宽度，就使用popupElement的scrollWidth，
     * 不用offsetWidth是会包含scrollBar的宽度
     */
    const width =
      popupElement.offsetWidth - overlayScrollWidth > triggerElement.offsetWidth
        ? popupElement.scrollWidth
        : triggerElement.offsetWidth - overlayScrollWidth;

    let otherOverlayInnerStyle: React.CSSProperties = {};
    if (popupProps && typeof popupProps.overlayInnerStyle === 'object' && !popupProps.overlayInnerStyle.width) {
      otherOverlayInnerStyle = popupProps.overlayInnerStyle;
    }
    return {
      width: `${Math.min(width, MAX_POPUP_WIDTH)}px`,
      ...otherOverlayInnerStyle,
    };
  };

  const onInnerPopupVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    if (disabled || readonly) {
      return;
    }
    // 如果点击触发元素（输入框）且为可输入状态，则继续显示下拉框
    const newVisible = context.trigger === 'trigger-element-click' && allowInput ? true : visible;
    if (props.popupVisible !== newVisible) {
      setInnerPopupVisible(newVisible);
      onPopupVisibleChange?.(newVisible, context);
      if (!newVisible) {
        extra?.afterHidePopup?.(context);
      }
    }
  };

  const tOverlayInnerStyle = useMemo(() => {
    let result: TdPopupProps['overlayInnerStyle'] = {};
    const overlayInnerStyle = popupProps?.overlayInnerStyle || {};
    if (isFunction(overlayInnerStyle) || (isObject(overlayInnerStyle) && overlayInnerStyle.width)) {
      result = overlayInnerStyle;
    } else if (!autoWidth) {
      result = matchWidthFunc;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoWidth, popupProps?.overlayInnerStyle]);

  return {
    tOverlayInnerStyle,
    innerPopupVisible,
    onInnerPopupVisibleChange,
  };
}
