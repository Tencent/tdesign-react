import React, { MouseEvent, ReactNode } from 'react';
import { ChevronRightCircleIcon } from 'tdesign-icons-react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import {
  TdPrimaryTableProps,
  PrimaryTableCol,
  TableRowData,
  PrimaryTableCellParams,
  TableExpandedRowParams,
  RowEventContext,
} from '../type';
import useClassName from './useClassName';
import useDefaultValue from '../../_util/useDefault';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export default function useRowExpand(props: TdPrimaryTableProps) {
  const { expandedRowKeys } = props;
  const [locale] = useLocaleReceiver('table');
  const { tableExpandClasses, positiveRotate90, tableFullRowClasses } = useClassName();
  // controlled and uncontrolled
  const [tExpandedRowKeys, setTExpandedRowKeys] = useDefaultValue(
    expandedRowKeys,
    props.defaultExpandedRowKeys,
    props.onExpandChange,
  );

  const showExpandedRow = Boolean(props.expandedRow);

  const showExpandIconColumn = props.expandIcon !== false && showExpandedRow;

  const isFirstColumnFixed = props.columns?.[0]?.fixed === 'left';

  const onToggleExpand = (e: MouseEvent<HTMLSpanElement>, row: TableRowData) => {
    props.expandOnRowClick && e.stopPropagation();
    const currentId = get(row, props.rowKey || 'id');
    const index = tExpandedRowKeys.indexOf(currentId);
    const newKeys = [...tExpandedRowKeys];
    index !== -1 ? newKeys.splice(index, 1) : newKeys.push(currentId);
    setTExpandedRowKeys(newKeys, {
      expandedRowData: props.data.filter((t) => newKeys.includes(get(t, props.rowKey || 'id'))),
    });
  };

  const renderExpandIcon = (p: PrimaryTableCellParams<TableRowData>) => {
    const { row, rowIndex } = p;
    const { expandIcon } = props;
    const currentId = get(row, props.rowKey || 'id');
    const expanded = tExpandedRowKeys.includes(currentId);
    const defaultIcon: ReactNode = locale.expandIcon || <ChevronRightCircleIcon />;
    let icon = defaultIcon;
    if (expandIcon === false || expandIcon === null) {
      icon = null;
    } else if (isFunction(expandIcon)) {
      icon = expandIcon({ row, index: rowIndex });
    }
    const classes = [
      tableExpandClasses.iconBox,
      tableExpandClasses[expanded ? 'expanded' : 'collapsed'],
      { [positiveRotate90]: expanded },
    ];
    return (
      <span className={classNames(classes)} onClick={(e: MouseEvent<HTMLSpanElement>) => onToggleExpand(e, row)}>
        {icon}
      </span>
    );
  };

  const getExpandColumn = () => {
    const expandCol: PrimaryTableCol<TableRowData> = {
      colKey: '__EXPAND_ROW_ICON_COLUMN__',
      width: 64,
      className: tableExpandClasses.iconCell,
      fixed: isFirstColumnFixed ? 'left' : undefined,
      cell: renderExpandIcon,
    };
    return expandCol;
  };

  const renderExpandedRow = (
    p: TableExpandedRowParams<TableRowData> & { tableWidth: number; isWidthOverflow: boolean },
  ) => {
    if (!tExpandedRowKeys.includes(get(p.row, props.rowKey || 'id'))) return null;
    const isFixedLeft = p.isWidthOverflow && props.columns.find((item) => item.fixed === 'left');
    return (
      <tr className={classNames([tableExpandClasses.row, { [tableFullRowClasses.base]: isFixedLeft }])}>
        <td colSpan={p.columns.length}>
          <div
            className={classNames([tableExpandClasses.rowInner, { [tableFullRowClasses.innerFullRow]: isFixedLeft }])}
            style={isFixedLeft ? { width: `${p.tableWidth}px` } : {}}
          >
            <div className={tableFullRowClasses.innerFullElement}>{props.expandedRow(p)}</div>
          </div>
        </td>
      </tr>
    );
  };

  const onInnerExpandRowClick = (p: RowEventContext<TableRowData>) => {
    onToggleExpand(p.e, p.row);
  };

  return {
    showExpandedRow,
    showExpandIconColumn,
    getExpandColumn,
    renderExpandedRow,
    onInnerExpandRowClick,
  };
}
