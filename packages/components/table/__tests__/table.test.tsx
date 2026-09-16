import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { BaseTable, EnhancedTable, PrimaryTable, Table } from '..';

import type { ComponentType } from 'react';
import type { RenderResult } from '@testing-library/react';
import type { BaseTableProps } from '../interface';
import type { PrimaryTableCol, TableRowData } from '../type';

type TestTableRow = TableRowData & {
  index: number;
  applicant: string;
  status: number;
  channel: string;
  detail: { email: string };
  matters: string;
  time: number;
  createTime: string;
};

type TableMountProps = Partial<BaseTableProps<TestTableRow>>;
type TableComponent = ComponentType<BaseTableProps<TestTableRow>>;
type TableRerender = RenderResult['rerender'];

type PaginationConfig = NonNullable<BaseTableProps['pagination']>;
type PaginationWithTotal = PaginationConfig & { total: number };
type PaginationWithPageSize = PaginationConfig & ({ pageSize: number } | { defaultPageSize: number });

type LocalPaginationMountProps = TableMountProps & {
  pagination: PaginationWithTotal;
};
type RemotePaginationMountProps = TableMountProps & {
  pagination: PaginationWithPageSize;
};

const MOUNT_COLUMNS: PrimaryTableCol<TestTableRow>[] = [
  { title: 'Index', colKey: 'index', className: 'table-test-column-index' },
  { title: 'Applicant', colKey: 'applicant' },
  { title: 'Time', colKey: 'createTime' },
];

function resolvePageSize(pagination: PaginationConfig): number {
  return pagination.pageSize ?? pagination.defaultPageSize ?? 10;
}

function getTableData(total = 5): TestTableRow[] {
  const tableData: TestTableRow[] = [];
  for (let i = 0; i < total; i++) {
    tableData.push({
      index: i + 1,
      applicant: ['贾明', '张三', '王芳'][i % 3],
      status: i % 3,
      channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
      detail: {
        email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
      },
      matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
      time: [2, 3, 1, 4][i % 4],
      createTime: ['', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
    });
  }
  return tableData;
}

function getDataLengthLargerThanPageSizeTableMount(
  TTable: TableComponent,
  props: LocalPaginationMountProps,
): RenderResult;
function getDataLengthLargerThanPageSizeTableMount(
  TTable: TableComponent,
  props: LocalPaginationMountProps,
  rerender: TableRerender,
): void;
function getDataLengthLargerThanPageSizeTableMount(
  TTable: TableComponent,
  props: LocalPaginationMountProps,
  rerender?: TableRerender,
): RenderResult | void {
  const element = React.createElement(TTable, {
    rowKey: 'index',
    data: getTableData(props.pagination.total),
    columns: MOUNT_COLUMNS,
    ...props,
  });
  if (rerender) {
    rerender(element);
    return;
  }
  return render(element);
}

function getNormalCountDataTableMount(TTable: TableComponent, props: RemotePaginationMountProps): RenderResult;
function getNormalCountDataTableMount(
  TTable: TableComponent,
  props: RemotePaginationMountProps,
  rerender: TableRerender,
): void;
function getNormalCountDataTableMount(
  TTable: TableComponent,
  props: RemotePaginationMountProps,
  rerender?: TableRerender,
): RenderResult | void {
  const element = React.createElement(TTable, {
    rowKey: 'index',
    data: getTableData(resolvePageSize(props.pagination)),
    columns: MOUNT_COLUMNS,
    ...props,
  });
  if (rerender) {
    rerender(element);
    return;
  }
  return render(element);
}

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

const TABLES = [Table, BaseTable, PrimaryTable, EnhancedTable];
const EXPANDABLE_TABLES = [Table, PrimaryTable, EnhancedTable];

describe('Table', () => {
  TABLES.forEach((TTable) => {
    describe(TTable.name, () => {
      describe('props', () => {
        // 测试边框
        describe(':bordered', () => {
          it('[boolean]', () => {
            const { container: container1 } = render(
              <TTable rowKey="index" bordered data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            expect(container1.firstChild).toHaveClass('t-table--bordered');

            const { container: container2 } = render(
              <TTable rowKey="index" bordered={true} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            expect(container2.firstChild).toHaveClass('t-table--bordered');

            const { container: container3 } = render(
              <TTable rowKey="index" bordered={false} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            expect(container3.firstChild).toHaveClass('t-table');
          });
        });

        describe(':rowAttributes', () => {
          it('[object]', () => {
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

          it('[object[]]', () => {
            const rowAttrs = [{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }];

            const { container } = render(
              <TTable rowKey="index" rowAttributes={rowAttrs} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            const trWrapper = container.querySelector('tbody').querySelector('tr');
            expect(trWrapper.getAttribute('data-level')).toBe('level-1');
            expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
          });

          it('[function]', () => {
            const rowAttrs = () => ({
              'data-level': 'level-1',
              'data-name': 'tdesign',
            });

            const { container } = render(
              <TTable rowKey="index" rowAttributes={rowAttrs} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            const trWrapper = container.querySelector('tbody').querySelector('tr');
            expect(trWrapper.getAttribute('data-level')).toBe('level-1');
            expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
          });

          it('[function[]]', () => {
            const rowAttrs = [{ 'data-level': 'level-1' }, () => ({ 'data-name': 'tdesign' })];

            const { container } = render(
              <TTable rowKey="index" rowAttributes={rowAttrs} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            const trWrapper = container.querySelector('tbody').querySelector('tr');
            expect(trWrapper.getAttribute('data-level')).toBe('level-1');
            expect(trWrapper.getAttribute('data-name')).toBe('tdesign');
          });
        });

        describe(':rowClassName', () => {
          it('[string]', () => {
            const rowClassName = 'tdesign-class';
            const { container } = render(
              <TTable rowKey="index" rowClassName={rowClassName} data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            const trWrapper = container.querySelector('tbody').querySelector('tr');
            expect(trWrapper.getAttribute('class')).toBe(rowClassName);
          });
          it('[object]', () => {
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
          it('[array]', () => {
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
          it('[function]', () => {
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

        describe(':empty', () => {
          it('[string]', () => {
            const { container: container1 } = render(
              <TTable rowKey="index" data={[]} columns={SIMPLE_COLUMNS}></TTable>,
            );
            expect(container1.querySelector('.t-table__empty')).toBeTruthy();
            expect(container1.querySelector('.t-table__empty').innerHTML).toBe('暂无数据');

            const { container: container2 } = render(
              <TTable rowKey="index" data={[]} empty="Empty Data" columns={SIMPLE_COLUMNS}></TTable>,
            );
            expect(container2.querySelector('.t-table__empty')).toBeTruthy();
            expect(container2.querySelector('.t-table__empty').innerHTML).toBe('Empty Data');
          });
          it('[TNode]', () => {
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

        describe(':firstFullRow', () => {
          it('[string]', () => {
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
          it('[TNode]', () => {
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

        describe(':lastFullRow', () => {
          it('[string]', () => {
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
          it('[TNode]', () => {
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

        describe(':loading', () => {
          it('[boolean]', () => {
            const { container } = render(
              <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} loading={true}></TTable>,
            );
            expect(container.querySelector('.t-loading')).toBeTruthy();
            expect(container.querySelector('.t-icon-loading')).toBeTruthy();
          });
          it('[string/TNode]', () => {
            const { container } = render(
              <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} loading={'function loading'}></TTable>,
            );
            expect(container.querySelector('.t-loading')).toBeTruthy();
            expect(container.querySelector('.t-icon-loading')).toBeTruthy();
            expect(container.querySelector('.t-loading__text')).toBeTruthy();
            expect(container.querySelector('.t-loading__text').innerHTML).toBe('function loading');
          });
          it('hide indicator with loadingProps', () => {
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

        describe(':verticalAlign', () => {
          it('[top]', () => {
            const { container } = render(
              <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="top"></TTable>,
            );
            expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table t-vertical-align-top');
          });
          it('[middle]', () => {
            const { container } = render(
              <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="middle"></TTable>,
            );
            expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table');
          });
          it('[bottom]', () => {
            const { container } = render(
              <TTable rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="bottom"></TTable>,
            );
            expect(container.querySelector('.t-table').getAttribute('class')).toBe('t-table t-vertical-align-bottom');
          });
        });

        describe(':topContent', () => {
          it('[string]', () => {
            const topContentText = 'This is top content';
            const { container } = render(
              <TTable topContent={topContentText} rowKey="index" data={data} columns={SIMPLE_COLUMNS}></TTable>,
            );
            expect(container.querySelector('.t-table__top-content')).toBeTruthy();
            expect(container.querySelector('.t-table__top-content').innerHTML).toBe(topContentText);
          });
          it('[TNode]', () => {
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

        describe(':columns', () => {
          it('columns.align', () => {
            const columns = [
              { title: 'Index', colKey: 'index', align: 'center' as const },
              { title: 'Instance', colKey: 'instance', align: 'left' as const },
              { title: 'description', colKey: 'description' },
              { title: 'Owner', colKey: 'owner', align: 'right' as const },
            ];
            const { container } = render(<TTable rowKey="index" data={data} columns={columns}></TTable>);
            const firstTrWrapper = container.querySelector('tbody > tr');
            const tdList = firstTrWrapper.querySelectorAll('td');
            expect(tdList[0].classList.contains('t-align-center')).toBeTruthy();
            expect(tdList[1].getAttribute('class')).toBeNull();
            expect(tdList[2].getAttribute('class')).toBeNull();
            expect(tdList[3].getAttribute('class')).toBe('t-align-right');
          });

          it('columns.attrs', () => {
            const columns = [
              { title: 'Index', colKey: 'index' },
              {
                title: 'Instance',
                colKey: 'instance',
                attrs: { 'col-key': 'instance' },
              },
              { title: 'description', colKey: 'description' },
              { title: 'Owner', colKey: 'owner' },
            ];
            const { container } = render(<TTable rowKey="index" data={data} columns={columns}></TTable>);
            const firstTrWrapper = container.querySelector('tbody > tr');
            const tdList = firstTrWrapper.querySelectorAll('td');
            expect(tdList[1].getAttribute('col-key')).toBe('instance');
          });

          it('columns.className [string/function/object/array]', () => {
            const columns = [
              {
                title: 'Index',
                colKey: 'index',
                className: () => ['tdesign-class'],
              },
              {
                title: 'Instance',
                colKey: 'instance',
                className: 'tdesign-class',
              },
              {
                title: 'description',
                colKey: 'description',
                className: [{ 'tdesign-class': true }],
              },
              {
                title: 'Owner',
                colKey: 'owner',
                className: { 'tdesign-class': true, 'tdesign-class1': false },
              },
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

      describe('events', () => {
        it('onCellClick', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onCellClick={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.click(container.querySelector('td'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowClick', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowClick={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.click(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowDblclick', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowDblclick={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.doubleClick(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowMouseup', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowMouseup={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.mouseUp(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowMousedown', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowMousedown={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.mouseDown(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowMouseenter', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowMouseenter={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.mouseEnter(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowMouseleave', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowMouseleave={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.mouseLeave(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it('onRowMouseover', () => {
          const fn = vi.fn();
          const { container } = render(
            <TTable rowKey="index" bordered data={data} onRowMouseover={fn} columns={SIMPLE_COLUMNS}></TTable>,
          );
          fireEvent.mouseOver(container.querySelector('tbody').querySelector('tr'));
          expect(fn).toHaveBeenCalled();
        });

        it(':onPageChange', async () => {
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
    });
  });

  EXPANDABLE_TABLES.forEach((TTable) => {
    describe(TTable.name, () => {
      describe('events', () => {
        it('onExpandChange', async () => {
          const expandedRowKeys = [101];
          const fn = vi.fn();
          const { container } = render(
            <TTable
              expandedRowKeys={expandedRowKeys}
              rowKey="index"
              data={data}
              columns={SIMPLE_COLUMNS}
              onExpandChange={fn}
              expandedRow={() => <div>expanded row</div>}
            ></TTable>,
          );

          const expandIcon = container.querySelector('.t-table__expand-box');
          fireEvent.click(expandIcon);
          expect(fn).toHaveBeenCalled();
          expect(fn.mock.calls[0].length).toBe(2);
          expect(fn.mock.calls[0][0]).toEqual([101, 100]);
          expect(fn.mock.calls[0][1]).toEqual({
            currentRowData: data[0],
            expandedRowData: [data[0], data[1]],
          });
        });
      });
    });
  });

  describe('scenarios', () => {
    describe('pagination scroll reset', () => {
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

      TABLES.forEach((TTable) => {
        it(`${TTable.name} resets scroll position when switching pages`, async () => {
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

          expect(scrollElement.scrollHeight).toBeGreaterThan(scrollElement.clientHeight);
          expect(scrollElement.scrollTop).toBe(0);

          scrollElement.scrollTop = 100;
          expect(scrollElement.scrollTop).toBe(100);

          const nextButton = container.querySelector('.t-pagination__btn-next');
          expect(nextButton).toBeTruthy();
          fireEvent.click(nextButton);

          expect(onPageChange).toHaveBeenCalledTimes(1);
          expect(scrollElement.scrollTop).toBe(0);
        });
      });
    });

    describe('expanded row', () => {
      EXPANDABLE_TABLES.forEach((TTable) => {
        it(`${TTable.name} expandedRowKeys is empty`, () => {
          const { container } = render(
            <TTable
              expandedRowKeys={[]}
              rowKey="index"
              data={data}
              columns={SIMPLE_COLUMNS}
              expandedRow={() => <div>expanded row</div>}
            ></TTable>,
          );
          expect(container.querySelector('.t-table__expandable-icon-cell')).toBeTruthy();
          expect(container.querySelector('.t-table__expanded-row')).toBeFalsy();
        });
      });
    });

    describe('row selection', () => {
      const selectColumns = [
        {
          colKey: 'row-select',
          type: 'multiple' as const,
          disabled: ({ row }: { row: { disabled?: boolean } }) => row.disabled === true,
        },
        { colKey: 'key', title: 'Key' },
      ];

      function getSelectTableData({ withDisabled = true } = {}) {
        const selectData = [];
        for (let i = 0; i <= 5; i++) {
          selectData.push({
            key: `${i}`,
            ...(withDisabled && i === 2 ? { disabled: true } : {}),
          });
        }
        return selectData;
      }

      const TestPrimaryTable = ({
        defaultSelectedRowKeys = [],
        onSelectChange = vi.fn(),
        selectData = getSelectTableData(),
      }: {
        defaultSelectedRowKeys?: string[];
        onSelectChange?: ReturnType<typeof vi.fn>;
        selectData?: Array<{ key: string; disabled?: boolean }>;
      }) => (
        <Table
          rowKey="key"
          columns={selectColumns}
          data={selectData}
          defaultSelectedRowKeys={defaultSelectedRowKeys}
          onSelectChange={onSelectChange}
        />
      );

      it('select-all without disabled rows', async () => {
        const onSelectChange = vi.fn();

        const { container } = render(
          <TestPrimaryTable selectData={getSelectTableData({ withDisabled: false })} onSelectChange={onSelectChange} />,
        );

        const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');
        expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
        expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');

        await fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).toHaveClass('t-is-checked');
        expect(onSelectChange).toHaveBeenCalledWith(['0', '1', '2', '3', '4', '5'], expect.any(Object));

        onSelectChange.mockClear();
        await fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
        expect(onSelectChange).toHaveBeenCalledWith([], expect.any(Object));
      });

      it('select-all with disabled rows', async () => {
        const onSelectChange = vi.fn();

        const { container } = render(<TestPrimaryTable onSelectChange={onSelectChange} />);

        const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');
        expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
        expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');

        await fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
        expect(onSelectChange).toHaveBeenCalledWith(
          expect.arrayContaining(['0', '1', '3', '4', '5']),
          expect.any(Object),
        );
        expect(onSelectChange.mock.calls[0][0]).not.toContain('2');

        onSelectChange.mockClear();
        await fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');
        expect(onSelectChange).toHaveBeenCalledWith([], expect.any(Object));
      });

      it('select-all keeps preselected disabled row', async () => {
        const onSelectChange = vi.fn();

        const { container } = render(
          <TestPrimaryTable defaultSelectedRowKeys={['2']} onSelectChange={onSelectChange} />,
        );

        const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');
        expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');

        await fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).toHaveClass('t-is-checked');
        expect(onSelectChange).toHaveBeenCalledWith(
          expect.arrayContaining(['0', '1', '2', '3', '4', '5']),
          expect.any(Object),
        );

        onSelectChange.mockClear();
        await fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
        expect(onSelectChange).toHaveBeenCalledWith(['2'], expect.any(Object));
      });
    });

    describe('locale data pagination controlled', () => {
      it('pagination.current changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            current: 2,
            pageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
        expect(container.querySelectorAll('tbody tr')).toMatchSnapshot();

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'pagination-current-changed',
            pagination: {
              current: 7,
              pageSize: 5,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.pagination-current-changed');
        expect(container1).toMatchSnapshot();
        expect(container1.querySelector('tbody tr td')?.textContent).toBe('31');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination.pageSize changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            current: 2,
            pageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
        expect(container.querySelectorAll('tbody tr')).toMatchSnapshot();

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'pagination-page-size-changed',
            pagination: {
              current: 2,
              pageSize: 10,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.pagination-page-size-changed');
        expect(container1.querySelector('tbody tr:last-child td')?.textContent).toBe('20');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });

      it('both pagination.pageSize and pagination.current changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            current: 2,
            pageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
        expect(container.querySelectorAll('tbody tr')).toMatchSnapshot();

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'pagination-current-and-size-changed',
            pagination: {
              current: 3,
              pageSize: 10,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.pagination-current-and-size-changed');
        expect(container1.querySelector('tbody tr:first-child td')?.textContent).toBe('21');
        expect(container1.querySelector('tbody tr:last-child td')?.textContent).toBe('30');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });

      it('data changed, data length changed, pagination not changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            current: 2,
            pageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'table-data-changed',
            pagination: {
              current: 2,
              pageSize: 5,
              total: 90,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.table-data-changed');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('data changed, while data length not changed, pagination not changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            current: 2,
            pageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'data-changed-with-same-length',
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.data-changed-with-same-length');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });
    });

    describe('local data pagination uncontrolled', () => {
      it('default pagination ', () => {
        const { container } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            defaultCurrent: 2,
            defaultPageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('default pagination, data changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            defaultCurrent: 2,
            defaultPageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'default-pagination-data-not-change',
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 90,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.default-pagination-data-not-change');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('default pagination, data changed, while data length not changed', () => {
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          pagination: {
            defaultCurrent: 2,
            defaultPageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'default-pagination-data-content-changed',
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.default-pagination-data-content-changed');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('default pagination changed, data rendered not changed', () => {
        const tableData = getTableData(102);
        const { container, rerender } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
          data: tableData,
          pagination: {
            defaultCurrent: 2,
            defaultPageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getDataLengthLargerThanPageSizeTableMount(
          BaseTable,
          {
            className: 'default-pagination-changed',
            data: tableData,
            pagination: {
              defaultCurrent: 3,
              defaultPageSize: 10,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.default-pagination-changed');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });
    });

    it('pagination.total is less than pagination.pageSize', () => {
      const { container: container1 } = getDataLengthLargerThanPageSizeTableMount(BaseTable, {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 2,
        },
      });
      expect(container1.querySelectorAll('tbody tr').length).toBe(2);
    });

    describe('async data pagination uncontrolled', () => {
      it('default pagination', () => {
        const { container } = getNormalCountDataTableMount(BaseTable, {
          pagination: {
            defaultCurrent: 2,
            defaultPageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('1');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('default pagination, data changed, while data length not changed', () => {
        const { container, rerender } = getNormalCountDataTableMount(BaseTable, {
          pagination: {
            defaultCurrent: 2,
            defaultPageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('1');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getNormalCountDataTableMount(
          BaseTable,
          {
            className: 'default-pagination-async-data-change',
            pagination: {
              defaultCurrent: 3,
              defaultPageSize: 10,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.default-pagination-async-data-change');
        expect(container1.querySelector('tbody tr td').textContent).toBe('1');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });
    });

    describe('async data pagination controlled', () => {
      it('pagination changed', () => {
        const { container, rerender } = getNormalCountDataTableMount(BaseTable, {
          pagination: {
            current: 2,
            pageSize: 5,
            total: 102,
          },
        });
        expect(container.querySelector('tbody tr td').textContent).toBe('1');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        getNormalCountDataTableMount(
          BaseTable,
          {
            className: 'default-pagination-async-data-change',
            pagination: {
              current: 3,
              pageSize: 10,
              total: 102,
            },
          },
          rerender,
        );
        const container1 = container.querySelector('.default-pagination-async-data-change');
        expect(container1.querySelector('tbody tr td').textContent).toBe('1');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });
    });
  });
});
