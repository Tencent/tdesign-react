import React, { useMemo, useRef } from 'react';
import { isFunction, isObject } from 'lodash-es';

import useControlled from '../hooks/useControlled';
import useInnerPopupVisible from '../hooks/useInnerPopupVisible';

import type { PopupVisibleChangeContext, TdPopupProps } from '../popup';
import type { TdSelectInputProps } from './type';

export type overlayStyleProps = Pick<
  TdSelectInputProps,
  | 'popupProps'
  | 'autoWidth'
  | 'readonly'
  | 'readOnly'
  | 'onPopupVisibleChange'
  | 'disabled'
  | 'allowInput'
  | 'popupVisible'
  | 'defaultPopupVisible'
>;

// 单位：px
const MAX_POPUP_WIDTH = 1000;

export default function useOverlayInnerStyle(
  props: overlayStyleProps,
  extra?: {
    afterHidePopup?: (ctx: PopupVisibleChangeContext) => void;
  },
) {
  const { popupProps, autoWidth, disabled, onPopupVisibleChange, allowInput } = props;
  const readonly = props.readOnly || props.readonly;

  const [innerPopupVisible, setInnerPopupVisible] = useControlled(props, 'popupVisible', onPopupVisibleChange);

  const contentWidthRef = useRef<number | null>(null);
  const skipNextBlur = useRef(false);

  const matchWidthFunc = (triggerElement: HTMLElement, popupElement: HTMLElement) => {
    if (!triggerElement || !popupElement) return;

    const prevDisplay = popupElement.style.display;
    // 设置display来可以获取popupElement的宽度
    // eslint-disable-next-line no-param-reassign
    popupElement.style.display = '';

    /**
     * https://github.com/Tencent/tdesign-react/issues/3858
     * 记录内容宽度，避免 resize 过程中经过分支临界点时，将宽度锁死
     * 无法在 popup 和 trigger 宽度两个分支间正确切换
     */
    if (contentWidthRef.current === null) {
      contentWidthRef.current = popupElement.scrollWidth;
    }
    // popupElement的scrollBar宽度
    const overlayScrollWidth = popupElement.offsetWidth - popupElement.scrollWidth;

    /**
     * https://github.com/Tencent/tdesign-react/issues/2642
     * 取 popup 和 trigger 元素宽度的较大值进行比较
     * 如果 popup ≤ trigger，使用 trigger 宽度减去 popup 滚动条宽度
     * 否则，使用 popup 的 scrollWidth
     * 不用 offsetWidth，因为它会包含滚动条的宽度
     */
    const width =
      contentWidthRef.current > triggerElement.offsetWidth
        ? contentWidthRef.current
        : triggerElement.offsetWidth - overlayScrollWidth;

    if (prevDisplay === 'none') {
      // eslint-disable-next-line no-param-reassign
      popupElement.style.display = 'none';
    }
    let otherOverlayInnerStyle: React.CSSProperties = {};
    if (popupProps && typeof popupProps.overlayInnerStyle === 'object' && !popupProps.overlayInnerStyle.width) {
      otherOverlayInnerStyle = popupProps.overlayInnerStyle;
    }
    return {
      width: `${Math.min(width, MAX_POPUP_WIDTH)}px`,
      ...otherOverlayInnerStyle,
    };
  };

  const onInnerPopupVisibleChange = useInnerPopupVisible((visible: boolean, context: PopupVisibleChangeContext) => {
    skipNextBlur.current = false;
    if (disabled || readonly) return;
    // 如果点击触发元素（输入框）且为可输入状态，则继续显示下拉框
    const newVisible = context.trigger === 'trigger-element-click' && allowInput ? true : visible;
    if (props.popupVisible !== newVisible) {
      setInnerPopupVisible(newVisible, context);
      if (!newVisible) {
        extra?.afterHidePopup?.(context);
        skipNextBlur.current = true;
        contentWidthRef.current = null;
      }
    }
  });

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
    skipNextBlur,
    onInnerPopupVisibleChange,
  };
}
