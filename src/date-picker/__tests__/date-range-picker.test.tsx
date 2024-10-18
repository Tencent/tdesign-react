import React from 'react';
import { BrowseIcon, LockOnIcon } from 'tdesign-icons-react';
import dayjs from 'dayjs';

import { render, fireEvent, act, waitFor, vi } from '@test/utils';

import { DateRangePicker } from '..';

describe('DateRangePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockDate = new Date(2022, 7, 27);
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clearable', async () => {
    const { container } = render(<DateRangePicker defaultValue={['2022-09-14', '2022-10-01']} clearable={true} />);
    // 模拟鼠标进入
    fireEvent.mouseEnter(container.querySelector('input'));

    const clearElement = document.querySelector('.t-range-input__suffix-clear');
    expect(clearElement).not.toBeNull();
  });

  it('disabled', () => {
    const { container } = render(<DateRangePicker disabled />);
    const inputElement = container.querySelector('.t-input__inner');
    expect((inputElement as HTMLInputElement).disabled).toBe(true);
  });

  it('enableTimePicker', async () => {
    const { container } = render(<DateRangePicker enableTimePicker={true} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const panelElement = await waitFor(() => document.querySelector('.t-date-picker__panel-time'));
    expect(panelElement).toBeInTheDocument();
  });

  it('firstDayOfWeek', async () => {
    const { container } = render(<DateRangePicker firstDayOfWeek={3} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const weekElement = await waitFor(() => document.querySelector('.t-date-picker__table table thead tr th'));
    expect(weekElement).toHaveTextContent('三');
  });

  it('defaultValue value format', async () => {
    const { container: container1 } = render(
      <DateRangePicker defaultValue={['2022-09-14', '2022-10-01']} format={'YYYY-MM-DD'} />,
    );
    const inputElement1 = container1.querySelector('.t-input__inner');
    expect((inputElement1 as HTMLInputElement).value).toEqual('2022-09-14');

    const { container: container2 } = render(<DateRangePicker value={['2022-09-14', '2022-10-01']} />);
    const inputElement2 = container2.querySelector('.t-input__inner');
    expect((inputElement2 as HTMLInputElement).value).toEqual('2022-09-14');
  });

  it('mode', async () => {
    const { container } = render(<DateRangePicker mode={'quarter'} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const pickerTable = await waitFor(() => document.querySelector('.t-date-picker__table'));
    expect(pickerTable).toHaveTextContent('一季度');
  });

  it('mode', async () => {
    const { container } = render(<DateRangePicker mode={'week'} value={['2022-37周', '2022-38周']} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const weekEle = await waitFor(() => document.querySelector('.t-date-picker__panel-week'));
    expect(weekEle).not.toBeNull();
  });

  it('placeholder', () => {
    const wrapper = render(<DateRangePicker placeholder={undefined} />);
    expect(wrapper.container.querySelector('input')?.placeholder).toEqual('请选择日期');
  });

  it('popupProps', async () => {
    const { container } = render(<DateRangePicker popupProps={{ showArrow: true }} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const popupArrow = await waitFor(() => document.querySelector('.t-popup__arrow'));
    expect(popupArrow).toBeInTheDocument();
  });

  it('prefixIcon suffixIcon', async () => {
    const { container } = render(<DateRangePicker prefixIcon={<BrowseIcon />} suffixIcon={<LockOnIcon />} />);
    const iconBrowse = container.querySelector('.t-icon-browse');
    const lockOn = container.querySelector('.t-icon-lock-on');

    expect(iconBrowse).toBeInTheDocument();
    expect(lockOn).toBeInTheDocument();
  });

  it('presets', async () => {
    const { container } = render(<DateRangePicker presets={{ 特定日期范围: ['2021-01-01', '2022-01-01'] }} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const pickerPresets = await waitFor(() => document.querySelector('.t-date-picker__presets'));
    expect(pickerPresets).toHaveTextContent('特定日期范围');
  });

  it('inputProps', async () => {
    const { container } = render(
      <DateRangePicker rangeInputProps={{ value: ['test-inputProps', 'test-inputProps'] }} />,
    );
    const inputWrapElement = container.querySelector('.t-input__inner');
    expect((inputWrapElement as HTMLInputElement).value).toEqual('test-inputProps');
  });

  it('separator', async () => {
    const { container } = render(<DateRangePicker separator={'#'} />);
    const inputWrapElement = container.querySelector('.t-range-input__inner-separator');
    expect(inputWrapElement).toHaveTextContent('#');
  });

  it('status', async () => {
    const { container } = render(<DateRangePicker status={'warning'} />);
    const tInput = container.querySelector('.t-range-input');
    expect(tInput.classList.contains('t-is-warning')).toBeTruthy();
  });

  it('timePickerProps', async () => {
    const { container } = render(<DateRangePicker enableTimePicker={true} timePickerProps={{ value: '13:01:01' }} />);
    act(() => {
      fireEvent.mouseDown(container.querySelector('input'));
      vi.runAllTimers();
    });
    const panelElement = await waitFor(() => document.querySelector('.t-date-picker__panel-time .t-is-current'));
    expect(panelElement).toHaveTextContent('13');
  });

  it('tips', async () => {
    const tips = 'test-tips';
    const { queryByText } = render(<DateRangePicker tips={tips} />);
    expect(queryByText(tips)).toBeInTheDocument();
  });

  it('onBlur onFocus', async () => {
    const blurFn = vi.fn();
    const focusFn = vi.fn();

    const { container } = render(<DateRangePicker allowInput onBlur={blurFn} onFocus={focusFn} />);
    const InputDom = container.querySelector('.t-input__inner');
    fireEvent.focus(InputDom);
    expect(focusFn).toBeCalledTimes(1);
    fireEvent.blur(InputDom);
    expect(blurFn).toBeCalledTimes(1);
  });

  it('onChange onPick onInput', async () => {
    const changeFn = vi.fn();
    const pickFn = vi.fn();
    const { container } = render(
      <DateRangePicker defaultValue={['2022-08-29', '2022-09-14']} onChange={changeFn} onPick={pickFn} />,
    );
    fireEvent.mouseDown(container.querySelector('input'));

    const firstTBody = await waitFor(() => document.querySelector('tbody'));
    fireEvent.click(firstTBody.firstChild.firstChild.firstChild);
    fireEvent.click(firstTBody.firstChild.firstChild.firstChild);

    expect(changeFn).toBeCalledTimes(2);
    expect(pickFn).toBeCalledTimes(2);
  });

  it('panel select month and year', async () => {
    const { container } = render(<DateRangePicker defaultValue={['2022-08-29', '2022-09-14']} />);
    fireEvent.mouseDown(container.querySelector('input'));

    const panelEle = await waitFor(() => document.querySelector('.t-date-picker__panel-date'));

    const monthPanel = panelEle.querySelector('.t-date-picker__header-controller-month .t-input');
    fireEvent.click(monthPanel);
    const monthPopup = await waitFor(() => document.querySelector('.t-select__list'));
    fireEvent.click(monthPopup.firstChild);

    const monthInput = await waitFor(() =>
      document.querySelector('.t-date-picker__header-controller-month .t-input__inner'),
    );
    expect((monthInput as HTMLInputElement).value).toEqual('1 月');

    const yearPanel = panelEle.querySelector('.t-date-picker__header-controller-year .t-input');
    fireEvent.click(yearPanel);
    const yearPopup = await waitFor(() =>
      document.querySelector('.t-date-picker__header-controller-year .t-select__list .t-is-selected'),
    );
    fireEvent.click(yearPopup.nextElementSibling);
    const yearInput = await waitFor(() =>
      document.querySelector('.t-date-picker__header-controller-year .t-input__inner'),
    );
    expect((yearInput as HTMLInputElement).value).toEqual('2023');
  });

  it('pure trigger onChange onPick', async () => {
    const { container } = render(
      <DateRangePicker format={'YYYY-MM-DD'} defaultValue={['2022-09-14', '2022-09-15']} clearable={true} />,
    );
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.change(inputEle, { target: { value: '2022-09-10' } });
    expect((inputEle as HTMLInputElement).value).toEqual('2022-09-10');
  });

  test('cell handleMouseEnter', async () => {
    const { container } = render(<DateRangePicker />);
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.mouseDown(inputEle);

    fireEvent.mouseEnter(document.querySelector('.t-date-picker__cell'));
    fireEvent.mouseLeave(document.querySelector('.t-date-picker__cell'));
  });

  test('cell handleClick', async () => {
    const { container } = render(<DateRangePicker />);
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.mouseDown(inputEle);

    fireEvent.click(document.querySelector('.t-date-picker__cell-inner'));
    fireEvent.click(document.querySelector('.t-date-picker__cell-inner'));
  });

  test('onJumperClick', async () => {
    const { container } = render(<DateRangePicker />);
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.mouseDown(inputEle);

    const jumperPrev = await waitFor(() => document.querySelector('.t-pagination-mini__prev'));
    fireEvent.click(jumperPrev);
    const jumperNext = await waitFor(() => document.querySelector('.t-pagination-mini__next'));
    fireEvent.click(jumperNext);
    const jumperCurrent = await waitFor(() => document.querySelector('.t-pagination-mini__current'));
    fireEvent.click(jumperCurrent);
  });

  test('onTimePickerChange & onConfirmClick', async () => {
    const { container, getByText } = render(<DateRangePicker enableTimePicker />);
    fireEvent.mouseDown(container.querySelector('input'));

    const timePickerItem = await waitFor(() => document.querySelector('.t-time-picker__panel-body-scroll-item'));
    fireEvent.click(timePickerItem);
    const confirmBtn = getByText('确定');
    fireEvent.click(confirmBtn);
  });

  test('onPresetClick', async () => {
    const { container } = render(
      <DateRangePicker presets={{ 圣诞节: [dayjs('2023-12-25').toDate(), dayjs('2023-12-25').toDate()] }} />,
    );
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.mouseDown(inputEle);

    const christmasBtn = await waitFor(() => document.querySelector('.t-date-picker__presets .t-button'));
    fireEvent.click(christmasBtn);
    expect(christmasBtn).toBeTruthy();
  });

  test('onYearChange', async () => {
    const { container } = render(<DateRangePicker />);
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.mouseDown(inputEle);

    const yearSelect = await waitFor(() => document.querySelector('.t-date-picker__header-controller-year'));
    fireEvent.click(yearSelect);

    const monthSelect = await waitFor(() => document.querySelector('.t-date-picker__header-controller-month'));
    fireEvent.click(monthSelect);
  });
});
