import { useState, useRef, useMemo, useEffect } from 'react';
import { TdBaseTableProps } from '../type';
import { on, off } from '../../_util/dom';
import { AffixProps } from '../../affix';

/**
 * 1. 表头吸顶（普通表头吸顶 和 虚拟滚动表头吸顶）
 * 2. 表尾吸底
 * 3. 底部滚动条吸底
 * 4. 分页器吸底
 */
export default function useAffix(props: TdBaseTableProps) {
  const tableContentRef = useRef<HTMLDivElement>();
  // 吸顶表头
  const affixHeaderRef = useRef<HTMLDivElement>();
  // 吸底表尾
  const affixFooterRef = useRef<HTMLDivElement>();
  // 吸底滚动条
  const horizontalScrollbarRef = useRef<HTMLDivElement>();
  // 吸底分页器
  const paginationRef = useRef<HTMLDivElement>();
  // 当表格完全滚动消失在视野时，需要隐藏吸顶表头
  const [showAffixHeader, setShowAffixHeader] = useState(true);
  // 当表格完全滚动消失在视野时，需要隐藏吸底尾部
  const [showAffixFooter, setShowAffixFooter] = useState(true);
  // 当表格完全滚动消失在视野时，需要隐藏吸底分页器
  const [showAffixPagination, setShowAffixPagination] = useState(true);

  const isVirtualScroll = useMemo(
    () => props.scroll && props.scroll.type === 'virtual' && (props.scroll.threshold || 100) < props.data.length,
    [props.data.length, props.scroll],
  );

  const isAffixed = useMemo(
    () => !!(props.headerAffixedTop || props.footerAffixedBottom || props.horizontalScrollAffixedBottom),
    [props.footerAffixedBottom, props.headerAffixedTop, props.horizontalScrollAffixedBottom],
  );

  let lastScrollLeft = 0;
  const onHorizontalScroll = (scrollElement?: HTMLElement) => {
    if (!isAffixed && !isVirtualScroll) return;
    let target = scrollElement;
    if (!target && tableContentRef.current) {
      lastScrollLeft = 0;
      target = tableContentRef.current;
    }
    if (!target) return;
    const left = target.scrollLeft;
    // 如果 lastScrollLeft 等于 left，说明不是横向滚动，不需要更新横向滚动距离
    if (lastScrollLeft === left) return;
    lastScrollLeft = left;
    // 表格内容、吸顶表头、吸底表尾、吸底横向滚动更新
    const toUpdateScrollElement = [
      tableContentRef.current,
      affixHeaderRef.current,
      affixFooterRef.current,
      horizontalScrollbarRef.current,
    ];
    for (let i = 0, len = toUpdateScrollElement.length; i < len; i++) {
      if (toUpdateScrollElement[i] && scrollElement !== toUpdateScrollElement[i]) {
        toUpdateScrollElement[i].scrollLeft = left;
      }
    }
  };

  // 吸底的元素（footer、横向滚动条、分页器）是否显示
  const isAffixedBottomElementShow = (elementRect: DOMRect, tableRect: DOMRect, headerHeight: number) =>
    tableRect.top + headerHeight < elementRect.top && elementRect.top > elementRect.height;

  const getOffsetTop = (props: boolean | Partial<AffixProps>) => {
    if (typeof props === 'boolean') return 0;
    return props.offsetTop || 0;
  };

  const updateAffixHeaderOrFooter = () => {
    if (!isAffixed && !isVirtualScroll) return;
    const pos = tableContentRef.current?.getBoundingClientRect();
    const headerRect = tableContentRef.current?.querySelector('thead')?.getBoundingClientRect();
    const headerHeight = headerRect?.height || 0;
    const footerRect = affixFooterRef.current?.getBoundingClientRect();
    if ((props.headerAffixedTop || isVirtualScroll) && affixHeaderRef.current) {
      const offsetTop = getOffsetTop(props.headerAffixProps || props.headerAffixedTop);
      const footerHeight = footerRect?.height || 0;
      let r = Math.abs(pos.top) < pos.height - headerHeight - offsetTop - footerHeight;
      // 如果是虚拟滚动的表头，只要表头在可视区域内，一律永久显示（虚拟滚动表头 和 吸顶表头可能同时存在）
      if (isVirtualScroll) {
        r = pos.top > -1 * headerRect.height;
      }
      setShowAffixHeader(r);
    }
    // 底部内容吸底 和 底部滚动条吸底，不可能同时存在，二选一即可
    if (props.footerAffixedBottom && affixFooterRef.current) {
      const show = isAffixedBottomElementShow(footerRect, pos, headerHeight);
      setShowAffixFooter(show);
    } else if (props.horizontalScrollAffixedBottom && horizontalScrollbarRef.current) {
      const horizontalScrollbarRect = horizontalScrollbarRef.current.getBoundingClientRect();
      const show = isAffixedBottomElementShow(horizontalScrollbarRect, pos, headerHeight);
      setShowAffixFooter(show);
    }
    if (props.paginationAffixedBottom && paginationRef.current) {
      const pageRect = paginationRef.current.getBoundingClientRect();
      const show = isAffixedBottomElementShow(pageRect, pos, headerHeight);
      setShowAffixPagination(show);
    }
  };

  const onDocumentScroll = () => {
    updateAffixHeaderOrFooter();
  };

  const onFootScroll = () => {
    onHorizontalScroll(affixFooterRef.current);
  };

  const onHeaderScroll = () => {
    onHorizontalScroll(affixHeaderRef.current);
  };

  const horizontalScrollbarScroll = () => {
    onHorizontalScroll(horizontalScrollbarRef.current);
  };

  const onTableContentScroll = () => {
    onHorizontalScroll(tableContentRef.current);
  };

  const onFootMouseEnter = () => {
    on(affixFooterRef.current, 'scroll', onFootScroll);
  };

  const onFootMouseLeave = () => {
    off(affixFooterRef.current, 'scroll', onFootScroll);
  };

  const onHeaderMouseEnter = () => {
    on(affixHeaderRef.current, 'scroll', onHeaderScroll);
  };

  const onHeaderMouseLeave = () => {
    off(affixHeaderRef.current, 'scroll', onHeaderScroll);
  };

  const onScrollbarMouseEnter = () => {
    on(horizontalScrollbarRef.current, 'scroll', horizontalScrollbarScroll);
  };

  const onScrollbarMouseLeave = () => {
    off(horizontalScrollbarRef.current, 'scroll', horizontalScrollbarScroll);
  };

  const onTableContentMouseEnter = () => {
    on(tableContentRef.current, 'scroll', onTableContentScroll);
  };

  const onTableContentMouseLeave = () => {
    off(tableContentRef.current, 'scroll', onTableContentScroll);
  };

  const addHorizontalScrollListeners = () => {
    if (affixHeaderRef.current) {
      on(affixHeaderRef.current, 'mouseenter', onHeaderMouseEnter);
      on(affixHeaderRef.current, 'mouseleave', onHeaderMouseLeave);
    }

    if (props.footerAffixedBottom && affixFooterRef.current) {
      on(affixFooterRef.current, 'mouseenter', onFootMouseEnter);
      on(affixFooterRef.current, 'mouseleave', onFootMouseLeave);
    }

    if (props.horizontalScrollAffixedBottom && horizontalScrollbarRef.current) {
      on(horizontalScrollbarRef.current, 'mouseenter', onScrollbarMouseEnter);
      on(horizontalScrollbarRef.current, 'mouseleave', onScrollbarMouseLeave);
    }

    if ((isAffixed || isVirtualScroll) && tableContentRef.current) {
      on(tableContentRef.current, 'mouseenter', onTableContentMouseEnter);
      on(tableContentRef.current, 'mouseleave', onTableContentMouseLeave);
    }
  };

  const removeHorizontalScrollListeners = () => {
    if (affixHeaderRef.current) {
      off(affixHeaderRef.current, 'mouseenter', onHeaderMouseEnter);
      off(affixHeaderRef.current, 'mouseleave', onHeaderMouseLeave);
    }
    if (affixFooterRef.current) {
      off(affixFooterRef.current, 'mouseenter', onFootMouseEnter);
      off(affixFooterRef.current, 'mouseleave', onFootMouseLeave);
    }
    if (tableContentRef.current) {
      off(tableContentRef.current, 'mouseenter', onTableContentMouseEnter);
      off(tableContentRef.current, 'mouseleave', onTableContentMouseLeave);
    }
    if (horizontalScrollbarRef.current) {
      off(horizontalScrollbarRef.current, 'mouseenter', onScrollbarMouseEnter);
      off(horizontalScrollbarRef.current, 'mouseleave', onScrollbarMouseLeave);
    }
  };

  const addVerticalScrollListener = () => {
    if (typeof document === 'undefined') return;
    if (!isAffixed && !props.paginationAffixedBottom) return;
    const timer = setTimeout(() => {
      if (isAffixed || props.paginationAffixedBottom) {
        on(document, 'scroll', onDocumentScroll);
      } else {
        off(document, 'scroll', onDocumentScroll);
      }
      clearTimeout(timer);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      addHorizontalScrollListeners();
      onHorizontalScroll();
      updateAffixHeaderOrFooter();
      clearTimeout(timer);
    });

    return removeHorizontalScrollListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affixHeaderRef, affixFooterRef, horizontalScrollbarRef, tableContentRef]);

  useEffect(() => {
    addVerticalScrollListener();
    return () => {
      off(document, 'scroll', onDocumentScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAffixed]);

  useEffect(() => {
    addHorizontalScrollListeners();
    onHorizontalScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.data,
    props.columns,
    props.headerAffixedTop,
    props.footerAffixedBottom,
    props.horizontalScrollAffixedBottom,
  ]);

  const setTableContentRef = (tableContent: HTMLDivElement) => {
    tableContentRef.current = tableContent;
    addVerticalScrollListener();
  };

  return {
    showAffixHeader,
    showAffixFooter,
    showAffixPagination,
    affixHeaderRef,
    affixFooterRef,
    horizontalScrollbarRef,
    paginationRef,
    onHorizontalScroll,
    setTableContentRef,
    updateAffixHeaderOrFooter,
  };
}
