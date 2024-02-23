import { useEffect, useMemo, MutableRefObject, useCallback, CSSProperties } from 'react';
import useVirtualScroll from '../../hooks/useVirtualScroll';
import { TdSelectProps } from '../type';
import { TScroll, SizeEnum } from '../../common';

interface PanelVirtualScroll {
  scroll?: TdSelectProps['scroll'];
  popupContentRef: MutableRefObject<HTMLDivElement>;
  options: TdSelectProps['options'];
  size: SizeEnum;
}

const usePanelVirtualScroll = ({ popupContentRef, scroll, options, size }: PanelVirtualScroll) => {
  const scrollThreshold = scroll?.threshold || 100;
  const scrollType = scroll?.type;

  const isVirtual = useMemo<boolean>(
    () => scrollType === 'virtual' && options?.length > scrollThreshold,
    [scrollType, scrollThreshold, options],
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
    // 排除横向滚动出发的纵向虚拟滚动计算
    if (Math.abs(lastScrollY - top) > 5) {
      handleVirtualScroll();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      lastScrollY = top;
    } else {
      lastScrollY = -1;
    }
  }, []);

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
  } as CSSProperties;

  const panelStyle = {
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
    panelStyle,
  };
};

export default usePanelVirtualScroll;
