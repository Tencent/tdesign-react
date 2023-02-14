import { useEffect, useMemo, MutableRefObject, useCallback, CSSProperties } from 'react';
import useVirtualScroll from '../../hooks/useVirtualScroll';
import { TdSelectProps } from '../type';

const usePanelVirtualScroll = ({
  popupContentRef,
  scroll,
  options,
}: {
  scroll?: TdSelectProps['scroll'];
  popupContentRef: MutableRefObject<HTMLElement>;
  options: TdSelectProps['options'];
}) => {
  const scrollThreshold = scroll?.threshold || 100;
  const scrollType = scroll?.type;

  const isVirtual = useMemo(
    () => scrollType === 'virtual' && options?.length > scrollThreshold,
    [scrollType, scrollThreshold, options],
  );

  const scrollParams = useMemo(
    () =>
      ({
        type: 'virtual',
        isFixedRowHeight: scroll?.isFixedRowHeight || false,
        rowHeight: scroll?.rowHeight || 28, // 默认每行高度28
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
