import MockDate from 'mockdate';
import { render, fireEvent, vi } from '@test/utils';

import React from 'react';
import Calendar from '../Calendar';
// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2021-08-27');

// every component needs four parts: props/events/slots/functions.
describe('Calendar测试', () => {
  // test props api
  describe(':props', () => {
    test(':theme', () => {
      const { container } = render(<Calendar theme={'card'}></Calendar>);
      expect(container.firstChild.classList.contains('t-calendar--card')).toBeTruthy();
    });

    test('fillWithZero', () => {
      const { getAllByText } = render(<Calendar fillWithZero={true} />);
      const tableCell = getAllByText(/^0/i);
      expect(tableCell[0]).toBeInTheDocument();
    });

    test('click 单击单元格', async () => {
      const mockFn = vi.fn();
      const { container } = render(<Calendar onCellClick={mockFn}></Calendar>);
      fireEvent.click(container.querySelector('.t-calendar__table-body-cell'));
      expect(mockFn).toHaveBeenCalled();
    });
    test('click 双击单元格', async () => {
      const mockFn = vi.fn();
      const { container } = render(<Calendar onCellDoubleClick={mockFn}></Calendar>);
      fireEvent.doubleClick(container.querySelector('.t-calendar__table-body-cell'));
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
