import React from 'react';
import { render } from '@test/utils';
import { Table, BaseTable, PrimaryTable, EnhancedTable } from '..';

const data = new Array(5).fill(null).map((item, index) => ({
  id: index + 100,
  index: index + 100,
  instance: `JQTest${index + 1}`,
  status: index % 2,
  owner: 'jenny;peter',
  description: 'test',
}));

// 4 类表格组件同时测试
const TABLES = [Table, BaseTable, PrimaryTable, EnhancedTable];

TABLES.forEach((TTable) => {
  describe(TTable.name, () => {
    it('Props.columns.align', () => {
      const columns = [
        { title: 'Index', colKey: 'index', align: 'center' },
        { title: 'Instance', colKey: 'instance', align: 'left' },
        { title: 'description', colKey: 'description' },
        { title: 'Owner', colKey: 'owner', align: 'right' },
      ];
      const { container } = render(<TTable rowKey="index" data={data} columns={columns}></TTable>);
      const firstTrWrapper = container.querySelector('tbody > tr');
      const tdList = firstTrWrapper.querySelectorAll('td');
      expect(tdList[0].classList.contains('t-align-center')).toBeTruthy();
      expect(tdList[1].getAttribute('class')).toBe('');
      expect(tdList[2].getAttribute('class')).toBe('');
      expect(tdList[3].getAttribute('class')).toBe('t-align-right');
    });

    it('Props.columns.attrs', () => {
      const columns = [
        { title: 'Index', colKey: 'index' },
        { title: 'Instance', colKey: 'instance', attrs: { 'col-key': 'instance' } },
        { title: 'description', colKey: 'description' },
        { title: 'Owner', colKey: 'owner' },
      ];
      const { container } = render(<TTable rowKey="index" data={data} columns={columns}></TTable>);
      const firstTrWrapper = container.querySelector('tbody > tr');
      const tdList = firstTrWrapper.querySelectorAll('td');
      expect(tdList[1].getAttribute('col-key')).toBe('instance');
    });

    it('Props.columns.className works fine', () => {
      const columns = [
        { title: 'Index', colKey: 'index', className: () => ['tdesign-class'] },
        { title: 'Instance', colKey: 'instance', className: 'tdesign-class' },
        { title: 'description', colKey: 'description', className: [{ 'tdesign-class': true }] },
        { title: 'Owner', colKey: 'owner', className: { 'tdesign-class': true, 'tdesign-class1': false } },
      ];
      const { container } = render(<TTable rowKey="index" data={data} columns={columns}></TTable>);
      const firstTrWrapper = container.querySelector('tbody > tr');
      const tdList = firstTrWrapper.querySelectorAll('td');
      expect(tdList[0].getAttribute('class')).toBe('tdesign-class');
      expect(tdList[1].getAttribute('class')).toBe('tdesign-class');
      expect(tdList[2].getAttribute('class')).toBe('tdesign-class');
      expect(tdList[3].getAttribute('class')).toBe('tdesign-class');
      expect(tdList[3].classList.contains('tdesign-class1')).toBeFalsy();
    });
  });
});
