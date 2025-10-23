import { useEffect, useMemo, useRef, useState } from 'react';
import { off, on } from '../../_util/listener';
import type { AffixProps } from '../../affix';
import type { TdBaseTableProps } from '../type';

type AffixOffset = { left: number; top: number };
const INITIAL_AFFIX_OFFSET: AffixOffset = { left: 0, top: 0 };

/**
 * 1. 表头吸顶（普通表头吸顶 和 虚拟滚动表头吸顶）
 * 2. 表尾吸底
 * 3. 底部滚动条吸底
 * 4. 分页器吸底
 */
export default function useAffix(props: TdBaseTableProps, { showElement }: { showElement: boolean }) {
  const tableContentRef = useRef<HTMLDivElement>(null);
  const lastTableScrollLeftRef = useRef<number>(0);

  // 吸顶表头
  const affixHeaderRef = useRef<HTMLDivElement>(null);
  // 吸底表尾
  const affixFooterRef = useRef<HTMLDivElement>(null);
  // 吸底滚动条
  const horizontalScrollbarRef = useRef<HTMLDivElement>(null);
  // 吸底分页器
  const paginationRef = useRef<HTMLDivElement>(null);

  // 初始化渲染表格时，记录其位置，用于后续计算偏移量
  const initialTableRectRef = useRef<AffixOffset | null>(INITIAL_AFFIX_OFFSET);

  const [affixOffset, setAffixOffset] = useState<AffixOffset>(INITIAL_AFFIX_OFFSET);

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
    () =>
      !!(
        isVirtualScroll ||
        props.headerAffixedTop ||
        props.footerAffixedBottom ||
        props.horizontalScrollAffixedBottom ||
        props.paginationAffixedBottom
      ),
    [
      isVirtualScroll,
      props.footerAffixedBottom,
      props.headerAffixedTop,
      props.horizontalScrollAffixedBottom,
      props.paginationAffixedBottom,
    ],
  );

  const onTableHorizontalScroll = (scrollElement?: HTMLElement) => {
    if (!isAffixed) return;
    let target = scrollElement;
    if (!target && tableContentRef.current) {
      lastTableScrollLeftRef.current = 0;
      target = tableContentRef.current;
    }
    if (!target) return;
    const left = target.scrollLeft;
    // 如果 lastScrollLeft 等于 left，说明不是横向滚动，不需要更新横向滚动距离
    if (lastTableScrollLeftRef.current === left) return;
    lastTableScrollLeftRef.current = left;
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

  const onPageHorizonScroll = () => {
    if (!isAffixed || !tableContentRef.current) return;
    const { left, top } = tableContentRef.current.getBoundingClientRect();

    const leftOffset = left - initialTableRectRef.current.left;
    const topOffset = top - initialTableRectRef.current.top;
    setAffixOffset({ left: leftOffset, top: topOffset });

    const toUpdateScrollElement = [affixHeaderRef.current, affixFooterRef.current];
    for (let i = 0, len = toUpdateScrollElement.length; i < len; i++) {
      if (toUpdateScrollElement[i]) {
        // top 具体的偏移逻辑交个 Affix 组件的底层即可
        toUpdateScrollElement[i].style.marginLeft = `${leftOffset}px`;
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
    if (!isAffixed) return;
    const pos = tableContentRef.current?.getBoundingClientRect();
    if (!pos) return;
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

  const onPageScroll = () => {
    updateAffixHeaderOrFooter();
    onPageHorizonScroll();
  };

  const onFootScroll = () => {
    onTableHorizontalScroll(affixFooterRef.current);
  };

  const onHeaderScroll = () => {
    onTableHorizontalScroll(affixHeaderRef.current);
  };

  const horizontalScrollbarScroll = () => {
    onTableHorizontalScroll(horizontalScrollbarRef.current);
  };

  const onTableContentScroll = () => {
    onTableHorizontalScroll(tableContentRef.current);
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

  const addTableHorizontalScrollListeners = () => {
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

    if (isAffixed && tableContentRef.current) {
      on(tableContentRef.current, 'mouseenter', onTableContentMouseEnter);
      on(tableContentRef.current, 'mouseleave', onTableContentMouseLeave);
    }
  };

  const removeTableHorizontalScrollListeners = () => {
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

  const addPageScrollListener = () => {
    const timer = setTimeout(() => {
      if (isAffixed) {
        onPageScroll(); // initial sync
        on(window, 'scroll', onPageScroll);
      } else {
        off(window, 'scroll', onPageScroll);
      }
      clearTimeout(timer);
    });
  };

  const refreshTablePosition = () => {
    if (!tableContentRef.current) return;
    const { left, top } = tableContentRef.current.getBoundingClientRect();
    initialTableRectRef.current = { left, top };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      addTableHorizontalScrollListeners();
      onTableHorizontalScroll();
      updateAffixHeaderOrFooter();
      clearTimeout(timer);
    });
    return () => {
      removeTableHorizontalScrollListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affixHeaderRef, affixFooterRef, horizontalScrollbarRef, tableContentRef, showElement]);

  useEffect(() => {
    addPageScrollListener();
    return () => {
      off(window, 'scroll', onPageScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAffixed]);

  useEffect(() => {
    addTableHorizontalScrollListeners();
    updateAffixHeaderOrFooter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.data,
    props.columns,
    props.headerAffixedTop,
    props.footerAffixedBottom,
    props.horizontalScrollAffixedBottom,
    props.lazyLoad,
  ]);

  useEffect(() => {
    on(window, 'resize', refreshTablePosition);
    return () => {
      off(window, 'resize', refreshTablePosition);
    };
  }, []);

  const setTableContentRef = (tableContent: HTMLDivElement) => {
    tableContentRef.current = tableContent;
    addPageScrollListener();
    setTimeout(() => {
      refreshTablePosition();
    }, 100);
  };

  return {
    affixOffset,
    showAffixHeader,
    showAffixFooter,
    showAffixPagination,
    affixHeaderRef,
    affixFooterRef,
    horizontalScrollbarRef,
    paginationRef,
    onTableHorizontalScroll,
    setTableContentRef,
    updateAffixHeaderOrFooter,
  };
}
