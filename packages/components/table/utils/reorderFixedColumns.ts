import log from '@tdesign/common-js/log/index';

import type { BaseTableCol, TableRowData } from '../type';

/** 始终保持在最左侧的功能列，不参与左固定重排 */
export const TABLE_LEADING_COLUMN_KEYS = new Set(['__EXPAND_ROW_ICON_COLUMN__', 'row-select', 'drag', 'serial-number']);

/**
 * 判断是否存在需要前置的左固定列（非功能列、非连续从左起始的 fixed: 'left'）
 */
export function hasLeftFixedColumnNeedReorder<T extends TableRowData>(columns: BaseTableCol<T>[] = []): boolean {
  let metScrollable = false;
  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    if (col.colKey && TABLE_LEADING_COLUMN_KEYS.has(col.colKey)) continue;
    if (col.fixed === 'right') break;
    if (col.fixed === 'left' && metScrollable) return true;
    if (!col.fixed) metScrollable = true;
  }
  return false;
}

/**
 * 左固定列前置重排：将所有 fixed: 'left' 的业务列移到功能列之后、可滚动区域之前。
 * 示例：[ID, name(fixed)] -> [name(fixed), ID]，使 name 初始即贴左，ID 位于 fixed 右侧。
 */
export function reorderColumnsForLeftFixed<T extends TableRowData>(columns: BaseTableCol<T>[] = []): BaseTableCol<T>[] {
  if (!columns.length) return columns;

  const hasMultiHeader = columns.some((col) => col.children?.length);
  if (hasMultiHeader) {
    log.warn('TDesign Table', 'fixedColumnReorder 暂不支持多级表头，已跳过重排。请使用平铺列或手动调整 columns 顺序。');
    return columns;
  }

  const leading: BaseTableCol<T>[] = [];
  const leftFixed: BaseTableCol<T>[] = [];
  const scrollable: BaseTableCol<T>[] = [];
  const rightFixed: BaseTableCol<T>[] = [];

  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    if (col.colKey && TABLE_LEADING_COLUMN_KEYS.has(col.colKey)) {
      leading.push(col);
      continue;
    }
    if (col.fixed === 'right') {
      rightFixed.push(col);
    } else if (col.fixed === 'left') {
      leftFixed.push(col);
    } else {
      scrollable.push(col);
    }
  }

  if (!hasLeftFixedColumnNeedReorder(columns)) {
    return columns;
  }

  return [...leading, ...leftFixed, ...scrollable, ...rightFixed];
}
