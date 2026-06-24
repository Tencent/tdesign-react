import log from '@tdesign/common-js/log/index';

import type { BaseTableCol, TableRowData } from '../type';

/** 始终保持在最左侧的功能列，不参与左固定重排 */
export const TABLE_LEADING_COLUMN_KEYS = new Set(['__EXPAND_ROW_ICON_COLUMN__', 'row-select', 'drag', 'serial-number']);

/** 单个非首列 left fixed 的贴左触发阈值（列重排用） */
export interface LeftFixedReorderTriggerEntry {
  colKey: string;
  /** 该列与容器左边界接触所需的 scrollLeft（基于 columns 定义顺序） */
  threshold: number;
}

/**
 * 非首列 left fixed 内置行为的完整布局状态。
 * - 列重排：按定义顺序独立阈值触发
 * - border：按当前渲染列序 + sticky 激活时机（可与重排阈值不同）
 * - 左阴影：与重排触发一致
 */
export interface LeftFixedLayoutState<T extends TableRowData = TableRowData> {
  /** 是否存在需要内置行为的非首列 left fixed */
  enabled: boolean;
  /** 当前 scrollLeft 下应渲染的 columns */
  displayColumns: BaseTableCol<T>[];
  /** 已达重排阈值的 colKey（定义顺序） */
  reorderTriggeredKeys: string[];
  /** fixed-left-last border 应落在哪一列 */
  borderBoundaryColKey?: string;
  /** 是否显示左固定列阴影 */
  showLeftShadow: boolean;
  /** 重排触发签名 */
  reorderSignature: string;
  /** border + 重排联合签名（滚动增量刷新用） */
  layoutSignature: string;
}

/** 解析列宽配置为像素值 */
export function parseColumnWidth(width?: string | number): number {
  if (typeof width === 'number' && !Number.isNaN(width)) return width;
  if (typeof width === 'string') {
    const n = parseFloat(width);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

function getColumnWidth<T extends TableRowData>(col: BaseTableCol<T>, colWidths: Record<string, number>): number {
  const colKey = String(col.colKey ?? '');
  return colWidths[colKey] ?? parseColumnWidth(col.width);
}

function isLeadingColumn<T extends TableRowData>(col: BaseTableCol<T>): boolean {
  return Boolean(col.colKey && TABLE_LEADING_COLUMN_KEYS.has(col.colKey));
}

/**
 * 判断是否存在需要前置的左固定列（非功能列、非连续从左起始的 fixed: 'left'）
 */
export function hasLeftFixedColumnNeedReorder<T extends TableRowData>(columns: BaseTableCol<T>[] = []): boolean {
  let metScrollable = false;
  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    if (isLeadingColumn(col)) continue;
    if (col.fixed === 'right') break;
    if (col.fixed === 'left' && metScrollable) return true;
    if (!col.fixed) metScrollable = true;
  }
  return false;
}

/**
 * 遍历 columns 定义顺序，收集每个非首列 left fixed 的独立重排阈值。
 */
export function getLeftFixedReorderTriggerEntries<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): LeftFixedReorderTriggerEntry[] {
  const entries: LeftFixedReorderTriggerEntry[] = [];
  let widthBefore = 0;
  let metScrollable = false;

  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    if (isLeadingColumn(col)) {
      widthBefore += getColumnWidth(col, colWidths);
      continue;
    }
    if (col.fixed === 'right') break;

    if (col.fixed === 'left' && metScrollable) {
      entries.push({ colKey: String(col.colKey ?? i), threshold: widthBefore });
    }

    widthBefore += getColumnWidth(col, colWidths);
    if (!col.fixed) metScrollable = true;
  }

  return entries;
}

/** 计算首个需重排的非首列 left fixed 贴左前的 scrollLeft 阈值 */
export function getLeftFixedReorderTriggerScrollLeft<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): number {
  const entries = getLeftFixedReorderTriggerEntries(columns, colWidths);
  return entries.length ? entries[0].threshold : Infinity;
}

/** 当前 scrollLeft 下已达重排阈值、应前置的 left fixed 列 colKey（定义顺序） */
export function getTriggeredLeftFixedColKeys<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): string[] {
  if (scrollLeft <= 0 || !hasLeftFixedColumnNeedReorder(columns)) return [];
  return getLeftFixedReorderTriggerEntries(columns, colWidths)
    .filter((entry) => scrollLeft >= entry.threshold)
    .map((entry) => entry.colKey);
}

export function getTriggeredLeftFixedSignature<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): string {
  return getTriggeredLeftFixedColKeys(columns, scrollLeft, colWidths).join('|');
}

/**
 * 基于当前渲染列序与 sticky 激活时机，计算 fixed-left-last border 应落在哪一列。
 * 与列重排阈值分离：dept 可在 sticky 贴住 name 时即显示 border，不必等到重排阈值。
 */
export function getLeftFixedBorderBoundaryColKey<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  displayColumns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): string | undefined {
  if (scrollLeft <= 0 || !hasLeftFixedColumnNeedReorder(originColumns)) {
    return undefined;
  }

  let tableOffset = 0;
  let leftFixedWidthSum = 0;
  let lastStickyActiveKey: string | undefined;

  for (let i = 0, len = displayColumns.length; i < len; i++) {
    const col = displayColumns[i];
    const colKey = String(col.colKey ?? i);
    const width = getColumnWidth(col, colWidths);

    if (isLeadingColumn(col)) {
      tableOffset += width;
      continue;
    }
    if (col.fixed === 'right') break;

    if (col.fixed === 'left') {
      const activationScrollLeft = Math.max(0, tableOffset - leftFixedWidthSum);
      if (scrollLeft >= activationScrollLeft) {
        lastStickyActiveKey = colKey;
      }
      leftFixedWidthSum += width;
    }
    tableOffset += width;
  }

  return lastStickyActiveKey;
}

/** 左 fixed 重排是否已触发 */
export function isLeftFixedReorderTriggered<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): boolean {
  return getTriggeredLeftFixedColKeys(columns, scrollLeft, colWidths).length > 0;
}

/** 左固定列阴影：非首列 left fixed 时与重排触发一致，否则 scrollLeft > 0 即显示 */
export function shouldShowLeftFixedColumnShadow<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): boolean {
  if (scrollLeft <= 0) return false;
  if (hasLeftFixedColumnNeedReorder(columns)) {
    return isLeftFixedReorderTriggered(columns, scrollLeft, colWidths);
  }
  return true;
}

/**
 * 统一解析非首列 left fixed 的布局状态（列序 / border / 阴影 / 签名）。
 * @param displayColumnsOverride 传入当前已渲染列时可跳过列序重算（如 useFixed 内已有 finalColumns）
 */
export function resolveLeftFixedLayout<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
  displayColumnsOverride?: BaseTableCol<T>[],
): LeftFixedLayoutState<T> {
  const enabled = hasLeftFixedColumnNeedReorder(originColumns);

  if (!enabled) {
    return {
      enabled: false,
      displayColumns: originColumns,
      reorderTriggeredKeys: [],
      borderBoundaryColKey: undefined,
      showLeftShadow: shouldShowLeftFixedColumnShadow(originColumns, scrollLeft, colWidths),
      reorderSignature: '',
      layoutSignature: '',
    };
  }

  const reorderTriggeredKeys = getTriggeredLeftFixedColKeys(originColumns, scrollLeft, colWidths);
  const displayColumns = displayColumnsOverride ?? resolveColumnsForLeftFixed(originColumns, scrollLeft, colWidths);
  const borderBoundaryColKey = getLeftFixedBorderBoundaryColKey(originColumns, displayColumns, scrollLeft, colWidths);
  const reorderSignature = reorderTriggeredKeys.join('|');
  const layoutSignature = `${borderBoundaryColKey ?? ''}|${reorderSignature}`;

  return {
    enabled: true,
    displayColumns,
    reorderTriggeredKeys,
    borderBoundaryColKey,
    showLeftShadow: shouldShowLeftFixedColumnShadow(originColumns, scrollLeft, colWidths),
    reorderSignature,
    layoutSignature,
  };
}

/** 比较两组 columns 的 colKey 顺序是否一致 */
export function isSameColumnOrder<T extends TableRowData>(
  prev: BaseTableCol<T>[] = [],
  next: BaseTableCol<T>[] = [],
): boolean {
  if (prev.length !== next.length) return false;
  for (let i = 0, len = prev.length; i < len; i++) {
    if (prev[i].colKey !== next[i].colKey) return false;
  }
  return true;
}

/** 列 fixed 配置签名，用于检测 fixed 目标切换 */
export function getColumnFixedSignature<T extends TableRowData>(columns: BaseTableCol<T>[] = []): string {
  return columns.map((col) => `${col.colKey ?? ''}:${col.fixed ?? ''}`).join('|');
}

/** 渲染列配置是否一致（顺序 + fixed） */
export function isSameDisplayColumns<T extends TableRowData>(
  prev: BaseTableCol<T>[] = [],
  next: BaseTableCol<T>[] = [],
): boolean {
  return isSameColumnOrder(prev, next) && getColumnFixedSignature(prev) === getColumnFixedSignature(next);
}

/** 根据 scrollLeft 与各列独立阈值解析最终渲染列顺序 */
export function resolveColumnsForLeftFixed<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): BaseTableCol<T>[] {
  if (!hasLeftFixedColumnNeedReorder(columns)) return columns;
  const triggeredKeys = getTriggeredLeftFixedColKeys(columns, scrollLeft, colWidths);
  if (!triggeredKeys.length) return columns;
  return reorderColumnsForLeftFixedPartial(columns, new Set(triggeredKeys));
}

/** 仅前置已触发的 left fixed 列；未触发的 left fixed 列保留在定义位置 */
export function reorderColumnsForLeftFixedPartial<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  triggeredColKeys: Set<string> = new Set(),
): BaseTableCol<T>[] {
  if (!columns.length || !triggeredColKeys.size) return columns;

  const hasMultiHeader = columns.some((col) => col.children?.length);
  if (hasMultiHeader) {
    log.warn('TDesign Table', '非首列左固定暂不支持多级表头，已跳过重排。请使用平铺列或手动调整 columns 顺序。');
    return columns;
  }

  const leading: BaseTableCol<T>[] = [];
  const triggeredLeftFixed: BaseTableCol<T>[] = [];
  const scrollable: BaseTableCol<T>[] = [];
  const rightFixed: BaseTableCol<T>[] = [];

  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    const colKey = String(col.colKey ?? i);

    if (isLeadingColumn(col)) {
      leading.push(col);
      continue;
    }
    if (col.fixed === 'right') {
      rightFixed.push(col);
      continue;
    }
    if (col.fixed === 'left' && triggeredColKeys.has(colKey)) {
      triggeredLeftFixed.push(col);
      continue;
    }
    scrollable.push(col);
  }

  return [...leading, ...triggeredLeftFixed, ...scrollable, ...rightFixed];
}

/** 全量前置（测试用）：将所有需重排的 left fixed 列移到功能列之后 */
export function reorderColumnsForLeftFixed<T extends TableRowData>(columns: BaseTableCol<T>[] = []): BaseTableCol<T>[] {
  if (!columns.length || !hasLeftFixedColumnNeedReorder(columns)) return columns;
  const allKeys = getLeftFixedReorderTriggerEntries(columns).map((entry) => entry.colKey);
  return reorderColumnsForLeftFixedPartial(columns, new Set(allKeys));
}
