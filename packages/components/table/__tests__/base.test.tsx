import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { BaseTable, EnhancedTable, PrimaryTable, Table } from '..';
import { getEmptyDataTableMount, getNormalTableMount } from './mount';

import type { TdBaseTableProps } from '../type';

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

describe('Table', () => {
  // 每一种表格组件都需要单独测试，避免出现组件之间属性或事件透传不成功的情况
  TABLES.forEach((TTable) => {
    describe(TTable.name, () => {
      describe('props', () => {
        // 测试边框
        describe(':props.bordered', () => {
          it('bordered default value is true', () => {
            const { container } = render(
              <TTable rowKey="index" bordered data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
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
              <TTable rowKey="index" rowAttributes={rowAttrs as any} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            const trWrapper = container.querySelector('tbody').querySelector('tr');
            expect(trWrapper.getAttribute('data-level')).toBe('level-1');
            expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
          });

          it('props.rowAttributes could be a Array<Function>', () => {
            const rowAttrs = [() => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]];

            const { container } = render(
              <TTable rowKey="index" rowAttributes={rowAttrs as any} data={data} columns={SIMPLE_COLUMNS}></TTable>,
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

      describe('events', () => {
        // onPageChange
        it('props.pagination: onPageChange should be triggered when switching pages', async () => {
          const onPageChange = vi.fn();
          const pagination = {
            current: 1,
            pageSize: 2,
            total: 10,
          };

          // create a small data set for pagination assertions
          const pageData = new Array(6).fill(null).map((_, idx) => {
            const i = idx + 1;
            let applicant = `name-${i}`;
            if (i === 3) applicant = '王芳';
            else if (i === 4) applicant = '贾明';
            return { index: i, applicant };
          });

          const COLUMNS = [
            { title: 'Index', colKey: 'index' },
            { title: 'Applicant', colKey: 'applicant' },
          ];

          const { container } = render(
            <TTable
              rowKey="index"
              data={pageData}
              columns={COLUMNS}
              pagination={pagination}
              onPageChange={onPageChange}
            />,
          );

          expect(container.querySelector('.t-pagination')).toBeTruthy();
          const nextButton = container.querySelector('.t-pagination__btn-next');
          expect(nextButton).toBeTruthy();

          fireEvent.click(nextButton);

          // 验证 onPageChange 被触发
          expect(onPageChange).toHaveBeenCalledTimes(1);
          // 第一个参数应包含新的分页信息
          expect(onPageChange.mock.calls[0][0]).toEqual(
            expect.objectContaining({ current: 2, pageSize: 2, previous: 1 }),
          );
          // 第二个参数应为当前页的数据（此处校验包含预期行）
          expect(onPageChange.mock.calls[0][1]).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ index: 3, applicant: '王芳' }),
              expect.objectContaining({ index: 4, applicant: '贾明' }),
            ]),
          );
        });
      });

      describe('scenarios', () => {
        // JSDOM 环境下 scrollHeight/clientHeight 默认都为 0，需 mock
        function mockScrollHeight(element: HTMLElement, scrollHeight: number, clientHeight: number) {
          Object.defineProperty(element, 'scrollHeight', {
            value: scrollHeight,
            configurable: true,
          });
          Object.defineProperty(element, 'clientHeight', {
            value: clientHeight,
            configurable: true,
          });
        }

        it('props.pagination: scroll position should reset when switching pages', async () => {
          const onPageChange = vi.fn();
          const pagination = {
            current: 1,
            pageSize: 2,
            total: 50,
          };

          const longData = new Array(20).fill(null).map((_, idx) => ({
            index: idx + 1,
            applicant: `name-${idx + 1}`,
          }));
          const COLUMNS = [
            { title: 'Index', colKey: 'index' },
            { title: 'Applicant', colKey: 'applicant' },
          ];

          const { container } = render(
            <TTable
              rowKey="index"
              data={longData}
              columns={COLUMNS}
              pagination={pagination}
              onPageChange={onPageChange}
              maxHeight={200}
            />,
          );

          expect(container.querySelector('.t-pagination')).toBeTruthy();
          const tableContent = container.querySelector('.t-table__content');
          expect(tableContent).toBeTruthy();

          const scrollElement = tableContent as HTMLElement;

          mockScrollHeight(scrollElement, 100, 50);

          // 初始化后就断言有滚动条，且初始 scrollTop 为 0
          expect(scrollElement.scrollHeight).toBeGreaterThan(scrollElement.clientHeight);
          expect(scrollElement.scrollTop).toBe(0);

          // 模拟滚动
          scrollElement.scrollTop = 100;
          expect(scrollElement.scrollTop).toBe(100);

          const nextButton = container.querySelector('.t-pagination__btn-next');
          expect(nextButton).toBeTruthy();
          fireEvent.click(nextButton);

          expect(onPageChange).toHaveBeenCalledTimes(1);
          // 断言滚动条回到顶部
          expect(scrollElement.scrollTop).toBe(0);
        });
      });
    });
  });

  describe('props', () => {
    it('props.bordered works fine', () => {
      // bordered default value is false
      const { container: container1 } = getNormalTableMount(BaseTable);
      expect(container1.querySelector(`.${'t-table--bordered'}`)).toBeFalsy();
      // bordered = true
      const { container: container2 } = getNormalTableMount(BaseTable, {
        bordered: true,
      });
      expect(container2.firstChild).toHaveClass('t-table--bordered');
      // bordered = false
      const { container: container3 } = getNormalTableMount(BaseTable, {
        bordered: false,
      });
      expect(container3.querySelector(`.${'t-table--bordered'}`)).toBeFalsy();
    });

    it('props.fixedRows is equal [3, 1]', () => {
      const { container } = getNormalTableMount(BaseTable, {
        fixedRows: [3, 1],
      });
      expect(container.querySelectorAll('.t-table__row--fixed-top').length).toBe(3);
      expect(container.querySelectorAll('.t-table__row--fixed-bottom').length).toBe(1);
    });

    it('props.footData works fine. `"tfoot.t-table__footer"` should exist', () => {
      const { container } = getNormalTableMount(BaseTable);
      expect(container.querySelector('tfoot.t-table__footer')).toBeTruthy();
    });

    it('props.footData works fine. `{"tfoot > tr":2}` should exist', () => {
      const { container } = getNormalTableMount(BaseTable);
      expect(container.querySelectorAll('tfoot > tr').length).toBe(2);
    });

    it('props.hover works fine', () => {
      // hover default value is false
      const { container: container1 } = getNormalTableMount(BaseTable);
      expect(container1.querySelector(`.${'t-table--hoverable'}`)).toBeFalsy();
      // hover = true
      const { container: container2 } = getNormalTableMount(BaseTable, {
        hover: true,
      });
      expect(container2.firstChild).toHaveClass('t-table--hoverable');
      // hover = false
      const { container: container3 } = getNormalTableMount(BaseTable, {
        hover: false,
      });
      expect(container3.querySelector(`.${'t-table--hoverable'}`)).toBeFalsy();
    });

    it('props.loading: BaseTable contains element `.t-loading`', () => {
      // loading default value is undefined
      const { container } = getNormalTableMount(BaseTable);
      expect(container.querySelector('.t-loading')).toBeFalsy();
      // loading = false
      const { container: container1 } = getNormalTableMount(BaseTable, {
        loading: false,
      });
      expect(container1.querySelector('.t-loading')).toBeFalsy();
      // loading = true
      const { container: container2 } = getNormalTableMount(BaseTable, {
        loading: true,
      });
      expect(container2.querySelector('.t-loading')).toBeTruthy();
    });

    it('props.resizable works fine', () => {
      // resizable default value is false
      const { container: container1 } = getNormalTableMount(BaseTable);
      expect(container1.querySelector(`.${'t-table--column-resizable'}`)).toBeFalsy();
      // resizable = true
      const { container: container2 } = getNormalTableMount(BaseTable, {
        resizable: true,
      });
      expect(container2.firstChild).toHaveClass('t-table--column-resizable');
      // resizable = false
      const { container: container3 } = getNormalTableMount(BaseTable, {
        resizable: false,
      });
      expect(container3.querySelector(`.${'t-table--column-resizable'}`)).toBeFalsy();
    });

    it(`props.rowAttributes is equal to { 'data-level': 'level-1' }`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowAttributes: { 'data-level': 'level-1' },
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper.getAttribute('data-level')).toBe('level-1');
    });
    it(`props.rowAttributes is equal to [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowAttributes: [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }],
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper.getAttribute('data-level')).toBe('level-1');
      expect(domWrapper.getAttribute('data-name')).toBe('tdesign');
    });
    it(`props.rowAttributes is equal to () => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowAttributes: () => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }],
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper.getAttribute('data-level')).toBe('level-1');
      expect(domWrapper.getAttribute('data-name')).toBe('tdesign');
    });
    it(`props.rowAttributes is equal to [() => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]]`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowAttributes: [() => [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]],
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper.getAttribute('data-level')).toBe('level-1');
      expect(domWrapper.getAttribute('data-name')).toBe('tdesign');
    });

    it(`props.rowClassName is equal to 'tdesign-class'`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowClassName: 'tdesign-class',
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper).toHaveClass('tdesign-class');
    });
    it(`props.rowClassName is equal to { 'tdesign-class': true, 'tdesign-class-next': false }`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowClassName: { 'tdesign-class': true, 'tdesign-class-next': false },
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper).toHaveClass('tdesign-class');
      expect(domWrapper.classList.contains('tdesign-class-next')).toBeFalsy();
    });
    it(`props.rowClassName is equal to ['tdesign-class-default', { 'tdesign-class': true, 'tdesign-class-next': false }]`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowClassName: ['tdesign-class-default', { 'tdesign-class': true, 'tdesign-class-next': false }],
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper).toHaveClass('tdesign-class-default');
      expect(domWrapper).toHaveClass('tdesign-class');
      expect(domWrapper.classList.contains('tdesign-class-next')).toBeFalsy();
    });
    it(`props.rowClassName is equal to () => ({ 'tdesign-class': true, 'tdesign-class-next': false })`, () => {
      const { container } = getNormalTableMount(BaseTable, {
        rowClassName: () => ({
          'tdesign-class': true,
          'tdesign-class-next': false,
        }),
      });
      const domWrapper = container.querySelector('tbody > tr');
      expect(domWrapper).toHaveClass('tdesign-class');
      expect(domWrapper.classList.contains('tdesign-class-next')).toBeFalsy();
    });

    it('props.showHeader: BaseTable contains element `thead`', () => {
      // showHeader default value is true
      const { container } = getNormalTableMount(BaseTable);
      expect(container.querySelector('thead')).toBeTruthy();
      // showHeader = false
      const { container: container1 } = getNormalTableMount(BaseTable, {
        showHeader: false,
      });
      expect(container1.querySelector('thead')).toBeFalsy();
      // showHeader = true
      const { container: container2 } = getNormalTableMount(BaseTable, {
        showHeader: true,
      });
      expect(container2.querySelector('thead')).toBeTruthy();
      expect(container2).toMatchSnapshot();
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdBaseTableProps['size'][]).forEach((item, index) => {
      it(`props.size is equal to ${item}`, () => {
        const { container } = getNormalTableMount(BaseTable, { size: item });
        if (typeof sizeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
        } else if (typeof sizeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(sizeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
        expect(container).toMatchSnapshot();
      });
    });

    it('props.stripe works fine', () => {
      // stripe default value is false
      const { container: container1 } = getNormalTableMount(BaseTable);
      expect(container1.querySelector(`.${'t-table--striped'}`)).toBeFalsy();
      // stripe = true
      const { container: container2 } = getNormalTableMount(BaseTable, {
        stripe: true,
      });
      expect(container2.firstChild).toHaveClass('t-table--striped');
      // stripe = false
      const { container: container3 } = getNormalTableMount(BaseTable, {
        stripe: false,
      });
      expect(container3.querySelector(`.${'t-table--striped'}`)).toBeFalsy();
    });

    const tableLayoutExpectedDom = ['table.t-table--layout-auto', 'table.t-table--layout-fixed'];
    (['auto', 'fixed'] as TdBaseTableProps['tableLayout'][]).forEach((item, index) => {
      it(`props.tableLayout is equal to ${item}`, () => {
        const { container } = getNormalTableMount(BaseTable, {
          tableLayout: item,
        });
        expect(container.querySelector(tableLayoutExpectedDom[index])).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    const verticalAlignClassNameList = [
      't-vertical-align-top',
      { 't-vertical-align-middle': false },
      't-vertical-align-bottom',
    ];
    (['top', 'middle', 'bottom'] as TdBaseTableProps['verticalAlign'][]).forEach((item, index) => {
      it(`props.verticalAlign is equal to ${item}`, () => {
        const { container } = getNormalTableMount(BaseTable, {
          verticalAlign: item,
        });
        if (typeof verticalAlignClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(verticalAlignClassNameList[index]);
        } else if (typeof verticalAlignClassNameList[index] === 'object') {
          const classNameKey = Object.keys(verticalAlignClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });
  });

  describe('slots', () => {
    it('props.bottomContent works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        bottomContent: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    it('props.cellEmptyContent works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        cellEmptyContent: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    it('props.empty works fine', () => {
      const { container } = getEmptyDataTableMount(BaseTable, {
        empty: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    it('props.firstFullRow works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        firstFullRow: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-table__first-full-row')).toBeTruthy();
      expect(container.querySelector('td[colspan="3"]')).toBeTruthy();
    });

    it('props.footerSummary works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        footerSummary: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-table__footer')).toBeTruthy();
      expect(container.querySelector('.t-table__row-full-element')).toBeTruthy();
      expect(container.querySelector('td[colspan="3"]')).toBeTruthy();
    });

    it('props.lastFullRow works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        lastFullRow: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-table__last-full-row')).toBeTruthy();
      expect(container.querySelector('td[colspan="3"]')).toBeTruthy();
    });

    it('props.loading works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        loading: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-loading')).toBeTruthy();
    });

    it('props.topContent works fine', () => {
      const { container } = getNormalTableMount(BaseTable, {
        topContent: <span className="custom-node">TNode</span>,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });
});
