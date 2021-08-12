import { HTMLAttributes, MutableRefObject } from 'react';
import useClickOutside from '../_util/useClickOutside';
import { TdPopupProps, PopupVisibleChangeContext, PopupTriggerEvent } from '../_type/components/popup';
import { ChangeHandler } from '../_util/useDefault';

export type TriggerProps = HTMLAttributes<HTMLDivElement>;
export type PopupProps = HTMLAttributes<HTMLDivElement>;
type HandleTrigger = (e: PopupTriggerEvent, trigger: PopupVisibleChangeContext['trigger']) => void;
const ESC_KEY = 'Escape';

export default function useTriggerProps(
  ref: MutableRefObject<HTMLElement>,
  triggers: Array<TdPopupProps['trigger']>,
  visible: boolean,
  setVisible: ChangeHandler<boolean, [PopupVisibleChangeContext]>,
  disabled = false,
): [TriggerProps, PopupProps] {
  const triggerProps: TriggerProps = {};
  const popupProps: PopupProps = {};

  const toggle: HandleTrigger = (e, trigger) => setVisible(!visible, { e, trigger });
  const show: HandleTrigger = (e, trigger) => setVisible(true, { e, trigger });
  const hide: HandleTrigger = (e, trigger) => setVisible(false, { e, trigger });

  // click outside 用于处理点击其他地方隐藏
  useClickOutside(ref, (e: any) => {
    if (visible && (triggers.includes('click') || triggers.includes('context-menu'))) {
      hide(e, 'trigger-element-blur');
    }
  });

  if (disabled) return [triggerProps, popupProps];

  // eslint-disable-next-line no-restricted-syntax
  for (const trigger of triggers) {
    // 点击触发
    if (trigger === 'click') {
      triggerProps.onClick = (e) => toggle(e, 'trigger-element-click');
    }

    // hover 触发
    if (trigger === 'hover') {
      triggerProps.onMouseEnter = (e) => show(e, 'trigger-element-hover');
      popupProps.onMouseEnter = (e) => show(e, 'trigger-element-hover'); // 兼容鼠标移入弹出框
      triggerProps.onMouseLeave = (e) => hide(e, 'trigger-element-hover');
      popupProps.onMouseLeave = (e) => hide(e, 'trigger-element-hover');
    }

    // focus 触发
    if (trigger === 'focus') {
      triggerProps.onFocus = (e) => show(e, 'trigger-element-focus');
      triggerProps.onBlur = (e) => hide(e, 'trigger-element-blur');
    }

    // contextMenu 触发
    if (trigger === 'context-menu') {
      triggerProps.onContextMenu = (e) => show(e, 'context-menu');
    }

    triggerProps.onKeyDown = (e) => {
      if (e.key === ESC_KEY) hide(e, 'keydown-esc');
    };
  }

  return [triggerProps, popupProps];
}
