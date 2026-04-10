/**
 * TagInput scroll 模式下的滚动逻辑 Hook
 * 如果标签过多时的处理方式是标签省略，则不需要此功能
 */
import { useEffect, useRef, WheelEvent } from 'react';
import useConfig from '../hooks/useConfig';
import {
  getScrollContainer,
  handleWheelScroll,
  scrollToRight as scrollToRightBase,
  scrollToLeft as scrollToLeftBase,
} from '../../common/js/utils/tagInputScroll';
import type { InputRef } from '../input';
import type { TdTagInputProps } from './type';

export default function useTagScroll(props: TdTagInputProps) {
  const { excessTagsDisplayType, disabled } = props;
  const readOnly = props.readOnly || props.readonly;
  const { classPrefix: prefix } = useConfig();

  /** 标签输入框组件 ref */
  const tagInputRef = useRef<InputRef>(null);
  /** 滚动容器元素缓存（.input__prefix） */
  const scrollElementRef = useRef<HTMLElement>();
  /** 进入防抖定时器 */
  const mouseEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 是否为可交互的 scroll 模式 */
  const isScrollMode = excessTagsDisplayType === 'scroll' && !readOnly && !disabled;

  /** 获取滚动容器（带缓存） */
  const getScrollElement = () => {
    const root = tagInputRef.current?.currentElement as HTMLElement;
    if (!root) return scrollElementRef.current;
    if (scrollElementRef.current?.parentElement !== root) {
      const found = getScrollContainer(root, prefix);
      if (found) scrollElementRef.current = found;
    }
    return scrollElementRef.current;
  };

  /** 滚动到最右侧并开启 scrollable，用于：悬浮进入、tag 变化后定位末尾 */
  const scrollToRight = () => {
    const el = getScrollElement();
    if (el) scrollToRightBase(el, prefix);
  };

  /** 处理滚轮事件，绑定到 TInput 的 onWheel */
  const onWheel = ({ e }: { e: WheelEvent<HTMLDivElement> }) => {
    if (!isScrollMode) return;
    const el = getScrollElement();
    if (el) handleWheelScroll(el, e);
  };

  /** 清除防抖定时器 */
  const clearEnterTimer = () => {
    if (mouseEnterTimerRef.current) {
      clearTimeout(mouseEnterTimerRef.current);
      mouseEnterTimerRef.current = null;
    }
  };

  /** 鼠标悬浮进入：延迟 100ms 后滚动到最右侧 */
  const scrollToRightOnEnter = () => {
    if (!isScrollMode) return;
    clearEnterTimer();
    mouseEnterTimerRef.current = setTimeout(() => {
      scrollToRight();
      mouseEnterTimerRef.current = null;
    }, 100);
  };

  /** 鼠标离开：滚回最左并关闭 scrollable */
  const scrollToLeftOnLeave = () => {
    if (!isScrollMode) return;
    clearEnterTimer();
    const el = getScrollElement();
    if (el) scrollToLeftBase(el, prefix);
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
