import log from '@tdesign/common-js/log/index';

import type { BaseTableCol, TableRowData } from '../type';

/** 始终保持在最左侧的功能列，不参与左固定重排 */
export const TABLE_LEADING_COLUMN_KEYS = new Set(['__EXPAND_ROW_ICON_COLUMN__', 'row-select', 'drag', 'serial-number']);

/** 横向滚动度量（右侧贴边阈值依赖 maxScrollLeft） */
export interface FixedLayoutScrollMetrics {
  scrollLeft: number;
  maxScrollLeft: number;
}

/** 单侧 fixed 重排触发项 */
export interface FixedReorderTriggerEntry {
  colKey: string;
  /** 左：scrollLeft >= threshold；右：scrollLeft >= maxScrollLeft - widthAfter */
  threshold: number;
  widthAfter?: number;
}

/** 单侧 fixed 布局状态 */
export interface FixedColumnSideLayoutState {
  enabled: boolean;
  reorderTriggeredKeys: string[];
  borderBoundaryColKey?: string;
  showShadow: boolean;
  reorderSignature: string;
  sideLayoutSignature: string;
}

/** 非首列 fixed 完整布局状态（左 + 右） */
export interface FixedColumnLayoutState<T extends TableRowData = TableRowData> {
  enabled: boolean;
  displayColumns: BaseTableCol<T>[];
  left: FixedColumnSideLayoutState;
  right: FixedColumnSideLayoutState;
  layoutSignature: string;
}

/** @deprecated 兼容旧引用 */
export type LeftFixedReorderTriggerEntry = FixedReorderTriggerEntry;

/** @deprecated 兼容旧引用 */
export interface LeftFixedLayoutState<T extends TableRowData = TableRowData> {
  enabled: boolean;
  displayColumns: BaseTableCol<T>[];
  reorderTriggeredKeys: string[];
  borderBoundaryColKey?: string;
  showLeftShadow: boolean;
  reorderSignature: string;
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

/** 在 displayColumns 中取最靠左、且已触发重排的 right fixed 列 */
function findLeftmostTriggeredRightFixedColKey<T extends TableRowData>(
  displayColumns: BaseTableCol<T>[] = [],
  triggeredColKeys: Set<string> = new Set(),
): string | undefined {
  for (let i = 0, len = displayColumns.length; i < len; i++) {
    const col = displayColumns[i];
    const colKey = String(col.colKey ?? i);
    if (col.fixed === 'right' && triggeredColKeys.has(colKey)) {
      return colKey;
    }
  }
  return undefined;
}

export function getColumnsTotalWidth<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): number {
  let total = 0;
  for (let i = 0, len = columns.length; i < len; i++) {
    total += getColumnWidth(columns[i], colWidths);
  }
  return total;
}

export function createFixedLayoutScrollMetrics(
  scrollLeft = 0,
  scrollWidth = 0,
  clientWidth = 0,
): FixedLayoutScrollMetrics {
  return {
    scrollLeft,
    maxScrollLeft: Math.max(0, scrollWidth - clientWidth),
  };
}

// ---------- 左 fixed ----------

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

export function getLeftFixedReorderTriggerEntries<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): FixedReorderTriggerEntry[] {
  const entries: FixedReorderTriggerEntry[] = [];
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

export function getLeftFixedReorderTriggerScrollLeft<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): number {
  const entries = getLeftFixedReorderTriggerEntries(columns, colWidths);
  return entries.length ? entries[0].threshold : Infinity;
}

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

/**
 * 右侧 fixed border 边界（fixed-right-first）。
 * 内置重排：跟重排阈值，取 display 中最靠左的已触发 right fixed 列。
 */
export function getRightFixedBorderBoundaryColKey<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  displayColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): string | undefined {
  const { scrollLeft } = scrollMetrics;
  if (scrollLeft <= 0 || !hasRightFixedColumnNeedReorder(originColumns)) {
    return undefined;
  }

  const triggeredKeys = new Set(getTriggeredRightFixedColKeys(originColumns, scrollMetrics, colWidths));
  if (!triggeredKeys.size) return undefined;

  return findLeftmostTriggeredRightFixedColKey(displayColumns, triggeredKeys);
}

export function isLeftFixedReorderTriggered<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
): boolean {
  return getTriggeredLeftFixedColKeys(columns, scrollLeft, colWidths).length > 0;
}

export function shouldShowLeftFixedColumnShadow<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
): boolean {
  if (scrollLeft <= 0) return false;
  if (hasLeftFixedColumnNeedReorder(columns)) {
    // 内置重排：阴影仅表示「已发生横滚」，与 border 列（sticky）解耦；加粗需二者同时满足
    return true;
  }
  return true;
}

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
  const middle: BaseTableCol<T>[] = [];

  for (let i = 0, len = columns.length; i < len; i++) {
    const col = columns[i];
    const colKey = String(col.colKey ?? i);

    if (isLeadingColumn(col)) {
      leading.push(col);
      continue;
    }
    if (col.fixed === 'left' && triggeredColKeys.has(colKey)) {
      triggeredLeftFixed.push(col);
      continue;
    }
    middle.push(col);
  }

  return [...leading, ...triggeredLeftFixed, ...middle];
}

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

export function reorderColumnsForLeftFixed<T extends TableRowData>(columns: BaseTableCol<T>[] = []): BaseTableCol<T>[] {
  if (!columns.length || !hasLeftFixedColumnNeedReorder(columns)) return columns;
  const allKeys = getLeftFixedReorderTriggerEntries(columns).map((entry) => entry.colKey);
  return reorderColumnsForLeftFixedPartial(columns, new Set(allKeys));
}

function buildLeftSideLayoutState<T extends TableRowData>(
  originColumns: BaseTableCol<T>[],
  displayColumns: BaseTableCol<T>[],
  scrollLeft: number,
  colWidths: Record<string, number>,
): FixedColumnSideLayoutState {
  const enabled = hasLeftFixedColumnNeedReorder(originColumns);

  if (!enabled) {
    return {
      enabled: false,
      reorderTriggeredKeys: [],
      borderBoundaryColKey: undefined,
      showShadow: shouldShowLeftFixedColumnShadow(originColumns, scrollLeft),
      reorderSignature: '',
      sideLayoutSignature: '',
    };
  }

  const reorderTriggeredKeys = getTriggeredLeftFixedColKeys(originColumns, scrollLeft, colWidths);
  const borderBoundaryColKey = getLeftFixedBorderBoundaryColKey(originColumns, displayColumns, scrollLeft, colWidths);
  const reorderSignature = reorderTriggeredKeys.join('|');

  return {
    enabled: true,
    reorderTriggeredKeys,
    borderBoundaryColKey,
    showShadow: shouldShowLeftFixedColumnShadow(originColumns, scrollLeft),
    reorderSignature,
    sideLayoutSignature: `${borderBoundaryColKey ?? ''}|${reorderSignature}`,
  };
}

export function resolveLeftFixedLayout<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollLeft = 0,
  colWidths: Record<string, number> = {},
  displayColumnsOverride?: BaseTableCol<T>[],
): LeftFixedLayoutState<T> {
  const displayColumns = displayColumnsOverride ?? resolveColumnsForLeftFixed(originColumns, scrollLeft, colWidths);
  const left = buildLeftSideLayoutState(originColumns, displayColumns, scrollLeft, colWidths);

  return {
    enabled: left.enabled,
    displayColumns,
    reorderTriggeredKeys: left.reorderTriggeredKeys,
    borderBoundaryColKey: left.borderBoundaryColKey,
    showLeftShadow: left.showShadow,
    reorderSignature: left.reorderSignature,
    layoutSignature: left.sideLayoutSignature,
  };
}

// ---------- 右 fixed（与左侧对称） ----------

export function hasRightFixedColumnNeedReorder<T extends TableRowData>(columns: BaseTableCol<T>[] = []): boolean {
  let metScrollable = false;
  for (let i = columns.length - 1; i >= 0; i--) {
    const col = columns[i];
    if (col.fixed === 'left') break;
    if (col.fixed === 'right' && metScrollable) return true;
    if (!col.fixed) metScrollable = true;
  }
  return false;
}

export function hasFixedColumnNeedReorder<T extends TableRowData>(columns: BaseTableCol<T>[] = []): boolean {
  return hasLeftFixedColumnNeedReorder(columns) || hasRightFixedColumnNeedReorder(columns);
}

export function getRightFixedReorderTriggerEntries<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): FixedReorderTriggerEntry[] {
  const entries: FixedReorderTriggerEntry[] = [];
  let widthAfter = 0;
  let metScrollable = false;

  for (let i = columns.length - 1; i >= 0; i--) {
    const col = columns[i];
    if (col.fixed === 'left') break;

    if (col.fixed === 'right' && metScrollable) {
      entries.unshift({
        colKey: String(col.colKey ?? i),
        threshold: 0,
        widthAfter,
      });
    }

    widthAfter += getColumnWidth(col, colWidths);
    if (!col.fixed) metScrollable = true;
  }

  return entries;
}

export function getTriggeredRightFixedColKeys<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): string[] {
  const { scrollLeft, maxScrollLeft } = scrollMetrics;
  if (maxScrollLeft <= 0 || !hasRightFixedColumnNeedReorder(columns)) return [];

  return getRightFixedReorderTriggerEntries(columns, colWidths)
    .filter((entry) => {
      const widthAfter = entry.widthAfter ?? 0;
      const threshold = maxScrollLeft - widthAfter;
      return threshold >= 0 && scrollLeft >= threshold;
    })
    .map((entry) => entry.colKey);
}

export function isRightFixedReorderTriggered<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): boolean {
  return getTriggeredRightFixedColKeys(columns, scrollMetrics, colWidths).length > 0;
}

export function shouldShowRightFixedColumnShadow<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
): boolean {
  const { scrollLeft, maxScrollLeft } = scrollMetrics;
  if (maxScrollLeft <= 0 || scrollLeft <= 0) return false;
  if (hasRightFixedColumnNeedReorder(columns)) {
    // 内置重排：阴影仅表示「仍可向右滚动」，与 border 列（重排阈值）解耦；加粗需二者同时满足
    return scrollLeft < maxScrollLeft;
  }
  return scrollLeft < maxScrollLeft;
}

function getTrailingRightFixedColumns<T extends TableRowData>(columns: BaseTableCol<T>[] = []): BaseTableCol<T>[] {
  const trailing: BaseTableCol<T>[] = [];
  for (let i = columns.length - 1; i >= 0; i--) {
    const col = columns[i];
    if (col.fixed === 'right') {
      trailing.unshift(col);
    } else {
      break;
    }
  }
  return trailing;
}

export function reorderColumnsForRightFixedPartial<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  triggeredColKeys: Set<string> = new Set(),
): BaseTableCol<T>[] {
  if (!columns.length || !triggeredColKeys.size) return columns;

  const hasMultiHeader = columns.some((col) => col.children?.length);
  if (hasMultiHeader) {
    log.warn('TDesign Table', '非末列右固定暂不支持多级表头，已跳过重排。请使用平铺列或手动调整 columns 顺序。');
    return columns;
  }

  let lastRightFixedIndex = -1;
  for (let i = columns.length - 1; i >= 0; i--) {
    if (columns[i].fixed === 'right') {
      lastRightFixedIndex = i;
      break;
    }
  }

  // 最后一个 right fixed 之后的列（如 operation）始终保持在最末
  const absoluteTail = lastRightFixedIndex >= 0 ? columns.slice(lastRightFixedIndex + 1) : [];
  const headPart = lastRightFixedIndex >= 0 ? columns.slice(0, lastRightFixedIndex + 1) : columns;
  const trailingRightFixed = getTrailingRightFixedColumns(headPart);
  const trailingKeys = new Set(trailingRightFixed.map((col) => String(col.colKey ?? '')));

  const leading: BaseTableCol<T>[] = [];
  const leftFixed: BaseTableCol<T>[] = [];
  const body: BaseTableCol<T>[] = [];
  const triggeredRightFixed: BaseTableCol<T>[] = [];

  for (let i = 0, len = headPart.length; i < len; i++) {
    const col = headPart[i];
    const colKey = String(col.colKey ?? i);

    if (isLeadingColumn(col)) {
      leading.push(col);
      continue;
    }
    if (col.fixed === 'left') {
      leftFixed.push(col);
      continue;
    }
    if (col.fixed === 'right') {
      if (trailingKeys.has(colKey)) continue;
      if (triggeredColKeys.has(colKey)) triggeredRightFixed.push(col);
      else body.push(col);
      continue;
    }
    body.push(col);
  }

  return [...leading, ...leftFixed, ...body, ...triggeredRightFixed, ...trailingRightFixed, ...absoluteTail];
}

export function resolveColumnsForRightFixed<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
  originColumns?: BaseTableCol<T>[],
): BaseTableCol<T>[] {
  const origin = originColumns ?? columns;
  if (!hasRightFixedColumnNeedReorder(origin)) return columns;
  const triggeredKeys = getTriggeredRightFixedColKeys(origin, scrollMetrics, colWidths);
  if (!triggeredKeys.length) return columns;
  return reorderColumnsForRightFixedPartial(columns, new Set(triggeredKeys));
}

export function reorderColumnsForRightFixed<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
): BaseTableCol<T>[] {
  if (!columns.length || !hasRightFixedColumnNeedReorder(columns)) return columns;
  const allKeys = getRightFixedReorderTriggerEntries(columns).map((entry) => entry.colKey);
  return reorderColumnsForRightFixedPartial(columns, new Set(allKeys));
}

function buildRightSideLayoutState<T extends TableRowData>(
  originColumns: BaseTableCol<T>[],
  displayColumns: BaseTableCol<T>[],
  scrollMetrics: FixedLayoutScrollMetrics,
  colWidths: Record<string, number>,
): FixedColumnSideLayoutState {
  const enabled = hasRightFixedColumnNeedReorder(originColumns);

  if (!enabled) {
    return {
      enabled: false,
      reorderTriggeredKeys: [],
      borderBoundaryColKey: undefined,
      showShadow: shouldShowRightFixedColumnShadow(originColumns, scrollMetrics),
      reorderSignature: '',
      sideLayoutSignature: '',
    };
  }

  const reorderTriggeredKeys = getTriggeredRightFixedColKeys(originColumns, scrollMetrics, colWidths);
  const borderBoundaryColKey = getRightFixedBorderBoundaryColKey(
    originColumns,
    displayColumns,
    scrollMetrics,
    colWidths,
  );
  const reorderSignature = reorderTriggeredKeys.join('|');

  return {
    enabled: true,
    reorderTriggeredKeys,
    borderBoundaryColKey,
    showShadow: shouldShowRightFixedColumnShadow(originColumns, scrollMetrics),
    reorderSignature,
    sideLayoutSignature: `${borderBoundaryColKey ?? ''}|${reorderSignature}`,
  };
}

// ---------- 统一入口 ----------

export function resolveDisplayColumnsForFixed<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): BaseTableCol<T>[] {
  const afterLeft = resolveColumnsForLeftFixed(originColumns, scrollMetrics.scrollLeft, colWidths);
  return resolveColumnsForRightFixed(afterLeft, scrollMetrics, colWidths, originColumns);
}

export function resolveFixedColumnLayout<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
  displayColumnsOverride?: BaseTableCol<T>[],
): FixedColumnLayoutState<T> {
  const displayColumns =
    displayColumnsOverride ?? resolveDisplayColumnsForFixed(originColumns, scrollMetrics, colWidths);
  const left = buildLeftSideLayoutState(originColumns, displayColumns, scrollMetrics.scrollLeft, colWidths);
  const right = buildRightSideLayoutState(originColumns, displayColumns, scrollMetrics, colWidths);
  const enabled = left.enabled || right.enabled;

  return {
    enabled,
    displayColumns,
    left,
    right,
    layoutSignature: `${left.sideLayoutSignature}::${right.sideLayoutSignature}`,
  };
}

// ---------- 通用工具 ----------

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

export function getColumnFixedSignature<T extends TableRowData>(columns: BaseTableCol<T>[] = []): string {
  return columns.map((col) => `${col.colKey ?? ''}:${col.fixed ?? ''}`).join('|');
}

export function isSameDisplayColumns<T extends TableRowData>(
  prev: BaseTableCol<T>[] = [],
  next: BaseTableCol<T>[] = [],
): boolean {
  return isSameColumnOrder(prev, next) && getColumnFixedSignature(prev) === getColumnFixedSignature(next);
}
