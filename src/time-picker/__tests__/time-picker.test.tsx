import MockDate from 'mockdate';
// import { render } from '@test/utils';
// import React from 'react';
// import TimePicker from '../index';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2022-08-27');

// TODO
describe('Cascader 组件测试', () => {
  test('dom', () => {
    expect(true).toBe(true);
  });
});
