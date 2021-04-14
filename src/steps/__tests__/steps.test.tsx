import React from 'react';
import { testExamples, render } from '@test/utils';
import Steps from '../Steps';

const { StepItem } = Steps;

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Steps 组件测试', () => {
  test('mount, unmount 测试', () => {
    const wrapper = render(
      <Steps current={1}>
        <StepItem status="finish" title="1" content="这里是提示文字"></StepItem>
        <StepItem status="process" title="2" content="这里是提示文字"></StepItem>
        <StepItem status="error" title="3" content="这里是提示文字"></StepItem>
        <StepItem status="wait" title="4" content="这里是提示文字"></StepItem>
      </Steps>,
    );

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });
});
