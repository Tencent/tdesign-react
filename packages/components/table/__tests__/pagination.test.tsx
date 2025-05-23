import { BaseTable } from '../index';
import { getDataLengthLargerThanPageSizeTableMount, getNormalCountDataTableMount, getTableData } from './mount';

/**
 * 1. 远程数据分页受控用法 async data pagination controlled
 * 2. 远程数据分页非受控用法 async data pagination uncontrolled
 * 3. 本地数据分页受控用法 local data pagination controlled
 * 4. 本地数据分页非受控用法 local data pagination uncontrolled
 * 5. 数据变化不影响分页结果 data changed not influence pagination
 */

describe('BaseTable Pagination', () => {
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

      // get new different length data
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

      // get new data, but data length is same
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

      // get new different length data
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

      // get new different length data
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
      expect(container1.querySelectorAll('tbody tr').length).toBe(5);
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
