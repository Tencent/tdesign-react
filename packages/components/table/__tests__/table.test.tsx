import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Table } from '..';

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
type PaginationConfig = NonNullable<BaseTableProps['pagination']>;
type PaginationMountProps = TableMountProps & { pagination: PaginationConfig };

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

function paginationTable(props: PaginationMountProps, options?: { remote?: boolean }) {
  const dataLength = options?.remote
    ? resolvePageSize(props.pagination)
    : (props.pagination.total ?? resolvePageSize(props.pagination));

  return <Table rowKey="index" data={getTableData(dataLength)} columns={MOUNT_COLUMNS} {...props} />;
}

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

describe('Table', () => {
  describe('props', () => {
    it('bordered[boolean]', () => {
      const { container: container1 } = render(
        <Table rowKey="index" bordered data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(container1.firstChild).toHaveClass('t-table--bordered');

      const { container: container2 } = render(
        <Table rowKey="index" bordered={true} data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(container2.firstChild).toHaveClass('t-table--bordered');

      const { container: container3 } = render(
        <Table rowKey="index" bordered={false} data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(container3.firstChild).toHaveClass('t-table');
    });

    it('rowAttributes[object/array/function]', () => {
      const { container: objectContainer } = render(
        <Table rowKey="index" rowAttributes={{ 'data-level': 'level-1' }} data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(objectContainer.querySelector('tbody tr').getAttribute('data-level')).toBe('level-1');

      const { container: arrayContainer } = render(
        <Table
          rowKey="index"
          rowAttributes={[{ 'data-level': 'level-1' }, { 'data-name': 'tdesign' }]}
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      const arrayRow = arrayContainer.querySelector('tbody tr');
      expect(arrayRow.getAttribute('data-level')).toBe('level-1');
      expect(arrayRow.getAttribute('data-name')).toBe('tdesign');

      const { container: fnContainer } = render(
        <Table
          rowKey="index"
          rowAttributes={() => ({
            'data-level': 'level-1',
            'data-name': 'tdesign',
          })}
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      const fnRow = fnContainer.querySelector('tbody tr');
      expect(fnRow.getAttribute('data-level')).toBe('level-1');
      expect(fnRow.getAttribute('data-name')).toBe('tdesign');

      const { container: mixedContainer } = render(
        <Table
          rowKey="index"
          rowAttributes={[{ 'data-level': 'level-1' }, () => ({ 'data-name': 'tdesign' })]}
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      const mixedRow = mixedContainer.querySelector('tbody tr');
      expect(mixedRow.getAttribute('data-level')).toBe('level-1');
      expect(mixedRow.getAttribute('data-name')).toBe('tdesign');
    });

    it('rowClassName[string/object/array/function]', () => {
      const { container: stringContainer } = render(
        <Table rowKey="index" rowClassName="tdesign-class" data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(stringContainer.querySelector('tbody tr').getAttribute('class')).toBe('tdesign-class');

      const { container: objectContainer } = render(
        <Table
          rowKey="index"
          rowClassName={{
            'tdesign-class': true,
            'tdesign-class-next': false,
          }}
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      expect(objectContainer.querySelector('tbody tr').getAttribute('class')).toBe('tdesign-class');

      const { container: arrayContainer } = render(
        <Table
          rowKey="index"
          rowClassName={['tdesign-class-default', { 'tdesign-class': true, 'tdesign-class-next': false }]}
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      expect(arrayContainer.querySelector('tbody tr').getAttribute('class')).toBe(
        'tdesign-class-default tdesign-class',
      );

      const { container: fnContainer } = render(
        <Table
          rowKey="index"
          rowClassName={() => ({
            'tdesign-class': true,
            'tdesign-class-next': false,
          })}
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      expect(fnContainer.querySelector('tbody tr').getAttribute('class')).toBe('tdesign-class');
    });

    it('empty[string/TNode]', () => {
      const { container: defaultContainer } = render(<Table rowKey="index" data={[]} columns={SIMPLE_COLUMNS}></Table>);
      expect(defaultContainer.querySelector('.t-table__empty')).toBeTruthy();
      expect(defaultContainer.querySelector('.t-table__empty').innerHTML).toBe('暂无数据');

      const { container: stringContainer } = render(
        <Table rowKey="index" data={[]} empty="Empty Data" columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(stringContainer.querySelector('.t-table__empty').innerHTML).toBe('Empty Data');

      const emptyText = 'Empty Data Rendered By children';
      const { container: nodeContainer } = render(
        <Table
          rowKey="index"
          data={[]}
          empty={<div className="render-function-class">{emptyText}</div>}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      expect(nodeContainer.querySelector('.render-function-class').innerHTML).toBe(emptyText);
    });

    it('firstFullRow[string/TNode]', () => {
      const { container: stringContainer } = render(
        <Table firstFullRow="This is a full row at first." rowKey="index" data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(stringContainer.querySelector('.t-table__row--full')).toBeTruthy();

      const { container: nodeContainer } = render(
        <Table
          firstFullRow={<span>This is a full row at first.</span>}
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      expect(nodeContainer.querySelector('.t-table__row--full')).toBeTruthy();
      expect(nodeContainer.querySelector('.t-table__first-full-row')).toBeTruthy();
    });

    it('lastFullRow[string/TNode]', () => {
      const { container: stringContainer } = render(
        <Table lastFullRow="This is a full row at last." rowKey="index" data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(stringContainer.querySelector('.t-table__row--full')).toBeTruthy();

      const { container: nodeContainer } = render(
        <Table
          lastFullRow={<span>This is a full row at last.</span>}
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
        ></Table>,
      );
      expect(nodeContainer.querySelector('.t-table__row--full')).toBeTruthy();
      expect(nodeContainer.querySelector('.t-table__last-full-row')).toBeTruthy();
    });

    it('loading[boolean/TNode]', () => {
      const { container: booleanContainer } = render(
        <Table rowKey="index" data={data} columns={SIMPLE_COLUMNS} loading={true}></Table>,
      );
      expect(booleanContainer.querySelector('.t-loading')).toBeTruthy();
      expect(booleanContainer.querySelector('.t-icon-loading')).toBeTruthy();

      const { container: textContainer } = render(
        <Table rowKey="index" data={data} columns={SIMPLE_COLUMNS} loading="function loading"></Table>,
      );
      expect(textContainer.querySelector('.t-loading__text').innerHTML).toBe('function loading');

      const { container: propsContainer } = render(
        <Table
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
          loading="function loading"
          loadingProps={{ indicator: false }}
        ></Table>,
      );
      expect(propsContainer.querySelector('.t-loading')).toBeTruthy();
      expect(propsContainer.querySelector('.t-icon-loading')).toBeFalsy();
      expect(propsContainer.querySelector('.t-loading__text').innerHTML).toBe('function loading');
    });

    it('verticalAlign[top/middle/bottom]', () => {
      const { container: topContainer } = render(
        <Table rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="top"></Table>,
      );
      expect(topContainer.querySelector('.t-table').getAttribute('class')).toBe('t-table t-vertical-align-top');

      const { container: middleContainer } = render(
        <Table rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="middle"></Table>,
      );
      expect(middleContainer.querySelector('.t-table').getAttribute('class')).toBe('t-table');

      const { container: bottomContainer } = render(
        <Table rowKey="index" data={data} columns={SIMPLE_COLUMNS} verticalAlign="bottom"></Table>,
      );
      expect(bottomContainer.querySelector('.t-table').getAttribute('class')).toBe('t-table t-vertical-align-bottom');
    });

    it('topContent[string/TNode]', () => {
      const topContentText = 'This is top content';
      const { container: stringContainer } = render(
        <Table topContent={topContentText} rowKey="index" data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(stringContainer.querySelector('.t-table__top-content').innerHTML).toBe(topContentText);

      const { container: nodeContainer } = render(
        <Table topContent={<span>{topContentText}</span>} rowKey="index" data={data} columns={SIMPLE_COLUMNS}></Table>,
      );
      expect(nodeContainer.querySelector('.t-table__top-content').innerHTML).toBe(`<span>${topContentText}</span>`);
    });

    it('columns[align/attrs/className]', () => {
      const { container: alignContainer } = render(
        <Table
          rowKey="index"
          data={data}
          columns={[
            { title: 'Index', colKey: 'index', align: 'center' as const },
            {
              title: 'Instance',
              colKey: 'instance',
              align: 'left' as const,
            },
            { title: 'description', colKey: 'description' },
            { title: 'Owner', colKey: 'owner', align: 'right' as const },
          ]}
        ></Table>,
      );
      const alignCells = alignContainer.querySelector('tbody > tr').querySelectorAll('td');
      expect(alignCells[0].classList.contains('t-align-center')).toBeTruthy();
      expect(alignCells[1].getAttribute('class')).toBeNull();
      expect(alignCells[2].getAttribute('class')).toBeNull();
      expect(alignCells[3].getAttribute('class')).toBe('t-align-right');

      const { container: attrsContainer } = render(
        <Table
          rowKey="index"
          data={data}
          columns={[
            { title: 'Index', colKey: 'index' },
            {
              title: 'Instance',
              colKey: 'instance',
              attrs: { 'col-key': 'instance' },
            },
            { title: 'description', colKey: 'description' },
            { title: 'Owner', colKey: 'owner' },
          ]}
        ></Table>,
      );
      expect(attrsContainer.querySelector('tbody > tr').querySelectorAll('td')[1].getAttribute('col-key')).toBe(
        'instance',
      );

      const { container: classContainer } = render(
        <Table
          rowKey="index"
          data={data}
          columns={[
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
          ]}
        ></Table>,
      );
      const classCells = classContainer.querySelector('tbody > tr').querySelectorAll('td');
      expect(classCells[0].getAttribute('class')).toBe('tdesign-class');
      expect(classCells[1].getAttribute('class')).toBe('tdesign-class');
      expect(classCells[2].getAttribute('class')).toBe('tdesign-class');
      expect(classCells[3].getAttribute('class')).toBe('tdesign-class');
      expect(classCells[3].classList.contains('tdesign-class1')).toBeFalsy();
    });

    it('expandedRowKeys[empty]', () => {
      const { container } = render(
        <Table
          expandedRowKeys={[]}
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
          expandedRow={() => <div>expanded row</div>}
        ></Table>,
      );
      expect(container.querySelector('.t-table__expandable-icon-cell')).toBeTruthy();
      expect(container.querySelector('.t-table__expanded-row')).toBeFalsy();
    });

    describe('pagination', () => {
      it('pagination.current changed', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
        expect(container.querySelectorAll('tbody tr')).toMatchSnapshot();

        rerender(
          paginationTable({
            className: 'pagination-current-changed',
            pagination: {
              current: 7,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        const container1 = container.querySelector('.pagination-current-changed');
        expect(container1).toMatchSnapshot();
        expect(container1.querySelector('tbody tr td')?.textContent).toBe('31');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination.pageSize changed', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
        expect(container.querySelectorAll('tbody tr')).toMatchSnapshot();

        rerender(
          paginationTable({
            className: 'pagination-page-size-changed',
            pagination: {
              current: 2,
              pageSize: 10,
              total: 102,
            },
          }),
        );
        const container1 = container.querySelector('.pagination-page-size-changed');
        expect(container1.querySelector('tbody tr:last-child td')?.textContent).toBe('20');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });

      it('both pagination.pageSize and pagination.current changed', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
        expect(container.querySelectorAll('tbody tr')).toMatchSnapshot();

        rerender(
          paginationTable({
            className: 'pagination-current-and-size-changed',
            pagination: {
              current: 3,
              pageSize: 10,
              total: 102,
            },
          }),
        );
        const container1 = container.querySelector('.pagination-current-and-size-changed');
        expect(container1.querySelector('tbody tr:first-child td')?.textContent).toBe('21');
        expect(container1.querySelector('tbody tr:last-child td')?.textContent).toBe('30');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });

      it('data changed, data length changed, pagination not changed', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable({
            className: 'table-data-changed',
            pagination: {
              current: 2,
              pageSize: 5,
              total: 90,
            },
          }),
        );
        const container1 = container.querySelector('.table-data-changed');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('data changed, while data length not changed, pagination not changed', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable({
            className: 'data-changed-with-same-length',
            pagination: {
              current: 2,
              pageSize: 5,
              total: 102,
            },
          }),
        );
        const container1 = container.querySelector('.data-changed-with-same-length');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination[defaultCurrent]', () => {
        const { container } = render(
          paginationTable({
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination[defaultCurrent] stays when data length changes', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable({
            className: 'default-pagination-data-not-change',
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 90,
            },
          }),
        );
        const container1 = container.querySelector('.default-pagination-data-not-change');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination[defaultCurrent] stays when data content changes', () => {
        const { container, rerender } = render(
          paginationTable({
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable({
            className: 'default-pagination-data-content-changed',
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 102,
            },
          }),
        );
        const container1 = container.querySelector('.default-pagination-data-content-changed');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination[defaultCurrent] ignore later default change', () => {
        const tableData = getTableData(102);
        const { container, rerender } = render(
          paginationTable({
            data: tableData,
            pagination: {
              defaultCurrent: 2,
              defaultPageSize: 5,
              total: 102,
            },
          }),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('6');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable({
            className: 'default-pagination-changed',
            data: tableData,
            pagination: {
              defaultCurrent: 3,
              defaultPageSize: 10,
              total: 102,
            },
          }),
        );
        const container1 = container.querySelector('.default-pagination-changed');
        expect(container1.querySelector('tbody tr td').textContent).toBe('6');
        expect(container1.querySelectorAll('tbody tr').length).toBe(5);
      });
      it('pagination.total is less than pagination.pageSize', () => {
        const { container: container1 } = render(
          paginationTable({
            pagination: {
              current: 1,
              pageSize: 10,
              total: 2,
            },
          }),
        );
        expect(container1.querySelectorAll('tbody tr').length).toBe(2);
      });

      it('pagination[async defaultCurrent]', () => {
        const { container } = render(
          paginationTable(
            {
              pagination: {
                defaultCurrent: 2,
                defaultPageSize: 5,
                total: 102,
              },
            },
            { remote: true },
          ),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('1');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);
      });

      it('pagination[async defaultCurrent] stays when data content changes', () => {
        const { container, rerender } = render(
          paginationTable(
            {
              pagination: {
                defaultCurrent: 2,
                defaultPageSize: 5,
                total: 102,
              },
            },
            { remote: true },
          ),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('1');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable(
            {
              className: 'default-pagination-async-data-change',
              pagination: {
                defaultCurrent: 3,
                defaultPageSize: 10,
                total: 102,
              },
            },
            { remote: true },
          ),
        );
        const container1 = container.querySelector('.default-pagination-async-data-change');
        expect(container1.querySelector('tbody tr td').textContent).toBe('1');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });
      it('pagination[async] changed', () => {
        const { container, rerender } = render(
          paginationTable(
            {
              pagination: {
                current: 2,
                pageSize: 5,
                total: 102,
              },
            },
            { remote: true },
          ),
        );
        expect(container.querySelector('tbody tr td').textContent).toBe('1');
        expect(container.querySelectorAll('tbody tr').length).toBe(5);

        rerender(
          paginationTable(
            {
              className: 'default-pagination-async-data-change',
              pagination: {
                current: 3,
                pageSize: 10,
                total: 102,
              },
            },
            { remote: true },
          ),
        );
        const container1 = container.querySelector('.default-pagination-async-data-change');
        expect(container1.querySelector('tbody tr td').textContent).toBe('1');
        expect(container1.querySelectorAll('tbody tr').length).toBe(10);
      });

      it('onPageChange', async () => {
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
          <Table
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

      it('onPageChange resets scroll position', async () => {
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

        const { container } = render(
          <Table
            rowKey="index"
            data={longData}
            columns={[
              { title: 'Index', colKey: 'index' },
              { title: 'Applicant', colKey: 'applicant' },
            ]}
            pagination={pagination}
            onPageChange={onPageChange}
            maxHeight={200}
          />,
        );

        const scrollElement = container.querySelector('.t-table__content') as HTMLElement;
        mockScrollHeight(scrollElement, 100, 50);
        expect(scrollElement.scrollTop).toBe(0);

        scrollElement.scrollTop = 100;
        fireEvent.click(container.querySelector('.t-pagination__btn-next'));

        expect(onPageChange).toHaveBeenCalledTimes(1);
        expect(scrollElement.scrollTop).toBe(0);
      });
    });
  });

  describe('events', () => {
    it('onCellClick', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onCellClick={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.click(container.querySelector('td'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowClick', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowClick={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.click(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowDblclick', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowDblclick={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.doubleClick(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowMouseup', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowMouseup={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.mouseUp(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowMousedown', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowMousedown={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.mouseDown(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowMouseenter', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowMouseenter={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.mouseEnter(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowMouseleave', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowMouseleave={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.mouseLeave(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onRowMouseover', () => {
      const fn = vi.fn();
      const { container } = render(
        <Table rowKey="index" bordered data={data} onRowMouseover={fn} columns={SIMPLE_COLUMNS}></Table>,
      );
      fireEvent.mouseOver(container.querySelector('tbody').querySelector('tr'));
      expect(fn).toHaveBeenCalled();
    });

    it('onExpandChange', async () => {
      const expandedRowKeys = [101];
      const fn = vi.fn();
      const { container } = render(
        <Table
          expandedRowKeys={expandedRowKeys}
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
          onExpandChange={fn}
          expandedRow={() => <div>expanded row</div>}
        ></Table>,
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

  describe('scenarios', () => {
    describe('select', () => {
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

      const TPrimaryTable = ({
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
          <TPrimaryTable selectData={getSelectTableData({ withDisabled: false })} onSelectChange={onSelectChange} />,
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
        const { container } = render(<TPrimaryTable onSelectChange={onSelectChange} />);

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
        const { container } = render(<TPrimaryTable defaultSelectedRowKeys={['2']} onSelectChange={onSelectChange} />);

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
  });
});
