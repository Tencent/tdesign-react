import React, { useState } from 'react';
import { act, fireEvent, mockDelay, mockElementSizes, render, vi } from '@test/utils';

import { EnhancedTable } from '..';

import type { TableRowData } from '../type';

interface TreeRow {
  key: string;
  disabled?: boolean;
  children?: TreeRow[];
}

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple' as const,
    disabled: ({ row }: { row: TreeRow }) => row.disabled === true,
  },
  { colKey: 'key', title: 'Key' },
];

function getTreeData() {
  const data: TreeRow[] = [];

  for (let i = 0; i <= 2; i++) {
    const parentItem: TreeRow = {
      key: `${i}`,
      children: [],
    };

    for (let j = 0; j <= 2; j++) {
      const childItem: TreeRow = {
        key: `${i}-${j}`,
        children: [],
      };

      for (let k = 0; k <= 2; k++) {
        childItem.children.push({
          key: `${i}-${j}-${k}`,
        });
      }

      parentItem.children.push(childItem);
    }

    data.push(parentItem);
  }

  return data;
}

function getTreeDataWithDisabled() {
  const data = getTreeData();
  data[1].children[1].children[0].disabled = true;
  return data;
}

function getVirtualTreeData(rootCount = 150, childrenPerRoot = 3): TableRowData[] {
  const data: TableRowData[] = [];
  for (let i = 0; i < rootCount; i++) {
    data.push({
      key: `${i}`,
      name: `root-${i}`,
      children: Array.from({ length: childrenPerRoot }, (_, j) => ({
        key: `${i}-${j}`,
        name: `child-${i}-${j}`,
      })),
    });
  }
  return data;
}

function mockTableScrollContainer(element: HTMLElement, scrollHeight: number, clientHeight: number) {
  Object.defineProperty(element, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(element, 'clientHeight', {
    value: clientHeight,
    configurable: true,
  });
  element.scrollTop = 0;
}

describe('EnhancedTable', () => {
  describe('scenarios', () => {
    describe('tree row selection', () => {
      const TestEnhancedTable = ({
        checkStrictly = false,
        defaultSelectedRowKeys = [],
        onSelectChange = vi.fn(),
      }: {
        checkStrictly?: boolean;
        defaultSelectedRowKeys?: string[];
        onSelectChange?: ReturnType<typeof vi.fn>;
      }) => (
        <EnhancedTable
          rowKey="key"
          data={getTreeDataWithDisabled()}
          columns={columns}
          defaultSelectedRowKeys={defaultSelectedRowKeys}
          onSelectChange={onSelectChange}
          tree={{
            checkStrictly,
          }}
        />
      );

      it('select-all with disabled rows', async () => {
        const onSelectChange = vi.fn();

        const { container } = render(<TestEnhancedTable onSelectChange={onSelectChange} />);

        const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');

        expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
        expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');

        await fireEvent.click(selectAllCheckbox);
        const selectedKeys = onSelectChange.mock.calls[0][0];

        expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
        expect(selectedKeys).toHaveLength(38);
        expect(selectedKeys).not.toContain('1-1-0');
      });

      it('select-all keeps preselected disabled row', async () => {
        const onSelectChange = vi.fn();

        const { container } = render(
          <TestEnhancedTable defaultSelectedRowKeys={['1-1-0']} onSelectChange={onSelectChange} />,
        );

        const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');

        expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');

        await fireEvent.click(selectAllCheckbox);

        const selectedKeys = onSelectChange.mock.calls[0][0];

        expect(selectAllCheckbox).toHaveClass('t-is-checked');
        expect(selectedKeys).toHaveLength(39);
        expect(selectedKeys).toContain('1-1-0');

        onSelectChange.mockClear();
        await fireEvent.click(selectAllCheckbox);

        const afterUncheck = onSelectChange.mock.calls[0][0];

        expect(afterUncheck).toEqual(['1-1-0']);
        expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
      });

      it('select parent when checkStrictly is false', async () => {
        const onSelectChange = vi.fn();
        const { container } = render(
          <TestEnhancedTable defaultSelectedRowKeys={['1-1-0']} onSelectChange={onSelectChange} />,
        );

        const rows = container.querySelectorAll('tr.t-table-tr--level-0');
        const parentCheckbox = rows[1].querySelector('.t-checkbox');

        expect(parentCheckbox).toHaveClass('t-is-indeterminate');

        await fireEvent.click(parentCheckbox);

        const selectedKeys = onSelectChange.mock.calls[0][0];

        expect(parentCheckbox).toHaveClass('t-is-checked');
        expect(selectedKeys).toContain('1');
        expect(selectedKeys).toContain('1-1-0');
        expect(selectedKeys).toHaveLength(13);

        onSelectChange.mockClear();
        await fireEvent.click(parentCheckbox);

        expect(onSelectChange).toHaveBeenCalledWith(['1-1-0'], expect.any(Object));
      });

      it('select parent when checkStrictly is true', async () => {
        const onSelectChange = vi.fn();
        const { container } = render(
          <TestEnhancedTable defaultSelectedRowKeys={['1-1-0']} onSelectChange={onSelectChange} checkStrictly />,
        );
        const rows = container.querySelectorAll('tr.t-table-tr--level-0');

        const parentCheckbox = rows[1].querySelector('.t-checkbox');
        expect(parentCheckbox).not.toHaveClass('t-is-indeterminate');
        expect(parentCheckbox).not.toHaveClass('t-is-checked');

        await fireEvent.click(parentCheckbox);
        expect(onSelectChange).toHaveBeenCalledWith(expect.arrayContaining(['1-1-0', '1']), expect.any(Object));

        const childCheckbox = rows[2].querySelector('.t-checkbox');
        onSelectChange.mockClear();
        await fireEvent.click(childCheckbox);
        expect(onSelectChange).toHaveBeenCalledWith(expect.arrayContaining(['1-1-0', '1', '2']), expect.any(Object));
      });
    });

    describe('virtual scroll tree expand', () => {
      const VIRTUAL_ROW_HEIGHT = 40;
      const TABLE_HEIGHT = 400;
      const ROOT_COUNT = 150;
      const BUFFER_SIZE = 5;
      const virtualTreeColumns = [{ colKey: 'name', title: 'Name' }];

      function ControlledVirtualTreeTable() {
        const [expandedTreeNodes, setExpandedTreeNodes] = useState<Array<string | number>>([]);
        const [data] = useState(() => getVirtualTreeData(ROOT_COUNT));

        return (
          <EnhancedTable
            rowKey="key"
            data={data}
            columns={virtualTreeColumns}
            height={TABLE_HEIGHT}
            scroll={{
              type: 'virtual',
              rowHeight: VIRTUAL_ROW_HEIGHT,
              bufferSize: BUFFER_SIZE,
              threshold: 20,
            }}
            tree={{ treeNodeColumnIndex: 0 }}
            expandedTreeNodes={expandedTreeNodes}
            onExpandedTreeNodesChange={setExpandedTreeNodes}
          />
        );
      }

      it('shows children immediately after expanding a window-edge node', async () => {
        const restoreMock = mockElementSizes([
          { selector: '.t-table__content', height: TABLE_HEIGHT, width: 800 },
          { selector: 'tr', height: VIRTUAL_ROW_HEIGHT, width: 800 },
        ]);

        try {
          const { container } = render(<ControlledVirtualTreeTable />);
          const scrollElement = container.querySelector('.t-table__content') as HTMLElement;
          mockTableScrollContainer(scrollElement, ROOT_COUNT * VIRTUAL_ROW_HEIGHT, TABLE_HEIGHT);

          await act(async () => {
            await mockDelay(20);
          });

          const scrollTop = VIRTUAL_ROW_HEIGHT * 20;
          await act(async () => {
            scrollElement.scrollTop = scrollTop;
            fireEvent.scroll(scrollElement);
            await mockDelay(20);
          });

          const visibleRoots = Array.from(container.querySelectorAll('tr.t-table-tr--level-0'));
          expect(visibleRoots.length).toBeGreaterThan(1);

          const targetRoot =
            visibleRoots.find((row) => row.textContent?.includes('root-29')) || visibleRoots[visibleRoots.length - 2];
          const rootKey = targetRoot.textContent?.match(/root-(\d+)/)?.[1];
          expect(rootKey).toBeTruthy();

          const expandIcon = targetRoot.querySelector('.t-table__tree-op-icon');
          expect(expandIcon).toBeTruthy();

          await act(async () => {
            fireEvent.click(expandIcon);
            await mockDelay(20);
            scrollElement.scrollTop = scrollTop + 1;
            fireEvent.scroll(scrollElement);
            await mockDelay(20);
          });

          expect(container.querySelectorAll('tr.t-table-tr--level-1').length).toBeGreaterThan(0);
          expect(container.textContent).toContain(`child-${rootKey}-0`);
          expect(scrollElement.scrollTop).toBe(scrollTop + 1);
        } finally {
          restoreMock();
        }
      });
    });
  });
});
