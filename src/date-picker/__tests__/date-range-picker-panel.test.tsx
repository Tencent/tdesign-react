import MockDate from 'mockdate';
import React from 'react';
import dayjs from 'dayjs';

import { render } from '@test/utils';

import { DateRangePickerPanel } from '..';
// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2023-09-01');

describe('DateRangePickerPanel', () => {
  beforeEach(() => {
    MockDate.set('2023-09-01');
  });

  afterEach(() => {
    MockDate.reset();
  });

  test('value props', async () => {
    const { container } = render(<DateRangePickerPanel defaultValue={['2023-09-14', '2023-09-14']} />);
    expect(container.querySelector('.t-date-picker__cell--active')).toBeInTheDocument();
    expect(container.querySelector('.t-date-picker__cell--active').firstChild).toHaveTextContent('14');

    const { container: container2 } = render(<DateRangePickerPanel value={['2023-09-12', '2023-09-12']} />);
    expect(container2.querySelector('.t-date-picker__cell--active')).toBeInTheDocument();
    expect(container2.querySelector('.t-date-picker__cell--active').firstChild).toHaveTextContent('12');
  });

  test('disableDate props', async () => {
    const { container: container1 } = render(
      <DateRangePickerPanel disableDate={[dayjs().subtract(1, 'day').format(), dayjs().subtract(2, 'day').format()]} />,
    );
    expect(container1.querySelector('.t-date-picker__cell--disabled')).toBeInTheDocument();
    expect(container1.querySelector('.t-date-picker__cell--disabled').firstChild).toHaveTextContent('30');

    const { container: container2 } = render(
      <DateRangePickerPanel
        disableDate={{
          from: dayjs().add(1, 'day').format(),
          to: dayjs().add(3, 'day').format(),
        }}
      />,
    );
    expect(container2.querySelector('.t-date-picker__cell--disabled')).toBeInTheDocument();
    expect(container2.querySelector('.t-date-picker__cell--disabled').firstChild).toHaveTextContent('2');

    const { container: container3 } = render(
      <DateRangePickerPanel
        disableDate={{
          before: dayjs().subtract(3, 'day').format(),
          after: dayjs().add(3, 'day').format(),
        }}
      />,
    );
    expect(container3.querySelector('.t-date-picker__cell--disabled')).toBeInTheDocument();
    expect(container3.querySelector('.t-date-picker__cell--disabled').firstChild).toHaveTextContent('28');
  });

  test('enableTimePicker props', async () => {
    const { container } = render(<DateRangePickerPanel enableTimePicker />);
    expect(container.querySelector('.t-time-picker__panel')).toBeInTheDocument();
  });

  test('firstDayOfWeek props', async () => {
    const { container } = render(<DateRangePickerPanel firstDayOfWeek={2} />);
    expect(container.querySelector('.t-date-picker__table table thead tr').firstChild).toHaveTextContent('二');
  });

  test('format props', async () => {
    const { container } = render(
      <DateRangePickerPanel defaultValue={['09/02/2023', '09/02/2023']} format="MM/DD/YYYY" />,
    );
    expect(container.querySelector('.t-date-picker__cell--active').firstChild).toHaveTextContent('2');
  });

  test('mode props', async () => {
    const { container: container1 } = render(
      <DateRangePickerPanel mode="date" defaultValue={['2023-09-03', '2023-09-03']} />,
    );
    expect(container1.querySelector('.t-date-picker__cell--active').firstChild).toHaveTextContent('3');

    const { container: container2 } = render(
      <DateRangePickerPanel mode="week" defaultValue={['2023-36周', '2023-36周']} />,
    );
    expect(container2.querySelector('.t-date-picker__table-week-row--active')).toBeInTheDocument();
    expect(container2.querySelector('.t-date-picker__table-week-row--active td').firstChild).toHaveTextContent('36');

    const { container: container3 } = render(
      <DateRangePickerPanel mode="month" defaultValue={['2023-11', '2023-11']} />,
    );
    expect(container3.querySelector('.t-date-picker__cell--active').firstChild).toHaveTextContent('11 月');

    const { container: container4 } = render(<DateRangePickerPanel mode="year" defaultValue={['2024', '2024']} />);
    expect(container4.querySelector('.t-date-picker__cell--active').firstChild).toHaveTextContent('2024');

    // const { container: container5 } = render(<DateRangePickerPanel mode="quarter" defaultValue={['2023-Q2', '2023-Q2']} />);
    // expect(container5.querySelector('.t-date-picker__cell--active')).toHaveTextContent('二季度');
  });

  test('presets props', async () => {
    const { container } = render(<DateRangePickerPanel presets={{ 今天: [new Date(), new Date()] }} />);
    expect(container.querySelector('.t-date-picker__presets')).toBeInTheDocument();
    expect(container.querySelector('.t-date-picker__presets').firstChild.firstChild).toHaveTextContent('今天');
  });

  test('presets、presetsPlacement props', async () => {
    const { container } = render(
      <DateRangePickerPanel presets={{ 今天: [new Date(), new Date()] }} presetsPlacement="left" />,
    );
    expect(container.querySelector('.t-date-picker__presets')).toBeInTheDocument();
    expect(container.querySelector('.t-date-picker__presets').firstChild.firstChild).toHaveTextContent('今天');
    expect(container.querySelector('.t-date-picker__presets').parentNode).toHaveClass('t-date-picker__footer--left');
  });
});
