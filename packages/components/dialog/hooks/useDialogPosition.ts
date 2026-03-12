import { type MutableRefObject, useCallback } from 'react';
import { canUseDocument } from '../../_util/dom';

// 模块级别的鼠标位置记录，确保 Plugin 模式也能捕获到点击位置
let mousePosition: { x: number; y: number } | null = null;

const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};

if (canUseDocument) {
  document.addEventListener('click', getClickPosition, true);
}

export default function useDialogPosition(dialogCardRef: MutableRefObject<HTMLElement>) {
  const applyTransform = useCallback(() => {
    const el = dialogCardRef.current;
    if (!el || !mousePosition) return;

    const { x, y } = mousePosition;

    const parentRect = el.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

    const top = parentRect.top + el.offsetTop;
    const left = parentRect.left + el.offsetLeft;

    const offsetX = x - left;
    const offsetY = y - top;

    el.style.transformOrigin = `${offsetX}px ${offsetY}px`;
  }, [dialogCardRef]);

  return { applyTransform };
}
