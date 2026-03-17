/**
 * 当标签数量过多时，输入框显示不下，则需要滚动查看，以下为滚动逻辑
 * 如果标签过多时的处理方式，是标签省略，则不需要此功能
 */
import { isFunction } from 'lodash-es';
import { useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import useConfig from '../hooks/useConfig';
import type { TdTagInputProps } from './type';

let mouseEnterTimer: ReturnType<typeof setTimeout> | null = null;

export default function useTagScroll(props: TdTagInputProps) {
  const { excessTagsDisplayType, disabled } = props;
  const readOnly = props.readOnly || props.readonly;
  const { classPrefix } = useConfig();

  const tagInputRef = useRef<{ currentElement: HTMLDivElement }>(null);

  // 允许向右滚动的最大距离
  const scrollDistanceRef = useRef(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const updateScrollElement = useCallback(
    (element: HTMLDivElement) => {
      const prefixElement = element.querySelector(`.${classPrefix}-input__prefix`) as HTMLElement;
      scrollElementRef.current = prefixElement;
    },
    [classPrefix],
  );

  const updateScrollDistance = useCallback(() => {
    if (!scrollElementRef.current) return;
    scrollDistanceRef.current = scrollElementRef.current.scrollWidth - scrollElementRef.current.clientWidth;
  }, []);

  const scrollTo = useCallback((distance: number) => {
    if (isFunction(scrollElementRef.current?.scroll)) {
      scrollElementRef.current.scroll({ left: distance, behavior: 'smooth' });
    }
  }, []);

  const scrollToRight = useCallback(() => {
    // 重新获取滚动元素，确保元素引用是最新的
    const element = tagInputRef.current?.currentElement;
    if (element) {
      updateScrollElement(element);
    }
    if (!scrollElementRef.current) return;
    // 先标记为可滚动，触发 --scrollable 类添加（使 overflow-x: auto 生效）
    // 再在下一帧执行滚动，确保 overflow 样式已应用到 DOM
    setIsScrollable(true);
    requestAnimationFrame(() => {
      updateScrollDistance();
      scrollTo(scrollDistanceRef.current);
    });
  }, [updateScrollElement, updateScrollDistance, scrollTo]);

  const scrollToLeft = useCallback(() => {
    scrollTo(0);
  }, [scrollTo]);

  // MAC 电脑横向滚动使用 deltaX，Windows 纵向滚动使用 deltaY
  const onWheel = useCallback(
    ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
      if (readOnly || disabled) return;
      if (!scrollElementRef.current) return;
      // 使用 deltaX 或 deltaY 来判断滚动方向，优先使用绝对值更大的
      const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta > 0) {
        updateScrollDistance();
        const distance = Math.min(scrollElementRef.current.scrollLeft + 120, scrollDistanceRef.current);
        scrollTo(distance);
      } else if (delta < 0) {
        const distance = Math.max(scrollElementRef.current.scrollLeft - 120, 0);
        scrollTo(distance);
      }
    },
    [readOnly, disabled, updateScrollDistance, scrollTo],
  );

  // 鼠标 hover，自动滑动到最右侧，以便输入新标签
  const scrollToRightOnEnter = useCallback(() => {
    if (excessTagsDisplayType !== 'scroll') return;
    // 一闪而过的 mousenter 不需要执行
    mouseEnterTimer = setTimeout(() => {
      scrollToRight();
      if (mouseEnterTimer) clearTimeout(mouseEnterTimer);
    }, 100);
  }, [excessTagsDisplayType, scrollToRight]);

  const scrollToLeftOnLeave = useCallback(() => {
    if (excessTagsDisplayType !== 'scroll') return;
    setIsScrollable(false); // 离开焦点不可滚动
    scrollTo(0);
    if (mouseEnterTimer) clearTimeout(mouseEnterTimer);
  }, [excessTagsDisplayType, scrollTo]);

  const clearScroll = () => {
    if (mouseEnterTimer) clearTimeout(mouseEnterTimer);
  };

  const initScroll = useCallback(
    (element: HTMLDivElement) => {
      if (!element) return;
      updateScrollElement(element);
    },
    [updateScrollElement],
  );

  useEffect(() => {
    initScroll(tagInputRef?.current?.currentElement);
    return clearScroll;
  }, [initScroll]);

  useEffect(() => {
    // 监听 isScrollable 变化，动态添加/移除 --scrollable 类
    if (excessTagsDisplayType !== 'scroll') return;

    const scrollElementClass = `${classPrefix}-input__prefix`;
    const element = tagInputRef.current?.currentElement;
    if (!element) return;

    const scrollElement = element.querySelector(`.${scrollElementClass}`);
    if (!scrollElement) return;

    if (isScrollable) {
      scrollElement.classList.add(`${scrollElementClass}--scrollable`);
    } else {
      scrollElement.classList.remove(`${scrollElementClass}--scrollable`);
    }
  }, [isScrollable, excessTagsDisplayType, classPrefix]);

  return {
    initScroll,
    clearScroll,
    tagInputRef,
    scrollTo,
    scrollToRight,
    scrollToLeft,
    updateScrollElement,
    updateScrollDistance,
    onWheel,
    scrollToRightOnEnter,
    scrollToLeftOnLeave,
  };
}
