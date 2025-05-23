import React, { useState, useRef } from 'react';
import { FilterIcon as TdFilterIcon } from 'tdesign-icons-react';
import { isEmpty } from 'lodash-es';
import classNames from 'classnames';
import log from '@tdesign/common-js/log/index';
import Popup, { PopupProps } from '../popup';
import Checkbox from '../checkbox';
import Radio from '../radio';
import Input from '../input';
import TButton from '../button';
import { PrimaryTableCol, FilterValue, TableRowData, TdPrimaryTableProps } from './type';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { parseContentTNode } from '../_util/parseTNode';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
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
  onVisibleChange: (val: boolean) => void;
  onReset: (column: PrimaryTableCol<TableRowData>) => void;
  onConfirm: (column: PrimaryTableCol<TableRowData>) => void;
  onInnerFilterChange: (val: any, column: PrimaryTableCol<TableRowData>) => void;
}

export default function TableFilterController(props: TableFilterControllerProps) {
  const { tFilterValue, innerFilterValue, tableFilterClasses, isFocusClass, column } = props;

  const { FilterIcon } = useGlobalIcon({
    FilterIcon: TdFilterIcon,
  });
  const triggerElementRef = useRef<HTMLDivElement>(null);
  const [locale, t] = useLocaleReceiver('table');
  const [filterPopupVisible, setFilterPopupVisible] = useState(false);

  const onFilterPopupVisibleChange = (visible: boolean) => {
    setFilterPopupVisible(visible);
    props.onVisibleChange?.(visible);
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
          setFilterPopupVisible(false);
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
            setFilterPopupVisible(false);
            props.onReset?.(column);
          }}
        >
          {locale.resetText}
        </TButton>
        <TButton
          theme="primary"
          size="small"
          onClick={() => {
            setFilterPopupVisible(false);
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
  return (
    <div className={classNames([tableFilterClasses.icon, { [isFocusClass]: isObjectTrue || isValueExist }])}>
      <Popup
        // attach={primaryTableElement ? () => primaryTableElement : undefined}
        visible={filterPopupVisible}
        destroyOnClose
        trigger="click"
        placement="bottom-right"
        showArrow
        overlayClassName={tableFilterClasses.popup}
        onVisibleChange={(val: boolean) => onFilterPopupVisibleChange(val)}
        content={
          <div className={tableFilterClasses.popupContent}>
            {getFilterContent(column)}
            {getBottomButtons(column)}
          </div>
        }
        {...props.popupProps}
      >
        <div ref={triggerElementRef}>
          {parseContentTNode(props.filterIcon, { col: column, colIndex: props.colIndex }) || defaultFilterIcon}
        </div>
      </Popup>
    </div>
  );
}
