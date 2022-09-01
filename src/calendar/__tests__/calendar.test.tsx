import MockDate from 'mockdate';
import { testExamples, render, fireEvent } from '@test/utils';

import React from 'react';
import Calendar from '../Calendar';
// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2021-08-27');

// 测试组件代码 Example 快照
testExamples(__dirname);
// every component needs four parts: props/events/slots/functions.
describe('Calendar测试', () => {
  // test props api
  describe(':props', () => {
    it(':value', () => {
      const wrapper = render(<Calendar value={'2022-08-30'}></Calendar>);
      expect(wrapper).toMatchSnapshot();
    });

    it(':theme', () => {
      const { container } = render(<Calendar theme={'card'}></Calendar>);
      expect(container.firstChild.classList.contains('t-calendar--card')).toBeTruthy();
    });

    it('fillWithZero', () => {
      const { getAllByText } = render(<Calendar fillWithZero={true} />);
      const tableCell = getAllByText(/^0/i);
      expect(tableCell[0]).toBeInTheDocument();
    });

    it(':mode', () => {
      const wrapper = render(<Calendar mode={'year'}></Calendar>);
      expect(wrapper).toMatchSnapshot();
    });

    it(':firstDayOfWeek', () => {
      const wrapper = render(<Calendar firstDayOfWeek={3}></Calendar>);
      expect(wrapper).toMatchSnapshot();
    });

    it(':isShowWeekendDefault', () => {
      const wrapper = render(<Calendar isShowWeekendDefault={false}></Calendar>);
      expect(wrapper).toMatchSnapshot();
    });

    it(':range', () => {
      const testRange = ['2012-08', '2022-08'];
      const wrapper = render(<Calendar range={testRange}></Calendar>);
      expect(wrapper).toMatchSnapshot();
    });
    test('click 单击单元格', async () => {
      const mockFn = jest.fn();
      const { container } = render(<Calendar onCellClick={mockFn}></Calendar>);
      fireEvent.click(container.querySelector('.t-calendar__table-body-cell'));
      expect(mockFn).toHaveBeenCalled();
    });
    test('click 双击单元格', async () => {
      const mockFn = jest.fn();
      const { container } = render(<Calendar onCellDoubleClick={mockFn}></Calendar>);
      fireEvent.doubleClick(container.querySelector('.t-calendar__table-body-cell'));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
