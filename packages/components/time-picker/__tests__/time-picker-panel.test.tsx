import React from 'react';
import MockDate from 'mockdate';
import { render, vi } from '@test/utils';

import { TimePickerPanel } from '../index';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');

describe('TimePickerPanel', () => {
  describe('props', () => {
    test('props.value for TimePickerPanel works fine', () => {
      const onChange = vi.fn();
      const { container } = render(<TimePickerPanel value={'00:10:20'} onChange={onChange} />);
      const scrollPanels = container.querySelectorAll('.t-time-picker__panel-body-scroll');
      expect(scrollPanels.item(0).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('00');
      expect(scrollPanels.item(1).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('10');
      expect(scrollPanels.item(2).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('20');
    });
  });
});
