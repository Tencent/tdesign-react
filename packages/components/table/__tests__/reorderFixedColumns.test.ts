import { describe, expect, it } from 'vitest';

import {
  getLeftFixedBorderBoundaryColKey,
  getLeftFixedReorderTriggerEntries,
  getLeftFixedReorderTriggerScrollLeft,
  getTriggeredLeftFixedColKeys,
  hasLeftFixedColumnNeedReorder,
  isLeftFixedReorderTriggered,
  isSameDisplayColumns,
  reorderColumnsForLeftFixed,
  reorderColumnsForLeftFixedPartial,
  resolveColumnsForLeftFixed,
  resolveLeftFixedLayout,
  shouldShowLeftFixedColumnShadow,
} from '../utils/reorderFixedColumns';

import type { BaseTableCol } from '../type';

const disconnectedColumns: BaseTableCol[] = [
  { colKey: 'id', width: 100 },
  { colKey: 'name', width: 120, fixed: 'left' },
  { colKey: 'email', width: 180 },
  { colKey: 'dept', width: 120, fixed: 'left' },
];

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

  it('非首列 left fixed 时，未达贴左阈值不显示左阴影', () => {
    expect(shouldShowLeftFixedColumnShadow(columnsWithNameFixed, 50)).toBe(false);
    expect(shouldShowLeftFixedColumnShadow(columnsWithNameFixed, 99)).toBe(false);
  });

  it('达到贴左阈值后显示左阴影', () => {
    expect(shouldShowLeftFixedColumnShadow(columnsWithNameFixed, 100)).toBe(true);
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
