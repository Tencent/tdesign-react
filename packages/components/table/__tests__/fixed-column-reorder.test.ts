import { describe, expect, it } from 'vitest';

import {
  getDeferredRightFixedStickyColKeys,
  getRightFixedBorderBoundaryColKey,
  getRightFixedReorderTriggerEntries,
  getTriggeredRightFixedColKeys,
  reorderColumnsForRightFixedPartial,
  resolveColumnsForRightFixed,
  shouldShowRightFixedColumnShadow,
} from '../utils/reorderFixedColumns';

import type { BaseTableCol } from '../type';

/** 与 demo 统一的 8 列定义顺序（address—city—remark 镜像左 name—email—dept） */
const DEMO_COLUMN_ORDER = ['id', 'name', 'email', 'dept', 'address', 'city', 'remark', 'operation'] as const;

function buildDemoColumns(
  fixed: Partial<Record<(typeof DEMO_COLUMN_ORDER)[number], 'left' | 'right'>>,
): BaseTableCol[] {
  const widths: Record<string, number> = {
    id: 100,
    name: 120,
    email: 180,
    dept: 120,
    address: 220,
    city: 120,
    remark: 160,
    operation: 100,
  };
  return DEMO_COLUMN_ORDER.map((colKey) => ({
    colKey,
    width: widths[colKey],
    ...(fixed[colKey] ? { fixed: fixed[colKey] } : {}),
  }));
}

/** 右不相连：address + remark，city 夹在中间（镜像左 name+dept） */
const siteRightDisconnectedColumns = buildDemoColumns({
  address: 'right',
  remark: 'right',
});

/** 右：固定 address */
const rightAddressColumns = buildDemoColumns({ address: 'right' });

/** 旧版三列 operation 右固定（保留重排用例） */
const rightDisconnectedDemoColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'address', width: 220, fixed: 'right' },
  { colKey: 'city', width: 120 },
  { colKey: 'remark', width: 160, fixed: 'right' },
  { colKey: 'email', width: 180 },
  { colKey: 'operation', width: 100, fixed: 'right' },
];

const DEMO_MAX_SCROLL_LEFT = 560;
const SITE_MAX_SCROLL_LEFT = 400;
const RIGHT_ADDRESS_MAX_SCROLL_LEFT = 400;
const ADDRESS_WIDTH_AFTER = 380;
const REMARK_WIDTH_AFTER = 100;

const demoScroll = (scrollLeft: number) => ({
  scrollLeft,
  maxScrollLeft: DEMO_MAX_SCROLL_LEFT,
});
const siteScroll = (scrollLeft: number) => ({
  scrollLeft,
  maxScrollLeft: SITE_MAX_SCROLL_LEFT,
});
const rightAddressScroll = (scrollLeft: number) => ({
  scrollLeft,
  maxScrollLeft: RIGHT_ADDRESS_MAX_SCROLL_LEFT,
});

describe('fixed-column-reorder demo：右不相连 partial 重排', () => {
  it('address 与 remark 均触发时保持定义顺序且 operation 在最末', () => {
    expect(
      reorderColumnsForRightFixedPartial(rightDisconnectedDemoColumns, new Set(['address', 'remark'])).map(
        (col) => col.colKey,
      ),
    ).toEqual(['id', 'city', 'email', 'address', 'remark', 'operation']);
  });

  it('仅 remark 触发时 address 留在原位置', () => {
    expect(
      reorderColumnsForRightFixedPartial(rightDisconnectedDemoColumns, new Set(['remark'])).map((col) => col.colKey),
    ).toEqual(['id', 'address', 'city', 'email', 'remark', 'operation']);
  });
});

describe('fixed-column-reorder demo：右不相连 deferred sticky', () => {
  it('scroll=0 两列均 sticky', () => {
    expect(getDeferredRightFixedStickyColKeys(siteRightDisconnectedColumns, siteScroll(0))).toEqual(new Set());
  });

  it('address 触发重排后取消 sticky', () => {
    expect(getDeferredRightFixedStickyColKeys(siteRightDisconnectedColumns, siteScroll(20))).toEqual(
      new Set(['address']),
    );
  });
});

describe('fixed-column-reorder demo：右重排阈值（统一列序）', () => {
  it('右不相连 address 与 remark 各有独立 widthAfter', () => {
    expect(getRightFixedReorderTriggerEntries(siteRightDisconnectedColumns)).toEqual([
      { colKey: 'address', threshold: 0, widthAfter: ADDRESS_WIDTH_AFTER },
      { colKey: 'remark', threshold: 0, widthAfter: REMARK_WIDTH_AFTER },
    ]);
  });
});

describe('fixed-column-reorder demo：右 border 跟贴边栈', () => {
  it('右不相连 remark 重排后 border 清除（scroll=200）', () => {
    const display = reorderColumnsForRightFixedPartial(rightDisconnectedDemoColumns, new Set(['remark']));
    expect(
      getRightFixedBorderBoundaryColKey(rightDisconnectedDemoColumns, display, {
        scrollLeft: 200,
        maxScrollLeft: 400,
      }),
    ).toBeUndefined();
  });

  it('address 与 remark 均重排时 border 清除', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedDemoColumns, demoScroll(420));
    expect(getTriggeredRightFixedColKeys(rightDisconnectedDemoColumns, demoScroll(420))).toEqual(['address', 'remark']);
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedDemoColumns, display, demoScroll(420))).toBeUndefined();
  });

  it('滚到最右端无 border', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedDemoColumns, demoScroll(560));
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedDemoColumns, display, demoScroll(560))).toBeUndefined();
  });
});

describe('fixed-column-reorder demo：站点列宽右不相连', () => {
  it('scroll=50 address 已重排、remark 贴右：border 在 remark', () => {
    expect(
      getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, siteRightDisconnectedColumns, siteScroll(50)),
    ).toBe('remark');
  });

  it('scroll=0 address 贴右有 border（address+remark 两列 fixed）', () => {
    expect(
      getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, siteRightDisconnectedColumns, siteScroll(0)),
    ).toBe('address');
  });

  it('scroll=20 address 达阈值后 border 交接至 remark', () => {
    expect(
      getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, siteRightDisconnectedColumns, siteScroll(20)),
    ).toBe('remark');
  });

  it('scroll=250 remark 贴右未达阈值：border 在 remark', () => {
    expect(
      getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, siteRightDisconnectedColumns, siteScroll(250)),
    ).toBe('remark');
  });

  it('scroll=300 remark 达重排阈值：border 清除', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(300));
    expect(getTriggeredRightFixedColKeys(siteRightDisconnectedColumns, siteScroll(300))).toEqual(['address', 'remark']);
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(300))).toBeUndefined();
  });

  it('scroll=300 后回到 10：border 回到 address', () => {
    expect(
      getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, siteRightDisconnectedColumns, siteScroll(10)),
    ).toBe('address');
  });

  it('滚到最右端无 border', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(400));
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(400))).toBeUndefined();
  });
});

describe('fixed-column-reorder demo：右固定 address', () => {
  it('scroll=20 达重排阈值：列重排触发，border 与 shadow 清除', () => {
    const display = resolveColumnsForRightFixed(rightAddressColumns, rightAddressScroll(20));
    expect(getTriggeredRightFixedColKeys(rightAddressColumns, rightAddressScroll(20))).toEqual(['address']);
    expect(getRightFixedBorderBoundaryColKey(rightAddressColumns, display, rightAddressScroll(20))).toBeUndefined();
    expect(shouldShowRightFixedColumnShadow(rightAddressColumns, rightAddressScroll(20), {}, display)).toBe(false);
  });

  it('scroll=19 未达重排阈值：仍有 border', () => {
    expect(getRightFixedBorderBoundaryColKey(rightAddressColumns, rightAddressColumns, rightAddressScroll(19))).toBe(
      'address',
    );
  });

  it('scroll=0 有 border、有阴影', () => {
    expect(getRightFixedBorderBoundaryColKey(rightAddressColumns, rightAddressColumns, rightAddressScroll(0))).toBe(
      'address',
    );
    expect(shouldShowRightFixedColumnShadow(rightAddressColumns, rightAddressScroll(0))).toBe(true);
  });

  it('滚到最右端无 border、无阴影', () => {
    expect(
      getRightFixedBorderBoundaryColKey(rightAddressColumns, rightAddressColumns, rightAddressScroll(400)),
    ).toBeUndefined();
    expect(shouldShowRightFixedColumnShadow(rightAddressColumns, rightAddressScroll(400))).toBe(false);
  });
});

describe('fixed-column-reorder demo：右 border 与 shadow 同步', () => {
  it('scroll=250 贴边阶段：border 与 shadow 同时激活', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(250));
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(250))).toBe('remark');
    expect(shouldShowRightFixedColumnShadow(siteRightDisconnectedColumns, siteScroll(250), {}, display)).toBe(true);
  });
});
