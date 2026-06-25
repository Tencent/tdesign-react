import React, { useMemo } from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, waitFor } from '@test/utils';

import BaseTable from '../BaseTable';

import type { BaseTableCol, TableRowData } from '../type';

/** 与 demo「右：固定 address」列配置一致 */
const rightAddressColumns: BaseTableCol[] = [
  { colKey: 'id', title: 'ID', width: 100 },
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'email', title: '邮箱', width: 180 },
  { colKey: 'dept', title: '部门', width: 120 },
  { colKey: 'city', title: '城市', width: 120 },
  { colKey: 'address', title: '地址', width: 220, fixed: 'right' },
  { colKey: 'remark', title: '备注', width: 160 },
  { colKey: 'operation', title: '操作', width: 100 },
];

const baseColumns: BaseTableCol[] = [
  { colKey: 'id', title: 'ID', width: 100 },
  { colKey: 'name', title: '姓名', width: 120 },
  { colKey: 'email', title: '邮箱', width: 180 },
  { colKey: 'dept', title: '部门', width: 120 },
  { colKey: 'city', title: '城市', width: 120 },
  { colKey: 'address', title: '地址', width: 220 },
  { colKey: 'remark', title: '备注', width: 160 },
  { colKey: 'operation', title: '操作', width: 100 },
];

const data: TableRowData[] = [
  {
    id: 1,
    name: '张三',
    email: 'a@x.com',
    dept: '研发',
    city: '深圳',
    address: '南山',
    remark: 'A',
  },
];

function applyRightAddressFixed(cols: BaseTableCol[]): BaseTableCol[] {
  return cols.map((col) => (col.colKey === 'address' ? { ...col, fixed: 'right' as const } : col));
}

function mockTableScroll(content: HTMLElement, scrollLeft: number) {
  Object.defineProperty(content, 'scrollLeft', {
    configurable: true,
    value: scrollLeft,
    writable: true,
  });
  Object.defineProperty(content, 'scrollWidth', {
    configurable: true,
    value: 1120,
    writable: true,
  });
  Object.defineProperty(content, 'clientWidth', {
    configurable: true,
    value: 720,
    writable: true,
  });
}

function getTableRoot(container: HTMLElement) {
  return container.querySelector('.t-table') as HTMLElement;
}

function getScrollContent(container: HTMLElement) {
  return container.querySelector('.t-table__content') as HTMLElement;
}

function getAddressTh(container: HTMLElement) {
  return container.querySelector('th[data-colkey="address"]');
}

async function flushFixedLayout() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

function DemoLikeTable({ fixedAddress }: { fixedAddress: boolean }) {
  const columns = useMemo(() => (fixedAddress ? applyRightAddressFixed(baseColumns) : baseColumns), [fixedAddress]);
  return <BaseTable bordered rowKey="id" data={data} columns={columns} maxHeight={320} style={{ width: 720 }} />;
}

describe('右固定 address 集成：border 与 shadow 同步', () => {
  it('scrollLeft=0：无 fixed-right-first、无 scrollable-to-right', async () => {
    const { container } = render(
      <BaseTable bordered rowKey="id" data={data} columns={rightAddressColumns} style={{ width: 720 }} />,
    );

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
    expect(getAddressTh(container)).not.toHaveClass('t-table__cell--fixed-right-first');
  });

  it('scrollLeft=140：address 有 fixed-right-first 且容器有 scrollable-to-right', async () => {
    const { container } = render(
      <BaseTable bordered rowKey="id" data={data} columns={rightAddressColumns} style={{ width: 720 }} />,
    );

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    mockTableScroll(content, 140);

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getAddressTh(container)).toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('从 scroll=140 回到 0：border 与 shadow 均应清除', async () => {
    const { container } = render(
      <BaseTable bordered rowKey="id" data={data} columns={rightAddressColumns} style={{ width: 720 }} />,
    );

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 140);

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    mockTableScroll(content, 0);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
      expect(getAddressTh(container)).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });
});

describe('右固定 address 模式切换（复现 demo Radio 切换）', () => {
  it('从「不固定」切到「右固定 address」后 scroll=0 不应提前加粗', async () => {
    const { container, rerender } = render(<DemoLikeTable fixedAddress={false} />);
    await flushFixedLayout();

    rerender(<DemoLikeTable fixedAddress={true} />);
    await flushFixedLayout();

    const tableRoot = getTableRoot(container);
    const content = getScrollContent(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
    expect(getAddressTh(container)).not.toHaveClass('t-table__cell--fixed-right-first');
  });

  it('模式切换后滚到 140 应出现 border 加粗', async () => {
    const { container, rerender } = render(<DemoLikeTable fixedAddress={false} />);
    await flushFixedLayout();

    rerender(<DemoLikeTable fixedAddress={true} />);
    await flushFixedLayout();

    const tableRoot = getTableRoot(container);
    const content = getScrollContent(container);
    mockTableScroll(content, 140);

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getAddressTh(container)).toHaveClass('t-table__cell--fixed-right-first');
    });
  });
});
