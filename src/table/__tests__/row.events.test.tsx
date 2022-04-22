import React from 'react';
import { render, fireEvent } from '@test/utils';
import { Table, BaseTable, PrimaryTable, EnhancedTable } from '..';

const data = new Array(5).fill(null).map((item, index) => ({
  id: index + 100,
  index: index + 100,
  instance: `JQTest${index + 1}`,
  status: index % 2,
  owner: 'jenny;peter',
  description: 'test',
}));

const SIMPLE_COLUMNS = [
  { title: 'Index', colKey: 'index' },
  { title: 'Instance', colKey: 'instance' },
];

// 4 类表格组件同时测试
const TABLES = [Table, BaseTable, PrimaryTable, EnhancedTable];

TABLES.forEach((TTable) => {
  describe(TTable.name, () => {
    it('Events.onCellClick', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onCellClick={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.click(container.querySelector('td'));
      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowClick', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowClick={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.click(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowDblclick', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowDblclick={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.doubleClick(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowMouseup', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowMouseup={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.mouseUp(container.querySelector('tbody').querySelector('tr'));

      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowMousedown', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowMousedown={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.mouseDown(container.querySelector('tbody').querySelector('tr'));

      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowMouseenter', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowMouseenter={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.mouseEnter(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowMouseleave', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowMouseleave={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.mouseLeave(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('Events.onRowMouseover', async () => {
      const fn = jest.fn();
      const { container } = render(
        <TTable rowKey="index" bordered data={data} onRowMouseover={fn} columns={SIMPLE_COLUMNS}></TTable>,
      );
      fireEvent.mouseOver(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });
  });
});
