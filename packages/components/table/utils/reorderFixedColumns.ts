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
  /** 左：scrollLeft >= widthBefore；右：scrollFromRight <= widthAfter */
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

/** 距右缘剩余可滚距离（DOM 仅有 scrollLeft，右向判断统一用此量） */
export function getScrollFromRight(scrollMetrics: FixedLayoutScrollMetrics): number {
  const { scrollLeft, maxScrollLeft } = scrollMetrics;
  return Math.max(0, maxScrollLeft - scrollLeft);
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
 * 与 setFixedRightPos 相同规则，基于 display 列序与列宽计算 right fixed 的 sticky right 偏移。
 * border 边界取已触发列中 right 偏移最大者（贴边栈最左缘，与 fixed-right-first 一致）。
 */
export function computeRightFixedOffsets<T extends TableRowData>(
  displayColumns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): Map<string, number> {
  const offsets = new Map<string, number>();
  const rightFixedMeta = new Map<string, { right: number; width: number }>();

  for (let i = displayColumns.length - 1; i >= 0; i--) {
    const col = displayColumns[i];
    if (col.fixed === 'left') break;

    const colKey = String(col.colKey ?? i);
    const width = getColumnWidth(col, colWidths);

    if (col.fixed === 'right') {
      let lastColIndex = i + 1;
      while (lastColIndex < displayColumns.length && displayColumns[lastColIndex].fixed !== 'right') {
        lastColIndex += 1;
      }
      const lastCol = displayColumns[lastColIndex];
      const lastKey = lastCol ? String(lastCol.colKey ?? lastColIndex) : '';
      const lastMeta = lastKey ? rightFixedMeta.get(lastKey) : undefined;
      const right = (lastMeta?.right ?? 0) + (lastMeta?.width ?? 0);
      rightFixedMeta.set(colKey, { right, width });
      offsets.set(colKey, right);
    }
  }

  return offsets;
}

/** 在已触发列中，取 right 偏移最大者作为 fixed-right-first 边界列 */
export function pickRightFixedBorderBoundaryColKey(
  triggeredColKeys: Set<string> | string[] = [],
  rightOffsets: Map<string, number> = new Map(),
): string | undefined {
  const keys = triggeredColKeys instanceof Set ? triggeredColKeys : new Set(triggeredColKeys);
  let boundaryColKey: string | undefined;
  let maxRight = -1;

  keys.forEach((colKey) => {
    const right = rightOffsets.get(colKey) ?? 0;
    if (right >= maxRight) {
      maxRight = right;
      boundaryColKey = colKey;
    }
  });

  return boundaryColKey;
}

/** 从 fixed 位置 Map 读取已算好的 sticky right 偏移 */
export function readRightFixedOffsetsFromColumnMap(
  columnMap: Map<string | number, { col?: { fixed?: string }; right?: number }> = new Map(),
): Map<string, number> {
  const offsets = new Map<string, number>();
  columnMap.forEach((info, key) => {
    if (info.col?.fixed === 'right' && info.right !== undefined) {
      offsets.set(String(key), info.right);
    }
  });
  return offsets;
}

/** 右固定 border / 阴影是否应显示（与标准右固定一致：可横向滚动且未滚到最右） */
export function isRightFixedBorderScrollActive(scrollMetrics: FixedLayoutScrollMetrics): boolean {
  const { scrollLeft, maxScrollLeft } = scrollMetrics;
  return maxScrollLeft > 0 && scrollLeft < maxScrollLeft;
}

/** 参与内置重排的 right fixed 列 colKey 列表（定义顺序，从右往左） */
export function getRightFixedReorderColKeys<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  colWidths: Record<string, number> = {},
): string[] {
  return getRightFixedReorderTriggerEntries(columns, colWidths).map((entry) => entry.colKey);
}

/** 是否仅有一列 right fixed（如「右：固定 address」），border 与标准右固定一致 */
export function isSingleIsolatedRightFixedColumn<T extends TableRowData>(columns: BaseTableCol<T>[] = []): boolean {
  if (getRightFixedReorderColKeys(columns).length !== 1) return false;
  let rightFixedCount = 0;
  for (let i = 0, len = columns.length; i < len; i++) {
    if (columns[i].fixed === 'right') rightFixedCount += 1;
  }
  return rightFixedCount === 1;
}

/**
 * 多列不相连：与单列 address 同语义——未达重排阈值前贴右缘才有 border。
 * 在仍贴边的列中取 widthAfter 最大者（最内侧贴边列）作为 fixed-right-first。
 */
function getColumnWidthAfterInOrder<T extends TableRowData>(
  columns: BaseTableCol<T>[] = [],
  targetColKey: string,
  colWidths: Record<string, number> = {},
): number {
  let widthAfter = 0;
  for (let i = columns.length - 1; i >= 0; i--) {
    const colKey = String(columns[i].colKey ?? i);
    if (colKey === targetColKey) return widthAfter;
    widthAfter += getColumnWidth(columns[i], colWidths);
  }
  return -1;
}

function getRightFixedMultiBorderBoundaryColKey<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics,
  colWidths: Record<string, number> = {},
): string | undefined {
  const { maxScrollLeft } = scrollMetrics;
  const scrollFromRight = getScrollFromRight(scrollMetrics);
  const entries = getRightFixedReorderTriggerEntries(originColumns, colWidths);
  const triggered = new Set(getTriggeredRightFixedColKeys(originColumns, scrollMetrics, colWidths));
  const trailing = getRightFixedTrailingColKeysForReorder(originColumns);
  const entryColKeys = new Set(entries.map((entry) => entry.colKey));

  let boundaryColKey: string | undefined;
  let maxStickingWidthAfter = -1;

  const considerCandidate = (colKey: string, widthAfter: number) => {
    if (triggered.has(colKey)) return;
    if (widthAfter > maxScrollLeft) return;
    if (scrollFromRight > widthAfter && widthAfter > maxStickingWidthAfter) {
      maxStickingWidthAfter = widthAfter;
      boundaryColKey = colKey;
    }
  };

  // 已有列触发重排：border 立即交给仍未触发的贴边列（避免内侧列仍占 border）
  if (triggered.size > 0) {
    for (let i = 0, len = entries.length; i < len; i++) {
      const entry = entries[i];
      considerCandidate(entry.colKey, entry.widthAfter ?? 0);
    }
    return boundaryColKey;
  }

  for (let i = 0, len = entries.length; i < len; i++) {
    const entry = entries[i];
    considerCandidate(entry.colKey, entry.widthAfter ?? 0);
  }

  // 末段 trailing 列（如 operation）可能不在 reorder entries 中
  trailing.forEach((colKey) => {
    if (entryColKeys.has(colKey)) return;
    const widthAfter = getColumnWidthAfterInOrder(originColumns, colKey, colWidths);
    if (widthAfter < 0) return;
    considerCandidate(colKey, widthAfter);
  });

  return boundaryColKey;
}

/**
 * 右侧 border 边界列（fixed-right-first）。
 * - 仅一列 right fixed（如 address）：scrollFromRight > widthAfter 时贴右缘有 border；达重排阈值后脱离右边界，border 清除。
 * - 多列不相连：各列均在 scrollFromRight > widthAfter 时贴右缘；取 widthAfter 最大且仍贴边者为边界，达阈值后交接给下一列。
 */
export function getRightFixedStickyBoundaryColKey<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): string | undefined {
  const { maxScrollLeft } = scrollMetrics;
  if (!hasRightFixedColumnNeedReorder(originColumns)) return undefined;
  if (!isRightFixedBorderScrollActive(scrollMetrics)) return undefined;

  // 单列右固定：未达重排阈值前贴右缘；达阈值后列脱离右边界，不再加粗
  if (isSingleIsolatedRightFixedColumn(originColumns)) {
    const entry = getRightFixedReorderTriggerEntries(originColumns, colWidths)[0];
    if (!entry) return undefined;
    const widthAfter = entry.widthAfter ?? 0;
    if (widthAfter > maxScrollLeft) return undefined;
    if (getScrollFromRight(scrollMetrics) > widthAfter) {
      return entry.colKey;
    }
    return undefined;
  }

  return getRightFixedMultiBorderBoundaryColKey(originColumns, scrollMetrics, colWidths);
}

/** 结合布局快照，解析右侧 border 边界 */
export function resolveRightBorderBoundaryColKey<T extends TableRowData>(
  originColumns: BaseTableCol<T>[],
  displayColumns: BaseTableCol<T>[],
  scrollMetrics: FixedLayoutScrollMetrics,
  colWidths: Record<string, number>,
): string | undefined {
  return getRightFixedStickyBoundaryColKey(originColumns, scrollMetrics, colWidths);
}

/** @alias resolveRightBorderBoundaryColKey */
export function getRightFixedBorderBoundaryColKey<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  displayColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): string | undefined {
  return resolveRightBorderBoundaryColKey(originColumns, displayColumns, scrollMetrics, colWidths);
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
  colWidths: Record<string, number> = {},
): boolean {
  if (scrollLeft <= 0) return false;
  if (hasLeftFixedColumnNeedReorder(columns)) {
    // 与左 border（sticky）相反：左阴影跟重排阈值
    return isLeftFixedReorderTriggered(columns, scrollLeft, colWidths);
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
      showShadow: shouldShowLeftFixedColumnShadow(originColumns, scrollLeft, colWidths),
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
    showShadow: shouldShowLeftFixedColumnShadow(originColumns, scrollLeft, colWidths),
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
  if (maxScrollLeft <= 0 || scrollLeft <= 0 || !hasRightFixedColumnNeedReorder(columns)) return [];

  const scrollFromRight = getScrollFromRight(scrollMetrics);

  return getRightFixedReorderTriggerEntries(columns, colWidths)
    .filter((entry) => {
      const widthAfter = entry.widthAfter ?? 0;
      if (widthAfter > maxScrollLeft) return false;
      return scrollFromRight <= widthAfter;
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
  colWidths: Record<string, number> = {},
  displayColumns: BaseTableCol<T>[] = [],
): boolean {
  // 容器阴影：重排模式跟随 border 边界；标准右固定与 develop 一致，看是否还能右滚
  if (hasRightFixedColumnNeedReorder(columns)) {
    const display = displayColumns.length ? displayColumns : columns;
    return !!getRightFixedBorderBoundaryColKey(columns, display, scrollMetrics, colWidths);
  }
  const { scrollLeft, maxScrollLeft } = scrollMetrics;
  return scrollLeft < maxScrollLeft;
}

function getRightFixedTrailingColKeysForReorder<T extends TableRowData>(columns: BaseTableCol<T>[] = []): Set<string> {
  let lastRightFixedIndex = -1;
  for (let i = columns.length - 1; i >= 0; i--) {
    if (columns[i].fixed === 'right') {
      lastRightFixedIndex = i;
      break;
    }
  }
  if (lastRightFixedIndex < 0) return new Set();
  const headPart = columns.slice(0, lastRightFixedIndex + 1);
  return new Set(getTrailingRightFixedColumns(headPart).map((col) => String(col.colKey ?? '')));
}

/**
 * 多列右不相连：已触发重排的列取消 sticky，border 交给外侧下一列。
 * 单列右固定（如 address）不延迟。
 */
export function getDeferredRightFixedStickyColKeys<T extends TableRowData>(
  originColumns: BaseTableCol<T>[] = [],
  scrollMetrics: FixedLayoutScrollMetrics = { scrollLeft: 0, maxScrollLeft: 0 },
  colWidths: Record<string, number> = {},
): Set<string> {
  if (isSingleIsolatedRightFixedColumn(originColumns)) return new Set();
  if (!hasRightFixedColumnNeedReorder(originColumns)) return new Set();
  return new Set(getTriggeredRightFixedColKeys(originColumns, scrollMetrics, colWidths));
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
      showShadow: shouldShowRightFixedColumnShadow(originColumns, scrollMetrics, colWidths, displayColumns),
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
    showShadow: shouldShowRightFixedColumnShadow(originColumns, scrollMetrics, colWidths, displayColumns),
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
