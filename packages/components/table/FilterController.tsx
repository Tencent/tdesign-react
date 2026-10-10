import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash-es';
import { FilterIcon as TdFilterIcon } from 'tdesign-icons-react';
import log from '@tdesign/common-js/log/index';

import { parseContentTNode } from '../_util/parseTNode';
import TButton from '../button';
import Checkbox from '../checkbox';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useLayoutEffect from '../hooks/useLayoutEffect';
import Input from '../input';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Popup from '../popup';
import Radio from '../radio';
import { useIsAffixedHeader } from './hooks/useAffixedHeader';

import type { PopupProps, PopupVisibleChangeContext } from '../popup';
import type { FilterValue, PrimaryTableCol, TableRowData, TdPrimaryTableProps } from './type';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

export type FilterPopupOwner = 'default' | 'affixed';

export interface TableFilterControllerProps {
  filterIcon: TdPrimaryTableProps['filterIcon'];
  tFilterValue: FilterValue;
  innerFilterValue: FilterValue;
  tableFilterClasses: {
    filterable: string;
    popup: string;
    icon: string;
    popupContent: string;
    result: string;
    inner: string;
    bottomButtons: string;
    contentInner: string;
    iconWrap: string;
  };
  isFocusClass: string;
  column: PrimaryTableCol;
  colIndex: number;
  primaryTableElement: HTMLElement;
  popupProps: PopupProps;
  visible: boolean;
  popupOwner?: FilterPopupOwner;
  onVisibleChange: (val: boolean, colKey: string, from?: FilterPopupOwner) => void;
  onReset: (column: PrimaryTableCol<TableRowData>) => void;
  onConfirm: (column: PrimaryTableCol<TableRowData>) => void;
  onInnerFilterChange: (val: any, column: PrimaryTableCol<TableRowData>) => void;
}

function TableFilterController(props: TableFilterControllerProps) {
  const {
    visible = false,
    popupOwner = 'default',
    tFilterValue,
    innerFilterValue,
    tableFilterClasses,
    isFocusClass,
    column,
  } = props;

  const { FilterIcon } = useGlobalIcon({
    FilterIcon: TdFilterIcon,
  });
  const [locale, t] = useLocaleReceiver('table');
  const { classPrefix } = useConfig();

  const triggerElementRef = useRef<HTMLDivElement>(null);

  const currentHeader: FilterPopupOwner = useIsAffixedHeader() ? 'affixed' : 'default';
  // 同一列的两份表头中，只有持有浮层的那一份渲染 Popup，另一份仅渲染图标并把点击转交给浮层持有者
  const isPopupOwner = popupOwner === currentHeader;
  const filterPopupVisible = isPopupOwner && visible;

  /* 常规表头持有浮层时，虚拟滚动的常规表头会随内容滚出可视区域，
     若存在吸顶表头，以其中同一列的图标作为定位参照，浮层实例本身不随吸顶表头的创建和销毁而重新挂载 */
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);

  const handleFilterPopupVisible = (visible: boolean) => {
    props.onVisibleChange?.(visible, column.colKey, currentHeader);
  };

  const getAffixedHeaderIcon = (): HTMLElement | null => {
    const tableSelector = `.${classPrefix}-table`;
    const selfTable = triggerElementRef.current?.closest(tableSelector);
    if (!selfTable) return null;
    const ths = selfTable.querySelectorAll(`.${classPrefix}-table__affixed-header-elm th`);
    const th = Array.from(ths).find(
      (item) => item.getAttribute('data-colkey') === column.colKey && item.closest(tableSelector) === selfTable,
    );
    return th?.querySelector<HTMLElement>(`.${tableFilterClasses.icon} > div`) || null;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    // 吸顶表头是否存在取决于 DOM 而非 props；仅在参照元素变化时更新，不会循环
    const next = filterPopupVisible && currentHeader === 'default' ? getAffixedHeaderIcon() : null;
    if (next !== referenceEl) setReferenceEl(next);
  });

  // 另一份表头中同一列的筛选图标：它并非当前 Popup 的 trigger，
  // 需要交由图标自身的 click 决定开合，否则会先被 document 事件关闭再被 click 打开
  const isSameColumnFilterIcon = (el: HTMLElement) => {
    const icon = el.closest(`.${tableFilterClasses.icon}`);
    if (!icon || icon.closest('th')?.getAttribute('data-colkey') !== column.colKey) return false;
    // 限定同一个表格，避免同页多个表格的同名列相互影响
    const tableSelector = `.${classPrefix}-table`;
    const selfTable = triggerElementRef.current?.closest(tableSelector);
    return Boolean(selfTable) && selfTable === icon.closest(tableSelector);
  };

  const onFilterVisibleChange = (visible: boolean, ctx: PopupVisibleChangeContext) => {
    const isDocClick = ctx?.trigger === 'document' && ctx?.e?.target;
    if (isDocClick && !visible) {
      const el = ctx.e.target as HTMLElement;
      /** 过滤后的数据量在跨越虚拟滚动的 threshold 时
          表头重建导致原始点击的元素被误判为不属于 Popup 内部从而触发关闭 */
      const isInsideFilter = el.closest(`.${tableFilterClasses.popupContent}`) !== null;
      if (isInsideFilter || isSameColumnFilterIcon(el)) return;
    }
    handleFilterPopupVisible(visible);
  };

  const getFilterContent = (column: PrimaryTableCol) => {
    const types = ['single', 'multiple', 'input'];
    if (column.type && !types.includes(column.filter.type)) {
      log.error('Table', `TDesign Table Error: column.filter.type must be the following: ${JSON.stringify(types)}`);
      return;
    }
    const Component = {
      single: RadioGroup,
      multiple: CheckboxGroup,
      input: Input,
    }[column.filter.type];
    if (!Component && !column?.filter?.component) return;
    const filterComponentProps: { [key: string]: any } = {
      options: ['single', 'multiple'].includes(column.filter.type) ? column.filter?.list : undefined,
      ...(column.filter?.props || {}),
      onChange: (val: any) => {
        props.onInnerFilterChange?.(val, column);
      },
    };
    if (column.colKey && innerFilterValue && column.colKey in innerFilterValue) {
      filterComponentProps.value = innerFilterValue[column.colKey];
    }
    // 允许自定义触发确认搜索的事件
    if (column.filter?.confirmEvents) {
      column.filter.confirmEvents.forEach((event) => {
        filterComponentProps[event] = () => {
          handleFilterPopupVisible(false);
          props.onConfirm?.(column);
        };
      });
    }
    const FilterComponent = column?.filter?.component || Component;
    const filter = column.filter || {};
    return (
      <div className={tableFilterClasses.contentInner}>
        <FilterComponent
          className={filter.classNames}
          style={filter.style}
          {...filter.attrs}
          {...filterComponentProps}
        />
      </div>
    );
  };

  const getBottomButtons = (column: PrimaryTableCol) => {
    if (!column.filter.showConfirmAndReset) return;
    return (
      <div className={tableFilterClasses.bottomButtons}>
        <TButton
          theme="default"
          size="small"
          onClick={() => {
            handleFilterPopupVisible(false);
            props.onReset?.(column);
          }}
        >
          {locale.resetText}
        </TButton>
        <TButton
          theme="primary"
          size="small"
          onClick={() => {
            handleFilterPopupVisible(false);
            props.onConfirm?.(column);
          }}
        >
          {locale.confirmText}
        </TButton>
      </div>
    );
  };

  if (!column.filter || (column.filter && !Object.keys(column.filter).length)) return null;
  const defaultFilterIcon = t(locale.filterIcon) || <FilterIcon />;
  const filterValue = tFilterValue?.[column.colKey];
  const isObjectTrue = typeof filterValue === 'object' && !isEmpty(filterValue);
  // false is a valid filter value
  const isValueExist = ![null, undefined, ''].includes(filterValue) && typeof filterValue !== 'object';
  const filterIconNode = (
    <div ref={triggerElementRef} onClick={isPopupOwner ? undefined : () => handleFilterPopupVisible(!visible)}>
      {parseContentTNode(props.filterIcon, {
        col: column,
        colIndex: props.colIndex,
      }) || defaultFilterIcon}
    </div>
  );
  return (
    <div className={classNames([tableFilterClasses.icon, { [isFocusClass]: isObjectTrue || isValueExist }])}>
      {isPopupOwner ? (
        <Popup
          visible={filterPopupVisible}
          destroyOnClose
          trigger="click"
          placement="bottom-right"
          showArrow
          overlayClassName={tableFilterClasses.popup}
          referenceElement={referenceEl}
          onVisibleChange={onFilterVisibleChange}
          content={
            <div className={tableFilterClasses.popupContent}>
              {getFilterContent(column)}
              {getBottomButtons(column)}
            </div>
          }
          {...props.popupProps}
        >
          {filterIconNode}
        </Popup>
      ) : (
        filterIconNode
      )}
    </div>
  );
}

export default TableFilterController;
