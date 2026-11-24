import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import useConfig from '../../hooks/useConfig';
import useEventListener from '../../hooks/useEventListener';
import Loading from '../../loading';
import type { PageInfo, TableRowData, TdBaseTableProps } from '../type';

const PULL_REFRESH_DISTANCE = 80;

/**
 * 上拉加载分页 hook
 * 参考 usePagination 实现，内部管理分页数据，上拉触发时自动加载下一页
 * 支持跟手位移效果和 loading 状态
 */
export default function usePullRefresh(props: TdBaseTableProps, containerRef: React.RefObject<HTMLDivElement | null>) {
  const { pagination, data, loading, loadingProps, loadingMode } = props;
  const { classPrefix } = useConfig();

  const [dataSource, setDataSource] = useState<TableRowData[]>([]);
  const [isPaginateData, setIsPaginateData] = useState(false);

  // 上拉跟手位移量（px）
  const [pullOffset, setPullOffset] = useState(0);
  // 是否正在拖拽中（用于控制 CSS transition）
  const [isPulling, setIsPulling] = useState(false);
  // 是否正在加载更多（上拉触发后的 loading 状态）
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const pageSize = pagination?.pageSize ?? pagination?.defaultPageSize ?? 10;
  const isControlled = pagination?.current !== undefined;

  // 当前页码（内部维护）
  const currentPageRef = useRef<number>(pagination?.current || pagination?.defaultCurrent || 1);

  // 触摸相关 ref
  const startYRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);

  // 是否还有更多数据
  const hasMoreRef = useRef<boolean>(true);

  const [locale] = useLocaleReceiver('table');
  /**
   * 计算当前应展示的数据（累积模式：展示第 1 页到第 current 页的所有数据）
   */
  const calculateAccumulatedData = useCallback(
    (current: number, size: number) => {
      const { total } = pagination;
      const curTotal = current * size;
      const list = data || [];
      const shouldPaginate = list.length > size || total > curTotal;
      if (!shouldPaginate) {
        return { newData: list, hasMore: false };
      }
      const end = current * size;
      const newData = list.slice(0, end);
      const hasMore = end < list.length || total > curTotal;
      return { newData, hasMore };
    },
    [data, pagination],
  );

  // 初始化和 data 变更时重新计算
  useEffect(() => {
    if (!pagination) {
      setIsPaginateData(false);
      setDataSource(data || []);
      return;
    }

    setIsPaginateData(true);
    const current = isControlled ? pagination.current || 1 : currentPageRef.current;
    const { newData, hasMore } = calculateAccumulatedData(current, pageSize);
    setDataSource(newData || []);
    hasMoreRef.current = hasMore;
  }, [data, pagination, pageSize, isControlled, calculateAccumulatedData]);

  // 受控模式下 current 变更时同步
  useEffect(() => {
    if (!pagination || !isControlled) return;
    currentPageRef.current = pagination.current || 1;
    const { newData, hasMore } = calculateAccumulatedData(currentPageRef.current, pageSize);
    setDataSource(newData || []);
    hasMoreRef.current = hasMore;
  }, [pagination, isControlled, pageSize, calculateAccumulatedData]);

  // loading 结束时重置 isLoadingMore
  useEffect(() => {
    if (!loading && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [loading, isLoadingMore]);

  /**
   * 加载下一页
   */
  const loadNextPage = useCallback(() => {
    if (!hasMoreRef.current) return;

    const previousPage = currentPageRef.current;
    const nextPage = previousPage + 1;
    currentPageRef.current = nextPage;

    const { newData, hasMore } = calculateAccumulatedData(nextPage, pageSize);
    setDataSource(newData || []);
    hasMoreRef.current = hasMore;

    // 设置加载状态
    setIsLoadingMore(true);

    // 触发 onPageChange 事件
    const pageInfo: PageInfo = { current: nextPage, previous: previousPage, pageSize };
    props.onPageChange?.(pageInfo, newData || []);
  }, [calculateAccumulatedData, pageSize, props]);

  // --- 触摸事件逻辑 ---
  const isAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollTop + clientHeight >= scrollHeight - 1;
  }, [containerRef]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (loading || isLoadingMore || !hasMoreRef.current) return;
      if (!isAtBottom()) return;
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
      setIsPulling(true);
      setPullOffset(0);
    },
    [loading, isLoadingMore, isAtBottom],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (loading || isLoadingMore || !isPullingRef.current) return;

      const currentY = e.touches[0].clientY;
      const diff = startYRef.current - currentY; // 正值表示上拉

      if (diff > 0) {
        // 阻止默认滚动，因为已经到底了
        if (isAtBottom()) {
          e.preventDefault();
        }
        // 使用阻尼效果：实际位移 = diff * 0.5，最大不超过 PULL_REFRESH_DISTANCE * 1.5
        const dampedOffset = Math.min(diff * 0.5, PULL_REFRESH_DISTANCE * 1.5);
        setPullOffset(dampedOffset);
      } else {
        // 向下滑回时重置
        setPullOffset(0);
      }
    },
    [loading, isLoadingMore, isAtBottom],
  );

  const handleTouchEnd = useCallback(() => {
    if (loading || isLoadingMore || !isPullingRef.current) return;

    const currentOffset = pullOffset;
    isPullingRef.current = false;
    setIsPulling(false);

    if (currentOffset >= PULL_REFRESH_DISTANCE * 0.5) {
      // 达到触发阈值，加载下一页，保持一定位移展示 loading
      setPullOffset(PULL_REFRESH_DISTANCE * 0.5);
      loadNextPage();
    } else {
      // 未达到阈值，弹回
      setPullOffset(0);
    }
  }, [loading, isLoadingMore, pullOffset, loadNextPage]);

  // loading 结束后重置位移
  useEffect(() => {
    if (!isLoadingMore) {
      setPullOffset(0);
    }
  }, [isLoadingMore]);

  // 绑定触摸事件（touchmove 需要 preventDefault，须以 passive: false 原生监听，见 useEventListener）
  const pullRefreshEnabled = !!pagination && loadingMode === 'pull-refresh';
  useEventListener(containerRef, 'touchstart', handleTouchStart, {
    passive: true,
    enabled: pullRefreshEnabled,
  });
  useEventListener(containerRef, 'touchmove', handleTouchMove, {
    passive: false,
    enabled: pullRefreshEnabled,
  });
  useEventListener(containerRef, 'touchend', handleTouchEnd, {
    passive: true,
    enabled: pullRefreshEnabled,
  });

  /**
   * 渲染上拉加载 loading
   * 当用户上拉时（isPulling 或 isLoadingMore）展示底部 loading
   */
  const renderPullRefreshLoading = () => {
    if (!isPulling && !isLoadingMore) return null;
    return (
      <div className={`${classPrefix}-table-loading--bottom`}>
        <Loading text={locale.loadingText} {...loadingProps} loading={true} />
      </div>
    );
  };

  return {
    dataSource,
    isPaginateData,
    pullOffset,
    isPulling,
    isLoadingMore,
    renderPullRefreshLoading,
  };
}
