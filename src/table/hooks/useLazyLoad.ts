/**
 * 原作者 @louiszhai 思路
 */
import { useState, useMemo, useEffect } from 'react';
import observe from '../../_common/js/utils/observe';

export type UseLazyLoadParams = {
  type: 'lazy' | 'virtual';
  rowIndex: number;
  rowHeight?: number;
  bufferSize?: number;
};

export default function useLazyLoad(
  containerRef: HTMLElement,
  childRef: HTMLTableRowElement,
  params: UseLazyLoadParams,
) {
  // useMemo 用意：1. 为了实时响应数据；2. 表格的计算量容易过大，提前存储
  const tRowHeight = useMemo(() => Math.max(params.rowHeight || 48, 48), [params.rowHeight]);
  const [isInit, setIsInit] = useState(params.rowIndex === 0);
  const hasLazyLoadHolder = useMemo(() => params?.type === 'lazy' && !isInit, [isInit, params?.type]);

  const requestAnimationFrame =
    (typeof window === 'undefined' ? false : window.requestAnimationFrame) || ((cb) => setTimeout(cb, 16.6));

  const init = () => {
    if (!isInit) {
      requestAnimationFrame(() => {
        setIsInit(true);
      });
    }
  };

  useEffect(() => {
    if (params?.type !== 'lazy') return;
    const timer = setTimeout(() => {
      const bufferSize = Math.max(10, params.bufferSize || 10);
      const height = tRowHeight * bufferSize;
      childRef && observe(childRef, containerRef, init, height);
      clearTimeout(timer);
    });
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childRef, containerRef, params.bufferSize, params?.type, tRowHeight]);

  return {
    hasLazyLoadHolder,
    tRowHeight,
  };
}
