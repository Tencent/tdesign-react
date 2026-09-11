import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, mockDelay, render, vi, waitFor } from '@test/utils';

import TimePicker from '../index';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');

describe('TimePicker', () => {
  describe('props', () => {
    test('props.disabled works fine', () => {
      // disabled default value is
      const wrapper1 = render(<TimePicker></TimePicker>);
      const container1 = wrapper1.container.querySelector('.t-time-picker');
      expect(container1.querySelector('.t-is-disabled')).toBeFalsy();
      // disabled = true
      const wrapper2 = render(<TimePicker disabled={true}></TimePicker>);
      const container2 = wrapper2.container.querySelector('.t-time-picker .t-input');
      expect(container2).toHaveClass('t-is-disabled');
      // disabled = false
      const wrapper3 = render(<TimePicker disabled={false}></TimePicker>);
      const container3 = wrapper3.container.querySelector('.t-time-picker');
      expect(container3.querySelector('.t-is-disabled')).toBeFalsy();
    });

    test('props.defaultValue works fine', async () => {
      const { container } = render(<TimePicker defaultValue="00:10:20"></TimePicker>);
      expect(container.querySelectorAll('input').length).toBe(1);
      expect(container.querySelectorAll('input').item(0)).toHaveValue('00:10:20');
      fireEvent.click(document.querySelector('input'));
      await waitFor(() => {
        const scrollPanels = document.querySelectorAll('.t-time-picker__panel-body-scroll');
        expect(scrollPanels.item(0).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('00');
        expect(scrollPanels.item(1).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('10');
        expect(scrollPanels.item(2).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('20');
      });
    });

    test('props.defaultValue for TimePicker works fine', async () => {
      const { container } = render(<TimePicker defaultValue="00:10:20"></TimePicker>);
      expect(container.querySelectorAll('input').length).toBe(1);
      expect(container.querySelectorAll('input').item(0)).toHaveValue('00:10:20');
      fireEvent.click(document.querySelector('input'));
      await waitFor(() => {
        const scrollPanels = document.querySelectorAll('.t-time-picker__panel-body-scroll');
        expect(scrollPanels.item(0).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('00');
        expect(scrollPanels.item(1).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('10');
        expect(scrollPanels.item(2).querySelectorAll('.t-is-current').item(0)).toHaveTextContent('20');
      });
    });
  });

  describe('slots', () => {
    test('props.label for TimePicker  works fine', async () => {
      const label = 'abc';
      const { container } = render(<TimePicker label={label}></TimePicker>);
      const prefix = container.querySelector('.t-input__prefix');
      expect(prefix).toBeTruthy();
      expect(prefix).toHaveTextContent(label);
    });
  });

  describe('scenarios', () => {
    test('trigger panel works fine', async () => {
      const { container } = render(<TimePicker></TimePicker>);
      expect(container.querySelectorAll('input').length).toBe(1);
      fireEvent.click(document.querySelector('input'));
      await waitFor(() => {
        expect(document.querySelector('.t-time-picker__panel')).not.toBeNull();
        expect(document.querySelector('.t-time-picker__panel')).toHaveStyle({
          display: 'block',
        });
        expect(document.querySelectorAll('.t-time-picker__panel-body-scroll').length).toBe(3);
      });
    });

    test('props.allowInput works fine', async () => {
      const handleBlur = vi.fn();
      const handleFocus = vi.fn();
      const { container } = render(<TimePicker onBlur={handleBlur} onFocus={handleFocus} allowInput />);
      const InputDom = container.querySelector('.t-input__inner');
      fireEvent.click(InputDom);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      // input blur is not equal to TimePicker.blur
      fireEvent.mouseDown(document);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test('click to pick', async () => {
      const handleChange = vi.fn();
      const handleOpen = vi.fn();
      const handlePick = vi.fn();
      render(
        <TimePicker
          defaultValue="00:00:00"
          onChange={handleChange}
          onOpen={handleOpen}
          onPick={handlePick}
        ></TimePicker>,
      );
      fireEvent.click(document.querySelector('input'));
      expect(handleOpen).toHaveBeenCalledTimes(1);
      await waitFor(async () => {
        const confirmBtn = document.querySelectorAll('.t-time-picker__panel button').item(0);
        expect(confirmBtn).toBeInTheDocument();
        const panelItem1 = document.querySelectorAll('.t-time-picker__panel-body-scroll').item(0);
        fireEvent.click(panelItem1.querySelectorAll('.t-time-picker__panel-body-scroll-item').item(1));

        expect(handlePick).toHaveBeenCalled();
        fireEvent.click(confirmBtn);
        // expect(container.querySelectorAll('input').item(0)).toHaveValue('01:00:00');
        // expect(handleChange).toHaveBeenCalled(1);
      });
    });

    test('TimePicker presets test', async () => {
      const date = '20:00:00';
      const { container, getByText } = render(
        <TimePicker
          value={date}
          presets={{
            此刻: '11:00:00',
          }}
          clearable
        />,
      );

      fireEvent.click(document.querySelector('.t-input'));
      await mockDelay();
      fireEvent.click(getByText('此刻'));
      fireEvent.click(getByText('确定'));

      const inputs = container.querySelectorAll('input');
      expect(inputs.item(0).value).toBe(date);
    });
  });
});
