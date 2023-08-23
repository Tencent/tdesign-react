import { useMemo, useEffect, CSSProperties } from 'react';
import useVirtualScroll from '../../hooks/useVirtualScroll';
import TreeNode from '../../_common/js/tree/tree-node';

import type { TScroll } from '../../common';

export default function useTreeVirtualScroll({
  treeRef,
  scroll,
  data = [],
}: {
  data: TreeNode[];
  scroll: TScroll;
  treeRef: React.MutableRefObject<HTMLElement>;
}) {
  const scrollThreshold = scroll?.threshold || 100;
  const scrollType = scroll?.type;

  const isVirtual = useMemo(
    () => scrollType === 'virtual' && data?.length > scrollThreshold,
    [scrollType, scrollThreshold, data],
  );

  const scrollParams = useMemo(
    () =>
      ({
        type: 'virtual',
        isFixedRowHeight: scroll?.isFixedRowHeight || false, // expand and collapse operation make height of tree item different
        rowHeight: scroll?.rowHeight || 34,
        bufferSize: scroll?.bufferSize || 20,
        threshold: scrollThreshold,
      } as const),
    [scroll, scrollThreshold],
  );

  const {
    visibleData = null,
    handleScroll: handleVirtualScroll = null,
    scrollHeight = null,
    translateY = null,
    handleRowMounted = null,
    scrollToElement,
  } = useVirtualScroll(treeRef, {
    data: data || [],
    scroll: scrollParams,
  });

  let lastScrollY = -1;
  const onInnerVirtualScroll = (e: WheelEvent) => {
    if (!isVirtual) {
      return;
    }
    const target = e.target as HTMLElement;
    const top = target.scrollTop;
    if (lastScrollY !== top) {
      handleVirtualScroll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    } else {
      lastScrollY = -1;
    }
    lastScrollY = top;
  };

  useEffect(() => {
    const treeList = treeRef?.current;
    if (isVirtual) {
      treeList?.addEventListener?.('scroll', onInnerVirtualScroll);
    }
    return () => {
      // 卸载时取消监听
      if (isVirtual) {
        treeList?.removeEventListener?.('scroll', onInnerVirtualScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVirtual, onInnerVirtualScroll]);

  const cursorStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    transition: 'transform 0.2s',
    transform: `translate(0, ${scrollHeight}px)`,
    MsTransform: `translate(0, ${scrollHeight}px)`,
    MozTransform: `translate(0, ${scrollHeight}px)`,
    WebkitTransform: `translate(0, ${scrollHeight}px)`,
  } as CSSProperties;

  const treeNodeStyle = {
    transform: `translate(0, ${translateY}px)`,
    MsTransform: `translate(0, ${translateY}px)`,
    MozTransform: `translate(0, ${translateY}px)`,
    WebkitTransform: `translate(0, ${translateY}px)`,
  } as CSSProperties;

  return {
    scrollHeight,
    translateY,
    visibleData,
    handleRowMounted,
    isVirtual,
    cursorStyle,
    treeNodeStyle,
    scrollToElement,
  };
}
