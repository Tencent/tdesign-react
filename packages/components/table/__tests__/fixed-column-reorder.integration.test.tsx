import React, { useMemo } from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, waitFor } from '@test/utils';

import BaseTable from '../BaseTable';

import type { BaseTableCol, TableRowData } from '../type';

/** 与 demo 统一的 8 列定义顺序 */
const baseColumns: BaseTableCol[] = [
  { colKey: 'id', title: 'ID', width: 100 },
  { colKey: 'name', title: 'Name', width: 120 },
  { colKey: 'email', title: 'Email', width: 180 },
  { colKey: 'dept', title: 'Dept', width: 120 },
  { colKey: 'address', title: 'Address', width: 220 },
  { colKey: 'city', title: 'City', width: 120 },
  { colKey: 'remark', title: 'Remark', width: 160 },
  { colKey: 'operation', title: 'Operation', width: 100 },
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

function applyRightDisconnectedFixed(cols: BaseTableCol[]): BaseTableCol[] {
  return cols.map((col) => {
    if (col.colKey === 'address' || col.colKey === 'remark') {
      return { ...col, fixed: 'right' as const };
    }
    return col;
  });
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

function getTh(container: HTMLElement, colKey: string) {
  return container.querySelector(`th[data-colkey="${colKey}"]`);
}

async function flushFixedLayout() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

function DemoLikeTable({ fixedTarget }: { fixedTarget: 'none' | 'rightAddress' | 'rightDisconnected' }) {
  const columns = useMemo(() => {
    if (fixedTarget === 'rightAddress') return applyRightAddressFixed(baseColumns);
    if (fixedTarget === 'rightDisconnected') return applyRightDisconnectedFixed(baseColumns);
    return baseColumns;
  }, [fixedTarget]);
  return <BaseTable bordered rowKey="id" data={data} columns={columns} maxHeight={320} style={{ width: 720 }} />;
}

describe('右固定 address 集成：border 与 shadow 同步', () => {
  it('scrollLeft=0：address 有 fixed-right-first 且容器有 scrollable-to-right', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightAddress" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('scrollLeft=20：address 脱离右边界，无 fixed-right-first、无 scrollable-to-right', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightAddress" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    mockTableScroll(content, 20);

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('scrollLeft=20 后回到 0：border 与 shadow 恢复', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightAddress" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 20);
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
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('滚到最右端：border 与 shadow 均应清除', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightAddress" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 20);

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    mockTableScroll(content, 400);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });
});

describe('右不相连 address+remark 集成：border 与重排', () => {
  it('scrollLeft=50 address 已重排、remark 贴边：border 在 remark', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightDisconnected" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 50);
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'remark')).toHaveClass('t-table__cell--fixed-right-first');
      expect(getTh(container, 'address')).not.toHaveClass('t-table__cell--fixed-right');
    });
  });

  it('scrollLeft=0 address 有 border（address+remark 两列右 fixed）', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightDisconnected" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).toHaveClass('t-table__cell--fixed-right-first');
      expect(getTh(container, 'remark')).toHaveClass('t-table__cell--fixed-right');
    });
  });

  it('scrollLeft=250：remark 有 border', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightDisconnected" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    mockTableScroll(content, 250);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'remark')).toHaveClass('t-table__cell--fixed-right-first');
      expect(getTh(container, 'address')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('scrollLeft=300 remark 达阈值：border 清除', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightDisconnected" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 250);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    mockTableScroll(content, 300);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'remark')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('scrollLeft=20 address 重排后 border 交接至 remark', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightDisconnected" />);

    const content = getScrollContent(container);
    mockTableScroll(content, 10);
    await flushFixedLayout();

    mockTableScroll(content, 20);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(getTh(container, 'remark')).toHaveClass('t-table__cell--fixed-right-first');
      expect(getTh(container, 'address')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('scrollLeft=300 后回到 0：border 回到 address', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="rightDisconnected" />);

    const content = getScrollContent(container);
    mockTableScroll(content, 300);
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
      expect(getTh(container, 'address')).toHaveClass('t-table__cell--fixed-right-first');
      expect(getTh(container, 'remark')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });
});

describe('右固定 address 模式切换（复现 demo Radio 切换）', () => {
  it('从「不固定」切到「右固定 address」后 scroll=0 应显示 border 加粗', async () => {
    const { container, rerender } = render(<DemoLikeTable fixedTarget="none" />);
    await flushFixedLayout();

    rerender(<DemoLikeTable fixedTarget="rightAddress" />);
    await flushFixedLayout();

    const tableRoot = getTableRoot(container);
    const content = getScrollContent(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).toHaveClass('t-table__cell--fixed-right-first');
    });
  });

  it('模式切换后滚到 20 应清除 border 加粗', async () => {
    const { container, rerender } = render(<DemoLikeTable fixedTarget="none" />);
    await flushFixedLayout();

    rerender(<DemoLikeTable fixedTarget="rightAddress" />);
    await flushFixedLayout();

    const tableRoot = getTableRoot(container);
    const content = getScrollContent(container);
    mockTableScroll(content, 20);

    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-right');
      expect(getTh(container, 'address')).not.toHaveClass('t-table__cell--fixed-right-first');
    });
  });
});
