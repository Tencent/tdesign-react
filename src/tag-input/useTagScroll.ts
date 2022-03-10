/**
 * 当标签数量过多时，输入框显示不下，则需要滚动查看，以下为滚动逻辑
 * 如果标签过多时的处理方式，是标签省略，则不需要此功能
 */

import { useRef, useEffect, RefObject, useState, WheelEvent } from 'react';
import { TdTagInputProps } from './type';

let mouseEnterTimer = null;

export default function useTagScroll(props: TdTagInputProps) {
  const tagInputRef: RefObject<{ currentElement: HTMLDivElement }> = useRef();
  const { excessTagsDisplayType = 'scroll', readonly, disabled } = props;
  // 允许向右滚动的最大距离
  const [scrollDistance, setScrollDistance] = useState(0);
  const [scrollElement, setScrollElement] = useState<HTMLDivElement>();

  const updateScrollElement = (element: HTMLDivElement) => {
    const scrollElement = element.children[0] as HTMLDivElement;
    setScrollElement(scrollElement);
  };

  const updateScrollDistance = () => {
    setScrollDistance(scrollElement.scrollWidth - scrollElement.clientWidth);
  };

  const scrollTo = (distance: number) => {
    scrollElement?.scroll({ left: distance, behavior: 'smooth' });
  };

  const scrollToRight = () => {
    updateScrollDistance();
    scrollTo(scrollDistance);
  };

  const scrollToLeft = () => {
    scrollTo(0);
  };

  // TODO：MAC 电脑横向滚动，Windows 纵向滚动。当前只处理了横向滚动
  const onWheel = ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
    if (readonly || disabled) return;
    if (!scrollElement) return;
    if (e.deltaX > 0) {
      const distance = Math.min(scrollElement.scrollLeft + 120, scrollDistance);
      scrollTo(distance);
    } else {
      const distance = Math.max(scrollElement.scrollLeft - 120, 0);
      scrollTo(distance);
    }
  };

  // 鼠标 hover，自动滑动到最右侧，以便输入新标签
  const scrollToRightOnEnter = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    // 一闪而过的 mousenter 不需要执行
    mouseEnterTimer = setTimeout(() => {
      scrollToRight();
      clearTimeout(mouseEnterTimer);
    }, 100);
  };

  const scrollToLeftOnLeave = () => {
    if (excessTagsDisplayType !== 'scroll') return;
    scrollTo(0);
    clearTimeout(mouseEnterTimer);
  };

  const clearScroll = () => {
    clearTimeout(mouseEnterTimer);
  };

  const initScroll = (element: HTMLDivElement) => {
    if (!element) return;
    updateScrollElement(element);
  };

  useEffect(() => {
    initScroll(tagInputRef?.current.currentElement);
    return clearScroll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    initScroll,
    clearScroll,
    tagInputRef,
    scrollElement,
    scrollDistance,
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
