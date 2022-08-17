import React from 'react';
import { testExamples, render, waitFor, fireEvent } from '@test/utils';
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

  test('options 测试', async () => {
    const testId = 'step options test';
    const handleChange = jest.fn();

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Steps
          current={2}
          options={[
            {
              title: '1',
              content: '这里是提示文字',
              value: 1,
            },
            {
              title: '2',
              content: '这里是提示文字',
              value: 2,
            },
            {
              title: '3',
              content: '这里是提示文字',
              value: 3,
            },
          ]}
          onChange={handleChange}
        />
      </div>,
    );

    const stepsInstance = await waitFor(() => getByTestId(testId));
    const stepsItems = stepsInstance.querySelectorAll('.t-steps-item');
    expect(stepsItems.length).toBe(3);

    fireEvent.click(stepsInstance.querySelector('.t-steps-item__inner'));
    expect(handleChange).toBeCalledTimes(1);
  });
});
