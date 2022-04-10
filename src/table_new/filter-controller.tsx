import React, { useState, useRef, ReactNode } from 'react';
import { FilterIcon } from 'tdesign-icons-react';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import Popup from '../popup';
import { CheckboxGroup } from '../checkbox';
import { RadioGroup } from '../radio';
import Input from '../input';
import TButton from '../button';
import { PrimaryTableCol, FilterValue, TableRowData } from './type';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export interface TableFilterControllerProps {
  filterIcon: ReactNode;
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
  primaryTableElement: HTMLElement;
  onVisibleChange: (val: boolean) => void;
  onReset: (column: PrimaryTableCol<TableRowData>) => void;
  onConfirm: (column: PrimaryTableCol<TableRowData>) => void;
  onInnerFilterChange: (val: any, column: PrimaryTableCol<TableRowData>) => void;
}

export default function TableFilterController(props: TableFilterControllerProps) {
  const { tFilterValue, innerFilterValue, tableFilterClasses, isFocusClass, column, primaryTableElement } = props;

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
      console.error(`TDesign Table Error: column.filter.type must be the following: ${JSON.stringify(types)}`);
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
      value: innerFilterValue?.[column.colKey],
      onChange: (val: any) => {
        props.onInnerFilterChange?.(val, column);
      },
    };

    const FilterComponent = column?.filter?.component || Component;
    return (
      <div className={tableFilterClasses.contentInner}>
        <FilterComponent value={innerFilterValue?.[column.colKey]} {...filterComponentProps} />
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
  return (
    <Popup
      attach={primaryTableElement ? () => primaryTableElement : undefined}
      visible={filterPopupVisible}
      destroyOnClose
      trigger="click"
      placement="bottom-right"
      showArrow
      overlayClassName={tableFilterClasses.popup}
      onVisibleChange={(val: boolean) => onFilterPopupVisibleChange(val)}
      className={classNames([tableFilterClasses.icon, { [isFocusClass]: !isEmpty(tFilterValue?.[column.colKey]) }])}
      content={
        <div className={tableFilterClasses.popupContent}>
          {getFilterContent(column)}
          {getBottomButtons(column)}
        </div>
      }
    >
      <div ref={triggerElementRef}>{props.filterIcon || defaultFilterIcon}</div>
    </Popup>
  );
}
