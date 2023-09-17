import { useEffect, useState } from 'react';
import get from 'lodash/get';
import log from '../../_common/js/log';
import { BaseTableCellParams, BaseTableCol, TableRowData, TableRowspanAndColspanFunc } from '../type';

export interface SkipSpansValue {
  colspan?: number;
  rowspan?: number;
  skipped?: boolean;
}

export function getCellKey(row: TableRowData, rowKey: string, colKey: string, colIndex: number) {
  const rowValue = get(row, rowKey);
  if (rowValue === undefined) {
    log.error('Table', 'rowKey is wrong, can not get unique identifier of row.');
  }
  return [rowValue, colKey || colIndex].join('_');
}

export default function useRowspanAndColspan(
  data: TableRowData[],
  columns: BaseTableCol<TableRowData>[],
  rowKey: string,
  rowspanAndColspan: TableRowspanAndColspanFunc<TableRowData>,
) {
  const [skipSpansMap, setKipSnapsMap] = useState(new Map<string, SkipSpansValue>());

  // 计算单元格是否跳过渲染
  const onTrRowspanOrColspan = (
    params: BaseTableCellParams<TableRowData>,
    skipSpansValue: SkipSpansValue,
    map: Map<string, SkipSpansValue>,
  ) => {
    const { rowIndex, colIndex } = params;
    if (!skipSpansValue.rowspan && !skipSpansValue.colspan) return;
    const maxRowIndex = rowIndex + (skipSpansValue.rowspan || 1);
    const maxColIndex = colIndex + (skipSpansValue.colspan || 1);
    for (let i = rowIndex; i < maxRowIndex; i++) {
      for (let j = colIndex; j < maxColIndex; j++) {
        if (i !== rowIndex || j !== colIndex) {
          if (!data[i] || !columns[j]) return;
          const cellKey = getCellKey(data[i], rowKey, columns[j].colKey, j);
          const state = map.get(cellKey) || {};
          state.skipped = true;
          map.set(cellKey, state);
        }
      }
    }
  };

  // 计算单元格是否需要设置 rowspan 和 colspan
  const getSkipSpansMap = (
    data: TableRowData[],
    columns: BaseTableCol<TableRowData>[],
    rowspanAndColspan: TableRowspanAndColspanFunc<TableRowData>,
  ) => {
    if (!data || !rowspanAndColspan) return;
    const map: Map<string, SkipSpansValue> = new Map<string, SkipSpansValue>();
    for (let i = 0, len = data.length; i < len; i++) {
      const row = data[i];
      for (let j = 0, colLen = columns.length; j < colLen; j++) {
        const col = columns[j];
        const params = {
          row,
          col,
          rowIndex: i,
          colIndex: j,
        };
        const cellKey = getCellKey(row, rowKey, col.colKey, j);
        const state = map.get(cellKey) || {};
        const o = rowspanAndColspan(params) || {};
        if (o.rowspan || o.colspan || state.rowspan || state.colspan) {
          o.rowspan && (state.rowspan = o.rowspan);
          o.colspan && (state.colspan = o.colspan);
          map.set(cellKey, state);
        }
        onTrRowspanOrColspan?.(params, state, map);
      }
    }
    return map;
  };

  useEffect(() => {
    if (!rowspanAndColspan) return;
    skipSpansMap.clear();
    const result = getSkipSpansMap(data, columns, rowspanAndColspan);
    setKipSnapsMap(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, rowspanAndColspan]);

  return { skipSpansMap, getSkipSpansMap };
}
