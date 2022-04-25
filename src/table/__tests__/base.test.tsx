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

const SIMPLE_COLUMNS = [
  { title: 'Index', colKey: 'index' },
  { title: 'Instance', colKey: 'instance' },
];

// 4 类表格组件同时测试
const TABLES = [Table, BaseTable, PrimaryTable, EnhancedTable];

// 每一种表格组件都需要单独测试，避免出现组件之间属性或事件透传不成功的情况
TABLES.forEach((TTable) => {
  describe(TTable.name, () => {
    // 测试边框
    describe(':props.bordered', () => {
      it('bordered default value is true', () => {
        const { container } = render(<TTable rowKey="index" bordered data={data} columns={SIMPLE_COLUMNS}></TTable>);
        expect(container.firstChild).toHaveClass('t-table--bordered');
      });
      it('bordered={true} works fine', () => {
        const { container } = render(
          <TTable rowKey="index" bordered={true} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        expect(container.firstChild).toHaveClass('t-table--bordered');
      });
      it('bordered={false} works fine', () => {
        const { container } = render(
          <TTable rowKey="index" bordered={false} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        expect(container.firstChild).toHaveClass('t-table');
      });
    });

    // 测试边框
    describe(':props.rowAttributes', () => {
      it('props.rowAttributes could be an object', () => {
        const { container } = render(
          <TTable
            rowKey="index"
            rowAttributes={{ 'data-level': 'level-1' }}
            data={data}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('data-level')).toBe('level-1');
      });

      it('props.rowAttributes could be an Array<object>', () => {
        const rowAttrs = [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }];

        const { container } = render(
          <TTable rowKey="index" rowAttributes={rowAttrs} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('data-level')).toBe('level-1');
        expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
      });

      it('props.rowAttributes could be a function', () => {
        const rowAttrs = () => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }];

        const { container } = render(
          <TTable rowKey="index" rowAttributes={rowAttrs} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('data-level')).toBe('level-1');
        expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
      });

      it('props.rowAttributes could be a Array<Function>', () => {
        const rowAttrs = [() => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]];

        const { container } = render(
          <TTable rowKey="index" rowAttributes={rowAttrs} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('data-level')).toBe('level-1');
        expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
      });
    });

    describe(':props.rowClassName', () => {
      it('props.rowClassName could be a string', () => {
        const rowClassName = 'tdesign-class';
        const { container } = render(
          <TTable rowKey="index" rowClassName={rowClassName} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('class')).toBe(rowClassName);
      });
      it('props.rowClassName could be an object ', () => {
        const rowClassName = {
          'tdesign-class': true,
          'tdesign-class-next': false,
        };
        const { container } = render(
          <TTable rowKey="index" rowClassName={rowClassName} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('class')).toBe('tdesign-class');
      });
      it('props.rowClassName could be an Array ', () => {
        const rowClassName = [
          'tdesign-class-default',
          {
            'tdesign-class': true,
            'tdesign-class-next': false,
          },
        ];
        const { container } = render(
          <TTable rowKey="index" rowClassName={rowClassName} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('class')).toBe('tdesign-class-default tdesign-class');
      });
      it('props.rowClassName could be a function ', () => {
        const rowClassName = () => ({
          'tdesign-class': true,
          'tdesign-class-next': false,
        });
        const { container } = render(
          <TTable rowKey="index" rowClassName={rowClassName} data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        const trWrapper = container.querySelector('tbody').querySelector('tr');
        expect(trWrapper.getAttribute('class')).toBe('tdesign-class');
      });
    });

    // // 测试空数据
    describe(':props.empty', () => {
      it('empty default value is 暂无数据', () => {
        const { container } = render(<TTable rowKey="index" data={[]} columns={SIMPLE_COLUMNS}></TTable>);
        expect(container.querySelector('.t-table__empty')).toBeTruthy();
        expect(container.querySelector('.t-table__empty').innerHTML).toBe('暂无数据');
      });
      it('props.empty=Empty Data', () => {
        const { container } = render(
          <TTable rowKey="index" data={[]} empty="Empty Data" columns={SIMPLE_COLUMNS}></TTable>,
        );
        expect(container.querySelector('.t-table__empty')).toBeTruthy();
        expect(container.querySelector('.t-table__empty').innerHTML).toBe('Empty Data');
      });
      it('props.empty works fine as a children', () => {
        const emptyText = 'Empty Data Rendered By children';
        const { container } = render(
          <TTable
            rowKey="index"
            data={[]}
            empty={<div className="render-function-class">{emptyText}</div>}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        expect(container.querySelector('.t-table__empty')).toBeTruthy();
        expect(container.querySelector('.render-function-class')).toBeTruthy();
        expect(container.querySelector('.render-function-class').innerHTML).toBe(emptyText);
      });
    });
    // 测试第一行通栏
    describe(':props.firstFullRow', () => {
      it('props.firstFullRow could be string', () => {
        const { container } = render(
          <TTable
            firstFullRow="This is a full row at first."
            rowKey="index"
            data={data}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        expect(container.querySelector('.t-table__row--full')).toBeTruthy();
      });
      it('props.firstFullRow works fine as a children', () => {
        const { container } = render(
          <TTable
            firstFullRow={<span>This is a full row at first.</span>}
            rowKey="index"
            data={data}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        expect(container.querySelector('.t-table__row--full')).toBeTruthy();
        expect(container.querySelector('.t-table__first-full-row')).toBeTruthy();
      });
    });

    // 测试最后一行通栏
    describe(':props.lastFullRow', () => {
      it('props.lastFullRow could be string', () => {
        const { container } = render(
          <TTable
            lastFullRow="This is a full row at last."
            rowKey="index"
            data={data}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        expect(container.querySelector('.t-table__row--full')).toBeTruthy();
      });
      it('props.lastFullRow works fine as a children', () => {
        const { container } = render(
          <TTable
            lastFullRow={<span>This is a full row at last.</span>}
            rowKey="index"
            data={data}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        expect(container.querySelector('.t-table__row--full')).toBeTruthy();
        expect(container.querySelector('.t-table__last-full-row')).toBeTruthy();
      });
    });

    describe(':props.loading', () => {
      it('props.loading = true works fine', () => {
        const { container } = render(
          <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} loading={true}></TTable>,
        );
        expect(container.querySelector('.t-loading')).toBeTruthy();
        expect(container.querySelector('.t-icon-loading')).toBeTruthy();
      });
      it('props.loading works fine as a function', () => {
        const { container } = render(
          <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} loading={'function loading'}></TTable>,
        );
        expect(container.querySelector('.t-loading')).toBeTruthy();
        expect(container.querySelector('.t-icon-loading')).toBeTruthy();
        expect(container.querySelector('.t-loading__text')).toBeTruthy();
        expect(container.querySelector('.t-loading__text').innerHTML).toBe('function loading');
      });
      it('props.loading hide loading icon with `loadingProps`', () => {
        const { container } = render(
          <TTable
            rowKey="index"
            data={data}
            columns={SIMPLE_COLUMNS}
            loading={'function loading'}
            loadingProps={{ indicator: false }}
          ></TTable>,
        );
        expect(container.querySelector('.t-loading')).toBeTruthy();
        expect(container.querySelector('.t-icon-loading')).toBeFalsy();
        expect(container.querySelector('.t-loading__text')).toBeTruthy();
        expect(container.querySelector('.t-loading__text').innerHTML).toBe('function loading');
      });
    });

    describe(':props.verticalAlign', () => {
      it('props.verticalAlign default value is middle, do not need t-vertical-align-middle', () => {
        const { container } = render(
          <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="middle"></TTable>,
        );
        // 垂直居中对齐不需要 t-vertical-align-middle
        expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table');
      });
      it('props.verticalAlign = bottom', () => {
        const { container } = render(
          <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="bottom"></TTable>,
        );
        expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table t-vertical-align-bottom');
      });
      it('props.verticalAlign = top', () => {
        const { container } = render(
          <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="top"></TTable>,
        );
        expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table t-vertical-align-top');
      });
      it('props.verticalAlign = middle, do not need t-vertical-align-middle', () => {
        const { container } = render(
          <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="middle"></TTable>,
        );
        // 垂直居中对齐不需要 t-vertical-align-middle
        expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table');
      });
    });

    describe(':props.topContent', () => {
      it('props.topContent could be a string', () => {
        const topContentText = 'This is top content';
        const { container } = render(
          <TTable topContent={topContentText} rowKey="index" data={data} columns={SIMPLE_COLUMNS}></TTable>,
        );
        expect(container.querySelector('.t-table__top-content')).toBeTruthy();
        expect(container.querySelector('.t-table__top-content').innerHTML).toBe(topContentText);
      });
      it('props.topContent could be a function', () => {
        const topContentText = 'This is top content';
        const { container } = render(
          <TTable
            topContent={<span>{topContentText}</span>}
            rowKey="index"
            data={data}
            columns={SIMPLE_COLUMNS}
          ></TTable>,
        );
        expect(container.querySelector('.t-table__top-content')).toBeTruthy();
        expect(container.querySelector('.t-table__top-content').innerHTML).toBe(`<span>${topContentText}</span>`);
      });
    });
  });
});
