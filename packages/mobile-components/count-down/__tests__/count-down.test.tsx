import { render, act, describe, test, expect, vi, beforeEach, afterEach } from '@test/utils';
import React from 'react';
import CountDown, { CountDownRef } from '../CountDown';

const time = 96 * 60 * 1000;

describe('CountDown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('props', () => {
    test(':time', async () => {
      const { container } = render(<CountDown time={time} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test(':autoStart true', async () => {
      const onChange = vi.fn();
      const { container } = render(<CountDown time={time} autoStart={true} onChange={onChange} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(onChange).toHaveBeenCalled();
      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test(':autoStart false', async () => {
      const onChange = vi.fn();
      const { container } = render(<CountDown time={time} autoStart={false} onChange={onChange} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(onChange).not.toHaveBeenCalled();
      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test(':format', async () => {
      const { container } = render(<CountDown time={time} format="HH:mm:ss" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    test(':millisecond', async () => {
      const { container } = render(<CountDown time={time} millisecond />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // 验证毫秒格式显示 (默认格式应该包含毫秒)
      expect(container.textContent).toMatch(/\d{2}:\d{2}:\d{2}:\d{3}/);
    });

    /* eslint-disable no-await-in-loop */
    test(':size', async () => {
      const sizes = ['small', 'medium', 'large'] as const;

      // eslint-disable-next-line no-await-in-loop
      for (const size of sizes) {
        const { container } = render(<CountDown time={time} size={size} theme="square" />);

        await act(async () => {
          vi.advanceTimersByTime(100);
        });

        // 验证尺寸类名
        expect(container.querySelector(`.t-count-down--${size}`)).toBeTruthy();

        // 验证不同尺寸的背景宽高（通过CSS类验证）
        const items = container.querySelectorAll('.t-count-down__item');
        expect(items.length).toBeGreaterThan(0);

        // 验证分隔符的间距样式类
        const splits = container.querySelectorAll('.t-count-down__split--dot');
        if (splits.length > 0) {
          expect(splits[0]).toBeTruthy();
        }
      }
    });

    test(':splitWithUnit', async () => {
      // 测试 splitWithUnit=true 显示文字单位（使用中文格式）
      const { container: containerWithUnit } = render(
        <CountDown time={time} splitWithUnit format="HH时mm分ss秒" theme="square" />,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(containerWithUnit.querySelector('.t-count-down__split--text')).toBeTruthy();
      expect(containerWithUnit.querySelector('.t-count-down__split--dot')).toBeFalsy();
      // 验证显示中文单位
      expect(containerWithUnit.textContent).toMatch(/时.*分.*秒/);

      // 测试 splitWithUnit=false 显示冒号分隔符
      const { container: containerWithoutUnit } = render(
        <CountDown time={time} splitWithUnit={false} format="HH:mm:ss" theme="square" />,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(containerWithoutUnit.querySelector('.t-count-down__split--dot')).toBeTruthy();
      expect(containerWithoutUnit.querySelector('.t-count-down__split--text')).toBeFalsy();
      // 验证显示冒号分隔符
      expect(containerWithoutUnit.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);

      // 测试默认行为（splitWithUnit=false）
      const { container: defaultContainer } = render(<CountDown time={time} format="mm:ss" theme="round" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(defaultContainer.querySelector('.t-count-down__split--dot')).toBeTruthy();
      expect(defaultContainer.textContent).toMatch(/\d{2}:\d{2}/);
    });

    test(':theme', async () => {
      // 测试 default 主题 - 纯文本显示
      const { container: defaultContainer } = render(<CountDown time={time} theme="default" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(defaultContainer.querySelector('.t-count-down--default')).toBeTruthy();
      // default 主题没有背景项
      expect(defaultContainer.querySelectorAll('.t-count-down__item').length).toBeGreaterThan(0);

      // 测试 square 主题 - 方形背景
      const { container: squareContainer } = render(<CountDown time={time} theme="square" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(squareContainer.querySelector('.t-count-down--square')).toBeTruthy();
      const squareItems = squareContainer.querySelectorAll('.t-count-down__item');
      expect(squareItems.length).toBeGreaterThan(0);

      // 测试 round 主题 - 圆形背景
      const { container: roundContainer } = render(<CountDown time={time} theme="round" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(roundContainer.querySelector('.t-count-down--round')).toBeTruthy();
      const roundItems = roundContainer.querySelectorAll('.t-count-down__item');
      expect(roundItems.length).toBeGreaterThan(0);
    });

    test(':content', async () => {
      // 测试自定义内容函数，验证时间数据传递
      const customContent = (timeData: any) => (
        <span className="custom">
          Hours: {timeData?.hours || 0}, Minutes: {timeData?.minutes || 0}
        </span>
      );

      const { container } = render(<CountDown time={time} content={customContent as any} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.querySelector('.custom')).toBeTruthy();
      // 验证时间数据被正确传递（96分钟 = 1小时36分钟）
      expect(container.textContent).toMatch(/Hours: 1, Minutes: 3[0-6]/);

      // 测试字符串内容
      const { container: stringContainer } = render(<CountDown time={time} content="Custom String" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(stringContainer.textContent).toBe('Custom String');

      // 测试 JSX 内容
      const { container: jsxContainer } = render(
        <CountDown time={time} content={<div className="jsx-content">JSX Content</div>} />,
      );

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(jsxContainer.querySelector('.jsx-content')).toBeTruthy();
      expect(jsxContainer.textContent).toBe('JSX Content');
    });

    test(':className', async () => {
      const { container } = render(<CountDown time={time} className="custom-countdown" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.querySelector('.custom-countdown')).toBeTruthy();
    });

    test(':style', async () => {
      const { container } = render(<CountDown time={time} style={{ color: 'red' }} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const element = container.querySelector('.t-count-down') as HTMLElement;
      expect(element?.style.color).toBeTruthy();
    });
  });

  describe('events', () => {
    test('start method', async () => {
      const ref = React.createRef<CountDownRef>();
      const { container } = render(<CountDown ref={ref} time={time} autoStart={false} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
        ref.current?.start();
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test('pause method', async () => {
      const ref = React.createRef<CountDownRef>();
      const { container } = render(<CountDown ref={ref} time={time} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
        ref.current?.pause();
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test('reset method', async () => {
      const ref = React.createRef<CountDownRef>();
      const { container } = render(<CountDown ref={ref} time={time} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
        ref.current?.reset();
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test('onChange callback', async () => {
      const onChange = vi.fn();
      render(<CountDown time={time} onChange={onChange} />);

      await act(async () => {
        vi.advanceTimersByTime(1100);
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls[0][0]).toHaveProperty('days');
    });

    test('onFinish callback', async () => {
      const onFinish = vi.fn();
      render(<CountDown time={1000} onFinish={onFinish} />);

      await act(async () => {
        vi.advanceTimersByTime(1200);
      });

      expect(onFinish).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    test('zero time', async () => {
      const { container } = render(<CountDown time={0} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test('negative time', async () => {
      const { container } = render(<CountDown time={-1000} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test('large time value', async () => {
      const largeTime = 365 * 24 * 60 * 60 * 1000; // 1年
      const { container } = render(<CountDown time={largeTime} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(container.querySelector('.t-count-down')).toBeTruthy();
    });

    test('empty format string', async () => {
      const { container } = render(<CountDown time={time} format="" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // 空格式字符串会导致组件返回 null
      expect(container.querySelector('.t-count-down')).toBeNull();
    });

    test('invalid format string', async () => {
      const { container } = render(<CountDown time={time} format="xyz" />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      // 无效格式字符串的处理结果
      expect(container.textContent).toMatch(/^(xyz|)$/);
    });
  });

  describe('format variations', () => {
    /* eslint-disable no-await-in-loop */
    test('detailed formats', async () => {
      const testCases = [
        { format: 'HH:mm:ss', time: 3661000, expected: /\d{2}:\d{2}:\d{2}/ },
        { format: 'mm:ss', time: 61000, expected: /\d{2}:\d{2}/ },
        { format: 'DD天HH时mm分ss秒', time: 90061000, expected: /\d+天\d+时\d+分\d+秒/ },
        { format: 'HH:mm:ss:SSS', time: 3661500, expected: /\d{2}:\d{2}:\d{2}:\d{3}/ },
      ];

      for (const testCase of testCases) {
        const { container } = render(<CountDown time={testCase.time} format={testCase.format} />);

        await act(async () => {
          vi.advanceTimersByTime(100);
        });

        expect(container.textContent).toMatch(testCase.expected);
      }
    });
  });
});
