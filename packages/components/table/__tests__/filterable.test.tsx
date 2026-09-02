import React, { useState } from 'react';
import { fireEvent, render, waitFor } from '@test/utils';

import { PrimaryTable } from '..';

import type { FilterType, FilterValue, PrimaryTableCol, TableRowData } from '..';

const ROW_COUNT = 200;
const LIST = ['主机', '配件'];

function getData(): TableRowData[] {
  return new Array(ROW_COUNT).fill(null).map((_, index) => ({
    id: index,
    name: `name-${index}`,
    // 前 20 条为 “配件”，筛选后数据量会低于虚拟滚动阈值 100
    category: index < 20 ? LIST[1] : LIST[0],
  }));
}

const ALL_DATA = getData();

function CustomFilter(props: { defaultSelected?: string[]; onChange?: (val: string[]) => void }) {
  const { defaultSelected = [], onChange } = props;
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  return (
    <div className="custom-filter">
      {LIST.map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            data-value={item}
            checked={selected.includes(item)}
            onChange={() => {
              const next = selected.includes(item) ? selected.filter((v) => v !== item) : [...selected, item];
              setSelected(next);
              onChange?.(next);
            }}
          />
          {item}
        </label>
      ))}
    </div>
  );
}

function VirtualFilterTable(props: { headerAffixedTop?: boolean }) {
  const [filterValue, setFilterValue] = useState<FilterValue>({});
  const data = ALL_DATA.filter((row) => {
    const val = (filterValue.category as string[]) || [];
    return !val.length || val.includes(row.category as string);
  });
  const columns: PrimaryTableCol[] = [
    { colKey: 'name', title: 'Name', width: 100 },
    {
      colKey: 'category',
      title: 'Category',
      width: 100,
      filter: {
        type: 'custom' as FilterType,
        component: CustomFilter,
        props: { defaultSelected: (filterValue.category as string[]) || [] },
        resetValue: [],
      },
    },
  ];
  return (
    <PrimaryTable
      rowKey="id"
      data={data}
      columns={columns}
      maxHeight={200}
      scroll={{ type: 'virtual' }}
      headerAffixedTop={props.headerAffixedTop}
      filterValue={filterValue}
      onFilterChange={(val) => setFilterValue(val)}
    />
  );
}

const getPopups = () => document.querySelectorAll('.t-table__filter-pop-content');

describe('Filterable Table with virtual scroll', () => {
  const descriptors: Array<[string, PropertyDescriptor]> = [];

  function mockSize(prop: string, value: number) {
    const origin = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
    if (origin) descriptors.push([prop, origin]);
    Object.defineProperty(HTMLElement.prototype, prop, {
      configurable: true,
      get: () => value,
    });
  }

  beforeAll(() => {
    mockSize('clientWidth', 800);
    mockSize('clientHeight', 200);
    mockSize('scrollHeight', 4000);
    mockSize('scrollWidth', 800);
    HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
      return {
        width: 800,
        height: 200,
        top: 0,
        left: 0,
        right: 800,
        bottom: 200,
        x: 0,
        y: 0,
      } as DOMRect;
    };
  });

  afterAll(() => {
    descriptors.forEach(([prop, descriptor]) => Object.defineProperty(HTMLElement.prototype, prop, descriptor));
  });

  it('renders only one filter popup even though the affixed header duplicates THead', async () => {
    const { container } = render(<VirtualFilterTable />);

    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(2);
    });

    const icons = container.querySelectorAll('.t-table__filter-icon');
    expect(icons.length).toBe(2);

    // 模拟用户点击视觉上位于最顶层的吸顶表头筛选图标
    fireEvent.click(icons[0].firstChild as Element);

    await waitFor(() => {
      expect(document.querySelectorAll('.t-table__filter-pop-content').length).toBe(1);
    });
  });

  it('keeps the popup open and in sync when filtering crosses the virtual scroll threshold', async () => {
    const { container } = render(<VirtualFilterTable />);

    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(2);
    });

    const icons = container.querySelectorAll('.t-table__filter-icon');
    fireEvent.click(icons[0].firstChild as Element);

    await waitFor(() => {
      expect(document.querySelectorAll('.t-table__filter-pop-content').length).toBe(1);
    });

    const checkbox = document.querySelector('.custom-filter input[data-value="配件"]') as HTMLInputElement;
    fireEvent.click(checkbox);

    // 数据量降到阈值以下，吸顶表头被销毁
    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(1);
    });

    expect(getPopups().length).toBe(1);
    const checkedBoxes = document.querySelectorAll('.custom-filter input:checked');
    expect(checkedBoxes.length).toBe(1);
    expect((checkedBoxes[0] as HTMLInputElement).dataset.value).toBe('配件');

    // 取消筛选，数据量回到阈值之上，吸顶表头重建，浮层仍然只有一个
    fireEvent.click(document.querySelector('.custom-filter input[data-value="配件"]'));
    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(2);
    });
    expect(getPopups().length).toBe(1);
  });

  it('closes the popup when clicking the affixed header filter icon again', async () => {
    const { container } = render(<VirtualFilterTable />);

    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(2);
    });

    const affixedIcon = container.querySelectorAll('.t-table__filter-icon')[0].firstChild as Element;
    fireEvent.click(affixedIcon);
    await waitFor(() => {
      expect(getPopups().length).toBe(1);
    });

    // 吸顶表头的图标并非浮层 trigger，document mousedown 不应先关闭浮层导致再次打开
    fireEvent.mouseDown(affixedIcon);
    fireEvent.click(affixedIcon);
    await waitFor(() => {
      expect(getPopups().length).toBe(0);
    });
  });

  it('closes the popup when clicking the same colKey filter icon of another table', async () => {
    const { container } = render(
      <>
        <VirtualFilterTable />
        <VirtualFilterTable />
      </>,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(4);
    });

    const tables = container.querySelectorAll('.t-table');
    const iconOf = (tableIndex: number) =>
      tables[tableIndex].querySelectorAll('.t-table__filter-icon')[0].firstChild as Element;

    fireEvent.click(iconOf(0));
    await waitFor(() => {
      expect(getPopups().length).toBe(1);
    });

    // 另一个表格的同名列图标不属于当前表格，应正常关闭当前浮层并打开自己的浮层
    fireEvent.mouseDown(iconOf(1));
    fireEvent.click(iconOf(1));
    await waitFor(() => {
      expect(getPopups().length).toBe(1);
    });
  });

  it('lets the affixed header own the popup when headerAffixedTop is enabled', async () => {
    const { container } = render(<VirtualFilterTable headerAffixedTop />);

    await waitFor(() => {
      expect(container.querySelectorAll('thead').length).toBe(2);
    });

    const affixedIcon = container.querySelectorAll('.t-table__filter-icon')[0].firstChild as Element;
    fireEvent.click(affixedIcon);

    await waitFor(() => {
      expect(getPopups().length).toBe(1);
    });
    // 浮层挂在吸顶表头的图标上，保证滚动吸顶后浮层定位正确
    const icons = container.querySelectorAll('.t-table__filter-icon');
    expect((icons[0].firstChild as Element).classList.contains('t-popup-open')).toBe(true);
    expect((icons[1].firstChild as Element).classList.contains('t-popup-open')).toBe(false);
  });
});
