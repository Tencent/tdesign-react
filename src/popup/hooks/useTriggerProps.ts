import React, { HTMLAttributes, MutableRefObject, useRef } from 'react';
import useClickOutside from '../../_util/useClickOutside';
import { TdPopupProps, PopupVisibleChangeContext, PopupTriggerEvent } from '../type';
import { ChangeHandler } from '../../hooks/useControlled';
import { TNode } from '../../common';

export type TriggerProps = HTMLAttributes<HTMLDivElement>;
export type PopupProps = HTMLAttributes<HTMLDivElement>;
type HandleTrigger = (e: PopupTriggerEvent, trigger: PopupVisibleChangeContext['trigger']) => void;
const ESC_KEY = 'Escape';

export default function useTriggerProps(
  ref: MutableRefObject<HTMLElement>,
  triggerNode: MutableRefObject<HTMLElement>,
  triggers: Array<TdPopupProps['trigger']>,
  visible: boolean,
  setVisible: ChangeHandler<boolean, [PopupVisibleChangeContext]>,
  disabled = false,
  originTrigger: React.ReactElement<HTMLAttributes<HTMLElement>>,
  content: TNode,
): [TriggerProps, PopupProps] {
  const triggerProps: TriggerProps = {};
  const popupProps: PopupProps = {};
  const hasPopupMouseDown = useRef(false);
  const mouseDownTimer = useRef<number>();
  const toggle: HandleTrigger = (e, trigger) => setVisible(!visible, { e, trigger });
  const show: HandleTrigger = (e, trigger) => setVisible(true, { e, trigger });
  const hide: HandleTrigger = (e, trigger) => setVisible(false, { e, trigger });

  const shouldToggle = !!content;

  // click outside 用于处理点击其他地方隐藏
  useClickOutside([ref, triggerNode], (e: any) => {
    if (visible && (triggers.includes('click') || triggers.includes('context-menu')) && !hasPopupMouseDown.current) {
      hide(e, 'trigger-element-blur');
    }
  });

  if (disabled) return [triggerProps, popupProps];

  // eslint-disable-next-line no-restricted-syntax
  for (const trigger of triggers) {
    const { onClick, onMouseEnter, onMouseLeave, onMouseDown, onFocus, onBlur, onContextMenu, onKeyDown } =
      originTrigger.props;
    // 点击触发
    if (trigger === 'click') {
      triggerProps.onClick = (e) => {
        shouldToggle && toggle(e, 'trigger-element-click');
        onClick && onClick(e);
      };
    }

    // hover 触发
    if (trigger === 'hover') {
      triggerProps.onMouseEnter = (e) => {
        shouldToggle && show(e, 'trigger-element-hover');
        onMouseEnter && onMouseEnter(e);
      };
      popupProps.onMouseEnter = (e) => {
        // 如果当前弹出框本身没有展示 hover 时不应该展示
        visible && shouldToggle && show(e, 'trigger-element-hover');
      }; // 兼容鼠标移入弹出框
      triggerProps.onMouseLeave = (e) => {
        shouldToggle && hide(e, 'trigger-element-hover');
        onMouseLeave && onMouseLeave(e);
      };
      popupProps.onMouseLeave = (e) => shouldToggle && hide(e, 'trigger-element-hover');
    }

    // focus 触发
    if (trigger === 'focus') {
      triggerProps.onFocus = (e) => {
        shouldToggle && show(e, 'trigger-element-focus');
        onFocus && onFocus(e);
      };
      triggerProps.onBlur = (e) => {
        shouldToggle && hide(e, 'trigger-element-blur');
        onBlur && onBlur(e);
      };
    }

    // contextMenu 触发
    if (trigger === 'context-menu') {
      triggerProps.onContextMenu = (e) => {
        shouldToggle && show(e, 'context-menu');
        onContextMenu && onContextMenu(e);
      };
    }

    popupProps.onMouseDown = (e) => {
      clearTimeout(mouseDownTimer.current);
      hasPopupMouseDown.current = true;
      mouseDownTimer.current = window.setTimeout(() => {
        hasPopupMouseDown.current = false;
      });
      onMouseDown?.(e);
    };

    triggerProps.onKeyDown = (e) => {
      if (e.key === ESC_KEY) hide(e, 'keydown-esc');
      onKeyDown && onKeyDown(e);
    };
  }

  return [triggerProps, popupProps];
}
