import { useState, useEffect } from 'react';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import { TdSelectInputProps } from './type';
import { TdPopupProps, PopupVisibleChangeContext } from '../popup';

// 单位：px
const MAX_POPUP_WIDTH = 1000;

export default function useOverlayStyle(props: TdSelectInputProps) {
  const { popupProps, borderless } = props;
  const [innerPopupVisible, setInnerPopupVisible] = useState(false);
  const [tOverlayStyle, setTOverlayStyle] = useState<TdPopupProps['overlayStyle']>();

  const macthWidthFunc = (triggerElement: HTMLElement, popupElement: HTMLElement) => {
    if (!triggerElement || !popupElement) return;
    // 避免因滚动条出现文本省略，预留宽度 8
    const SCROLLBAR_WIDTH = popupElement.scrollHeight > popupElement.offsetHeight ? 0 : 0;
    const width =
      popupElement.offsetWidth + SCROLLBAR_WIDTH >= triggerElement.offsetWidth
        ? popupElement.offsetWidth
        : triggerElement.offsetWidth;
    return {
      width: `${Math.min(width, MAX_POPUP_WIDTH)}px`,
    };
  };

  const onInnerPopupVisibleChange = (visible: boolean, context: PopupVisibleChangeContext) => {
    // 如果点击触发元素（输入框），则永久显示下拉框
    const newVisible = context.trigger === 'trigger-element-click' ? true : visible;
    setInnerPopupVisible(newVisible);
    props.onPopupVisibleChange?.(newVisible, context);
  };

  useEffect(() => {
    if (tOverlayStyle) return;
    let result: TdPopupProps['overlayStyle'] = {};
    const overlayStyle = popupProps?.overlayStyle || {};
    if (isFunction(overlayStyle) || (isObject(overlayStyle) && overlayStyle.width)) {
      result = overlayStyle;
    } else if (!borderless) {
      result = macthWidthFunc;
    }
    setTOverlayStyle(result);
  }, [borderless, popupProps?.overlayStyle, tOverlayStyle]);

  return {
    tOverlayStyle,
    innerPopupVisible,
    onInnerPopupVisibleChange,
  };
}
