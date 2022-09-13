import MockDate from 'mockdate';
import React from 'react';
import dayjs from 'dayjs';
import { BrowseIcon, LockOnIcon } from 'tdesign-icons-react';

import { testExamples, render, fireEvent, act, waitFor } from '@test/utils';

import DatePicker from '..';
import type { DateValue } from '../type';
// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');
// 测试组件代码 Example 快照
testExamples(__dirname);

describe('DatePicker', () => {
  // const InputPlaceholder = '测试DatePicker';

  beforeEach(() => {
    MockDate.set('2022-08-27');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('className style', () => {
    const wrapper = render(<DatePicker className="test-class" style={{ width: '100px' }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('allowInput', () => {
    const wrapper = render(<DatePicker allowInput={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('clearable', async () => {
    const { container } = render(<DatePicker defaultValue={'2022-09-14'} clearable={true} />);
    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(container.querySelector('input'));
      jest.runAllTimers();
    });
    const clearElement = await waitFor(() => document.querySelector('.t-input__suffix-clear'));
    expect(clearElement).not.toBeNull();
    fireEvent.click(clearElement);
  });

  it('disableDate', async () => {
    const disabledDate = (date: DateValue) => date && dayjs().isBefore(date);
    const { container: container1 } = render(<DatePicker disableDate={disabledDate} />);
    act(() => {
      fireEvent.click(container1.querySelector('input'));
      jest.runAllTimers();
    });

    const { container: container2 } = render(<DatePicker disableDate={(date) => dayjs(date).day() === 6} />);
    act(() => {
      fireEvent.click(container2.querySelector('input'));
      jest.runAllTimers();
    });

    const { container: container3 } = render(
      <DatePicker
        disableDate={{
          before: dayjs().subtract(1, 'day').format(),
          after: dayjs().subtract(3, 'day').format(),
        }}
      />,
    );
    act(() => {
      fireEvent.click(container3.querySelector('input'));
      jest.runAllTimers();
    });

    const { container: container4 } = render(<DatePicker disableDate={['2022-09-14', '2022-09-16']} />);
    act(() => {
      fireEvent.click(container4.querySelector('input'));
      jest.runAllTimers();
    });

    const { container: container5 } = render(
      <DatePicker
        disableDate={{
          from: dayjs().subtract(1, 'day').format(),
          to: dayjs().subtract(3, 'day').format(),
        }}
      />,
    );
    act(() => {
      fireEvent.click(container5.querySelector('input'));
      jest.runAllTimers();
    });

    const disabledEle = await waitFor(() => document.querySelector('.t-date-picker__cell--disabled'));
    expect(disabledEle).not.toBeNull();
  });

  it('disabled', () => {
    const { container } = render(<DatePicker disabled />);
    const inputElement = container.querySelector('.t-input__inner');
    expect((inputElement as HTMLInputElement).disabled).toBe(true);
  });

  it('enableTimePicker', async () => {
    const { container } = render(<DatePicker enableTimePicker={true} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const panelElement = await waitFor(() => document.querySelector('.t-date-picker__panel-time'));
    expect(panelElement).toBeInTheDocument();
  });

  it('firstDayOfWeek', async () => {
    const { container } = render(<DatePicker firstDayOfWeek={3} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const weekElement = await waitFor(() => document.querySelector('.t-date-picker__table table thead tr th'));
    expect(weekElement).toHaveTextContent('三');
  });

  it('defaultValue value format', async () => {
    const { container: container1 } = render(<DatePicker defaultValue={'2022-09-14'} format={'YYYY-MM-DD'} />);
    const inputElement1 = container1.querySelector('.t-input__inner');
    expect((inputElement1 as HTMLInputElement).value).toEqual('2022-09-14');

    const { container: container2 } = render(<DatePicker value={'2022-09-14'} />);
    const inputElement2 = container2.querySelector('.t-input__inner');
    expect((inputElement2 as HTMLInputElement).value).toEqual('2022-09-14');
  });

  it('inputProps', async () => {
    const { container } = render(<DatePicker inputProps={{ value: 'test-inputProps' }} />);
    const inputWrapElement = container.querySelector('.t-input__inner');
    expect((inputWrapElement as HTMLInputElement).value).toEqual('test-inputProps');
  });

  it('mode week', async () => {
    const { container: container1 } = render(<DatePicker mode={'week'} value={'2022-37th'} />);
    act(() => {
      fireEvent.click(container1.querySelector('input'));
      jest.runAllTimers();
    });
    const weekEle = await waitFor(() => document.querySelector('.t-date-picker__panel-week'));
    expect(weekEle).not.toBeNull();
  });

  it('mode month', async () => {
    const { container } = render(<DatePicker mode={'month'} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const pickerTable = await waitFor(() => document.querySelector('tbody'));
    expect(pickerTable.firstChild.firstChild.firstChild).toHaveTextContent('1 月');
  });

  it('mode quarter', async () => {
    const { container } = render(<DatePicker mode={'quarter'} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const pickerTable = await waitFor(() => document.querySelector('.t-date-picker__table'));
    expect(pickerTable).toHaveTextContent('一季度');
  });

  it('mode year', async () => {
    const { container } = render(<DatePicker mode={'year'} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const weekEle = await waitFor(() => document.querySelector('.t-date-picker__panel-year'));
    expect(weekEle).not.toBeNull();
  });

  it('placeholder', () => {
    const wrapper = render(<DatePicker placeholder={undefined} />);
    expect(wrapper.container.querySelector('input')?.placeholder).toEqual('请选择日期');
  });

  it('popupProps', async () => {
    const { container } = render(<DatePicker popupProps={{ showArrow: true }} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const popupArrow = await waitFor(() => document.querySelector('.t-popup__arrow'));
    expect(popupArrow).toBeInTheDocument();
  });

  it('prefixIcon suffixIcon', async () => {
    const { container } = render(<DatePicker prefixIcon={<BrowseIcon />} suffixIcon={<LockOnIcon />} />);
    const iconBrowse = container.querySelector('.t-icon-browse');
    const lockOn = container.querySelector('.t-icon-lock-on');

    expect(iconBrowse).toBeInTheDocument();
    expect(lockOn).toBeInTheDocument();
  });

  it('presets bottom top', async () => {
    const presets = {
      昨天: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    };
    const { container } = render(<DatePicker presets={presets} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const table = await waitFor(() => document.querySelector('table'));
    fireEvent.mouseEnter(table);
    const pickerPresets = await waitFor(() => document.querySelector('.t-date-picker__presets'));
    expect(pickerPresets).toHaveTextContent('昨天');
  });

  it('status', async () => {
    const { container } = render(<DatePicker status={'warning'} />);
    const tInput = container.querySelector('.t-input');
    expect(tInput.classList.contains('t-is-warning')).toBeTruthy();
  });

  it('timePickerProps', async () => {
    const { container } = render(<DatePicker enableTimePicker={true} timePickerProps={{ value: '13:01:01' }} />);
    act(() => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
    });
    const panelElement = await waitFor(() => document.querySelector('.t-date-picker__panel-time .t-is-current'));
    expect(panelElement).toHaveTextContent('13');
  });

  it('tips', async () => {
    const tips = 'test-tips';
    const { queryByText } = render(<DatePicker tips={tips} />);
    expect(queryByText(tips)).toBeInTheDocument();
  });

  it('onBlur onFocus', async () => {
    const blurFn = jest.fn();
    const focusFn = jest.fn();

    const { container } = render(<DatePicker allowInput onBlur={blurFn} onFocus={focusFn} />);
    const InputDom = container.querySelector('.t-input__inner');
    fireEvent.focus(InputDom);
    expect(focusFn).toBeCalledTimes(1);
    fireEvent.blur(InputDom);
    expect(blurFn).toBeCalledTimes(1);
  });

  it('onChange onPick', async () => {
    const changeFn = jest.fn();
    const pickFn = jest.fn();
    const { container } = render(<DatePicker format={'YYYY-MM-DD'} onChange={changeFn} onPick={pickFn} />);
    await act(async () => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
      const firstDay = await waitFor(() => document.querySelector('.t-date-picker__cell--first-day-of-month'));
      fireEvent.click(firstDay);
    });
    setTimeout(async () => {
      expect(changeFn).toBeCalledTimes(1);
      expect(pickFn).toBeCalledTimes(1);
    }, 0);
  });

  it('onChange onPick', async () => {
    const changeFn = jest.fn();
    const pickFn = jest.fn();
    const { container } = render(<DatePicker format={'YYYY-MM-DD'} onChange={changeFn} onPick={pickFn} />);
    await act(async () => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
      const firstDay = await waitFor(() => document.querySelector('.t-date-picker__cell--first-day-of-month'));
      fireEvent.click(firstDay);
    });
    setTimeout(async () => {
      expect(changeFn).toBeCalledTimes(1);
      expect(pickFn).toBeCalledTimes(1);
    }, 0);
  });

  it('panel select month and year', async () => {
    const { container } = render(<DatePicker defaultValue={'2022-09-14'} />);
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

  it('panel select year, popup scroll', async () => {
    const { container } = render(<DatePicker defaultValue={'2022-09-14'} />);
    await act(async () => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
      const panelEle = await waitFor(() => document.querySelector('.t-date-picker__panel-date'));
      const yearPanel = panelEle.querySelector('.t-date-picker__header-controller-year .t-input');
      fireEvent.click(yearPanel);
      const popupContent = panelEle.querySelector('.t-date-picker__header-controller-year-popup .t-popup__content');
      fireEvent.scroll(popupContent, { target: { scrollY: 100, scrollTop: 0 } });
    });
  });

  it('pure trigger onChange onPick', async () => {
    const defaultValue = '2022-09-14 20:08:08';
    const { container } = render(
      <DatePicker format={'YYYY-MM-DD HH:mm:ss'} defaultValue={defaultValue} clearable={true} enableTimePicker />,
    );
    const inputEle = container.querySelector('.t-input__inner');
    fireEvent.change(inputEle, { target: { value: '2022-09-16 20:08:08' } });
    expect((inputEle as HTMLInputElement).value).toEqual('2022-09-16 20:08:08');
  });

  it('cell handleMouseEnter', async () => {
    const { container } = render(<DatePicker />);
    await act(async () => {
      fireEvent.click(container.querySelector('input'));
      jest.runAllTimers();
      const tbodyEle = await waitFor(() => document.querySelector('tbody'));
      fireEvent.mouseEnter(tbodyEle.firstChild.firstChild);
      fireEvent.mouseLeave(tbodyEle.firstChild.firstChild);
    });
  });
});
