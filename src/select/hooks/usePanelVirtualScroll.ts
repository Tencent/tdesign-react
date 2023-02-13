import { useEffect, useMemo, MutableRefObject, useCallback } from 'react';
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
  const {
    visibleData = null,
    handleScroll: handleVirtualScroll = null,
    scrollHeight = null,
    translateY = null,
    handleRowMounted = null,
  } = useVirtualScroll(popupContentRef, {
    data: options,
    scroll: {
      type: 'virtual',
      isFixedRowHeight: scroll?.isFixedRowHeight || false,
      rowHeight: scroll?.rowHeight || 28, // 默认每行高度28
      bufferSize: scroll?.bufferSize || 20,
      threshold: scrollThreshold || 100,
    },
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
    if (isVirtual) {
      console.log(popupContentRef, 'popupContentRef');
      popupContentRef?.current?.addEventListener?.('scroll', onInnerVirtualScroll);
    }
    return () => {
      // 卸载时取消监听

      if (isVirtual) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        popupContentRef.current?.removeEventListener?.('scroll', onInnerVirtualScroll);
      }
    };
  }, [isVirtual, onInnerVirtualScroll, popupContentRef]);

  const cursorStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    transition: 'transform 0.2s',
    transform: `translate(0, ${scrollHeight}px)`,
    msTransform: `translate(0, ${scrollHeight}px)`,
    mozTransform: `translate(0, ${scrollHeight}px)`,
    webkitTransform: `translate(0, ${scrollHeight}px)`,
  };

  const panelStyle = {
    transform: `translate(0, ${translateY}px)`,
    msTransform: `translate(0, ${translateY}px)`,
    mozTransform: `translate(0, ${translateY}px)`,
    webkitTransform: `translate(0, ${translateY}px)`,
  };

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
