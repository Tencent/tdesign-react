/**
 * 通用虚拟滚动，可支持 Select/List/Table/TreeSelect/Cascader 等组件
 */
import { useState, useMemo, useEffect, MutableRefObject, useRef } from 'react';
import { TScroll, ScrollToElementParams } from '../common';
import useResizeObserver from './useResizeObserver';

export type UseVirtualScrollParams = {
  /** 列数据 */
  data: { [key: string]: any }[];
  scroll: TScroll & {
    fixedRows?: Array<number>;
  };
};

const requestAnimationFrame =
  (typeof window === 'undefined' ? false : window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16.6));

const useVirtualScroll = (container: MutableRefObject<HTMLElement>, params: UseVirtualScrollParams) => {
  const { data, scroll } = params;
  /** 注意测试：数据长度为空；数据长度小于表格高度等情况。即期望只有数据量达到一定程度才允许开启虚拟滚动 */
  const [visibleData, setVisibleData] = useState<any[]>([]);
  // 滚动过程中表格顶部占位距离
  const [translateY, setTranslateY] = useState(() => (data?.length || 0) * (scroll?.rowHeight || 50));
  // 滚动高度，用于显示滚动条
  const [scrollHeight, setScrollHeight] = useState(0);
  const trScrollTopHeightList = useRef<number[]>([]);
  // 已经通过节点渲染计算出来的各自行高
  const [trHeightList, setTrHeightList] = useState<number[]>([]);
  const containerWidth = useRef(0);
  const containerHeight = useRef(0);
  const [startAndEndIndex, setStartAndEndIndex] = useState<[number, number]>(() => [0, (scroll?.bufferSize || 10) * 3]);

  // 设置初始值
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

  // 当前场景是否满足开启虚拟滚动的条件
  const isVirtualScroll = useMemo(() => tScroll.type === 'virtual' && tScroll.threshold < data.length, [tScroll, data]);
  const getTrScrollTopHeightList = (trHeightList: number[]) => {
    const list: number[] = [];
    // 大数据场景不建议使用 forEach 一类函数迭代
    // 当前行滚动高度 = 上一行滚动高度 + 当前行高度
    for (let i = 0, len = data.length; i < len; i++) {
      list[i] = (list[i - 1] || 0) + (trHeightList[i] || tScroll.rowHeight);
    }
    return list;
  };

  // const tripleBufferSize = useMemo(() => tScroll.bufferSize * 3, [tScroll.bufferSize]);

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
    let fixedStartData = fixedStart ? data.slice(0, fixedStart) : [];
    if (fixedStart && startIndex < fixedStart) {
      fixedStartData = fixedStartData.slice(0, startIndex);
    }
    let fixedEndData = fixedEnd ? data.slice(data.length - fixedEnd) : [];
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
  const handleRowMounted = (rowData: any) => {
    if (!isVirtualScroll || !rowData || tScroll.isFixedRowHeight || !container?.current) return;
    const trHeight = rowData.ref.offsetHeight;
    // eslint-disable-next-line
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

  const refreshVirtualScroll = ([{ contentRect }]: [ResizeObserverEntry]) => {
    // 如果宽度发生变化，重置滚动位置（高度发生变化时，会触发 container 变化，下方的 watch 会计算）
    const maxScrollbarWidth = 16;
    if (Math.abs(contentRect.width - containerWidth.current) > maxScrollbarWidth) {
      // eslint-disable-next-line
      container.current.scrollTop = 0;
      // react container.current.scrollTop 有时候不会触发滚动事件，故而手动触发
      handleScroll();
    }
    containerWidth.current = contentRect.width;
    containerHeight.current = contentRect.height;
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

  useResizeObserver(container, refreshVirtualScroll, isVirtualScroll);

  // 固定高度场景，可直接通过数据长度计算出最大滚动高度
  useEffect(
    () => {
      if (!isVirtualScroll) {
        trScrollTopHeightList.current = getTrScrollTopHeightList(trHeightList);
        return;
      }

      // 给数据添加下标
      addIndexToData(data);

      const scrollTopHeightList = trScrollTopHeightList.current;
      if (scrollTopHeightList?.length === data?.length) {
        // 数据初始化后，根据计算结果更新
        const lastIndex = scrollTopHeightList.length - 1;
        setScrollHeight(scrollTopHeightList[lastIndex]);

        updateVisibleData(scrollTopHeightList, container.current.scrollTop);
      } else {
        // 数据初始化
        setScrollHeight(data.length * tScroll.rowHeight);

        const tmpData = data.slice(0, (scroll?.bufferSize || 10) * 3);
        setVisibleData(tmpData);
        setTranslateY(0);
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
