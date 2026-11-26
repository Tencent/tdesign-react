import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import { Table } from '..';

const rect = (left: number, width: number): DOMRect => ({
  x: left,
  y: 0,
  left,
  top: 0,
  right: left + width,
  bottom: 40,
  width,
  height: 40,
  toJSON: () => ({}),
});

const mouse = (target: Element | Document, type: string, clientX: number) => {
  const event = new MouseEvent(type, { bubbles: true, button: 0, clientX });
  // JSDOM does not provide these coordinates on MouseEvent.
  Object.defineProperties(event, {
    pageX: { value: clientX },
    x: { value: clientX },
  });
  fireEvent(target, event);
};

describe('Table column resize boundaries', () => {
  let overflowing = false;

  beforeEach(() => {
    overflowing = false;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      const width = overflowing ? 250 : 200;
      if (this.tagName === 'TH') {
        return rect(this.dataset.colkey === 'last' ? width : 0, width);
      }
      return rect(0, 400);
    });
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(() => (overflowing ? 500 : 400));
  });

  afterEach(() => vi.restoreAllMocks());

  const resize = async (headerIndex: number, start: number) => {
    const onColumnResizeChange = vi.fn();
    const { container } = render(
      <Table
        rowKey="id"
        resizable
        data={[{ id: 1, first: 'First column', last: 'Last column' }]}
        columns={[
          { colKey: 'first', title: 'First', width: 200, ellipsis: true },
          { colKey: 'last', title: 'Last', width: 200, ellipsis: true },
        ]}
        onColumnResizeChange={onColumnResizeChange}
      />,
    );
    const header = container.querySelectorAll('th')[headerIndex];
    mouse(header, 'mousemove', start);
    mouse(header, 'mousedown', start);
    mouse(document, 'mousemove', start + 50);
    mouse(document, 'mouseup', start + 50);
    await mockDelay(20);
    return { container, onColumnResizeChange };
  };

  it.each([
    [0, 199],
    [1, 201],
  ])('keeps the total width when dragging the shared boundary from header %d', async (header, start) => {
    const { container, onColumnResizeChange } = await resize(header, start);
    expect(onColumnResizeChange).toHaveBeenCalledWith({
      columnsWidth: { first: 250, last: 150 },
    });
    expect(container.querySelector('th[data-colkey=first]')).toHaveStyle({
      width: '250px',
    });
    expect(container.querySelector('th[data-colkey=last]')).toHaveStyle({
      width: '150px',
    });
  });

  it('still grows the table when dragging the outer edge of the last column', async () => {
    const { onColumnResizeChange } = await resize(1, 399);
    expect(onColumnResizeChange).toHaveBeenCalledWith({
      columnsWidth: { first: 200, last: 250 },
    });
  });

  it('keeps the neighboring width when the table already overflows', async () => {
    overflowing = true;
    const { onColumnResizeChange } = await resize(1, 251);
    expect(onColumnResizeChange).toHaveBeenCalledWith({
      columnsWidth: { first: 300, last: 250 },
    });
  });
});
