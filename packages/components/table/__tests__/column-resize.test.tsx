import React from 'react';
import { createEvent, fireEvent, mockElementSizes, render, vi } from '@test/utils';

import { Table } from '..';

const columns = [
  { colKey: 'category', title: '普通列', width: 100 },
  {
    colKey: 'metrics',
    title: '分组表头',
    children: [
      { colKey: 'valueA', title: '子列 A', width: 100 },
      { colKey: 'valueB', title: '子列 B', width: 100 },
    ],
  },
];
const data = [{ id: 1, category: '示例 A', valueA: 10, valueB: 20 }];

function fireMouseEvent(
  target: Element | Document,
  type: 'mouseMove' | 'mouseDown' | 'mouseUp',
  x: number,
  buttons = 0,
) {
  const event = createEvent[type](target, {
    button: 0,
    buttons,
    clientX: x,
    clientY: 20,
  });
  // jsdom 的 MouseEvent 没有 pageX 和 x，补齐浏览器提供的拖动坐标。
  Object.defineProperties(event, { pageX: { value: x }, x: { value: x } });
  fireEvent(target, event);
}

describe('Table', () => {
  describe('scenarios', () => {
    describe('resizable', () => {
      let restoreSizes: () => void;

      beforeEach(() => {
        vi.useFakeTimers();
        restoreSizes = mockElementSizes([
          { selector: '.t-table', width: 300, height: 200 },
          { selector: '.t-table__content', width: 300, height: 200 },
          { selector: 'th[data-colkey="category"]', width: 100, height: 80 },
          {
            selector: 'th[data-colkey="metrics"]',
            width: 200,
            height: 40,
            left: 100,
          },
          {
            selector: 'th[data-colkey="valueA"]',
            width: 100,
            height: 40,
            left: 100,
            top: 40,
          },
          {
            selector: 'th[data-colkey="valueB"]',
            width: 100,
            height: 40,
            left: 200,
            top: 40,
          },
        ]);
      });

      afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
        restoreSizes();
      });

      it.each([true, false])('不应在相邻分组表头上启动拖动（mousemove: %s）', (shouldMoveOverGroup) => {
        const onColumnResizeChange = vi.fn();
        const { container } = render(
          <Table rowKey="id" columns={columns} data={data} resizable onColumnResizeChange={onColumnResizeChange} />,
        );
        const leaf = container.querySelector('th[data-colkey="category"]');
        const group = container.querySelector('th[data-colkey="metrics"]');
        const originalSelectStart = document.onselectstart;
        const originalDragStart = document.ondragstart;

        fireMouseEvent(leaf, 'mouseMove', 99);
        expect(leaf).toHaveStyle({ cursor: 'col-resize' });
        if (shouldMoveOverGroup) {
          fireMouseEvent(group, 'mouseMove', 101);
        }

        const addListener = vi.spyOn(document, 'addEventListener');
        try {
          fireMouseEvent(group, 'mouseDown', 101, 1);
          expect(addListener.mock.calls.filter(([type]) => type === 'mouseup' || type === 'mousemove')).toHaveLength(0);
          fireMouseEvent(document, 'mouseUp', 119);
          expect(onColumnResizeChange).not.toHaveBeenCalled();
          expect(document.onselectstart).toBe(originalSelectStart);
          expect(document.ondragstart).toBe(originalDragStart);
        } finally {
          // 修复前运行此用例时也清理已注册的拖动事件，避免影响其他用例。
          addListener.mock.calls.forEach(([type, listener, options]) => {
            if (type === 'mouseup' || type === 'mousemove') document.removeEventListener(type, listener, options);
          });
          addListener.mockRestore();
          document.onselectstart = originalSelectStart;
          document.ondragstart = originalDragStart;
        }
      });

      it('保留分组表头的自定义光标', () => {
        const { container } = render(
          <Table
            rowKey="id"
            columns={[columns[0], { ...columns[1], attrs: { style: { cursor: 'pointer' } } }]}
            data={data}
            resizable
          />,
        );
        const leaf = container.querySelector('th[data-colkey="category"]');
        const group = container.querySelector('th[data-colkey="metrics"]');
        expect(group).toHaveStyle({ cursor: 'pointer' });
        fireMouseEvent(leaf, 'mouseMove', 99);
        fireMouseEvent(group, 'mouseMove', 101);
        expect(group).toHaveStyle({ cursor: 'pointer' });
      });

      it.each([
        {
          name: '右边缘拖动',
          colKey: 'category',
          start: 99,
          end: 119,
          moveOverGroup: false,
          widths: { category: 120, metrics: 200, valueA: 80, valueB: 100 },
        },
        {
          name: '左边缘拖动',
          colKey: 'valueB',
          start: 201,
          end: 221,
          moveOverGroup: false,
          widths: { category: 100, metrics: 200, valueA: 120, valueB: 80 },
        },
        {
          name: '已开始拖动后跨过分组表头',
          colKey: 'category',
          start: 99,
          end: 119,
          moveOverGroup: true,
          widths: { category: 120, metrics: 200, valueA: 80, valueB: 100 },
        },
      ])('$name仍可正常调整列宽', ({ colKey, start, end, moveOverGroup, widths }) => {
        const onColumnResizeChange = vi.fn();
        const { container } = render(
          <Table rowKey="id" columns={columns} data={data} resizable onColumnResizeChange={onColumnResizeChange} />,
        );
        const leaf = container.querySelector(`th[data-colkey="${colKey}"]`);
        const group = container.querySelector('th[data-colkey="metrics"]');

        fireMouseEvent(leaf, 'mouseMove', start);
        fireMouseEvent(leaf, 'mouseDown', start, 1);
        fireMouseEvent(moveOverGroup ? group : document, 'mouseMove', end, 1);
        fireMouseEvent(document, 'mouseUp', end);

        expect(onColumnResizeChange).toHaveBeenCalledTimes(1);
        expect(onColumnResizeChange).toHaveBeenCalledWith({
          columnsWidth: widths,
        });
      });

      it('右侧固定列激活时仍可从左边缘调整自身宽度', () => {
        vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
        vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(400);
        const onColumnResizeChange = vi.fn();
        const { container } = render(
          <Table
            rowKey="id"
            columns={[
              columns[0],
              {
                ...columns[1],
                children: [columns[1].children[0], { ...columns[1].children[1], fixed: 'right' }],
              },
            ]}
            data={data}
            resizable
            onColumnResizeChange={onColumnResizeChange}
          />,
        );
        const fixed = container.querySelector('th[data-colkey="valueB"]');

        fireMouseEvent(fixed, 'mouseMove', 201);
        fireMouseEvent(fixed, 'mouseDown', 201, 1);
        fireMouseEvent(document, 'mouseMove', 181, 1);
        fireMouseEvent(document, 'mouseUp', 181);

        expect(onColumnResizeChange).toHaveBeenCalledTimes(1);
        expect(onColumnResizeChange).toHaveBeenCalledWith({
          columnsWidth: {
            category: 100,
            metrics: 200,
            valueA: 100,
            valueB: 120,
          },
        });
      });
    });
  });
});
