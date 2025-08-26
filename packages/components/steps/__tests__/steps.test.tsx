import React, { useState } from 'react';
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

const testId = 'step readonly test';

const StepRender = ({ theme }: { theme: 'default' | 'dot' }) => {
  const [current, setCurrent] = useState<string | number>(1);
  return (
    <div data-testid={testId}>
      <Steps options={stepOptions} current={current} theme={theme} onChange={(current) => setCurrent(current)} />
    </div>
  );
};

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
    expect(handleChange).toHaveBeenCalledTimes(1);
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

  test('theme=default - 切换渲染', async () => {
    const { getByTestId } = render(<StepRender theme="default" />);

    const stepsInstance = await waitFor(() => getByTestId(testId));

    const items = stepsInstance.querySelectorAll('.t-steps-item');
    expect(items.length).toBe(3);

    const stepsItemIcons = stepsInstance.querySelectorAll('.t-steps-item__icon');
    expect(stepsItemIcons.length).toBe(3);

    const contentItems = stepsInstance.querySelectorAll('.t-steps-item__content');
    expect(contentItems.length).toBe(3);

    const titleItems = stepsInstance.querySelectorAll('.t-steps-item__title');
    expect(titleItems.length).toBe(3);
    expect(titleItems[0]).toHaveTextContent('1');
    expect(titleItems[1]).toHaveTextContent('2');
    expect(titleItems[2]).toHaveTextContent('3');

    const descriptionItems = stepsInstance.querySelectorAll('.t-steps-item__description');
    expect(descriptionItems.length).toBe(3);
    expect(descriptionItems[0]).toHaveTextContent('这里是提示文字');
    expect(descriptionItems[1]).toHaveTextContent('这里是提示文字');
    expect(descriptionItems[2]).toHaveTextContent('这里是提示文字');

    const iconNumberItems = stepsInstance.querySelectorAll('.t-steps-item__icon--number');
    expect(iconNumberItems.length).toBe(3);
    expect(iconNumberItems[0]).toHaveTextContent('1');
    expect(iconNumberItems[1]).toHaveTextContent('2');
    expect(iconNumberItems[2]).toHaveTextContent('3');
    expect(items[0]).toHaveClass('t-steps-item--process');
    expect(items[1]).toHaveClass('t-steps-item--wait');
    expect(items[2]).toHaveClass('t-steps-item--wait');

    // 点击切换到第二个步骤
    fireEvent.click(iconNumberItems[1]);
    expect(iconNumberItems[0].children.length).toBe(1);
    expect((iconNumberItems[0].children[0] as Element).tagName.toLowerCase()).toBe('svg');
    expect(iconNumberItems[1]).toHaveTextContent('2');
    expect(iconNumberItems[2]).toHaveTextContent('3');
    expect(items[0]).toHaveClass('t-steps-item--finish');
    expect(items[1]).toHaveClass('t-steps-item--process');
    expect(items[2]).toHaveClass('t-steps-item--wait');

    // 点击切换到第三个步骤
    fireEvent.click(contentItems[2]);
    expect(iconNumberItems[0].children.length).toBe(1);
    expect((iconNumberItems[0].children[0] as Element).tagName.toLowerCase()).toBe('svg');
    expect(iconNumberItems[1].children.length).toBe(1);
    expect((iconNumberItems[1].children[0] as Element).tagName.toLowerCase()).toBe('svg');
    expect(iconNumberItems[2]).toHaveTextContent('3');
    expect(items[0]).toHaveClass('t-steps-item--finish');
    expect(items[1]).toHaveClass('t-steps-item--finish');
    expect(items[2]).toHaveClass('t-steps-item--process');
  });

  test('theme=dot - 切换渲染', async () => {
    const { getByTestId } = render(<StepRender theme="dot" />);

    const stepsInstance = await waitFor(() => getByTestId(testId));

    const items = stepsInstance.querySelectorAll('.t-steps-item');
    expect(items.length).toBe(3);

    const stepsItemIcons = stepsInstance.querySelectorAll('.t-steps-item__icon');
    expect(stepsItemIcons.length).toBe(3);
    //  测试 theme=dot 不渲染数字
    const iconNumberItems = stepsInstance.querySelectorAll('.t-steps-item__icon--number');
    expect(iconNumberItems.length).toBe(0);

    const contentItems = stepsInstance.querySelectorAll('.t-steps-item__content');
    expect(contentItems.length).toBe(3);

    const titleItems = stepsInstance.querySelectorAll('.t-steps-item__title');
    expect(titleItems.length).toBe(3);
    expect(titleItems[0]).toHaveTextContent('1');
    expect(titleItems[1]).toHaveTextContent('2');
    expect(titleItems[2]).toHaveTextContent('3');

    const descriptionItems = stepsInstance.querySelectorAll('.t-steps-item__description');
    expect(descriptionItems.length).toBe(3);
    expect(descriptionItems[0]).toHaveTextContent('这里是提示文字');
    expect(descriptionItems[1]).toHaveTextContent('这里是提示文字');
    expect(descriptionItems[2]).toHaveTextContent('这里是提示文字');

    expect(items[0]).toHaveClass('t-steps-item--process');
    expect(items[1]).toHaveClass('t-steps-item--wait');
    expect(items[2]).toHaveClass('t-steps-item--wait');

    // 点击切换到第二个步骤
    fireEvent.click(stepsItemIcons[1]);
    expect(items[0]).toHaveClass('t-steps-item--finish');
    expect(items[1]).toHaveClass('t-steps-item--process');
    expect(items[2]).toHaveClass('t-steps-item--wait');

    // 点击切换到第二个步骤
    fireEvent.click(contentItems[2]);
    expect(items[0]).toHaveClass('t-steps-item--finish');
    expect(items[1]).toHaveClass('t-steps-item--finish');
    expect(items[2]).toHaveClass('t-steps-item--process');
  });
});
