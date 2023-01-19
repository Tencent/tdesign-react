import MockDate from 'mockdate';
import { fireEvent, render, waitFor } from '@test/utils';
import React from 'react';
import TimePicker from '../index';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');

// TODO
describe('Timepicker 组件测试', () => {
  it('props.disabled works fine', () => {
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

  it('trigger panel works fine', async () => {
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

  it('props.defaultValue works fine', async () => {
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

  it('click to pick', async () => {
    const { container } = render(<TimePicker defaultValue="00:00:00"></TimePicker>);
    fireEvent.click(document.querySelector('input'));
    await waitFor(async () => {
      const confirmBtn = document.querySelectorAll('.t-time-picker__panel button').item(0);
      expect(confirmBtn).toBeInTheDocument();
      const panelItem1 = document.querySelectorAll('.t-time-picker__panel-body-scroll').item(0);
      // await fireEvent.scroll(panelItem1, { target: { scrollY: 24 } });
      fireEvent.click(panelItem1.querySelectorAll('.t-time-picker__panel-body-scroll-item').item(1));
      fireEvent.click(confirmBtn);
      expect(container.querySelectorAll('input').item(0)).toHaveValue('01:00:00');
    });
  });
});
