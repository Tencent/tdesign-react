import React, { Profiler, useState } from 'react';
import { fireEvent, render, vi } from '@test/utils';

import Select from '../index';

// 记录真实 DOM commit，而不是仅检查 act 刷新全部 effects 后的最终结果。
test.each(['options', 'children'] as const)('keeps an unchanged filter across parent rerenders: %s', (source) => {
  const committedLists: string[] = [];
  const readOptions = () =>
    Array.from(document.querySelectorAll('.t-popup .t-select-option'))
      .map((option) => option.textContent)
      .join('|');
  const Demo = () => {
    const [, setRevision] = useState(0);
    // 与官网 Demo 一样，在父组件 render 中创建 options / Option children。
    const options = [
      { label: '选项一', value: '1' },
      { label: '选项二', value: '2' },
      { label: '选项三', value: '3' },
    ];
    return (
      <>
        <button type="button" onClick={() => setRevision((revision) => revision + 1)}>
          rerender
        </button>
        <Select filterable defaultInputValue="二" popupVisible options={source === 'options' ? options : undefined}>
          {source === 'children'
            ? options.map((option) => <Select.Option key={option.value} {...option} />)
            : undefined}
        </Select>
      </>
    );
  };
  const { getByRole } = render(
    <Profiler
      id="select"
      onRender={() => {
        const list = readOptions();
        if (committedLists[committedLists.length - 1] !== list) committedLists.push(list);
      }}
    >
      <Demo />
    </Profiler>,
  );
  expect(readOptions()).toBe('选项二');
  committedLists.length = 0;
  fireEvent.click(getByRole('button', { name: 'rerender' }));
  expect(getByRole('textbox')).toHaveValue('二');
  expect(readOptions()).toBe('选项二');
  expect(committedLists).toEqual(['选项二']);
});

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];

const readOptions = () =>
  Array.from(document.querySelectorAll('.t-popup .t-select-option')).map((option) => option.textContent);

test('commits only the new filtered list when the controlled query and options change together', () => {
  const committedLists: string[][] = [];
  const demo = (inputValue: string, items: typeof options) => (
    <Profiler id="select" onRender={() => committedLists.push(readOptions())}>
      <Select filterable popupVisible inputValue={inputValue} options={items} />
    </Profiler>
  );
  const { rerender } = render(demo('一', options));
  committedLists.length = 0;
  rerender(demo('四', [...options, { label: '选项四', value: '4' }]));
  expect(committedLists.length).toBeGreaterThan(0);
  committedLists.forEach((list) => expect(list).toEqual(['选项四']));
});

test.each(['options', 'children'] as const)(
  'reserveKeyword preserves selection and query without freezing new %s',
  (source) => {
    const demo = (items: typeof options) => (
      <Select multiple filterable reserveKeyword options={source === 'options' ? items : undefined}>
        {source === 'children' ? items.map((option) => <Select.Option key={option.value} {...option} />) : undefined}
      </Select>
    );
    const { getByRole, getByText, rerender, container } = render(demo(options));
    const input = getByRole('textbox');
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: '一' } });
    fireEvent.click(getByText('选项一'));
    rerender(demo([...options, { label: '选项十一', value: '11' }]));
    expect(input).toHaveValue('一');
    expect(readOptions()).toEqual(['选项一', '选项十一']);
    expect(container.querySelector('.t-tag')).toHaveTextContent('选项一');
  },
);

test('remote search uses server options and retains labels of selections absent from the response', () => {
  const onSearch = vi.fn();
  const filter = vi.fn(() => false);
  const demo = (items: typeof options) => (
    <Select multiple filterable defaultValue={['1']} options={items} onSearch={onSearch} filter={filter} popupVisible />
  );
  const { getByRole, rerender, container } = render(demo(options));
  fireEvent.change(getByRole('textbox'), { target: { value: 'remote query' } });
  rerender(demo([options[1]]));
  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenLastCalledWith('remote query', expect.anything());
  expect(filter).not.toHaveBeenCalled();
  expect(readOptions()).toEqual(['选项二']);
  expect(container.querySelector('.t-tag')).toHaveTextContent('选项一');
});

test('recomputes filtering when a custom predicate changes with an unchanged query', () => {
  const { rerender } = render(
    <Select
      filterable
      popupVisible
      inputValue="query"
      options={options}
      filter={(_, option) => option.value === '1'}
    />,
  );
  expect(readOptions()).toEqual(['选项一']);
  rerender(
    <Select
      filterable
      popupVisible
      inputValue="query"
      options={options}
      filter={(_, option) => option.value === '2'}
    />,
  );
  expect(readOptions()).toEqual(['选项二']);
});

test('updates a creatable candidate without changing the query', () => {
  const { rerender } = render(<Select filterable popupVisible inputValue="四" options={options} />);
  expect(readOptions()).toEqual([]);
  rerender(<Select filterable creatable popupVisible inputValue="四" options={options} />);
  expect(readOptions()).toEqual(['四']);
  rerender(
    <Select filterable creatable popupVisible inputValue="四" options={[...options, { label: '四', value: '4' }]} />,
  );
  expect(readOptions()).toEqual(['四']);
});

test('filters grouped options while resolving selected labels from the full source', () => {
  const { container } = render(
    <Select
      multiple
      filterable
      popupVisible
      defaultValue={['1']}
      inputValue="二"
      options={[{ group: '分组', children: options }]}
    />,
  );
  expect(readOptions()).toEqual(['选项二']);
  expect(container.querySelector('.t-tag')).toHaveTextContent('选项一');
});

test('filters mapped labels without losing the selected object', () => {
  const items = [
    { id: '1', name: '选项一' },
    { id: '2', name: '选项二' },
  ];
  const { container } = render(
    <Select
      multiple
      filterable
      popupVisible
      keys={{ value: 'id', label: 'name' }}
      valueType="object"
      value={[items[0]]}
      inputValue="二"
      options={items}
    />,
  );
  expect(readOptions()).toEqual(['选项二']);
  expect(container.querySelector('.t-tag')).toHaveTextContent('选项一');
});

test('keyboard selection uses the current filtered group after an options update', () => {
  const onChange = vi.fn();
  const { getByRole, rerender } = render(
    <Select
      filterable
      popupVisible
      inputValue="二"
      options={[{ group: '分组', children: options }]}
      onChange={onChange}
    />,
  );
  rerender(
    <Select
      filterable
      popupVisible
      inputValue="四"
      options={[{ group: '分组', children: [...options, { label: '选项四', value: '4' }] }]}
      onChange={onChange}
    />,
  );
  const popup = document.querySelector('.t-popup__content') as HTMLElement;
  popup.scrollTo = vi.fn();
  fireEvent.keyDown(getByRole('textbox'), { key: 'ArrowDown', code: 'ArrowDown' });
  fireEvent.keyDown(getByRole('textbox'), { key: 'Enter', code: 'Enter' });
  expect(onChange).toHaveBeenLastCalledWith('4', expect.objectContaining({ trigger: 'check' }));
});

test('filters a virtual list down to a non-virtual result and back', () => {
  const items = Array.from({ length: 120 }, (_, index) => ({ label: `选项${index}`, value: String(index) }));
  const { getByRole } = render(<Select filterable popupVisible options={items} scroll={{ type: 'virtual' }} />);
  const initialList = readOptions();
  expect(initialList.length).toBeGreaterThan(0);
  expect(initialList.length).toBeLessThan(items.length);
  fireEvent.change(getByRole('textbox'), { target: { value: '选项119' } });
  expect(readOptions()).toEqual(['选项119']);
  fireEvent.change(getByRole('textbox'), { target: { value: '' } });
  const restoredList = readOptions();
  expect(restoredList.length).toBeGreaterThan(0);
  expect(restoredList.length).toBeLessThan(items.length);
  expect(restoredList).toEqual(items.slice(0, restoredList.length).map((item) => item.label));
});

test('keeps custom children when no option source is provided', () => {
  render(
    <Select popupVisible>
      <div>自定义面板内容</div>
    </Select>,
  );
  expect(document.querySelector('.t-popup')).toHaveTextContent('自定义面板内容');
});
