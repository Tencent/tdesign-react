import { describe, it, expect, render, vi, fireEvent, screen, act, waitFor } from '@test/utils';
import React from 'react';
import { Table, BaseTableRef, TableRowData, BaseTableCol } from '../index';

const prefix = 't';
const name = `.${prefix}-table`;

const data = [];
const total = 5;
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
    applicant: ['内容', '内容', '内容'][i % 3],
    status: ['内容', '内容', '内容'][i % 3],
    channel: ['内容', '内容', '内容'][i % 3],
    detail: {
      email: ['内容', '内容', '内容内容内容'][i % 3],
    },
  });
}

const columns: BaseTableCol<TableRowData>[] = [
  { colKey: 'serial-number', title: () => '序号', width: 60 },
  { colKey: 'applicant', title: <div>标题</div>, ellipsis: true, cell: 'type-slot-name', minWidth: 50 },
  {
    colKey: 'status',
    title: '标题',
    ellipsis: true,
  },
  {
    colKey: 'channel',
    title: '标题',
    cell: ({ col, row }) => row[col.colKey],
    ellipsis: true,
  },
  {
    colKey: 'detail.email',
    title: '标题',
    cell: () => '内容',
    ellipsis: true,
  },
];

describe('table', () => {
  describe(' props ', () => {
    it(': tableLayout', () => {
      const { container, rerender } = render(<Table rowKey="index" columns={columns} data={data} />);
      expect(container.querySelector(`${name}--layout-fixed`)).toBeTruthy();

      rerender(<Table rowKey="index" columns={columns} data={data} tableLayout="auto" />);
      expect(container.querySelector(`${name}--layout-auto`)).toBeTruthy();
    });

    it(': bordered', () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={data} bordered />);
      expect(container.querySelector(`${name}--bordered`)).toBeTruthy();
    });

    it(': stripe', () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={data} stripe bordered />);
      expect(container.querySelector(`${name}--striped`)).toBeTruthy();
    });

    it(': BaseTableCol colkey', () => {
      const columns = [{ title: '姓名' }];
      const data = [{ name: 'Tom' }];
      const { container } = render(<Table rowKey="index" columns={columns} data={data} />);
      const th = container.querySelector('th');
      expect(th.className).not.toContain('t-table__th-');
    });

    it(': BaseTableCol align', () => {
      columns[0].align = 'center';
      columns[1].align = 'right';
      const { container } = render(<Table style={{ width: '200px' }} rowKey="index" columns={columns} data={data} />);
      expect(container.querySelector('.t-align-center')).toBeTruthy();
      expect(container.querySelector('.t-align-right')).toBeTruthy();
    });

    it(': BaseTableCol fixed', async () => {
      const onScroll = vi.fn();
      columns[0].fixed = 'left';
      columns[3].fixed = 'right';
      const { container } = render(
        <Table style={{ width: '200px' }} rowKey="index" columns={columns} data={data} onScroll={onScroll} />,
      );

      await waitFor(() => {
        expect(container.querySelector(`${name}__cell--fixed-left`)).toBeTruthy();
        expect(container.querySelector(`${name}__cell--fixed-right`)).toBeTruthy();
      });

      const tableContent = container.querySelector(`${name}__content`);
      Object.defineProperty(tableContent, 'scrollWidth', { value: 500 });
      fireEvent.scroll(tableContent);

      await waitFor(() => {
        expect(container.querySelector(`${name}__content--scrollable-to-right`)).toBeTruthy();
      });

      fireEvent.scroll(tableContent, { target: { scrollLeft: 0 } });
      await waitFor(() => {
        expect(container.querySelector(`${name}__content--scrollable-to-left`)).toBeFalsy();
      });
    });

    it(': empty', () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={[]} empty="暂无数据" />);
      expect(container.querySelector(`${name}__empty`).textContent).toBe('暂无数据');
    });

    it(': cellEmptyContent', () => {
      const columns = [
        { colKey: 'id', title: 'ID' },
        { colKey: 'name', title: '姓名' },
        { colKey: 'age', title: '年龄' },
      ];
      const data = [
        { id: 1, name: '' },
        { id: 2, age: undefined },
      ];
      const { container, rerender } = render(
        <Table rowKey="index" columns={columns} data={data} cellEmptyContent="暂无数据" />,
      );
      const cellEmptyContent = screen.getAllByText('暂无数据');
      expect(cellEmptyContent).toHaveLength(4);

      rerender(
        <Table
          rowKey="index"
          columns={columns}
          data={data}
          cellEmptyContent={() => <div className="cell-empty-test">暂无数据</div>}
        />,
      );
      expect(container.querySelector('.cell-empty-test')).toBeTruthy();
    });

    it(': loading', () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={data} loading />);
      expect(container.querySelector(`${name}__loading--full`)).toBeTruthy();
    });

    it(': showHeader', () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={data} showHeader={false} />);
      expect(container.querySelector(`${name}__header`)).toBeNull();
    });

    it(': fixedRows', () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={data} fixedRows={[1, 2]} />);
      expect(container.querySelector(`${name}__row--fixed-top`)).toBeTruthy();
      expect(container.querySelector(`${name}__row--fixed-bottom`)).toBeTruthy();
      expect(container.querySelector(`${name}__row--fixed-bottom-first`)).toBeTruthy();
    });

    it(': height', () => {
      const { container, rerender } = render(<Table rowKey="index" columns={columns} data={data} height={200} />);
      expect(container.querySelector(`${name}__content`)).toHaveStyle('height: 200px;');
      expect(container.querySelector(`${name}__header--fixed`)).toBeTruthy();

      rerender(<Table rowKey="index" columns={columns} data={data} height="100%" />);
      expect(container.querySelector(`${name}__content`)).toHaveStyle('height: 100%');
    });

    it(': verticalAlign', () => {
      const verticalAligns = ['top', 'middle', 'bottom'] as const;
      verticalAligns.forEach((verticalAlign) => {
        const { container } = render(
          <Table rowKey="index" columns={columns} data={data} verticalAlign={verticalAlign} />,
        );
        expect(container.querySelector(`.t-vertical-align-${verticalAlign}`)).toBeTruthy();
      });
    });

    it(': rowAttributes', () => {
      const { container, rerender } = render(
        <Table rowKey="index" columns={columns} data={data} rowAttributes={{ draggable: 'true' }} />,
      );
      const row = container.querySelector('tbody tr');
      expect(row).toHaveAttribute('draggable', 'true');

      rerender(
        <Table
          rowKey="index"
          columns={columns}
          data={data}
          rowAttributes={[{ draggable: 'true' }, { title: '超出省略显示' }]}
        />,
      );
      expect(row).toHaveAttribute('draggable', 'true');
      expect(row).toHaveAttribute('title', '超出省略显示');

      rerender(<Table rowKey="index" columns={columns} data={data} rowAttributes={() => ({ draggable: 'true' })} />);
      expect(row).toHaveAttribute('draggable', 'true');
    });

    it(': rowClassName', () => {
      const { container, rerender } = render(
        <Table rowKey="index" columns={columns} data={data} rowClassName="row-test" />,
      );
      expect(container.querySelector('.row-test')).toHaveClass('row-test');

      rerender(<Table rowKey="index" columns={columns} data={data} rowClassName={{ 'row-test': true }} />);
      expect(container.querySelector('.row-test')).toHaveClass('row-test');

      rerender(<Table rowKey="index" columns={columns} data={data} rowClassName={() => 'row-test'} />);
      expect(container.querySelector('.row-test')).toHaveClass('row-test');
    });
  });

  describe('events', () => {
    const columns = [
      { colKey: 'id', title: 'ID', stopPropagation: true },
      { colKey: 'name', title: '姓名', stopPropagation: true },
      { colKey: 'age', title: '年龄', stopPropagation: true },
    ];
    const data = [
      { id: 1, name: '' },
      { id: 2, age: undefined },
    ];
    it(': onCellClick', () => {
      const onCellClick = vi.fn();
      const { container } = render(<Table rowKey="index" columns={columns} data={data} onCellClick={onCellClick} />);
      fireEvent.click(container.querySelector('td'));
      expect(onCellClick).toHaveBeenCalled();
    });

    it(': onRowClick', () => {
      const onRowClick = vi.fn();
      const { container } = render(<Table rowKey="index" columns={columns} data={data} onRowClick={onRowClick} />);
      fireEvent.click(container.querySelector('tbody tr'));
      expect(onRowClick).toHaveBeenCalled();
    });

    it(': onScroll', () => {
      const onScroll = vi.fn();
      const { container } = render(<Table rowKey="index" columns={columns} data={data} onScroll={onScroll} />);
      fireEvent.scroll(container.querySelector(`${name}__content`));
      expect(onScroll).toHaveBeenCalled();
    });

    it(': refreshTable', async () => {
      const ref = React.createRef<BaseTableRef>();
      render(<Table ref={ref} rowKey="index" columns={columns} data={data} />);
      expect(ref.current).toBeTruthy();

      await act(async () => {
        expect(() => ref.current?.refreshTable()).not.toThrow();
      });
    });

    it(': resize', async () => {
      const { container } = render(<Table rowKey="index" columns={columns} data={data} />);
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      await waitFor(async () => {
        expect(container.querySelector(`${name}`)).toBeTruthy();
      });
    });
  });
});
