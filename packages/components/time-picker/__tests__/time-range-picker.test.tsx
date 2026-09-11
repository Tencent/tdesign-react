import React, { useState } from 'react';
import MockDate from 'mockdate';
import { fireEvent, mockDelay, render, vi, waitFor } from '@test/utils';

import { TimeRangePicker } from '../index';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');

describe('TimeRangePicker', () => {
  describe('props', () => {
    test('props.defaultValue for TimeRangePicker works fine', async () => {
      const { container } = render(<TimeRangePicker defaultValue={['00:00:00', '00:10:20']} />);
      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBe(2);
      expect(inputs.item(0)).toHaveValue('00:00:00');
      expect(inputs.item(1)).toHaveValue('00:10:20');
      fireEvent.click(inputs.item(1));
      await waitFor(() => {
        const scrollPanels = document.querySelectorAll('.t-time-picker__panel-body-scroll');
        expect(scrollPanels.item(0).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('00');
        expect(scrollPanels.item(1).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('10');
        expect(scrollPanels.item(2).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('20');
      });
    });
  });

  describe('events', () => {
    test('props.onInput&onBlur&onForus works fine', async () => {
      const handleBlur = vi.fn();
      const handleInput = vi.fn();
      const handleFocus = vi.fn();
      const { container } = render(
        <TimeRangePicker allowInput onInput={handleInput} onBlur={handleBlur} onFocus={handleFocus} />,
      );
      const inputs = container.querySelectorAll('input');
      fireEvent.focus(inputs[0]);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      fireEvent.change(inputs[0], { target: { value: '00:10:20' } });
      expect(handleInput).toHaveBeenCalledTimes(1);
      fireEvent.blur(inputs[0]);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('slots', () => {
    test('props.label for TimeRangePicker  works fine', async () => {
      const label = 'abc';
      const { container } = render(<TimeRangePicker label={label}></TimeRangePicker>);
      const prefix = container.querySelector('.t-input__prefix');
      expect(prefix).toBeTruthy();
      expect(prefix).toHaveTextContent(label);
    });
  });

  describe('scenarios', () => {
    test('TimeRangePick presets test', async () => {
      const date = ['11:00:00', '12:00:00'];
      const defaultValue = ['00:00:01', '00:00:02'];

      const RangePicker = () => {
        const [value, setValue] = useState(defaultValue);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };

        return (
          <TimeRangePicker
            value={value}
            onChange={onChange}
            allow-input
            presets={{
              此刻: ['11:00:00', '12:00:00'],
            }}
            format="HH:mm:ss"
            clearable
          />
        );
      };
      const { getByText } = render(<RangePicker />);
      fireEvent.click(document.querySelectorAll('input').item(0));
      await mockDelay();
      fireEvent.click(getByText('此刻'));
      fireEvent.click(document.querySelectorAll('input').item(1));
      await mockDelay();
      fireEvent.click(getByText('此刻'));
      fireEvent.click(getByText('确定'));
      const inputs = document.querySelectorAll('input');
      expect(inputs.item(0).value).toBe(date[0]);
      expect(inputs.item(1).value).toBe(date[1]);
    });
  });
});
