import { describe, expect, it } from 'vitest';

import {
  getLeftFixedBorderBoundaryColKey,
  getLeftFixedReorderTriggerEntries,
  getLeftFixedReorderTriggerScrollLeft,
  getRightFixedBorderBoundaryColKey,
  getRightFixedReorderTriggerEntries,
  getTriggeredLeftFixedColKeys,
  getTriggeredRightFixedColKeys,
  hasLeftFixedColumnNeedReorder,
  hasRightFixedColumnNeedReorder,
  isLeftFixedReorderTriggered,
  isSameDisplayColumns,
  reorderColumnsForLeftFixed,
  reorderColumnsForLeftFixedPartial,
  reorderColumnsForRightFixed,
  reorderColumnsForRightFixedPartial,
  resolveColumnsForLeftFixed,
  resolveColumnsForRightFixed,
  resolveFixedColumnLayout,
  resolveLeftFixedLayout,
  shouldShowLeftFixedColumnShadow,
  shouldShowRightFixedColumnShadow,
} from '../utils/reorderFixedColumns';

import type { BaseTableCol } from '../type';

const disconnectedColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'name', width: 120, fixed: 'left' },
  { colKey: 'email', width: 180 },
  { colKey: 'dept', width: 120, fixed: 'left' },
];

const rightDisconnectedColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'email', width: 180 },
  { colKey: 'remark', width: 120, fixed: 'right' },
  { colKey: 'city', width: 120 },
  { colKey: 'operation', width: 100, fixed: 'right' },
];

const RIGHT_MAX_SCROLL_LEFT = 300;

const rightScroll = (scrollLeft: number) => ({
  scrollLeft,
  maxScrollLeft: RIGHT_MAX_SCROLL_LEFT,
});

describe('reorderColumnsForLeftFixed', () => {
  it('非首列左固定时，将 fixed 列移到功能列之后的最左侧', () => {
    const columns: BaseTableCol[] = [
      { colKey: 'id', title: 'ID', width: 80 },
      { colKey: 'name', title: '姓名', width: 120, fixed: 'left' },
      { colKey: 'email', title: '邮箱', width: 200 },
    ];
    const result = reorderColumnsForLeftFixed(columns);
    expect(result.map((col) => col.colKey)).toEqual(['name', 'id', 'email']);
  });

  it('保留展开列在最前，name 紧随其后左固定', () => {
    const columns: BaseTableCol[] = [
      { colKey: '__EXPAND_ROW_ICON_COLUMN__', width: 46, fixed: 'left' },
      { colKey: 'id', title: 'ID', width: 80 },
      { colKey: 'name', title: '姓名', width: 120, fixed: 'left' },
    ];
    const result = reorderColumnsForLeftFixed(columns);
    expect(result.map((col) => col.colKey)).toEqual(['__EXPAND_ROW_ICON_COLUMN__', 'name', 'id']);
  });

  it('多个非连续 left fixed 全量前置', () => {
    const result = reorderColumnsForLeftFixed(disconnectedColumns);
    expect(result.map((col) => col.colKey)).toEqual(['name', 'dept', 'id', 'email']);
  });

  it('从左连续固定的列顺序不变', () => {
    const columns: BaseTableCol[] = [{ colKey: 'a', fixed: 'left' }, { colKey: 'b', fixed: 'left' }, { colKey: 'c' }];
    expect(reorderColumnsForLeftFixed(columns)).toBe(columns);
  });

  it('无左固定列时不重排', () => {
    const columns: BaseTableCol[] = [{ colKey: 'id' }, { colKey: 'name' }];
    expect(reorderColumnsForLeftFixed(columns)).toBe(columns);
  });

  it('hasLeftFixedColumnNeedReorder 识别非首列左固定', () => {
    expect(hasLeftFixedColumnNeedReorder([{ colKey: 'id' }, { colKey: 'name', fixed: 'left' }])).toBe(true);
    expect(hasLeftFixedColumnNeedReorder([{ colKey: 'name', fixed: 'left' }, { colKey: 'id' }])).toBe(false);
  });
});

describe('reorderColumnsForLeftFixedPartial', () => {
  it('仅 name 触发时只前置 name，dept 仍留在原位置', () => {
    const result = reorderColumnsForLeftFixedPartial(disconnectedColumns, new Set(['name']));
    expect(result.map((col) => col.colKey)).toEqual(['name', 'id', 'email', 'dept']);
  });

  it('name 与 dept 均触发时按定义顺序一并前置', () => {
    const result = reorderColumnsForLeftFixedPartial(disconnectedColumns, new Set(['name', 'dept']));
    expect(result.map((col) => col.colKey)).toEqual(['name', 'dept', 'id', 'email']);
  });
});

describe('getLeftFixedReorderTriggerEntries', () => {
  it('不相连多列为每列独立计算贴左阈值', () => {
    expect(getLeftFixedReorderTriggerEntries(disconnectedColumns)).toEqual([
      { colKey: 'name', threshold: 100 },
      { colKey: 'dept', threshold: 400 },
    ]);
  });
});

describe('isLeftFixedReorderTriggered', () => {
  const columnsWithNameFixed: BaseTableCol[] = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'name', title: '姓名', width: 120, fixed: 'left' },
    { colKey: 'email', title: '邮箱', width: 200 },
  ];

  it('计算首个 left fixed 贴左前的 scrollLeft 阈值', () => {
    expect(getLeftFixedReorderTriggerScrollLeft(columnsWithNameFixed)).toBe(100);
    expect(getLeftFixedReorderTriggerScrollLeft(columnsWithNameFixed, { id: 90 })).toBe(90);
  });

  it('scrollLeft 未达阈值时不触发', () => {
    expect(isLeftFixedReorderTriggered(columnsWithNameFixed, 50)).toBe(false);
    expect(resolveColumnsForLeftFixed(columnsWithNameFixed, 50)).toBe(columnsWithNameFixed);
  });

  it('scrollLeft 达到阈值时触发', () => {
    expect(isLeftFixedReorderTriggered(columnsWithNameFixed, 100)).toBe(true);
    expect(resolveColumnsForLeftFixed(columnsWithNameFixed, 100).map((col) => col.colKey)).toEqual([
      'name',
      'id',
      'email',
    ]);
  });

  it('不相连多列：name 与 dept 分阶段触发', () => {
    expect(getTriggeredLeftFixedColKeys(disconnectedColumns, 150)).toEqual(['name']);
    expect(resolveColumnsForLeftFixed(disconnectedColumns, 150).map((col) => col.colKey)).toEqual([
      'name',
      'id',
      'email',
      'dept',
    ]);

    expect(getTriggeredLeftFixedColKeys(disconnectedColumns, 400)).toEqual(['name', 'dept']);
    expect(resolveColumnsForLeftFixed(disconnectedColumns, 400).map((col) => col.colKey)).toEqual([
      'name',
      'dept',
      'id',
      'email',
    ]);
  });

  it('滚回 dept 阈值以下时 dept 还原、name 仍保持前置', () => {
    expect(getTriggeredLeftFixedColKeys(disconnectedColumns, 350)).toEqual(['name']);
    expect(resolveColumnsForLeftFixed(disconnectedColumns, 350).map((col) => col.colKey)).toEqual([
      'name',
      'id',
      'email',
      'dept',
    ]);
  });

  it('无 left fixed 时即使滚动也不触发', () => {
    const columns: BaseTableCol[] = [{ colKey: 'id' }, { colKey: 'name' }];
    expect(isLeftFixedReorderTriggered(columns, 200)).toBe(false);
  });
});

describe('shouldShowLeftFixedColumnShadow', () => {
  const columnsWithNameFixed: BaseTableCol[] = [
    { colKey: 'id', title: 'ID', width: 100 },
    { colKey: 'name', title: '姓名', width: 120, fixed: 'left' },
    { colKey: 'email', title: '邮箱', width: 200 },
  ];

  it('非首列 left fixed 时，scrollLeft > 0 即显示左阴影', () => {
    expect(shouldShowLeftFixedColumnShadow(columnsWithNameFixed, 50)).toBe(true);
    expect(shouldShowLeftFixedColumnShadow(columnsWithNameFixed, 99)).toBe(true);
  });

  it('scrollLeft 为 0 时不显示左阴影', () => {
    expect(shouldShowLeftFixedColumnShadow(columnsWithNameFixed, 0)).toBe(false);
  });

  it('普通连续 left fixed 仍按 scrollLeft > 0 显示左阴影', () => {
    const columns: BaseTableCol[] = [{ colKey: 'name', fixed: 'left' }, { colKey: 'id' }];
    expect(shouldShowLeftFixedColumnShadow(columns, 1)).toBe(true);
  });
});

describe('getLeftFixedBorderBoundaryColKey', () => {
  it('name 重排后、dept sticky 未激活时 border 只在 name', () => {
    const display = resolveColumnsForLeftFixed(disconnectedColumns, 150);
    expect(getLeftFixedBorderBoundaryColKey(disconnectedColumns, display, 150)).toBe('name');
  });

  it('dept sticky 激活后（280px）即显示 border，不必等到重排阈值 400px', () => {
    const display = resolveColumnsForLeftFixed(disconnectedColumns, 300);
    expect(getLeftFixedBorderBoundaryColKey(disconnectedColumns, display, 300)).toBe('dept');
    expect(getTriggeredLeftFixedColKeys(disconnectedColumns, 300)).toEqual(['name']);
  });

  it('dept 重排后 border 仍在 dept', () => {
    const display = resolveColumnsForLeftFixed(disconnectedColumns, 400);
    expect(getLeftFixedBorderBoundaryColKey(disconnectedColumns, display, 400)).toBe('dept');
  });

  it('未进入重排阶段时返回 undefined，沿用默认 border 逻辑', () => {
    expect(getLeftFixedBorderBoundaryColKey(disconnectedColumns, disconnectedColumns, 50)).toBeUndefined();
  });
});

describe('resolveLeftFixedLayout', () => {
  it('统一返回列序、border、阴影与签名', () => {
    const layout = resolveLeftFixedLayout(disconnectedColumns, 300);
    expect(layout.enabled).toBe(true);
    expect(layout.reorderTriggeredKeys).toEqual(['name']);
    expect(layout.displayColumns.map((col) => col.colKey)).toEqual(['name', 'id', 'email', 'dept']);
    expect(layout.borderBoundaryColKey).toBe('dept');
    expect(layout.showLeftShadow).toBe(true);
    expect(layout.reorderSignature).toBe('name');
    expect(layout.layoutSignature).toBe('dept|name');
  });

  it('无内置行为时 enabled 为 false', () => {
    const columns: BaseTableCol[] = [{ colKey: 'name', fixed: 'left' }, { colKey: 'id' }];
    const layout = resolveLeftFixedLayout(columns, 10);
    expect(layout.enabled).toBe(false);
    expect(layout.showLeftShadow).toBe(true);
  });
});

describe('isSameDisplayColumns', () => {
  it('列序相同但 fixed 配置变化时判定为不同', () => {
    const prev: BaseTableCol[] = [
      { colKey: 'id', width: 100 },
      { colKey: 'name', width: 120, fixed: 'left' },
    ];
    const next: BaseTableCol[] = [
      { colKey: 'id', width: 100 },
      { colKey: 'name', width: 120 },
    ];
    expect(isSameDisplayColumns(prev, next)).toBe(false);
  });
});

describe('reorderColumnsForRightFixed', () => {
  it('非末列右固定时，将 fixed 列移到可滚动区之后的最右侧', () => {
    const columns: BaseTableCol[] = [
      { colKey: 'id', width: 80 },
      { colKey: 'email', width: 200 },
      { colKey: 'remark', width: 120, fixed: 'right' },
    ];
    expect(reorderColumnsForRightFixed(columns).map((col) => col.colKey)).toEqual(['id', 'email', 'remark']);
  });

  it('从右连续固定的列顺序不变', () => {
    const columns: BaseTableCol[] = [{ colKey: 'a' }, { colKey: 'b', fixed: 'right' }, { colKey: 'c', fixed: 'right' }];
    expect(reorderColumnsForRightFixed(columns)).toBe(columns);
  });

  it('hasRightFixedColumnNeedReorder 识别非末列右固定', () => {
    expect(
      hasRightFixedColumnNeedReorder([
        { colKey: 'id' },
        { colKey: 'remark', fixed: 'right' },
        { colKey: 'email' },
        { colKey: 'op', fixed: 'right' },
      ]),
    ).toBe(true);
    expect(hasRightFixedColumnNeedReorder([{ colKey: 'id' }, { colKey: 'op', fixed: 'right' }])).toBe(false);
    expect(
      hasRightFixedColumnNeedReorder([
        { colKey: 'b', fixed: 'right' },
        { colKey: 'c', fixed: 'right' },
      ]),
    ).toBe(false);
  });
});

describe('reorderColumnsForRightFixedPartial', () => {
  it('仅 remark 触发时只后置 remark，operation 仍留在最末', () => {
    expect(
      reorderColumnsForRightFixedPartial(rightDisconnectedColumns, new Set(['remark'])).map((col) => col.colKey),
    ).toEqual(['id', 'email', 'city', 'remark', 'operation']);
  });

  it('remark 与 operation 均触发时按定义顺序一并后置', () => {
    expect(
      reorderColumnsForRightFixedPartial(rightDisconnectedColumns, new Set(['remark', 'operation'])).map(
        (col) => col.colKey,
      ),
    ).toEqual(['id', 'email', 'city', 'remark', 'operation']);
  });
});

describe('getRightFixedReorderTriggerEntries', () => {
  it('不相连多列为每列独立计算贴右阈值', () => {
    expect(getRightFixedReorderTriggerEntries(rightDisconnectedColumns)).toEqual([
      { colKey: 'remark', threshold: 0, widthAfter: 220 },
    ]);
  });
});

describe('resolveColumnsForRightFixed', () => {
  it('scrollLeft 未达阈值时不重排', () => {
    expect(resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(50))).toBe(rightDisconnectedColumns);
  });

  it('scrollLeft 达到阈值时 remark 后置', () => {
    expect(resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(80)).map((col) => col.colKey)).toEqual([
      'id',
      'email',
      'city',
      'remark',
      'operation',
    ]);
  });

  it('滚回阈值以下时 remark 还原', () => {
    expect(resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(70)).map((col) => col.colKey)).toEqual([
      'id',
      'email',
      'remark',
      'city',
      'operation',
    ]);
  });
});

describe('getRightFixedBorderBoundaryColKey', () => {
  it('remark 重排后 border 在 remark', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(200));
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedColumns, display, rightScroll(200))).toBe('remark');
  });

  it('remark 达重排阈值即显示 border（镜像左 name@150）', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(90));
    expect(getTriggeredRightFixedColKeys(rightDisconnectedColumns, rightScroll(90))).toEqual(['remark']);
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedColumns, display, rightScroll(90))).toBe('remark');
  });

  it('remark 重排后 border 仍在 remark', () => {
    const display = resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(150));
    expect(getRightFixedBorderBoundaryColKey(rightDisconnectedColumns, display, rightScroll(150))).toBe('remark');
  });

  it('未进入重排阶段时返回 undefined，内置重排时不回落默认 border', () => {
    expect(
      getRightFixedBorderBoundaryColKey(rightDisconnectedColumns, rightDisconnectedColumns, rightScroll(50)),
    ).toBeUndefined();
  });
});

describe('fixed border 左 sticky / 右重排', () => {
  it('未重排 scroll=50：两侧均无 border', () => {
    expect(getLeftFixedBorderBoundaryColKey(disconnectedColumns, disconnectedColumns, 50)).toBeUndefined();
    expect(
      getRightFixedBorderBoundaryColKey(rightDisconnectedColumns, rightDisconnectedColumns, rightScroll(50)),
    ).toBeUndefined();
  });

  it('首列重排 scroll=150：左 name sticky；右 remark 重排', () => {
    expect(
      getLeftFixedBorderBoundaryColKey(disconnectedColumns, resolveColumnsForLeftFixed(disconnectedColumns, 150), 150),
    ).toBe('name');
    expect(
      getRightFixedBorderBoundaryColKey(
        rightDisconnectedColumns,
        resolveColumnsForRightFixed(rightDisconnectedColumns, rightScroll(150)),
        rightScroll(150),
      ),
    ).toBe('remark');
  });
});

describe('shouldShowRightFixedColumnShadow', () => {
  const columnsWithRemarkFixed: BaseTableCol[] = [
    { colKey: 'id', width: 100 },
    { colKey: 'email', width: 180 },
    { colKey: 'remark', width: 120, fixed: 'right' },
    { colKey: 'city', width: 120 },
    { colKey: 'operation', width: 100, fixed: 'right' },
  ];

  it('未达重排阈值时 scrollLeft > 0 仍可显示右阴影', () => {
    expect(shouldShowRightFixedColumnShadow(columnsWithRemarkFixed, rightScroll(50))).toBe(true);
  });

  it('scrollLeft 为 0 时不显示右阴影', () => {
    expect(shouldShowRightFixedColumnShadow(columnsWithRemarkFixed, rightScroll(0))).toBe(false);
  });

  it('达重排阈值时 border 在 remark，阴影由横滚决定', () => {
    const display = resolveColumnsForRightFixed(columnsWithRemarkFixed, rightScroll(90));
    expect(getRightFixedBorderBoundaryColKey(columnsWithRemarkFixed, display, rightScroll(90))).toBe('remark');
    expect(shouldShowRightFixedColumnShadow(columnsWithRemarkFixed, rightScroll(90))).toBe(true);
    expect(shouldShowRightFixedColumnShadow(columnsWithRemarkFixed, rightScroll(70))).toBe(true);
  });
});

describe('resolveFixedColumnLayout', () => {
  it('左右同时存在时统一解析列序与签名', () => {
    const columns: BaseTableCol[] = [
      { colKey: 'id', width: 100 },
      { colKey: 'name', width: 120, fixed: 'left' },
      { colKey: 'email', width: 180 },
      { colKey: 'remark', width: 120, fixed: 'right' },
      { colKey: 'city', width: 120 },
      { colKey: 'operation', width: 100, fixed: 'right' },
    ];
    const layout = resolveFixedColumnLayout(columns, {
      scrollLeft: 100,
      maxScrollLeft: 400,
    });
    expect(layout.left.reorderTriggeredKeys).toEqual(['name']);
    expect(layout.displayColumns.map((col) => col.colKey)).toEqual([
      'name',
      'id',
      'email',
      'remark',
      'city',
      'operation',
    ]);
  });
});
