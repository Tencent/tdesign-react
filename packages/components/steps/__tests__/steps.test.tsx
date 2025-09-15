import React, { useState } from 'react';
import { render, waitFor, fireEvent, vi } from '@test/utils';
import { omit } from '@tdesign/common-js/utils/helper';
import Steps from '../Steps';
import { TdStepsProps } from '../type';

const { StepItem } = Steps;

type Layout = 'horizontal' | 'vertical';
type Theme = 'default' | 'dot';
type Sequence = 'positive' | 'reverse';

const defaultOptions = [
  { title: '0', content: '这里是提示文字', value: 0 },
  { title: '1', content: '这里是提示文字', value: 1 },
  { title: '2', content: '这里是提示文字', value: 2 },
];

const TEST_ROOT_ID = 'step-test-root';

const StepRender = (props: TdStepsProps) => {
  const [current, setCurrent] = useState<string | number>(0);
  return (
    <div data-testid={TEST_ROOT_ID}>
      <Steps
        options={props.options || defaultOptions}
        current={current}
        {...omit(props, ['onChange'])}
        onChange={(c, p) => {
          setCurrent(c);
          props?.onChange && props.onChange(c, p);
        }}
      />
    </div>
  );
};

const SlotRender = (props: TdStepsProps & { initial?: number }) => {
  const [current, setCurrent] = useState<string | number>(props.initial ?? 0);
  return (
    <div data-testid={TEST_ROOT_ID}>
      <Steps
        current={current}
        {...omit(props, ['onChange'])}
        onChange={(c, p) => {
          setCurrent(c);
          props?.onChange && props.onChange(c, p);
        }}
      >
        <StepItem title="登录" content="已完成状态" />
        <StepItem title="购物" content="进行中状态" />
        <StepItem title="支付" content="未开始" />
      </Steps>
    </div>
  );
};

// --- Helpers to reduce repetition and assert node states ---
const nodeHasState = (el: Element | null, state: 'process' | 'finish' | 'wait') => {
  if (!el) return false;
  const cls = el.className || '';
  const re = new RegExp(`\\bt-steps-item(?:--|-)?${state}\\b`);
  return re.test(cls);
};

const getStepItems = (root: Element) => Array.from(root.querySelectorAll('.t-steps-item'));

const findProcessingIndex = (items: Element[]) => items.findIndex((it) => nodeHasState(it, 'process'));

const verifyDistribution = (root: Element, sequence: Sequence = 'positive') => {
  const items = getStepItems(root);
  const active = findProcessingIndex(items);
  expect(active).toBeGreaterThanOrEqual(0);
  items.forEach((it, idx) => {
    if (idx === active) {
      expect(nodeHasState(it, 'process')).toBe(true);
    } else if (sequence === 'positive') {
      if (idx < active) expect(nodeHasState(it, 'finish')).toBe(true);
      if (idx > active) expect(nodeHasState(it, 'wait')).toBe(true);
    } else {
      if (idx > active) expect(nodeHasState(it, 'finish')).toBe(true);
      if (idx < active) expect(nodeHasState(it, 'wait')).toBe(true);
    }
  });
};

const clickEachAndVerify = async function clickEachAndVerify(root: Element, sequence: Sequence = 'positive') {
  const icons = Array.from(root.querySelectorAll('.t-steps-item__icon'));
  await icons.reduce(
    (prev, icon) =>
      prev.then(async () => {
        fireEvent.click(icon);
        await waitFor(() => {
          const items = getStepItems(root);
          const hasProcess = items.some((it) => nodeHasState(it, 'process'));
          if (!hasProcess) throw new Error('no process state yet');
        });
        verifyDistribution(root, sequence);
      }),
    Promise.resolve(),
  );
};

describe('Steps 组件测试', () => {
  describe('options', () => {
    test('mount/unmount', () => {
      const wrapper = render(<StepRender />);
      expect(() => wrapper.unmount()).not.toThrow();
    });

    test('layout vertical', async () => {
      const { getByTestId } = render(<StepRender layout="vertical" />);
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      expect(root.querySelectorAll('.t-steps--vertical').length).toBe(1);
    });

    test('readonly 不可点击', async () => {
      const { getByTestId } = render(<StepRender readonly />);
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      expect(root.querySelectorAll('.t-steps-item--clickable').length).toBe(0);
    });

    describe('theme / behavior', () => {
      test('theme=default 基本渲染与切换', async () => {
        const { getByTestId } = render(<StepRender theme="default" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(3);

        const icons = root.querySelectorAll('.t-steps-item__icon');
        expect(icons.length).toBe(3);

        const numbers = root.querySelectorAll('.t-steps-item__icon--number');
        expect(numbers.length).toBe(3);
        expect(numbers[0]).toHaveTextContent('1');

        const titles = root.querySelectorAll('.t-steps-item__title');
        expect(titles[0]).toHaveTextContent('0');

        // 初始状态: first process, others wait
        expect(items[0]).toHaveClass('t-steps-item--process');
        expect(items[1]).toHaveClass('t-steps-item--wait');

        // 切换到第二个
        fireEvent.click(numbers[1]);
        expect(items[0]).toHaveClass('t-steps-item--finish');
        expect(items[1]).toHaveClass('t-steps-item--process');

        // 切换到第三个（通过 content 区域）
        const contents = root.querySelectorAll('.t-steps-item__content');
        fireEvent.click(contents[2]);
        expect(items[2]).toHaveClass('t-steps-item--process');
        expect(items[1]).toHaveClass('t-steps-item--finish');
      });

      test('theme=dot 不渲染数字，切换行为', async () => {
        const { getByTestId } = render(<StepRender theme="dot" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

        const numbers = root.querySelectorAll('.t-steps-item__icon--number');
        expect(numbers.length).toBe(0);

        const icons = root.querySelectorAll('.t-steps-item__icon');
        fireEvent.click(icons[1]);
        const items = root.querySelectorAll('.t-steps-item');
        expect(items[1]).toHaveClass('t-steps-item--process');
      });

      test('@change called with correct args (options)', async () => {
        const onChange = vi.fn();
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={2} options={defaultOptions} onChange={onChange} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        fireEvent.click(root.querySelector('.t-steps-item__inner'));
        expect(onChange).toHaveBeenCalledTimes(1);
      });
    });

    describe('sequence 行为 (options)', () => {
      test('positive 正序', async () => {
        const onChange = vi.fn();
        const { getByTestId } = render(<StepRender sequence="positive" onChange={onChange} />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const icons = root.querySelectorAll('.t-steps-item__icon');
        fireEvent.click(icons[1]);
        expect(onChange.mock.calls[0][0]).toBe(1);
        expect(onChange.mock.calls[0][1]).toBe(0);
      });

      test('reverse 倒序', async () => {
        const onChange = vi.fn();
        const { getByTestId } = render(<StepRender sequence="reverse" onChange={onChange} />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const icons = root.querySelectorAll('.t-steps-item__icon');
        // 初始倒序：最后一个应为 finish/process 视实现而定，此处断言为 finish
        expect(icons[2]).toHaveClass('t-steps-item-finish');
        fireEvent.click(icons[0]);
        expect(onChange.mock.calls[0][0]).toBe(2);
      });
    });

    // broader combinations and edge cases for options-based rendering
    const sequenceValues = ['positive', 'reverse'] as const;
    const layoutValues = ['horizontal', 'vertical'] as const;
    const themeValues = ['default', 'dot'] as const;

    const optionCombos: ReadonlyArray<readonly [Sequence, Layout, Theme]> = sequenceValues.flatMap((s) =>
      layoutValues.flatMap((l) => themeValues.map((t) => [s, l, t] as const)),
    );

    test.each(optionCombos)(
      'sequence=%s layout=%s theme=%s 点击每个节点并校验分布',
      async (sequence, layout, theme) => {
        const { getByTestId } = render(<StepRender sequence={sequence} layout={layout} theme={theme} />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        await clickEachAndVerify(root, sequence);
      },
    );

    test('空 options 不报错且无节点', async () => {
      const { getByTestId } = render(<StepRender options={[]} />);
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      const items = root.querySelectorAll('.t-steps-item');
      expect(items.length).toBe(0);
    });

    test('readonly 时点击不触发 onChange', async () => {
      const onChange = vi.fn();
      const { getByTestId } = render(<StepRender readonly onChange={onChange} />);
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      fireEvent.click(root.querySelector('.t-steps-item__icon'));
      expect(onChange).not.toHaveBeenCalled();
    });

    test('非数值 value 正确映射与切换', async () => {
      const opts = [
        { title: 'a', content: 'a', value: 'a' },
        { title: 'b', content: 'b', value: 'b' },
        { title: 'c', content: 'c', value: 'c' },
      ];
      const onChange = vi.fn();
      const { getByTestId } = render(
        <div data-testid={TEST_ROOT_ID}>
          <Steps options={opts} current={'a'} onChange={onChange} />
        </div>,
      );
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      const icons = root.querySelectorAll('.t-steps-item__icon');
      expect(icons.length).toBe(3);
      fireEvent.click(icons[2]);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('slot children', () => {
    test('slot 渲染与自定义 icon', async () => {
      const { getByTestId } = render(
        <div data-testid={TEST_ROOT_ID}>
          <Steps current={1}>
            <StepItem title="登录" content="已完成状态" />
            <StepItem title="购物" content="进行中状态" icon={<button>按钮</button>} />
            <StepItem title="支付" content="未开始" />
            <StepItem title="完成" content="未开始" />
          </Steps>
        </div>,
      );
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      const iconItems = root.querySelectorAll('.t-steps-item__icon');
      expect(iconItems.length).toBe(4);
      expect((iconItems[1].children[0] as Element).tagName.toLowerCase()).toBe('button');
    });

    test('slot @change called and status change', async () => {
      const onChange = vi.fn();
      const { getByTestId } = render(<SlotRender onChange={onChange} initial={2} />);
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      const inner = root.querySelector('.t-steps-item__inner');
      fireEvent.click(inner);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    const slotSequenceThemeCombos: ReadonlyArray<readonly [Sequence, Theme]> = [
      ['positive', 'default'],
      ['reverse', 'default'],
      ['positive', 'dot'],
      ['reverse', 'dot'],
    ];

    test.each(slotSequenceThemeCombos)('sequence=%s theme=%s (slot)', async (sequence, theme) => {
      const onChange = vi.fn();
      const { getByTestId } = render(<SlotRender sequence={sequence} theme={theme} onChange={onChange} />);
      const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
      const icons = root.querySelectorAll('.t-steps-item__icon');
      expect(icons.length).toBe(3);
      await clickEachAndVerify(root, sequence);
      expect(onChange).toHaveBeenCalled();
    });
  });
});
