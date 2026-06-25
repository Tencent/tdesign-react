import { resolveFixedColumnLayout } from './reorderFixedColumns';

import type { FixedColumnInfo } from '../interface';
import type { BaseTableCol, TableRowData } from '../type';
import type { FixedColumnLayoutState, FixedLayoutScrollMetrics } from './reorderFixedColumns';

/** 重置 fixed 边界标记 */
function resetFixedBoundaryFlags(levelNodes: FixedColumnInfo[][]): void {
  for (let t = 0, tLen = levelNodes.length; t < tLen; t++) {
    const nodes = levelNodes[t];
    for (let i = 0, len = nodes.length; i < len; i++) {
      nodes[i].lastLeftFixedCol = false;
      nodes[i].firstRightFixedCol = false;
    }
  }
}

/**
 * 标记 fixed-left-last / fixed-right-first 边界列。
 *
 * 左右两侧独立判断，互不影响：
 * - 单侧启用内置重排：仅按 borderBoundaryColKey 标记，不回落默认规则
 * - 单侧未启用重排：与 develop 一致，按列序标记首个边界（与 showShadow / 是否溢出无关）
 */
export function markFixedColumnBoundaries(
  levelNodes: FixedColumnInfo[][],
  layout: FixedColumnLayoutState<TableRowData>,
): void {
  resetFixedBoundaryFlags(levelNodes);

  for (let t = 0, tLen = levelNodes.length; t < tLen; t++) {
    const nodes = levelNodes[t];
    for (let i = 0, len = nodes.length; i < len; i++) {
      const colMapInfo = nodes[i];
      const nextColMapInfo = nodes[i + 1];
      const lastColMapInfo = nodes[i - 1];
      const { parent } = colMapInfo;
      const isParentLastLeftFixedCol = !parent || parent?.lastLeftFixedCol;
      const isParentFirstRightFixedCol = !parent || parent?.firstRightFixedCol;

      if (layout.left.enabled) {
        if (layout.left.borderBoundaryColKey && colMapInfo.col.colKey === layout.left.borderBoundaryColKey) {
          colMapInfo.lastLeftFixedCol = true;
        }
      } else if (isParentLastLeftFixedCol && colMapInfo.col.fixed === 'left' && nextColMapInfo?.col.fixed !== 'left') {
        colMapInfo.lastLeftFixedCol = true;
      }

      if (layout.right.enabled) {
        if (layout.right.borderBoundaryColKey && colMapInfo.col.colKey === layout.right.borderBoundaryColKey) {
          colMapInfo.firstRightFixedCol = true;
        }
      } else if (
        isParentFirstRightFixedCol &&
        colMapInfo.col.fixed === 'right' &&
        lastColMapInfo?.col.fixed !== 'right'
      ) {
        colMapInfo.firstRightFixedCol = true;
      }
    }
  }
}

/** 构建 useFixed 所需的 fixed 布局快照 */
export function buildFixedLayoutState(
  originColumns: BaseTableCol<TableRowData>[],
  displayColumns: BaseTableCol<TableRowData>[],
  scrollMetrics: FixedLayoutScrollMetrics,
  colWidths: Record<string, number>,
): FixedColumnLayoutState<TableRowData> {
  return resolveFixedColumnLayout(originColumns, scrollMetrics, colWidths, displayColumns);
}

/** @deprecated 使用 buildFixedLayoutState */
export function buildLeftFixedLayoutState(
  originColumns: BaseTableCol<TableRowData>[],
  displayColumns: BaseTableCol<TableRowData>[],
  scrollLeft: number,
  colWidths: Record<string, number>,
): FixedColumnLayoutState<TableRowData> {
  return resolveFixedColumnLayout(originColumns, { scrollLeft, maxScrollLeft: 0 }, colWidths, displayColumns);
}
