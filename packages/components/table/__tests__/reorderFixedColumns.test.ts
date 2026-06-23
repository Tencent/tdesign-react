import { describe, expect, it } from 'vitest';

import { hasLeftFixedColumnNeedReorder, reorderColumnsForLeftFixed } from '../utils/reorderFixedColumns';

import type { BaseTableCol } from '../type';

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
