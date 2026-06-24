import { resolveLeftFixedLayout } from './reorderFixedColumns';

import type { FixedColumnInfo } from '../interface';
import type { BaseTableCol, TableRowData } from '../type';
import type { LeftFixedLayoutState } from './reorderFixedColumns';

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
 * 根据 left fixed 布局状态标记 fixed-left-last / fixed-right-first 边界列。
 * 内置重排启用时用 sticky 边界；否则沿用「left fixed 且下一列非 left fixed」的默认规则。
 */
export function markFixedColumnBoundaries(
  levelNodes: FixedColumnInfo[][],
  layout: LeftFixedLayoutState<TableRowData>,
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

      if (layout.enabled && layout.borderBoundaryColKey) {
        if (colMapInfo.col.colKey === layout.borderBoundaryColKey) {
          colMapInfo.lastLeftFixedCol = true;
        }
      } else if (isParentLastLeftFixedCol && colMapInfo.col.fixed === 'left' && nextColMapInfo?.col.fixed !== 'left') {
        colMapInfo.lastLeftFixedCol = true;
      }

      if (isParentFirstRightFixedCol && colMapInfo.col.fixed === 'right' && lastColMapInfo?.col.fixed !== 'right') {
        colMapInfo.firstRightFixedCol = true;
      }
    }
  }
}

/** 构建 useFixed 所需的 left fixed 布局快照 */
export function buildLeftFixedLayoutState(
  originColumns: BaseTableCol<TableRowData>[],
  displayColumns: BaseTableCol<TableRowData>[],
  scrollLeft: number,
  colWidths: Record<string, number>,
): LeftFixedLayoutState<TableRowData> {
  return resolveLeftFixedLayout(originColumns, scrollLeft, colWidths, displayColumns);
}
