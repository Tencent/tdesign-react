/* eslint-disable no-underscore-dangle */
/**
 * 通用虚拟滚动，可支持 Select/List/Table/TreeSelect/Cascader 等组件
 */
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash-es';
import type { ScrollToElementParams, TScroll } from '../common';

export type UseVirtualScrollParams = {
  /** 列数据 */
  data: { [key: string]: any }[];
  scroll: TScroll & {
    fixedRows?: Array<number>;
  };
};

export type RowMountedParams = {
  ref: HTMLElement;
  data: {
    [key: string]: any;
    __VIRTUAL_SCROLL_INDEX?: number;
  };
};

const requestAnimationFrame =
  (typeof window === 'undefined' ? false : window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16.6));

const useVirtualScroll = (container: MutableRefObject<HTMLElement>, params: UseVirtualScrollParams) => {
  const { data, scroll } = params;

  const dataRef = useRef(data);
  const containerHeight = useRef(0);

  /** 注意测试：数据长度为空；数据长度小于表格高度等情况。即期望只有数据量达到一定程度才允许开启虚拟滚动 */
  const [visibleData, setVisibleData] = useState<any[]>([]);
  // 滚动过程中表格顶部占位距离
  const [translateY, setTranslateY] = useState(0);
  // 滚动高度，用于显示滚动条
  const [scrollHeight, setScrollHeight] = useState(0);
  // 每一行到顶部的距离总和
  const trScrollTopHeightList = useRef<number[]>([]);
  // 每一行的实际高度
  const [trHeightList, setTrHeightList] = useState<number[]>([]);

  const tScroll = useMemo(() => {
    if (!scroll) return {};
    return {
      bufferSize: scroll.bufferSize || 10,
      isFixedRowHeight: scroll.isFixedRowHeight ?? false,
      rowHeight: scroll.rowHeight || 47,
      threshold: scroll.threshold || 100,
      type: scroll.type,
      fixedRows: scroll.fixedRows ?? [0, 0],
    };
  }, [scroll]);
  const visibleCount = Math.min(tScroll.bufferSize * 3, data.length);

  const isVirtualScroll = useMemo(() => tScroll.type === 'virtual' && tScroll.threshold < data.length, [tScroll, data]);

  const [startAndEndIndex, setStartAndEndIndex] = useState<[number, number]>(() => [0, visibleCount]);

  const getTrScrollTopHeightList = (trHeightList: number[]) => {
    const list: number[] = [];
    // 大数据场景不建议使用 forEach 一类函数迭代
    // 当前行滚动高度 = 上一行滚动高度 + 当前行高度
    for (let i = 0, len = data.length; i < len; i++) {
      list[i] = (list[i - 1] || 0) + (trHeightList[i] || tScroll.rowHeight);
    }
    return list;
  };

  const updateVisibleData = (trScrollTopHeightList: number[], scrollTop: number) => {
    let currentIndex = -1;
    // 获取当前滚动到哪一个元素（大数据场景不建议使用 forEach 一类函数迭代）
    for (let i = 0, len = trScrollTopHeightList.length; i < len; i++) {
      if (trScrollTopHeightList[i] >= scrollTop) {
        currentIndex = i;
        break;
      }
    }
    let lastIndex = trScrollTopHeightList.length;
    const containerCurrentHeight = containerHeight.current || container.current.getBoundingClientRect().height;
    const scrollBottom = scrollTop + containerCurrentHeight;
    // 获取当前视窗的最后一个元素（大数据场景不建议使用 forEach 一类函数迭代）
    for (let i = currentIndex, len = trScrollTopHeightList.length; i < len; i++) {
      if (trScrollTopHeightList[i] >= scrollBottom) {
        lastIndex = i;
        break;
      }
    }

    if (currentIndex < 0) return;
    const startIndex = Math.max(currentIndex - tScroll.bufferSize, 0);
    const endIndex = Math.min(lastIndex + tScroll.bufferSize, trScrollTopHeightList.length);

    // 计算固定行情况
    const { fixedRows } = tScroll;
    const [fixedStart, fixedEnd] = fixedRows;

    const firstIsFake = data[0]?.__VIRTUAL_FAKE_DATA;
    const isScrollStart = lastIndex - visibleCount <= 0; // 首行开始出现在可视区域
    const startOffset = firstIsFake && !isScrollStart ? 1 : 0;

    let fixedStartData = fixedStart ? data.slice(startOffset, fixedStart + startOffset) : [];
    if (fixedStart && startIndex < fixedStart) {
      fixedStartData = fixedStartData.slice(0, startIndex);
    }

    const lastIsFake = data[data.length - 1]?.__VIRTUAL_FAKE_DATA;
    const isScrollEnd = lastIndex === trScrollTopHeightList.length;
    const endOffset = lastIsFake && !isScrollEnd ? 1 : 0;

    let fixedEndData = fixedEnd ? data.slice(data.length - fixedEnd - endOffset) : [];
    const bottomStartIndex = endIndex - data.length + 1 + (fixedEnd ?? 0);
    if (fixedEnd && bottomStartIndex > 0) {
      fixedEndData = fixedEndData.slice(bottomStartIndex);
    }

    if (startAndEndIndex.join() !== [startIndex, endIndex].join() && startIndex >= 0) {
      const tmpVisibleData = fixedStartData.concat(data.slice(startIndex, endIndex)).concat(fixedEndData);
      setVisibleData(tmpVisibleData);
      const lastScrollTop = trScrollTopHeightList[startIndex - 1];
      const top = lastScrollTop > 0 ? lastScrollTop : 0;
      const stickyHeight = trScrollTopHeightList[Math.min(startIndex, fixedStart) - 1] || 0;
      setTranslateY(top - stickyHeight);
      setStartAndEndIndex([startIndex, endIndex]);
    }
  };

  // 仅非固定高度场景需要
  const handleRowMounted = (rowData: RowMountedParams) => {
    if (!isVirtualScroll || !rowData || tScroll.isFixedRowHeight || !container?.current) return;
    const trHeight = rowData.ref.offsetHeight;
    const rowIndex = rowData.data.__VIRTUAL_SCROLL_INDEX;
    const newTrHeightList = trHeightList;
    if (newTrHeightList[rowIndex] !== trHeight) {
      newTrHeightList[rowIndex] = trHeight;
      setTrHeightList(newTrHeightList);

      const scrollTopHeightList = getTrScrollTopHeightList(newTrHeightList);
      trScrollTopHeightList.current = scrollTopHeightList;

      const lastIndex = scrollTopHeightList.length - 1;
      setScrollHeight(scrollTopHeightList[lastIndex] - containerHeight.current);
      updateVisibleData(scrollTopHeightList, container.current.scrollTop);
    }
  };

  const handleScroll = () => {
    if (!isVirtualScroll) return;
    updateVisibleData(trScrollTopHeightList.current, container.current.scrollTop);
  };

  const addIndexToData = (data: any[]) => {
    data.forEach((item, index) => {
      Reflect.set(item, '__VIRTUAL_SCROLL_INDEX', index);
    });
  };

  const updateScrollTop = ({ index, top = 0, behavior }: ScrollToElementParams) => {
    const scrollTop = trScrollTopHeightList.current[index] - top;
    container.current?.scrollTo({
      top: scrollTop,
      behavior: behavior || 'auto',
    });
  };

  /**
   * 滚动到指定元素（对外暴露的方法，谨慎修改）
   */
  const scrollToElement = (p: ScrollToElementParams) => {
    updateScrollTop(p);
    if (!tScroll.isFixedRowHeight) {
      requestAnimationFrame(() => {
        const duration = p.time ?? 60;
        const timer = setTimeout(() => {
          updateScrollTop(p);
          clearTimeout(timer);
        }, duration);
      });
    }
  };

  // 固定高度场景，可直接通过数据长度计算出最大滚动高度
  useEffect(
    () => {
      if (!isVirtualScroll) {
        // 避免从非虚拟滚动动态切换到虚拟滚动时，数据瞬间为[]，导致滚动位置重置的问题
        if (data.length) {
          dataRef.current = data;
          setVisibleData(data);
          trScrollTopHeightList.current = getTrScrollTopHeightList(trHeightList);
        }
        return;
      }
      // 给数据添加下标
      addIndexToData(data);

      const dataChanged = !isEqual(dataRef.current, data);
      const scrollTopHeightList = trScrollTopHeightList.current;
      if (scrollTopHeightList?.length === data?.length && !dataChanged) {
        // 正常滚动时更新可见数据
        const lastIndex = scrollTopHeightList.length - 1;
        setScrollHeight(scrollTopHeightList[lastIndex]);
        updateVisibleData(scrollTopHeightList, container.current.scrollTop);
      } else {
        /**
        /* 进入这个分支的场景可能有：
         * - 初始化
         * - 外部数据动态更新（长度变化、内容结构变化等）
         */
        dataRef.current = data;
        setScrollHeight(data.length * tScroll.rowHeight);

        // 如果之前存在滚动，基于原先数据计算位置
        const currentScrollTop = container.current?.scrollTop || 0;
        let currentIndex = Math.floor(currentScrollTop / tScroll.rowHeight);
        for (let i = 0; i < scrollTopHeightList?.length; i++) {
          if (scrollTopHeightList[i] >= currentScrollTop) {
            currentIndex = i;
            break;
          }
        }

        const startIndex = Math.max(currentIndex - tScroll.bufferSize, 0);
        const endIndex = Math.min(startIndex + visibleCount, data.length);
        const tmpData = data.slice(startIndex, endIndex);

        let translateY = startIndex * tScroll.rowHeight;

        if (scrollTopHeightList?.length > 0 && startIndex > 0) {
          const prevHeight = scrollTopHeightList[Math.min(startIndex - 1, scrollTopHeightList.length - 1)] || 0;
          translateY = Math.max(0, prevHeight);
        }

        setVisibleData(tmpData);
        setTranslateY(translateY);
      }

      const timer = setTimeout(() => {
        if (container.current) {
          const tmpContainerHeight = container.current.getBoundingClientRect().height;
          containerHeight.current = tmpContainerHeight;
          const scrollTopHeightList = getTrScrollTopHeightList(trHeightList);
          trScrollTopHeightList.current = scrollTopHeightList;
          clearTimeout(timer);
        }
      }, 1);
    },
    // eslint-disable-next-line
    [container, data, tScroll, isVirtualScroll, startAndEndIndex, trHeightList],
  );

  return {
    visibleData,
    translateY,
    scrollHeight,
    isVirtualScroll,
    handleScroll,
    handleRowMounted,
    scrollToElement,
  };
};

export type VirtualScrollConfig = ReturnType<typeof useVirtualScroll>;

export default useVirtualScroll;
