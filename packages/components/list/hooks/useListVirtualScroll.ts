import React, { useMemo } from 'react';
import log from '../../_common/js/log';
import useVirtualScroll from '../../hooks/useVirtualScroll';
import { TdListProps } from '../type';
import { Styles, type ComponentScrollToElementParams } from '../../common';

export const useListVirtualScroll = (
  scroll: TdListProps['scroll'],
  listRef: React.MutableRefObject<HTMLElement>,
  listItems: any[],
) => {
  const virtualScrollParams = useMemo(
    () => ({
      data: listItems,
      scroll,
    }),
    [listItems, scroll],
  );
  const virtualConfig = useVirtualScroll(listRef, virtualScrollParams);
  const { isVirtualScroll } = virtualConfig;
  let lastScrollY = -1;

  const onInnerVirtualScroll = (e: WheelEvent) => {
    const target = (e.target || e.srcElement) as HTMLElement;
    const top = target.scrollTop;
    if (lastScrollY !== top) {
      virtualConfig.isVirtualScroll && virtualConfig.handleScroll();
    } else {
      lastScrollY = -1;
    }
    lastScrollY = top;
  };

  const cursorStyle = useMemo(
    () =>
      ({
        position: 'absolute',
        width: '1px',
        height: '1px',
        transition: 'transform 0.2s',
        transform: `translate(0, ${virtualConfig.scrollHeight}px)`,
        msTransform: `translate(0, ${virtualConfig.scrollHeight}px)`,
        MozTransform: `translate(0, ${virtualConfig.scrollHeight}px)`,
        WebkitTransform: `translate(0, ${virtualConfig.scrollHeight}px)`,
      } as Styles),
    [virtualConfig.scrollHeight],
  );

  const listStyle = useMemo(
    () =>
      ({
        transform: `translate(0, ${virtualConfig.translateY}px)`,
        msTransform: `translate(0, ${virtualConfig.translateY}px)`,
        MozTransform: `translate(0, ${virtualConfig.translateY}px)`,
        WebkitTransform: `translate(0, ${virtualConfig.translateY}px)`,
      } as Styles),
    [virtualConfig.translateY],
  );

  const handleScrollTo = (params: ComponentScrollToElementParams) => {
    const { index, key } = params;
    const targetIndex = index === 0 ? index : index ?? Number(key);
    if (!targetIndex && targetIndex !== 0) {
      log.error('List', 'scrollTo: `index` or `key` must exist.');
      return;
    }
    if (targetIndex < 0 || targetIndex >= listItems.length) {
      log.error('List', `${targetIndex} does not exist in data, check \`index\` or \`key\` please.`);
      return;
    }
    virtualConfig.scrollToElement({ ...params, index: targetIndex - 1 });
  };

  return {
    virtualConfig,
    cursorStyle,
    listStyle,
    isVirtualScroll,
    onInnerVirtualScroll,
    scrollToElement: handleScrollTo,
  };
};
