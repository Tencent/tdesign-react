import React, { useState } from 'react';
import { render, waitFor, fireEvent, vi } from '@test/utils';
import { omit } from '@tdesign/common-js/utils/helper';
import Steps from '../Steps';
import { TdStepsProps } from '../type';

const { StepItem } = Steps;

const stepOptions = [
  {
    title: '0',
    content: '这里是提示文字',
    value: 0,
  },
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
];

const testId = 'step readonly test';

const StepRender = (props: TdStepsProps) => {
  const [current, setCurrent] = useState<string | number>(0);
  return (
    <div data-testid={testId}>
      <Steps
        options={props.options || stepOptions}
        current={current}
        {...omit(props, ['onChange'])}
        onChange={(current, previous) => {
          setCurrent(current);
          props?.onChange && props.onChange(current, previous);
        }}
      />
    </div>
  );
};

describe('Steps 组件测试', () => {
  test('mount, unmount 测试', () => {
    const wrapper = render(<StepRender />);

    expect(() => {
      wrapper.unmount();
    }).not.toThrow();
  });

  test('layout vertical 测试', async () => {
    const testId = 'step layout test';

    const { getByTestId } = render(
      <div data-testid={testId}>
        <StepRender layout="vertical" />
      </div>,
    );

    const stepsInstance = await waitFor(() => getByTestId(testId));
    const stepsItems = stepsInstance.querySelectorAll('.t-steps--vertical');
    expect(stepsItems.length).toBe(1);
  });

  test('layout readonly 测试', async () => {
    const testId = 'step readonly test';

    const { getByTestId } = render(<StepRender readonly />);

    const stepsInstance = await waitFor(() => getByTestId(testId));
    const stepsItems = stepsInstance.querySelectorAll('.t-steps-item--clickable');
    expect(stepsItems.length).toBe(0);
  });

  describe('theme = default', () => {
    test('切换进度', async () => {
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
      expect(titleItems[0]).toHaveTextContent('0');
      expect(titleItems[1]).toHaveTextContent('1');
      expect(titleItems[2]).toHaveTextContent('2');

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

    test('@change', async () => {
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
  });

  describe('theme = dot', () => {
    test('切换进度', async () => {
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
      expect(titleItems[0]).toHaveTextContent('0');
      expect(titleItems[1]).toHaveTextContent('1');
      expect(titleItems[2]).toHaveTextContent('2');

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

    test('切换渲染、渲染自定义图标', async () => {
      const { getByTestId } = render(
        <div data-testid={testId}>
          <Steps current={1}>
            <StepItem title="登录" content="已完成状态" />
            <StepItem title="购物" content="进行中状态" icon={<button>按钮</button>} />
            <StepItem title="支付" content="未开始" />
            <StepItem title="完成" content="未开始" />
          </Steps>
        </div>,
      );
      const stepsInstance = await waitFor(() => getByTestId(testId));

      const iconItems = stepsInstance.querySelectorAll('.t-steps-item__icon');
      expect(iconItems.length).toBe(4);
      expect(iconItems[0].children.length).toBe(1);
      expect((iconItems[0].children[0] as Element).tagName.toLowerCase()).toBe('span');
      expect(iconItems[1].children.length).toBe(1);
      expect((iconItems[1].children[0] as Element).tagName.toLowerCase()).toBe('button');
      expect(iconItems[2].children.length).toBe(1);
      expect((iconItems[2].children[0] as Element).tagName.toLowerCase()).toBe('span');
      expect(iconItems[3].children.length).toBe(1);
      expect((iconItems[3].children[0] as Element).tagName.toLowerCase()).toBe('span');
    });

    test('@change', async () => {
      const handleChange = vi.fn();

      const { getByTestId } = render(
        <div data-testid={testId}>
          <Steps current={2} options={stepOptions} onChange={handleChange} theme="dot" />
        </div>,
      );

      const stepsInstance = await waitFor(() => getByTestId(testId));
      const stepsItems = stepsInstance.querySelectorAll('.t-steps-item');
      expect(stepsItems.length).toBe(3);

      fireEvent.click(stepsInstance.querySelector('.t-steps-item__inner'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });
  describe('sequence', async () => {
    test('positive - 正序', async () => {
      const onChange = vi.fn();
      const { getByTestId } = render(<StepRender sequence="positive" onChange={onChange} />);
      const stepsInstance = await waitFor(() => getByTestId(testId));

      const stepsItemIcons = stepsInstance.querySelectorAll('.t-steps-item__icon');
      expect(stepsItemIcons.length).toBe(3);

      fireEvent.click(stepsItemIcons[1]);
      expect(onChange.mock.calls[0][0]).toBe(1);
      expect(onChange.mock.calls[0][1]).toBe(0);
      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-finish');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-process');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-default');

      fireEvent.click(stepsItemIcons[2]);
      expect(onChange.mock.calls[1][0]).toBe(2);
      expect(onChange.mock.calls[1][1]).toBe(1);
      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-finish');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-finish');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-process');

      fireEvent.click(stepsItemIcons[0]);
      expect(onChange.mock.calls[2][0]).toBe(0);
      expect(onChange.mock.calls[2][1]).toBe(2);
      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-process');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-default');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-default');
    });

    test('reverse - 倒序', async () => {
      const onChange = vi.fn();
      const { getByTestId } = render(<StepRender sequence="reverse" onChange={onChange} />);
      const stepsInstance = await waitFor(() => getByTestId(testId));

      const stepsItemIcons = stepsInstance.querySelectorAll('.t-steps-item__icon');
      expect(stepsItemIcons.length).toBe(3);

      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-default');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-default');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-process');

      fireEvent.click(stepsItemIcons[0]);
      expect(onChange.mock.calls[0][0]).toBe(2);
      expect(onChange.mock.calls[0][1]).toBe(0);
      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-process');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-finish');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-finish');

      fireEvent.click(stepsItemIcons[1]);
      expect(onChange.mock.calls[1][0]).toBe(1);
      expect(onChange.mock.calls[1][1]).toBe(2);
      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-default');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-process');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-finish');

      fireEvent.click(stepsItemIcons[2]);
      expect(onChange.mock.calls[2][0]).toBe(0);
      expect(onChange.mock.calls[2][1]).toBe(1);
      expect(stepsItemIcons[0]).toHaveClass('t-steps-item-default');
      expect(stepsItemIcons[1]).toHaveClass('t-steps-item-default');
      expect(stepsItemIcons[2]).toHaveClass('t-steps-item-process');
    });
  });
});
