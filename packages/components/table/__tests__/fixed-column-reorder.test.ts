import { describe, expect, it } from 'vitest';

import {
  getRightFixedBorderBoundaryColKey,
  getRightFixedReorderTriggerEntries,
  getTriggeredRightFixedColKeys,
  reorderColumnsForRightFixedPartial,
  resolveColumnsForRightFixed,
  shouldShowRightFixedColumnShadow,
} from '../utils/reorderFixedColumns';

import type { BaseTableCol } from '../type';

/** 与 fixed-column-reorder demo 右不相连场景一致（含 operation 右固定） */
const rightDisconnectedDemoColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'address', width: 220, fixed: 'right' },
  { colKey: 'city', width: 120 },
  { colKey: 'remark', width: 160, fixed: 'right' },
  { colKey: 'email', width: 180 },
  { colKey: 'operation', width: 100, fixed: 'right' },
];

/** 与 demo 右不相连列序一致：id,name,dept,address,city,remark,email,operation */
const siteRightDisconnectedColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'name', width: 120 },
  { colKey: 'dept', width: 120 },
  { colKey: 'address', width: 220, fixed: 'right' },
  { colKey: 'city', width: 120 },
  { colKey: 'remark', width: 160, fixed: 'right' },
  { colKey: 'email', width: 180 },
  { colKey: 'operation', width: 100 },
];

/** 与 demo「右：固定 address」一致 */
const rightAddressColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'name', width: 120 },
  { colKey: 'email', width: 180 },
  { colKey: 'dept', width: 120 },
  { colKey: 'city', width: 120 },
  { colKey: 'address', width: 220, fixed: 'right' },
  { colKey: 'remark', width: 160 },
  { colKey: 'operation', width: 100 },
];

const DEMO_MAX_SCROLL_LEFT = 560;
const SITE_MAX_SCROLL_LEFT = 400;
const RIGHT_ADDRESS_MAX_SCROLL_LEFT = 400;

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

describe('fixed-column-reorder demo：右重排阈值', () => {
  it('右不相连 address 与 remark 各有独立 widthAfter', () => {
    expect(getRightFixedReorderTriggerEntries(rightDisconnectedDemoColumns)).toEqual([
      { colKey: 'address', threshold: 0, widthAfter: 560 },
      { colKey: 'remark', threshold: 0, widthAfter: 280 },
    ]);
  });
});

describe('fixed-column-reorder demo：右 border 跟重排', () => {
  it('右不相连 remark 重排后 border 在 remark', () => {
    const display = reorderColumnsForRightFixedPartial(rightDisconnectedDemoColumns, new Set(['remark']));
    expect(
      getRightFixedBorderBoundaryColKey(rightDisconnectedDemoColumns, display, {
        scrollLeft: 200,
        maxScrollLeft: 400,
      }),
    ).toBe('remark');
  });

  it('address 与 remark 均重排时 border 在 display 中最靠左的已触发列', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedDemoColumns, demoScroll(420));
    expect(getTriggeredRightFixedColKeys(rightDisconnectedDemoColumns, demoScroll(420))).toEqual(['address', 'remark']);
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedDemoColumns, display, demoScroll(420))).toBe('address');
  });

  it('address 重排后 border 仍在 address', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedDemoColumns, demoScroll(560));
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedDemoColumns, display, demoScroll(560))).toBe('address');
  });
});

describe('fixed-column-reorder demo：站点列宽右不相连', () => {
  it('scroll=120 remark 达重排阈值：border 在 remark', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(120));
    expect(getTriggeredRightFixedColKeys(siteRightDisconnectedColumns, siteScroll(120))).toEqual(['remark']);
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(120))).toBe('remark');
  });

  it('scroll=280 remark 已重排：border 在 remark（address 阈值超出 maxScrollLeft）', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(280));
    expect(getTriggeredRightFixedColKeys(siteRightDisconnectedColumns, siteScroll(280))).toEqual(['remark']);
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(280))).toBe('remark');
  });

  it('scroll=400 滚到底：border 仍在 remark', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(400));
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(400))).toBe('remark');
  });
});

describe('fixed-column-reorder demo：右固定 address', () => {
  it('scroll=140 达重排阈值：border 与阴影同时可激活', () => {
    const display = resolveColumnsForRightFixed(rightAddressColumns, rightAddressScroll(140));
    expect(getTriggeredRightFixedColKeys(rightAddressColumns, rightAddressScroll(140))).toEqual(['address']);
    expect(getRightFixedBorderBoundaryColKey(rightAddressColumns, display, rightAddressScroll(140))).toBe('address');
    expect(shouldShowRightFixedColumnShadow(rightAddressColumns, rightAddressScroll(140))).toBe(true);
  });

  it('scroll=0 无 border、无阴影', () => {
    expect(
      getRightFixedBorderBoundaryColKey(rightAddressColumns, rightAddressColumns, rightAddressScroll(0)),
    ).toBeUndefined();
    expect(shouldShowRightFixedColumnShadow(rightAddressColumns, rightAddressScroll(0))).toBe(false);
  });
});

describe('fixed-column-reorder demo：阴影与 border 解耦', () => {
  it('scroll=50 未重排：无 border，可有阴影', () => {
    expect(
      getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, siteRightDisconnectedColumns, siteScroll(50)),
    ).toBeUndefined();
    expect(shouldShowRightFixedColumnShadow(siteRightDisconnectedColumns, siteScroll(50))).toBe(true);
  });

  it('scroll=280 有 border 且有阴影', () => {
    const display = resolveColumnsForRightFixed(siteRightDisconnectedColumns, siteScroll(280));
    expect(getRightFixedBorderBoundaryColKey(siteRightDisconnectedColumns, display, siteScroll(280))).toBe('remark');
    expect(shouldShowRightFixedColumnShadow(siteRightDisconnectedColumns, siteScroll(280))).toBe(true);
  });
});
