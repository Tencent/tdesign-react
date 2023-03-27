import React, { MouseEvent, ReactNode } from 'react';
import { ChevronRightCircleIcon as TdChevronRightCircleIcon } from 'tdesign-icons-react';
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
import useControlled from '../../hooks/useControlled';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { parseContentTNode } from '../../_util/parseTNode';

export default function useRowExpand(props: TdPrimaryTableProps) {
  const { expandIcon, expandedRow } = props;
  const { ChevronRightCircleIcon } = useGlobalIcon({
    ChevronRightCircleIcon: TdChevronRightCircleIcon,
  });
  const [locale] = useLocaleReceiver('table');
  const { tableExpandClasses, positiveRotate90, tableFullRowClasses } = useClassName();
  // controlled and uncontrolled
  const [tExpandedRowKeys, setTExpandedRowKeys] = useControlled(props, 'expandedRowKeys', props.onExpandChange, {
    defaultExpandedRowKeys: props.defaultExpandedRowKeys || [],
  });

  const showExpandedRow = Boolean(expandedRow);

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
      currentRowData: row,
    });
  };

  const renderExpandIcon = (p: PrimaryTableCellParams<TableRowData>, expandIcon: TdPrimaryTableProps['expandIcon']) => {
    const { row, rowIndex } = p;
    const currentId = get(row, props.rowKey || 'id');
    const expanded = tExpandedRowKeys.includes(currentId);
    // @ts-ignore TODO 待类型完善后移除
    const defaultIcon: ReactNode = locale.expandIcon || <ChevronRightCircleIcon />;
    let icon = defaultIcon;
    if (expandIcon === false || expandIcon === null) {
      icon = null;
    } else if (isFunction(expandIcon)) {
      // @ts-ignore TODO 待类型完善后移除
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
      width: 46,
      className: tableExpandClasses.iconCell,
      fixed: isFirstColumnFixed ? 'left' : undefined,
      cell: (p) => renderExpandIcon(p, expandIcon),
      stopPropagation: true,
    };
    return expandCol;
  };

  const renderExpandedRow = (
    p: TableExpandedRowParams<TableRowData> & { tableWidth: number; isWidthOverflow: boolean },
  ) => {
    const rowId = get(p.row, props.rowKey || 'id');
    if (!tExpandedRowKeys || !tExpandedRowKeys.includes(rowId)) return null;
    const isFixedLeft = p.isWidthOverflow && props.columns.find((item) => item.fixed === 'left');
    return (
      <tr
        key={`expand_${rowId}`}
        className={classNames([tableExpandClasses.row, { [tableFullRowClasses.base]: isFixedLeft }])}
      >
        <td colSpan={p.columns.length}>
          <div
            className={classNames([tableExpandClasses.rowInner, { [tableFullRowClasses.innerFullRow]: isFixedLeft }])}
            style={isFixedLeft ? { width: `${p.tableWidth}px` } : {}}
          >
            <div className={tableFullRowClasses.innerFullElement}>{parseContentTNode(expandedRow, p)}</div>
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
