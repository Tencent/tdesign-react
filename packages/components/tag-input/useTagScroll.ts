/**
 * 当标签数量过多时，输入框显示不下，则需要滚动查看，以下为滚动逻辑
 * 如果标签过多时的处理方式，是标签省略，则不需要此功能
 */
import { useEffect, useRef, WheelEvent } from 'react';
import useConfig from '../hooks/useConfig';
import type { InputRef } from '../input';
import type { TdTagInputProps } from './type';

export default function useTagScroll(props: TdTagInputProps) {
  const { excessTagsDisplayType, disabled } = props;
  const readOnly = props.readOnly || props.readonly;
  const { classPrefix: prefix } = useConfig();

  const tagInputRef = useRef<InputRef>(null);
  const scrollElementRef = useRef<HTMLElement>();
  const mouseEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getScrollElement = () => {
    const root = tagInputRef.current?.currentElement as HTMLElement;
    if (!root) return scrollElementRef.current;
    if (scrollElementRef.current?.parentElement !== root) {
      const found = root.querySelector(`.${prefix}-input__prefix`);
      if (found) scrollElementRef.current = found as HTMLElement;
    }
    return scrollElementRef.current;
  };

  /**
   * 滚动到最右侧
   * @param behavior 'auto' 立即跳转（layoutEffect 中使用），'smooth' 平滑动画（用户交互）
   */
  const scrollToRight = (behavior: ScrollBehavior = 'auto') => {
    const el = getScrollElement();
    if (!el) return;
    // scroll 模式下始终保持 scrollable，避免 overflow:hidden 阻断滚动
    el.classList.add(`${prefix}-input__prefix--scrollable`);
    el.scroll({ left: el.scrollWidth - el.clientWidth, behavior });
  };

  const onWheel = ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
    if (excessTagsDisplayType !== 'scroll') return;
    if (readOnly || disabled) return;
    const el = getScrollElement();
    if (!el) return;
    const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.max(0, Math.min(el.scrollLeft + delta, max));
  };

  const clearEnterTimer = () => {
    if (mouseEnterTimerRef.current) {
      clearTimeout(mouseEnterTimerRef.current);
      mouseEnterTimerRef.current = null;
    }
  };

  const scrollToRightOnEnter = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    clearEnterTimer();
    mouseEnterTimerRef.current = setTimeout(() => {
      scrollToRight('smooth');
      mouseEnterTimerRef.current = null;
    }, 100);
  };

  const scrollToLeftOnLeave = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    clearEnterTimer();
    scrollElementRef.current?.scroll({ left: 0, behavior: 'smooth' });
  };

  useEffect(() => clearEnterTimer, []);

  return {
    tagInputRef,
    scrollToRight,
    onWheel,
    scrollToRightOnEnter,
    scrollToLeftOnLeave,
  };
}
