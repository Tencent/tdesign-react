import { useRef } from 'react';

import noop from '../../_util/noop';

export type YearLoadDirection = 'top' | 'bottom';

type YearScrollState = {
  el: HTMLElement | null;
  anchor: {
    direction: YearLoadDirection;
    scrollHeight: number;
    scrollTop: number;
  } | null;
  delta: number;
  loadMore: (direction: YearLoadDirection) => void;
  onWheel: (ev: WheelEvent) => void;
};

function createYearScrollState(): YearScrollState {
  const state: YearScrollState = {
    el: null,
    anchor: null,
    delta: 0,
    loadMore: noop,
    onWheel: (ev) => {
      const scrollTop = state.el?.scrollTop ?? -1;
      const blocked = !state.el || scrollTop > 0 || ev.deltaY >= 0;
      // 离开顶部或向下滚动时清空累积，下次到顶重新计算
      if (blocked) {
        state.delta = 0;
      } else {
        state.delta += Math.abs(ev.deltaY);
      }
      const shouldLoad = !blocked && state.delta >= 50;
      if (!shouldLoad) return;
      state.delta = 0;
      state.loadMore('top');
    },
  };
  return state;
}

function useYearScroll() {
  const scrollRef = useRef<YearScrollState>(undefined);
  const state = scrollRef.current ?? createYearScrollState();
  scrollRef.current = state;
  return state;
}

export default useYearScroll;
