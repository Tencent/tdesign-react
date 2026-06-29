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

function applyLeftNameFixed(cols: BaseTableCol[]): BaseTableCol[] {
  return cols.map((col) => (col.colKey === 'name' ? { ...col, fixed: 'left' as const } : col));
}

function applyLeftDisconnectedFixed(cols: BaseTableCol[]): BaseTableCol[] {
  return cols.map((col) => {
    if (col.colKey === 'name' || col.colKey === 'dept') {
      return { ...col, fixed: 'left' as const };
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

function getThColKeys(container: HTMLElement) {
  return Array.from(container.querySelectorAll('thead th[data-colkey]')).map((th) => th.getAttribute('data-colkey'));
}

async function flushFixedLayout() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

function DemoLikeTable({
  fixedTarget,
}: {
  fixedTarget: 'none' | 'leftName' | 'leftDisconnected' | 'rightAddress' | 'rightDisconnected';
}) {
  const columns = useMemo(() => {
    if (fixedTarget === 'leftName') return applyLeftNameFixed(baseColumns);
    if (fixedTarget === 'leftDisconnected') return applyLeftDisconnectedFixed(baseColumns);
    if (fixedTarget === 'rightAddress') return applyRightAddressFixed(baseColumns);
    if (fixedTarget === 'rightDisconnected') return applyRightDisconnectedFixed(baseColumns);
    return baseColumns;
  }, [fixedTarget]);
  return <BaseTable bordered rowKey="id" data={data} columns={columns} maxHeight={320} style={{ width: 720 }} />;
}

describe('左固定 name 集成：重排与 border', () => {
  it('scrollLeft=0：列序保持定义顺序，name 无 fixed-left-last', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="leftName" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    await waitFor(() => {
      expect(getThColKeys(container)).toEqual([
        'id',
        'name',
        'email',
        'dept',
        'address',
        'city',
        'remark',
        'operation',
      ]);
      expect(getTh(container, 'name')).not.toHaveClass('t-table__cell--fixed-left-last');
      expect(tableRoot).not.toHaveClass('t-table__content--scrollable-to-left');
    });
  });

  it('scrollLeft=100：name 前置且有 fixed-left-last，容器有 scrollable-to-left', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="leftName" />);

    const content = getScrollContent(container);
    const tableRoot = getTableRoot(container);
    mockTableScroll(content, 0);
    await flushFixedLayout();

    mockTableScroll(content, 100);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(getThColKeys(container)[0]).toBe('name');
      expect(getTh(container, 'name')).toHaveClass('t-table__cell--fixed-left-last');
      expect(tableRoot).toHaveClass('t-table__content--scrollable-to-left');
    });
  });

  it('scrollLeft=100 后回到 0：列序与 border 恢复', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="leftName" />);

    const content = getScrollContent(container);
    mockTableScroll(content, 100);
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
      expect(getThColKeys(container)[0]).toBe('id');
      expect(getTh(container, 'name')).not.toHaveClass('t-table__cell--fixed-left-last');
    });
  });
});

describe('左固定不相连 集成：border 交接', () => {
  it('scrollLeft=100：border 在 name', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="leftDisconnected" />);

    const content = getScrollContent(container);
    mockTableScroll(content, 100);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(getTh(container, 'name')).toHaveClass('t-table__cell--fixed-left-last');
      expect(getTh(container, 'dept')).not.toHaveClass('t-table__cell--fixed-left-last');
    });
  });

  it('scrollLeft=300：border 交接至 dept', async () => {
    const { container } = render(<DemoLikeTable fixedTarget="leftDisconnected" />);

    const content = getScrollContent(container);
    mockTableScroll(content, 300);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(getTh(container, 'dept')).toHaveClass('t-table__cell--fixed-left-last');
      expect(getTh(container, 'name')).not.toHaveClass('t-table__cell--fixed-left-last');
    });
  });
});

describe('左固定模式切换（复现 demo Radio 切换）', () => {
  it('从 none 切到 leftName 后 scroll=100 应触发重排', async () => {
    const { container, rerender } = render(<DemoLikeTable fixedTarget="none" />);
    await flushFixedLayout();

    rerender(<DemoLikeTable fixedTarget="leftName" />);
    await flushFixedLayout();

    const content = getScrollContent(container);
    mockTableScroll(content, 100);
    await act(() => {
      fireEvent.scroll(content, { target: content });
    });
    await flushFixedLayout();

    await waitFor(() => {
      expect(getThColKeys(container)[0]).toBe('name');
      expect(getTh(container, 'name')).toHaveClass('t-table__cell--fixed-left-last');
    });
  });
});

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
