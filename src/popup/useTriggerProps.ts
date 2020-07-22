import { HTMLAttributes, useCallback, MutableRefObject } from 'react';
import useClickOutside from '../_util/useClickOutside';
import { PopupTrigger } from './Popup';

export type TriggerProps = HTMLAttributes<HTMLDivElement>;
export type PopupProps = HTMLAttributes<HTMLDivElement>;

export default function useTriggerProps(
  ref: MutableRefObject<HTMLElement>,
  triggers: PopupTrigger[],
  visible: boolean,
  setVisible: (visible: boolean) => void,
): [TriggerProps, PopupProps] {
  const triggerProps: TriggerProps = {};
  const popupProps: PopupProps = {};

  const toggle = useCallback(() => setVisible(!visible), [visible, setVisible]);
  const show = useCallback(() => setVisible(true), [setVisible]);
  const hide = useCallback(() => setVisible(false), [setVisible]);

  // eslint-disable-next-line no-restricted-syntax
  for (const trigger of triggers) {
    // 点击触发
    if (trigger === 'click') {
      triggerProps.onClick = toggle;
    }

    // hover 触发
    if (trigger === 'hover') {
      triggerProps.onMouseEnter = show;
      popupProps.onMouseEnter = show; // 兼容鼠标移入弹出框
      triggerProps.onMouseLeave = hide;
      popupProps.onMouseLeave = hide;
    }

    // focus 触发
    if (trigger === 'focus') {
      triggerProps.onFocus = show;
      triggerProps.onBlur = hide;
    }

    // contextMenu 触发
    if (trigger === 'contextMenu') {
      triggerProps.onContextMenu = show;
    }
  }

  // click outside 用于处理点击其他地方隐藏
  useClickOutside(ref, () => {
    if (
      visible &&
      (triggers.includes('click') || triggers.includes('focus') || triggers.includes('contextMenu'))
    ) {
      hide();
    }
  });

  return [triggerProps, popupProps];
}
