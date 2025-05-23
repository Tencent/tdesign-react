import React from 'react';
import { render, waitFor, fireEvent, vi } from '@test/utils';
import Steps from '../Steps';

const { StepItem } = Steps;

const stepOptions = [
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
];

describe('Steps 组件测试', () => {
  test('mount, unmount 测试', () => {
    const wrapper = render(
      <Steps current={1}>
        <StepItem status="finish" title="1" content="这里是提示文字"></StepItem>
        <StepItem status="process" title="2" content="这里是提示文字"></StepItem>
        <StepItem status="error" title="3" content="这里是提示文字"></StepItem>
        <StepItem title="4" content="这里是提示文字"></StepItem>
      </Steps>,
    );

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  test('options 测试', async () => {
    const testId = 'step options test';
    const handleChange = vi.fn();

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Steps current={2} options={stepOptions} onChange={handleChange} />
      </div>,
    );

    const stepsInstance = await waitFor(() => getByTestId(testId));
    const stepsItems = stepsInstance.querySelectorAll('.t-steps-item');
    expect(stepsItems.length).toBe(3);

    fireEvent.click(stepsInstance.querySelector('.t-steps-item__inner'));
    expect(handleChange).toBeCalledTimes(1);
  });

  test('layout vertical 测试', async () => {
    const testId = 'step layout test';

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Steps layout="vertical" options={stepOptions} />
      </div>,
    );

    const stepsInstance = await waitFor(() => getByTestId(testId));
    const stepsItems = stepsInstance.querySelectorAll('.t-steps--vertical');
    expect(stepsItems.length).toBe(1);
  });

  test('layout readonly 测试', async () => {
    const testId = 'step readonly test';

    const { getByTestId } = render(
      <div data-testid={testId}>
        <Steps options={stepOptions} readonly />
      </div>,
    );

    const stepsInstance = await waitFor(() => getByTestId(testId));
    const stepsItems = stepsInstance.querySelectorAll('.t-steps-item--clickable');
    expect(stepsItems.length).toBe(0);
  });
});
