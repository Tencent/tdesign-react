import React, { useMemo, useState } from 'react';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import { TdSelectInputProps } from './type';
import { TdPopupProps, PopupVisibleChangeContext } from '../popup';

export type overlayStyleProps = Pick<
  TdSelectInputProps,
  'popupProps' | 'autoWidth' | 'readonly' | 'onPopupVisibleChange' | 'allowInput'
>;

// 单位：px
const MAX_POPUP_WIDTH = 1000;

export default function useOverlayInnerStyle(props: overlayStyleProps) {
  const { popupProps, autoWidth, readonly, onPopupVisibleChange, allowInput } = props;
  const [innerPopupVisible, setInnerPopupVisible] = useState(false);

  const matchWidthFunc = (triggerElement: HTMLElement, popupElement: HTMLElement) => {
    if (!triggerElement || !popupElement) return;
    // 避免因滚动条出现文本省略，预留宽度 8
    const SCROLLBAR_WIDTH = popupElement.scrollHeight > popupElement.offsetHeight ? 8 : 0;
    const width =
      popupElement.offsetWidth + SCROLLBAR_WIDTH >= triggerElement.offsetWidth
        ? popupElement.offsetWidth
        : triggerElement.offsetWidth;
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
    if (readonly) return;
    // 如果点击触发元素（输入框）且为可输入状态，则继续显示下拉框
    const newVisible = context.trigger === 'trigger-element-click' && allowInput ? true : visible;
    setInnerPopupVisible(newVisible);
    onPopupVisibleChange?.(newVisible, context);
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
