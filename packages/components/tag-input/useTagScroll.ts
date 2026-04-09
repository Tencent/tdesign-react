/**
 * 当标签数量过多时，输入框显示不下，则需要滚动查看，以下为滚动逻辑
 * 如果标签过多时的处理方式，是标签省略，则不需要此功能
 */
import { useEffect, useRef, WheelEvent } from 'react';
import { isFunction } from 'lodash-es';
import useConfig from '../hooks/useConfig';
import type { InputRef } from '../input';
import type { TdTagInputProps } from './type';

export default function useTagScroll(props: TdTagInputProps) {
  const { excessTagsDisplayType, disabled } = props;
  const readOnly = props.readOnly || props.readonly;
  const { classPrefix: prefix } = useConfig();

  const tagInputRef = useRef<InputRef>(null);

  // 使用 useRef 避免 useState 闭包陷阱：赋值后立即可用，与 Vue ref() 行为一致
  const scrollElementRef = useRef<HTMLElement>();
  const scrollDistanceRef = useRef(0);
  const mouseEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollElementClass = `${prefix}-input__prefix`;

  const setScrollableClass = (scrollable: boolean) => {
    const element = tagInputRef.current?.currentElement as HTMLElement;
    if (!element) return;
    const scrollEl = element.querySelector(`.${scrollElementClass}`);
    if (!scrollEl) return;
    scrollEl.classList.toggle(`${scrollElementClass}--scrollable`, scrollable);
  };

  const updateScrollElement = (element: HTMLElement) => {
    // 获取 .t-input__prefix 元素，这是真正需要滚动的容器
    const prefixElement = element.querySelector(`.${scrollElementClass}`) as HTMLElement;
    if (prefixElement) {
      scrollElementRef.current = prefixElement;
    }
  };

  const updateScrollDistance = () => {
    if (!scrollElementRef.current) return;
    scrollDistanceRef.current = scrollElementRef.current.scrollWidth - scrollElementRef.current.clientWidth;
  };

  /**
   * 滚动到最右侧
   * @param behavior - 'auto' 立即跳转（适用于 layoutEffect 同步时机），'smooth' 平滑动画（适用于用户交互）
   */
  const scrollToRight = (behavior: ScrollBehavior = 'auto') => {
    // 重新获取滚动元素，确保元素引用是最新的
    const element = tagInputRef.current?.currentElement as HTMLElement;
    if (element) {
      updateScrollElement(element);
    }
    if (!scrollElementRef.current) return;

    updateScrollDistance();
    if (isFunction(scrollElementRef.current?.scroll)) {
      scrollElementRef.current.scroll({ left: scrollDistanceRef.current, behavior });
    }
    setScrollableClass(true);
  };

  // MAC 电脑横向滚动使用 deltaX，Windows 纵向滚动使用 deltaY
  const onWheel = ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
    if (readOnly || disabled) return;
    if (!scrollElementRef.current) return;
    // 使用 deltaX 或 deltaY 来判断滚动方向，优先使用绝对值更大的
    const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    updateScrollDistance();
    // 直接使用用户真实的 delta 值，而非固定步长，保证触控板和鼠标滚轮都跟手
    const newScrollLeft = scrollElementRef.current.scrollLeft + delta;
    scrollElementRef.current.scrollLeft = Math.max(0, Math.min(newScrollLeft, scrollDistanceRef.current));
  };

  // 鼠标 hover，自动滑动到最右侧，以便输入新标签
  const scrollToRightOnEnter = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    // 一闪而过的 mouseenter 不需要执行
    mouseEnterTimerRef.current = setTimeout(() => {
      scrollToRight('smooth');
    }, 100);
  };

  const scrollToLeftOnLeave = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    setScrollableClass(false);
    if (isFunction(scrollElementRef.current?.scroll)) {
      scrollElementRef.current.scroll({ left: 0, behavior: 'smooth' });
    }
    if (mouseEnterTimerRef.current) {
      clearTimeout(mouseEnterTimerRef.current);
    }
  };

  useEffect(() => {
    const element = tagInputRef.current?.currentElement as HTMLElement;
    if (element) {
      updateScrollElement(element);
    }
    return () => {
      if (mouseEnterTimerRef.current) {
        clearTimeout(mouseEnterTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tagInputRef,
    scrollToRight,
    onWheel,
    scrollToRightOnEnter,
    scrollToLeftOnLeave,
  };
}
