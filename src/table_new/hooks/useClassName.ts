import useConfig from '../../_util/useConfig';

export default function useClassName() {
  const { classPrefix } = useConfig();
  const classNames = {
    tableBaseClass: {
      table: `${classPrefix}-table`,
      body: `${classPrefix}-table__body`,
      overflowVisible: `${classPrefix}-table--overflow-visible`,
      content: `${classPrefix}-table__content`,
      topContent: `${classPrefix}-table__top-content`,
      bottomContent: `${classPrefix}-table__bottom-content`,
      tdLastRow: `${classPrefix}-table__td-last-row`,
      tdFirstCol: `${classPrefix}-table__td-first-col`,
      thCellInner: `${classPrefix}-table__th-cell-inner`,
      bordered: `${classPrefix}-table--bordered`,
      striped: `${classPrefix}-table--striped`,
      hover: `${classPrefix}-table--hoverable`,
      rowspanAndColspan: `${classPrefix}-table--rowspan-colspan`,
      empty: `${classPrefix}-table__empty`,
      emptyRow: `${classPrefix}-table__empty-row`,
      headerFixed: `${classPrefix}-table--header-fixed`,
      columnFixed: `${classPrefix}-table--column-fixed`,
      widthOverflow: `${classPrefix}-table--width-overflow`,
      multipleHeader: `${classPrefix}-table--multiple-header`,
      affixedHeader: `${classPrefix}-table--affixed-header`,
      affixedHeaderElm: `${classPrefix}-table__affixed-header-elm`,
      // 边框模式，固定表头，横向滚动时，右侧添加边线，分隔滚动条
      scrollbarDivider: `${classPrefix}-table__scroll-bar-divider`,
      // 当用户设置 height 为固定高度，为保证行元素铺满 table，则需设置 table 元素高度为 100%
      fullHeight: `${classPrefix}-table--full-height`,
    },

    tdAlignClasses: {
      left: `${classPrefix}-align-left`,
      right: `${classPrefix}-align-right`,
      center: `${classPrefix}-align-center`,
    },

    tableHeaderClasses: {
      header: `${classPrefix}-table__header`,
      thBordered: `${classPrefix}-table__header-th--bordered`,
      fixed: `${classPrefix}-table__header--fixed`,
      multipleHeader: `${classPrefix}-table__header--multiple`,
    },

    tableFooterClasses: {
      footer: `${classPrefix}-table__footer`,
      fixed: `${classPrefix}-table__footer--fixed`,
    },

    tableAlignClasses: {
      top: `${classPrefix}-vertical-align-top`,
      middle: `${classPrefix}-vertical-align-middle`,
      bottom: `${classPrefix}-vertical-align-bottom`,
    },

    tableRowFixedClasses: {
      top: `${classPrefix}-table__row--fixed-top`,
      bottom: `${classPrefix}-table__row--fixed-bottom`,
      firstBottom: `${classPrefix}-table__row--fixed-bottom-first`,
      withoutBorderBottom: `${classPrefix}-table__row--without-border-bottom`,
    },

    tableColFixedClasses: {
      left: `${classPrefix}-table__cell--fixed-left`,
      right: `${classPrefix}-table__cell--fixed-right`,
      lastLeft: `${classPrefix}-table__cell--fixed-left-last`,
      firstRight: `${classPrefix}-table__cell--fixed-right-first`,
      leftShadow: `${classPrefix}-table__content--scrollable-to-left`,
      rightShadow: `${classPrefix}-table__content--scrollable-to-right`,
    },

    tableLayoutClasses: {
      auto: `${classPrefix}-table--layout-auto`,
      fixed: `${classPrefix}-table--layout-fixed`,
    },

    tdEllipsisClass: `${classPrefix}-table-td--ellipsis`,

    // 行通栏，一列铺满整行
    tableFullRowClasses: {
      base: `${classPrefix}-table__row--full`,
      innerFullRow: `${classPrefix}-table__row-full-inner`,
      innerFullElement: `${classPrefix}-table__row-full-element`,
      firstFullRow: `${classPrefix}-table__first-full-row`,
      lastFullRow: `${classPrefix}-table__last-full-row`,
    },

    // 展开/收起行，全部类名
    tableExpandClasses: {
      iconBox: `${classPrefix}-table__expand-box`,
      iconCell: `${classPrefix}-table__expandable-icon-cell`,
      row: `${classPrefix}-table__expanded-row`,
      rowInner: `${classPrefix}-table__expanded-row-inner`,
      expanded: `${classPrefix}-table__row--expanded`,
      collapsed: `${classPrefix}-table__row--collapsed`,
    },

    // 排序功能，全部类名
    tableSortClasses: {
      sortable: `${classPrefix}-table__cell--sortable`,
      title: `${classPrefix}-table__cell--title`,
      trigger: `${classPrefix}-table__cell--sort-trigger`,
      doubleIcon: `${classPrefix}-table__double-icons`,
      sortIcon: `${classPrefix}-table__sort-icon`,
      iconDirection: {
        asc: `${classPrefix}-table-sort-asc`,
        desc: `${classPrefix}-table-sort-desc`,
      },
      iconActive: `${classPrefix}-table__sort-icon--active`,
      iconDefault: `${classPrefix}-icon-sort--default`,
    },

    // 行选中功能，全部类名
    tableSelectedClasses: {
      selected: `${classPrefix}-table__row--selected`,
      disabled: `${classPrefix}-table__row--disabled`,
    },

    // 过滤功能，全部类名
    tableFilterClasses: {
      filterable: `${classPrefix}-table__cell--filterable`,
      popup: `${classPrefix}-table__filter-pop`,
      icon: `${classPrefix}-table__filter-icon`,
      popupContent: `${classPrefix}-table__filter-pop-content`,
      result: `${classPrefix}-table__filter-result`,
      inner: `${classPrefix}-table__row-filter-inner`,
      bottomButtons: `${classPrefix}-table__filter--bottom-buttons`,
      contentInner: `${classPrefix}-table__filter-pop-content-inner`,
      iconWrap: `${classPrefix}-table__filter-icon-wrap`,
    },

    // 通用类名
    asyncLoadingClass: `${classPrefix}-table__async-loading`,
    isFocusClass: `${classPrefix}-is-focus`,
    isLoadingClass: `${classPrefix}-is-loading`,
    isLoadMoreClass: `${classPrefix}-is-load-more`,

    // 树形结构类名
    tableTreeClasses: {
      col: `${classPrefix}-table__tree-col`,
      inlineCol: `${classPrefix}-table__tree-col--inline`,
      icon: `${classPrefix}-table__tree-op-icon`,
    },

    // 拖拽功能类名
    tableDraggableClasses: {
      rowDraggable: `${classPrefix}-table--row-draggable`,
      rowHandlerDraggable: `${classPrefix}-table--row-handler-draggable`,
      colDraggable: `${classPrefix}-table--col-draggable`,
      handle: `${classPrefix}-table__handle-draggable`,
      ghost: `${classPrefix}-table__ele--draggable-ghost`,
      chosen: `${classPrefix}-table__ele--draggable-chosen`,
      dragging: `${classPrefix}-table__ele--draggable-dragging`,
    },

    virtualScrollClasses: {
      cursor: `${classPrefix}-table__virtual-scroll-cursor`,
      header: `${classPrefix}-table__virtual-scroll-header`,
    },

    positiveRotate90: `${classPrefix}-positive-rotate-90`,
    negativeRotate180: `${classPrefix}-negative-rotate-180`,
  };

  return classNames;
}
