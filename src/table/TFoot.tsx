import React, { CSSProperties, useRef } from 'react';
import isFunction from 'lodash/isFunction';
import classNames from 'classnames';
import get from 'lodash/get';
import { BaseTableCellParams, RowspanColspan, TableRowData, TdBaseTableProps } from './type';
import { formatRowAttributes, formatRowClassNames } from './utils';
import { RowAndColFixedPosition } from './interface';
import { getColumnFixedStyles } from './hooks/useFixed';
import useRowspanAndColspan, { getCellKey } from './hooks/useRowspanAndColspan';
import useClassName from './hooks/useClassName';

export interface TFootProps {
  rowKey: string;
  // 是否固定表头
  isFixedHeader: boolean;
  // 固定列 left/right 具体值
  rowAndColFixedPosition: RowAndColFixedPosition;
  footData: TdBaseTableProps['footData'];
  columns: TdBaseTableProps['columns'];
  rowAttributes: TdBaseTableProps['rowAttributes'];
  rowClassName: TdBaseTableProps['rowClassName'];
  // 表尾吸底内容宽度
  thWidthList?: { [colKey: string]: number };
  footerSummary?: TdBaseTableProps['footerSummary'];
  rowspanAndColspanInFooter: TdBaseTableProps['rowspanAndColspanInFooter'];
}

const TFoot: React.FC<TFootProps> = (props) => {
  const {
    footData,
    columns,
    rowKey,
    footerSummary,
    isFixedHeader,
    rowClassName,
    rowAttributes,
    thWidthList,
    rowAndColFixedPosition,
    rowspanAndColspanInFooter,
  } = props;
  const tfooterRef = useRef();
  const classnames = useClassName();

  const { skipSpansMap } = useRowspanAndColspan(footData, columns, rowKey, rowspanAndColspanInFooter);

  const renderTFootCell = (p: BaseTableCellParams<TableRowData>): React.ReactNode => {
    const { col, row } = p;
    if (isFunction(col.foot)) {
      return col.foot(p);
    }
    return col.foot || get(row, col.colKey);
  };

  const theadClasses = [classnames.tableFooterClasses.footer, { [classnames.tableFooterClasses.fixed]: isFixedHeader }];

  if (!columns) {
    return null;
  }

  const footerDomList = footData?.map<React.ReactNode>((row, rowIndex) => {
    const trAttributes = formatRowAttributes(rowAttributes, { row, rowIndex, type: 'foot' });
    // 自定义行类名
    const customClasses = formatRowClassNames(rowClassName, { row, rowIndex, type: 'foot' }, rowKey || 'id');
    return (
      <tr key={rowIndex} {...trAttributes} className={classNames(customClasses)}>
        {columns.map<React.ReactNode>((col, colIndex) => {
          // 合并单元格过滤
          const cellSpans: RowspanColspan = {};
          let spanState = null;
          if (skipSpansMap.size) {
            const cellKey = getCellKey(row, rowKey, col.colKey, colIndex);
            spanState = skipSpansMap.get(cellKey) || {};
            spanState?.rowspan > 1 && (cellSpans.rowspan = spanState.rowspan);
            spanState?.colspan > 1 && (cellSpans.colspan = spanState.colspan);
            if (spanState.skipped) {
              return null;
            }
          }
          const tdStyles = getColumnFixedStyles(col, colIndex, rowAndColFixedPosition, classnames.tableColFixedClasses);
          const style: CSSProperties = { ...tdStyles.style };
          if (thWidthList?.[col.colKey]) {
            style.width = `${thWidthList[col.colKey] || 0}px`;
          }
          return (
            <td
              key={col.colKey}
              rowSpan={cellSpans.rowspan}
              colSpan={cellSpans.colspan}
              className={classNames(tdStyles.classes)}
              style={style}
            >
              {renderTFootCell({ row, rowIndex, col, colIndex })}
            </td>
          );
        })}
      </tr>
    );
  });

  // 都不存在，则不需要渲染 footer
  if (!footerSummary && (!footData || !footData.length)) {
    return null;
  }
  return (
    <tfoot ref={tfooterRef} className={classNames(theadClasses)}>
      {footerSummary && (
        <tr className={classnames.tableFullRowClasses.base}>
          <td colSpan={columns.length}>
            <div className={classnames.tableFullRowClasses.innerFullElement}>{footerSummary}</div>
          </td>
        </tr>
      )}
      {footerDomList}
    </tfoot>
  );
};

export default TFoot;
