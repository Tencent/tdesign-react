import React from 'react';
import { testExamples, render } from '@test/utils';
import Steps from '../Steps';
import Step from '../Step';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Steps 组件测试', () => {
  test('mount, unmount 测试', () => {
    const wrapper = render(
      <Steps current={1}>
        <Step status="finish" title="1" content="这里是提示文字"></Step>
        <Step status="process" title="2" content="这里是提示文字"></Step>
        <Step status="error" title="3" content="这里是提示文字"></Step>
        <Step status="wait" title="4" content="这里是提示文字"></Step>
      </Steps>,
    );

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });
});
