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
  // isScrollable 也使用 useRef + 直接 DOM 操作，避免 setState 触发 re-render 打断滚动动画
  const isScrollableRef = useRef(false);
  const mouseEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollElementClass = `${prefix}-input__prefix`;

  const setScrollableClass = (scrollable: boolean) => {
    const element = tagInputRef.current?.currentElement as HTMLElement;
    if (!element) return;
    const scrollEl = element.querySelector(`.${scrollElementClass}`);
    if (!scrollEl) return;
    if (scrollable) {
      scrollEl.classList.add(`${scrollElementClass}--scrollable`);
    } else {
      scrollEl.classList.remove(`${scrollElementClass}--scrollable`);
    }
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

  const scrollTo = (distance: number) => {
    if (isFunction(scrollElementRef.current?.scroll)) {
      scrollElementRef.current.scroll({ left: distance, behavior: 'smooth' });
    }
  };

  const scrollToRight = () => {
    // 重新获取滚动元素，确保元素引用是最新的
    const element = tagInputRef.current?.currentElement as HTMLElement;
    if (element) {
      updateScrollElement(element);
    }
    if (!scrollElementRef.current) return;

    // 使用 setTimeout 确保 DOM 布局完成后再计算滚动距离
    setTimeout(() => {
      updateScrollDistance();
      scrollTo(scrollDistanceRef.current);
      setTimeout(() => {
        isScrollableRef.current = true;
        setScrollableClass(true);
      }, 200);
    }, 0);
  };

  const scrollToLeft = () => {
    scrollTo(0);
  };

  // MAC 电脑横向滚动使用 deltaX，Windows 纵向滚动使用 deltaY
  const onWheel = ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
    if (readOnly || disabled) return;
    if (!scrollElementRef.current) return;
    // 使用 deltaX 或 deltaY 来判断滚动方向，优先使用绝对值更大的
    const delta = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 0) {
      updateScrollDistance();
      // 滚轮是高频连续事件，直接设置 scrollLeft 即时响应，不用 smooth 避免动画互相打断导致不跟手
      scrollElementRef.current.scrollLeft = Math.min(
        scrollElementRef.current.scrollLeft + 120,
        scrollDistanceRef.current,
      );
    } else if (delta < 0) {
      scrollElementRef.current.scrollLeft = Math.max(scrollElementRef.current.scrollLeft - 120, 0);
    }
  };

  // 鼠标 hover，自动滑动到最右侧，以便输入新标签
  const scrollToRightOnEnter = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    // 一闪而过的 mousenter 不需要执行
    mouseEnterTimerRef.current = setTimeout(() => {
      scrollToRight();
      if (mouseEnterTimerRef.current) clearTimeout(mouseEnterTimerRef.current);
    }, 100);
  };

  const scrollToLeftOnLeave = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    isScrollableRef.current = false; // 离开焦点不可滚动
    setScrollableClass(false);
    scrollTo(0);
    if (mouseEnterTimerRef.current) {
      clearTimeout(mouseEnterTimerRef.current);
    }
  };

  const clearScroll = () => {
    if (mouseEnterTimerRef.current) {
      clearTimeout(mouseEnterTimerRef.current);
    }
  };

  const initScroll = (element: HTMLElement) => {
    if (!element) return;
    updateScrollElement(element);
  };

  useEffect(() => {
    initScroll(tagInputRef.current?.currentElement as HTMLElement);
    return clearScroll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tagInputRef,
    scrollElement: scrollElementRef,
    scrollDistance: scrollDistanceRef,
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
