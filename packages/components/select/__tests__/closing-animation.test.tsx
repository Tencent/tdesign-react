import React, { useState } from 'react';
import { act, fireEvent, render, vi } from '@test/utils';

import Select from '../index';

test.each([
  { source: 'options', destroyOnClose: false },
  { source: 'children', destroyOnClose: false },
  { source: 'options', destroyOnClose: true },
  { source: 'children', destroyOnClose: true },
])('keeps the filtered list during exit: $source, destroyOnClose=$destroyOnClose', ({ source, destroyOnClose }) => {
  vi.useFakeTimers();
  const onChange = vi.fn();
  const onInputChange = vi.fn();
  const Demo = () => {
    const [value, setValue] = useState('');
    const options = [
      { label: '选项一', value: '1' },
      { label: '选项二', value: '2' },
      { label: '选项三', value: '3' },
    ];
    return (
      <Select
        value={value}
        onChange={(next) => {
          onChange(next);
          setValue(String(next));
        }}
        onInputChange={onInputChange}
        filterable
        popupProps={{ destroyOnClose }}
        options={source === 'options' ? options : undefined}
      >
        {source === 'children' ? options.map((option) => <Select.Option key={option.value} {...option} />) : undefined}
      </Select>
    );
  };
  const { getByRole, getByText, unmount } = render(<Demo />);
  try {
    const input = getByRole('textbox');
    fireEvent.click(input);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.change(input, { target: { value: '一' } });
    const popup = document.querySelector('.t-popup');
    expect(popup).toHaveTextContent('选项一');
    expect(popup).not.toHaveTextContent('选项二');

    fireEvent.click(getByText('选项一'));
    expect(input).toHaveValue('选项一');
    expect(onChange).toHaveBeenLastCalledWith('1');
    expect(onInputChange).toHaveBeenLastCalledWith('', expect.objectContaining({ trigger: 'blur' }));
    expect(popup).toHaveStyle({ display: 'block' });
    expect(popup).not.toHaveTextContent('选项二');
    expect(popup).not.toHaveTextContent('选项三');

    act(() => vi.advanceTimersByTime(100));
    expect(popup).toHaveStyle({ display: 'block' });
    expect(popup).not.toHaveTextContent('选项二');
    act(() => vi.advanceTimersByTime(100));
    if (destroyOnClose) expect(document.querySelector('.t-popup')).toBeNull();
    else expect(popup).toHaveStyle({ display: 'none' });

    fireEvent.click(input);
    const reopenedPopup = document.querySelector('.t-popup');
    expect(reopenedPopup).toHaveTextContent('选项一');
    expect(reopenedPopup).toHaveTextContent('选项二');
    expect(reopenedPopup).toHaveTextContent('选项三');
    expect(onChange).toHaveBeenCalledTimes(1);
  } finally {
    unmount();
    vi.useRealTimers();
  }
});

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];

test('reopening during exit uses the latest options and cancels the pending close', () => {
  vi.useFakeTimers();
  const onChange = vi.fn();
  const { getByRole, getByText, rerender, unmount } = render(
    <Select filterable options={options} onChange={onChange} />,
  );
  try {
    const input = getByRole('textbox');
    fireEvent.click(input);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.change(input, { target: { value: '一' } });
    fireEvent.click(getByText('选项一'));
    const popup = document.querySelector('.t-popup');
    expect(popup).not.toHaveTextContent('选项二');

    rerender(<Select filterable options={[...options, { label: '选项四', value: '4' }]} onChange={onChange} />);
    expect(popup).not.toHaveTextContent('选项四');
    fireEvent.click(input);
    expect(input).toHaveValue('');
    expect(popup).toHaveTextContent('选项二');
    expect(popup).toHaveTextContent('选项四');
    act(() => vi.advanceTimersByTime(200));
    expect(popup).toHaveStyle({ display: 'block' });
    expect(onChange).toHaveBeenCalledTimes(1);
  } finally {
    unmount();
    vi.useRealTimers();
  }
});

test.each([false, true])('multiple selection keeps the open list live: reserveKeyword=%s', (reserveKeyword) => {
  const { getByRole, getByText } = render(
    <Select multiple filterable options={options} reserveKeyword={reserveKeyword} />,
  );
  const input = getByRole('textbox');
  fireEvent.click(input);
  fireEvent.change(input, { target: { value: '一' } });
  fireEvent.click(getByText('选项一'));
  const popup = document.querySelector('.t-popup');
  expect(popup).toHaveStyle({ display: 'block' });
  if (reserveKeyword) {
    expect(input).toHaveValue('一');
    expect(popup).not.toHaveTextContent('选项二');
  } else {
    expect(input).toHaveValue('');
    expect(popup).toHaveTextContent('选项二');
  }
});

test('a controlled popup that stays open continues updating its list', () => {
  const onPopupVisibleChange = vi.fn();
  const { getByRole, getByText } = render(
    <Select filterable options={options} popupVisible onPopupVisibleChange={onPopupVisibleChange} />,
  );
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: '一' } });
  fireEvent.click(getByText('选项一'));
  expect(onPopupVisibleChange).toHaveBeenLastCalledWith(false, expect.anything());
  expect(document.querySelector('.t-popup')).toHaveStyle({ display: 'block' });
  expect(document.querySelector('.t-popup')).toHaveTextContent('选项二');
  fireEvent.change(input, { target: { value: '三' } });
  expect(document.querySelector('.t-popup')).toHaveTextContent('选项三');
  expect(document.querySelector('.t-popup')).not.toHaveTextContent('选项二');
});
