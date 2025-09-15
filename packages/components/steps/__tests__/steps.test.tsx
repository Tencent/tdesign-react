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
  describe('基础功能', () => {
    describe('渲染测试', () => {
      test('mount/unmount - 组件正常挂载和卸载', () => {
        const wrapper = render(<StepRender />);
        expect(() => wrapper.unmount()).not.toThrow();
      });

      test('options 模式 - 基本渲染', async () => {
        const { getByTestId } = render(<StepRender />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(3);
      });

      test('children 模式 - 基本渲染', async () => {
        const { getByTestId } = render(<SlotRender />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(3);
      });
    });

    describe('layout 属性', () => {
      test('layout=vertical - options模式', async () => {
        const { getByTestId } = render(<StepRender layout="vertical" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--vertical');
      });

      test('layout=vertical - children模式', async () => {
        const { getByTestId } = render(<SlotRender layout="vertical" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--vertical');
      });

      test('layout=horizontal - options模式', async () => {
        const { getByTestId } = render(<StepRender layout="horizontal" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--horizontal');
      });
      test('layout=horizontal - children模式', async () => {
        const { getByTestId } = render(<SlotRender layout="horizontal" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--horizontal');
      });
    });

    describe('readonly 属性', () => {
      test('readonly=true - options模式', async () => {
        const { getByTestId } = render(<StepRender readonly />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        expect(root.querySelectorAll('.t-steps-item--clickable').length).toBe(0);
      });

      test('readonly=true - children模式', async () => {
        const { getByTestId } = render(<SlotRender readonly />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        expect(root.querySelectorAll('.t-steps-item--clickable').length).toBe(0);
      });
    });

    describe('theme 属性', () => {
      test('theme=default - options模式', async () => {
        const { getByTestId } = render(<StepRender theme="default" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const numbers = root.querySelectorAll('.t-steps-item__icon--number');
        expect(numbers.length).toBe(3);
        expect(numbers[0]).toHaveTextContent('1');
      });

      test('theme=default - children模式', async () => {
        const { getByTestId } = render(<SlotRender theme="default" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const numbers = root.querySelectorAll('.t-steps-item__icon--number');
        expect(numbers.length).toBe(3);
        expect(numbers[0]).toHaveTextContent('1');
      });

      test('theme=dot - options模式', async () => {
        const { getByTestId } = render(<StepRender theme="dot" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const numbers = root.querySelectorAll('.t-steps-item__icon--number');
        expect(numbers.length).toBe(0);
      });

      test('theme=dot - children模式', async () => {
        const { getByTestId } = render(<SlotRender theme="dot" />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const numbers = root.querySelectorAll('.t-steps-item__icon--number');
        expect(numbers.length).toBe(0);
      });
    });

    describe('separator 属性', () => {
      test('separator=line - options模式', async () => {
        const { getByTestId } = render(
          <div data-testid="step-test-root-line">
            <Steps current={0} options={defaultOptions} separator="line" />
          </div>,
        );
        const root = await waitFor(() => getByTestId('step-test-root-line'));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--line-separator');
      });

      test('separator=line - children模式', async () => {
        const { getByTestId } = render(
          <div data-testid="step-test-root-line">
            <Steps current={0} separator="line">
              <StepItem title="登录" content="已完成状态" />
              <StepItem title="购物" content="进行中状态" />
              <StepItem title="支付" content="未开始" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId('step-test-root-line'));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--line-separator');
      });

      test('separator=dashed - options模式', async () => {
        const { getByTestId } = render(
          <div data-testid="step-test-root-dashed">
            <Steps current={0} options={defaultOptions} separator="dashed" />
          </div>,
        );
        const root = await waitFor(() => getByTestId('step-test-root-dashed'));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--dashed-separator');
      });

      test('separator=dashed - children模式', async () => {
        const { getByTestId } = render(
          <div data-testid="step-test-root-dashed">
            <Steps current={0} separator="dashed">
              <StepItem title="登录" content="已完成状态" />
              <StepItem title="购物" content="进行中状态" />
              <StepItem title="支付" content="未开始" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId('step-test-root-dashed'));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--dashed-separator');
      });

      test('separator=arrow - options模式', async () => {
        const { getByTestId } = render(
          <div data-testid="step-test-root-arrow">
            <Steps current={0} options={defaultOptions} separator="arrow" />
          </div>,
        );
        const root = await waitFor(() => getByTestId('step-test-root-arrow'));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--arrow-separator');
      });

      test('separator=arrow - children模式', async () => {
        const { getByTestId } = render(
          <div data-testid="step-test-root-arrow">
            <Steps current={0} separator="arrow">
              <StepItem title="登录" content="已完成状态" />
              <StepItem title="购物" content="进行中状态" />
              <StepItem title="支付" content="未开始" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId('step-test-root-arrow'));
        expect(root.querySelector('.t-steps')).toHaveClass('t-steps--arrow-separator');
      });
    });

    describe('数据源属性', () => {
      test('options 数据驱动 - options模式', async () => {
        const { getByTestId } = render(<StepRender />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const titles = root.querySelectorAll('.t-steps-item__title');
        expect(titles[0]).toHaveTextContent('0');
        expect(titles[1]).toHaveTextContent('1');
        expect(titles[2]).toHaveTextContent('2');
      });

      test('children 自定义内容 - children模式', async () => {
        const { getByTestId } = render(<SlotRender />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const titles = root.querySelectorAll('.t-steps-item__title');
        expect(titles[0]).toHaveTextContent('登录');
        expect(titles[1]).toHaveTextContent('购物');
        expect(titles[2]).toHaveTextContent('支付');
      });

      test('自定义 icon - children模式', async () => {
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

      test('自定义 icon - options模式', async () => {
        const customIconOptions = [
          { title: '登录', content: '已完成状态', value: 0 },
          { title: '购物', content: '进行中状态', value: 1, icon: <button>按钮</button> },
          { title: '支付', content: '未开始', value: 2 },
          { title: '完成', content: '未开始', value: 3 },
        ];
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={1} options={customIconOptions} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const iconItems = root.querySelectorAll('.t-steps-item__icon');
        expect(iconItems.length).toBe(4);
        expect((iconItems[1].children[0] as Element).tagName.toLowerCase()).toBe('button');
      });
    });

    describe('current 属性', () => {
      test('current=FINISH - options模式', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current="FINISH" options={defaultOptions} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        items.forEach((item) => {
          expect(item).toHaveClass('t-steps-item--finish');
        });
      });

      test('current=FINISH - children模式', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current="FINISH">
              <StepItem title="登录" content="已完成状态" />
              <StepItem title="购物" content="进行中状态" />
              <StepItem title="支付" content="未开始" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        items.forEach((item) => {
          expect(item).toHaveClass('t-steps-item--finish');
        });
      });
    });

    describe('自定义 status', () => {
      test('自定义 status 优先级 - options模式', async () => {
        const opts = [
          { title: '1', content: 'content1', value: 0, status: 'error' as const },
          { title: '2', content: 'content2', value: 1, status: 'finish' as const },
          { title: '3', content: 'content3', value: 2 },
        ];
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={1} options={opts} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items[0]).toHaveClass('t-steps-item--error');
        expect(items[1]).toHaveClass('t-steps-item--finish');
        expect(items[2]).toHaveClass('t-steps-item--wait');
      });
    });

    describe('defaultCurrent 属性', () => {
      test('非受控模式 defaultCurrent - options模式', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps defaultCurrent={1} options={defaultOptions} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items[1]).toHaveClass('t-steps-item--process');
      });

      test('非受控模式 defaultCurrent - children模式', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps defaultCurrent={1}>
              <StepItem title="登录" content="已完成状态" />
              <StepItem title="购物" content="进行中状态" />
              <StepItem title="支付" content="未开始" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items[1]).toHaveClass('t-steps-item--process');
      });
    });
  });

  describe('交互行为', () => {
    describe('点击交互', () => {
      describe('theme=default', () => {
        test('数字点击切换 - options模式', async () => {
          const { getByTestId } = render(<StepRender theme="default" />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

          const numbers = root.querySelectorAll('.t-steps-item__icon--number');
          expect(numbers[0]).toHaveTextContent('1');

          // 初始状态
          const items = root.querySelectorAll('.t-steps-item');
          expect(items[0]).toHaveClass('t-steps-item--process');

          // 点击第二个
          fireEvent.click(numbers[1]);
          expect(items[0]).toHaveClass('t-steps-item--finish');
          expect(items[1]).toHaveClass('t-steps-item--process');
        });

        test('数字点击切换 - children模式', async () => {
          const { getByTestId } = render(<SlotRender theme="default" />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

          const items = root.querySelectorAll('.t-steps-item');
          expect(items.length).toBe(3);

          const numbers = root.querySelectorAll('.t-steps-item__icon--number');
          expect(numbers.length).toBe(3);
          expect(numbers[0]).toHaveTextContent('1');

          // 切换到第二个
          fireEvent.click(numbers[1]);
          expect(items[0]).toHaveClass('t-steps-item--finish');
          expect(items[1]).toHaveClass('t-steps-item--process');
        });
      });

      describe('theme=dot', () => {
        test('图标点击切换 - options模式', async () => {
          const { getByTestId } = render(<StepRender theme="dot" />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

          const numbers = root.querySelectorAll('.t-steps-item__icon--number');
          expect(numbers.length).toBe(0);

          const icons = root.querySelectorAll('.t-steps-item__icon');
          fireEvent.click(icons[1]);
          const items = root.querySelectorAll('.t-steps-item');
          expect(items[1]).toHaveClass('t-steps-item--process');
        });

        test('图标点击切换 - children模式', async () => {
          const { getByTestId } = render(<SlotRender theme="dot" />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

          const numbers = root.querySelectorAll('.t-steps-item__icon--number');
          expect(numbers.length).toBe(0);

          const icons = root.querySelectorAll('.t-steps-item__icon');
          fireEvent.click(icons[1]);
          const items = root.querySelectorAll('.t-steps-item');
          expect(items[1]).toHaveClass('t-steps-item--process');
        });
      });

      describe('content 区域点击', () => {
        test('content 区域点击 - options模式', async () => {
          const { getByTestId } = render(<StepRender />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

          const contents = root.querySelectorAll('.t-steps-item__content');
          fireEvent.click(contents[2]);
          const items = root.querySelectorAll('.t-steps-item');
          expect(items[2]).toHaveClass('t-steps-item--process');
        });

        test('content 区域点击 - children模式', async () => {
          const { getByTestId } = render(<SlotRender />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));

          const contents = root.querySelectorAll('.t-steps-item__content');
          fireEvent.click(contents[2]);
          const items = root.querySelectorAll('.t-steps-item');
          expect(items[2]).toHaveClass('t-steps-item--process');
        });
      });

      describe('readonly 状态', () => {
        test('readonly 时点击无效 - options模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(<StepRender readonly onChange={onChange} />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          fireEvent.click(root.querySelector('.t-steps-item__icon'));
          expect(onChange).not.toHaveBeenCalled();
        });

        test('readonly 时点击无效 - children模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(<SlotRender readonly onChange={onChange} />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          fireEvent.click(root.querySelector('.t-steps-item__icon'));
          expect(onChange).not.toHaveBeenCalled();
        });
      });
    });

    describe('状态变化', () => {
      describe('onChange 回调', () => {
        test('onChange 回调参数正确 - options模式', async () => {
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

        test('onChange 回调参数正确 - children模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(
            <div data-testid={TEST_ROOT_ID}>
              <Steps current={2} onChange={onChange}>
                <StepItem title="登录" content="已完成状态" />
                <StepItem title="购物" content="进行中状态" />
                <StepItem title="支付" content="未开始" />
              </Steps>
            </div>,
          );
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          fireEvent.click(root.querySelector('.t-steps-item__inner'));
          expect(onChange).toHaveBeenCalledTimes(1);
        });
      });

      describe('非数值 value 映射', () => {
        test('非数值 value 映射 - options模式', async () => {
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
          fireEvent.click(icons[2]);
          expect(onChange).toHaveBeenCalled();
        });

        test('非数值 value 映射 - children模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(
            <div data-testid={TEST_ROOT_ID}>
              <Steps current="second" onChange={onChange}>
                <StepItem title="first" content="content1" value="first" />
                <StepItem title="second" content="content2" value="second" />
                <StepItem title="third" content="content3" value="third" />
              </Steps>
            </div>,
          );
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          const icons = root.querySelectorAll('.t-steps-item__icon');
          fireEvent.click(icons[2]);
          expect(onChange).toHaveBeenCalled();
        });
      });
    });
  });

  describe('特殊场景', () => {
    describe('边缘情况', () => {
      test('空 options', async () => {
        const { getByTestId } = render(<StepRender options={[]} />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(0);
      });

      test('空 children', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={0}></Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(0);
      });

      test('单个步骤 - options模式', async () => {
        const singleOption = [{ title: 'single', content: 'single content', value: 0 }];
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={0} options={singleOption} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(1);
        expect(items[0]).toHaveClass('t-steps-item--process');
      });

      test('单个步骤 - children模式', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={0}>
              <StepItem title="single" content="single content" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(1);
        expect(items[0]).toHaveClass('t-steps-item--process');
      });

      test('重复 value 映射 - options模式', async () => {
        const opts = [
          { title: '1', content: 'content1', value: 0 },
          { title: '2', content: 'content2', value: 0 }, // 重复 value，后面的覆盖前面的
          { title: '3', content: 'content3', value: 1 },
        ];
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current={0} options={opts} />
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(3);
        // 由于 value 重复，后面的覆盖前面的，所以 current=0 匹配第二个项目
        expect(items[0]).toHaveClass('t-steps-item--finish');
        expect(items[1]).toHaveClass('t-steps-item--process');
        expect(items[2]).toHaveClass('t-steps-item--wait');
      });
    });

    describe('sequence 行为', () => {
      describe('positive 顺序', () => {
        test('positive 顺序 - options模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(<StepRender sequence="positive" onChange={onChange} defaultCurrent={0} />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          const icons = root.querySelectorAll('.t-steps-item__icon');
          expect(icons[0]).toHaveClass('t-steps-item-process');
          fireEvent.click(icons[2]);
          expect(onChange.mock.calls[0][0]).toBe(2);
          expect(onChange.mock.calls[0][1]).toBe(0);
        });

        test('positive 顺序 - children模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(<SlotRender sequence="positive" onChange={onChange} initial={0} />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          const icons = root.querySelectorAll('.t-steps-item__icon');
          expect(icons[0]).toHaveClass('t-steps-item-process');
          fireEvent.click(icons[2]);
          expect(onChange.mock.calls[0][0]).toBe(2);
          expect(onChange.mock.calls[0][1]).toBe(0);
        });
      });

      describe('reverse 倒序', () => {
        test('reverse 倒序 - options模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(<StepRender sequence="reverse" onChange={onChange} defaultCurrent={0} />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          const icons = root.querySelectorAll('.t-steps-item__icon');
          expect(icons[2]).toHaveClass('t-steps-item-process');
          fireEvent.click(icons[0]);
          expect(onChange.mock.calls[0][0]).toBe(2);
          expect(onChange.mock.calls[0][1]).toBe(0);
          expect(icons[2]).toHaveClass('t-steps-item-finish');
          expect(icons[0]).toHaveClass('t-steps-item-process');
        });

        test('reverse 倒序 - children模式', async () => {
          const onChange = vi.fn();
          const { getByTestId } = render(<SlotRender sequence="reverse" onChange={onChange} initial={0} />);
          const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
          const icons = root.querySelectorAll('.t-steps-item__icon');
          expect(icons[2]).toHaveClass('t-steps-item-process');
          fireEvent.click(icons[0]);
          expect(onChange.mock.calls[0][0]).toBe(2);
          expect(onChange.mock.calls[0][1]).toBe(0);
          expect(icons[2]).toHaveClass('t-steps-item-finish');
          expect(icons[0]).toHaveClass('t-steps-item-process');
        });
      });
    });

    describe('配置组合', () => {
      const sequenceValues = ['positive', 'reverse'] as const;
      const layoutValues = ['horizontal', 'vertical'] as const;
      const themeValues = ['default', 'dot'] as const;

      const optionCombos: ReadonlyArray<readonly [Sequence, Layout, Theme]> = sequenceValues.flatMap((s) =>
        layoutValues.flatMap((l) => themeValues.map((t) => [s, l, t] as const)),
      );

      test.each(optionCombos)('options模式: sequence=%s layout=%s theme=%s', async (sequence, layout, theme) => {
        const { getByTestId } = render(<StepRender sequence={sequence} layout={layout} theme={theme} />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        await clickEachAndVerify(root, sequence);
      });

      const slotSequenceThemeCombos: ReadonlyArray<readonly [Sequence, Theme]> = [
        ['positive', 'default'],
        ['reverse', 'default'],
        ['positive', 'dot'],
        ['reverse', 'dot'],
      ];

      test.each(slotSequenceThemeCombos)('children模式: sequence=%s theme=%s', async (sequence, theme) => {
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

  describe('模式对比', () => {
    describe('Options模式特性', () => {
      test('options 数据驱动渲染', async () => {
        const { getByTestId } = render(<StepRender />);
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const titles = root.querySelectorAll('.t-steps-item__title');
        expect(titles.length).toBe(3);
        expect(titles[0]).toHaveTextContent('0');
      });
    });

    describe('Children模式特性', () => {
      test('children 模式下 value 映射', async () => {
        const { getByTestId } = render(
          <div data-testid={TEST_ROOT_ID}>
            <Steps current="second">
              <StepItem title="first" content="content1" value="first" />
              <StepItem title="second" content="content2" value="second" />
              <StepItem title="third" content="content3" value="third" />
            </Steps>
          </div>,
        );
        const root = await waitFor(() => getByTestId(TEST_ROOT_ID));
        const items = root.querySelectorAll('.t-steps-item');
        expect(items.length).toBe(3);
        expect(items[0]).toHaveClass('t-steps-item--finish');
        expect(items[1]).toHaveClass('t-steps-item--process');
        expect(items[2]).toHaveClass('t-steps-item--wait');
      });
    });
  });
});
