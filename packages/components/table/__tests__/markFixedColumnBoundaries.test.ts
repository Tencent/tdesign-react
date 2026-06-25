import { describe, expect, it } from 'vitest';

import { markFixedColumnBoundaries } from '../utils/markFixedColumnBoundaries';

import type { FixedColumnInfo } from '../interface';
import type { FixedColumnLayoutState } from '../utils/reorderFixedColumns';

function createLevelNodes(colKeys: string[], fixedMap: Record<string, 'left' | 'right'>): FixedColumnInfo[][] {
  return [
    colKeys.map((colKey) => ({
      col: { colKey, fixed: fixedMap[colKey] },
      lastLeftFixedCol: false,
      firstRightFixedCol: false,
    })),
  ];
}

describe('markFixedColumnBoundaries', () => {
  it('右侧内置重排 sticky 激活时按 borderBoundaryColKey 标记，不回落默认规则', () => {
    const levelNodes = createLevelNodes(['id', 'city', 'email', 'remark', 'operation'], {
      remark: 'right',
      operation: 'right',
    });
    const layout: FixedColumnLayoutState = {
      enabled: true,
      displayColumns: [],
      left: {
        enabled: false,
        reorderTriggeredKeys: [],
        showShadow: false,
        reorderSignature: '',
        sideLayoutSignature: '',
      },
      right: {
        enabled: true,
        reorderTriggeredKeys: ['remark'],
        borderBoundaryColKey: 'remark',
        showShadow: false,
        reorderSignature: 'remark',
        sideLayoutSignature: 'remark|remark',
      },
      layoutSignature: '::remark|remark',
    };

    markFixedColumnBoundaries(levelNodes, layout);

    expect(levelNodes[0][3].firstRightFixedCol).toBe(true);
    expect(levelNodes[0][4].firstRightFixedCol).toBe(false);
  });

  it('右侧内置重排启用且 borderBoundaryColKey 为空时，不标记默认 border', () => {
    const levelNodes = createLevelNodes(['id', 'address', 'city', 'remark', 'operation'], {
      address: 'right',
      remark: 'right',
      operation: 'right',
    });
    const layout: FixedColumnLayoutState = {
      enabled: true,
      displayColumns: [],
      left: {
        enabled: false,
        reorderTriggeredKeys: [],
        showShadow: false,
        reorderSignature: '',
        sideLayoutSignature: '',
      },
      right: {
        enabled: true,
        reorderTriggeredKeys: [],
        borderBoundaryColKey: undefined,
        showShadow: false,
        reorderSignature: '',
        sideLayoutSignature: '',
      },
      layoutSignature: '::',
    };

    markFixedColumnBoundaries(levelNodes, layout);

    expect(levelNodes[0][1].firstRightFixedCol).toBe(false);
    expect(levelNodes[0][3].firstRightFixedCol).toBe(false);
    expect(levelNodes[0][4].firstRightFixedCol).toBe(false);
  });

  it('左侧内置重排启用时，右侧不回落默认 border 规则', () => {
    const levelNodes = createLevelNodes(['id', 'name', 'email', 'remark', 'operation'], {
      remark: 'right',
      operation: 'right',
    });
    const layout: FixedColumnLayoutState = {
      enabled: true,
      displayColumns: [],
      left: {
        enabled: true,
        reorderTriggeredKeys: ['name'],
        borderBoundaryColKey: 'name',
        showShadow: true,
        reorderSignature: 'name',
        sideLayoutSignature: 'name|name',
      },
      right: {
        enabled: false,
        reorderTriggeredKeys: [],
        borderBoundaryColKey: undefined,
        showShadow: false,
        reorderSignature: '',
        sideLayoutSignature: '',
      },
      layoutSignature: 'name|name::',
    };

    markFixedColumnBoundaries(levelNodes, layout);

    expect(levelNodes[0][3].firstRightFixedCol).toBe(false);
    expect(levelNodes[0][4].firstRightFixedCol).toBe(false);
  });
});
