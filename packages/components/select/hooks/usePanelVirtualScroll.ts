import { useCallback, useEffect, useMemo, useState } from 'react';

import useConfig from '../../hooks/useConfig';
import useLayoutEffect from '../../hooks/useLayoutEffect';
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
  const config = useConfig();
  const [rowGap, setRowGap] = useState(0);
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
    rowGap,
  });

  useLayoutEffect(() => {
    if (!isVirtual) return;
    const { classPrefix } = config;
    // 分组不是等间距的选项行，保持原有分组计算。
    const hasGroups = options?.some((option) => 'group' in option && option.group);
    const option = !hasGroups
      ? popupContentRef.current?.querySelector(
          `.${classPrefix}-select__dropdown-inner > .${classPrefix}-select__list > .${classPrefix}-select-option + .${classPrefix}-select-option`,
        )
      : null;
    // 第一项没有相邻项 margin，测量第二项以保留主题定义的实际间距。
    const gap = option ? parseFloat(getComputedStyle(option).marginTop) || 0 : 0;
    if (gap !== rowGap) setRowGap(gap);
  }, [config, isVirtual, options, popupContentRef, rowGap, size, visibleData]);

  let lastScrollY = -1;

  const onInnerVirtualScroll = useCallback(
    (e: WheelEvent) => {
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
    },
    [isVirtual, handleVirtualScroll],
  );

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
