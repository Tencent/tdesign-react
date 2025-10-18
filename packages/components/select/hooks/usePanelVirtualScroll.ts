import { useCallback, useEffect, useMemo } from 'react';
import useVirtualScroll from '../../hooks/useVirtualScroll';

import type { SizeEnum, TScroll } from '../../common';
import type { TdSelectProps } from '../type';

interface PanelVirtualScroll {
  scroll?: TdSelectProps['scroll'];
  popupContentRef: React.MutableRefObject<HTMLDivElement>;
  options: TdSelectProps['options'];
  size: SizeEnum;
}

const usePanelVirtualScroll = ({ popupContentRef, scroll, options, size }: PanelVirtualScroll) => {
  const scrollThreshold = scroll?.threshold || 100;
  const scrollType = scroll?.type;

  const enableVirtual = useMemo<boolean>(() => scrollType === 'virtual', [scrollType]);
  const isVirtual = useMemo<boolean>(
    () => enableVirtual && options?.length > scrollThreshold,
    [enableVirtual, options?.length, scrollThreshold],
  );

  const scrollParams = useMemo<TScroll>(() => {
    const heightMap = {
      small: 20,
      medium: 28,
      large: 36,
    };
    const rowHeight = heightMap[size] || 28;
    return {
      type: 'virtual',
      isFixedRowHeight: scroll?.isFixedRowHeight || false,
      rowHeight: scroll?.rowHeight || rowHeight,
      bufferSize: scroll?.bufferSize || 20,
      threshold: scrollThreshold,
    };
  }, [scroll, scrollThreshold, size]);

  const {
    visibleData = null,
    handleScroll: handleVirtualScroll = null,
    scrollHeight = null,
    translateY = null,
    handleRowMounted = null,
  } = useVirtualScroll(popupContentRef, {
    enable: enableVirtual,
    data: options || [],
    scroll: scrollParams,
  });

  let lastScrollY = -1;

  const onInnerVirtualScroll = useCallback((e: WheelEvent) => {
    if (!isVirtual) {
      return;
    }
    const target = e.target as HTMLElement;
    const top = target.scrollTop;
    // 排除横向滚动触发的纵向虚拟滚动计算
    if (Math.abs(lastScrollY - top) > 5) {
      handleVirtualScroll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      lastScrollY = top;
    } else {
      lastScrollY = -1;
    }
  }, [isVirtual, handleVirtualScroll]);

  // 监听popup滚动 处理虚拟滚动时的virtualData变化
  useEffect(() => {
    const popupContentDom = popupContentRef?.current;
    if (isVirtual) {
      popupContentDom?.addEventListener?.('scroll', onInnerVirtualScroll);
    }
    return () => {
      // 卸载时取消监听
      if (isVirtual) {
        popupContentDom?.removeEventListener?.('scroll', onInnerVirtualScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVirtual, onInnerVirtualScroll, popupContentRef.current]);

  const cursorStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    transition: 'transform 0.2s',
    transform: `translate(0, ${scrollHeight}px)`,
    MsTransform: `translate(0, ${scrollHeight}px)`,
    MozTransform: `translate(0, ${scrollHeight}px)`,
    WebkitTransform: `translate(0, ${scrollHeight}px)`,
  } as React.CSSProperties;

  const panelStyle = {
    transform: `translate(0, ${translateY}px)`,
    MsTransform: `translate(0, ${translateY}px)`,
    MozTransform: `translate(0, ${translateY}px)`,
    WebkitTransform: `translate(0, ${translateY}px)`,
  } as React.CSSProperties;

  return {
    scrollHeight,
    translateY,
    visibleData,
    handleRowMounted,
    isVirtual,
    cursorStyle,
    panelStyle,
  };
};

export default usePanelVirtualScroll;
