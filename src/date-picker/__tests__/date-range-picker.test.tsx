import MockDate from 'mockdate';
import React from 'react';
import dayjs from 'dayjs';
import { BrowseIcon, LockOnIcon } from 'tdesign-icons-react';

import { testExamples, render, fireEvent, act, waitFor } from '@test/utils';

import { DateRangePicker } from '..';
// import type { DateValue } from '../type';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');
// 测试组件代码 Example 快照
testExamples(__dirname);

describe('DateRangePicker', () => {
  // const InputPlaceholder = '测试DateRangePicker';

  beforeEach(() => {
    MockDate.set('2022-08-27');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('className style', () => {
    const wrapper = render(<DateRangePicker className="test-class" style={{ width: '100px' }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('allowInput', () => {
    const wrapper = render(<DateRangePicker allowInput={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  // it('clearable', async () => {
  //   const { container } = render(<DateRangePicker defaultValue={['2022-09-14', '2022-10-01']} clearable={true} />);
  //   // 模拟鼠标进入
  //   act(() => {
  //     fireEvent.mouseEnter(container.querySelector('input'));
  //     jest.runAllTimers();
  //   });
  //   const clearElement = await waitFor(() => document.querySelector('.t-input__suffix-clear'));
  //   expect(clearElement).not.toBeNull();
  // });

  it('disableDate', () => {
    const disabledDate = {
      before: dayjs().subtract(5, 'day').format(),
      after: dayjs().add(5, 'day').format(),
    };
    const wrapper = render(<DateRangePicker disableDate={disabledDate} />);
    expect(Array.from(wrapper.container.children)).toMatchSnapshot();
  });

  it('disabled', () => {
    const { container } = render(<DateRangePicker disabled />);
    const inputElement = container.querySelector('.t-input__inner');
    expect((inputElement as HTMLInputElement).disabled).toBe(true);
  });

  it('enableTimePicker', async () => {
    const { container } = render(<DateRangePicker enableTimePicker={true} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const panelElement = await waitFor(() => document.querySelector('.t-date-picker__panel-time'));
    expect(panelElement).toBeInTheDocument();
  });

  it('firstDayOfWeek', async () => {
    const { container } = render(<DateRangePicker firstDayOfWeek={3} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
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
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const pickerTable = await waitFor(() => document.querySelector('.t-date-picker__table'));
    expect(pickerTable).toHaveTextContent('一季度');
  });

  it('mode', async () => {
    const { container } = render(<DateRangePicker mode={'week'} value={['2022-37th', '2022-38th']} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
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
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
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
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
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
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
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
    const blurFn = jest.fn();
    const focusFn = jest.fn();

    const { container } = render(<DateRangePicker allowInput onBlur={blurFn} onFocus={focusFn} />);
    const InputDom = container.querySelector('.t-input__inner');
    fireEvent.focus(InputDom);
    expect(focusFn).toBeCalledTimes(1);
    fireEvent.blur(InputDom);
    expect(blurFn).toBeCalledTimes(1);
  });

  it('onChange onPick onInput', async () => {
    const changeFn = jest.fn();
    const pickFn = jest.fn();
    const { container } = render(
      <DateRangePicker defaultValue={['2022-08-29', '2022-09-14']} onChange={changeFn} onPick={pickFn} />,
    );
    await act(async () => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
      const firstTBody = await waitFor(() => document.querySelector('tbody'));
      fireEvent.click(firstTBody.firstChild.firstChild.firstChild);
      fireEvent.click(firstTBody.firstChild.firstChild.firstChild);
    });
    setTimeout(async () => {
      expect(changeFn).toBeCalledTimes(1);
      expect(pickFn).toBeCalledTimes(2);
    }, 0);
  });

  it('panel select month and year', async () => {
    const { container } = render(<DateRangePicker defaultValue={['2022-08-29', '2022-09-14']} />);
    await act(async () => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    await act(async () => {
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
  });

  it('pure trigger onChange onPick', async () => {
    const { container } = render(
      <DateRangePicker
        format={'YYYY-MM-DD'}
        defaultValue={['2022-09-14', '2022-09-15']}
        clearable={true}
        // enableTimePicker
      />,
    );
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.change(inputEle, { target: { value: '2022-09-10' } });
    expect((inputEle as HTMLInputElement).value).toEqual('2022-09-10');
  });
});
