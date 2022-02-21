import React, { useMemo, useState } from 'react';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import { TdSelectInputProps } from './type';
import { TdPopupProps, PopupVisibleChangeContext } from '../popup';

// 单位：px
const MAX_POPUP_WIDTH = 1000;

export default function useOverlayStyle(props: TdSelectInputProps) {
  const { popupProps, borderless } = props;
  const [innerPopupVisible, setInnerPopupVisible] = useState(false);

  const macthWidthFunc = (triggerElement: HTMLElement, popupElement: HTMLElement) => {
    if (!triggerElement || !popupElement) return;
    // 避免因滚动条出现文本省略，预留宽度 8
    const SCROLLBAR_WIDTH = popupElement.scrollHeight > popupElement.offsetHeight ? 8 : 0;
    const width =
      popupElement.offsetWidth + SCROLLBAR_WIDTH >= triggerElement.offsetWidth
        ? popupElement.offsetWidth
        : triggerElement.offsetWidth;
    let otherOverlayStyle: React.CSSProperties = {};
    if (typeof popupProps.overlayStyle === 'object' && !popupProps.overlayStyle.width) {
      otherOverlayStyle = popupProps.overlayStyle;
    }
    return {
      width: `${Math.min(width, MAX_POPUP_WIDTH)}px`,
      ...otherOverlayStyle,
    };
  };

  const onInnerPopupVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    // 如果点击触发元素（输入框），则永久显示下拉框
    const newVisible = context.trigger === 'trigger-element-click' ? true : visible;
    setInnerPopupVisible(newVisible);
    props.onPopupVisibleChange?.(newVisible, context);
  };

  const tOverlayStyle = useMemo(() => {
    let result: TdPopupProps['overlayStyle'] = {};
    const overlayStyle = popupProps?.overlayStyle || {};
    if (isFunction(overlayStyle) || (isObject(overlayStyle) && overlayStyle.width)) {
      result = overlayStyle;
    } else if (!borderless) {
      result = macthWidthFunc;
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borderless, popupProps?.overlayStyle]);

  return {
    tOverlayStyle,
    innerPopupVisible,
    onInnerPopupVisibleChange,
  };
}
