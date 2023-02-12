import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Rate from '../Rate';

describe('Rate 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Rate />);
    expect(container.firstChild.classList.contains('t-rate')).toBeTruthy();
    expect(document.querySelectorAll('.t-rate__item')).toHaveLength(5);
  });

  // 点击测试
  test('onChange', async () => {
    const clickFn = vi.fn();
    render(<Rate onChange={clickFn} />);
    fireEvent.click(document.querySelector('.t-rate__item'));
    expect(clickFn).toBeCalledTimes(1);
    expect(clickFn).toBeCalledWith(1);
  });

  // mouse 事件测试
  test('mouse', async () => {
    render(<Rate defaultValue={3} showText />);
    expect(document.querySelectorAll('.t-rate__item--full')).toHaveLength(3);

    fireEvent.mouseMove(document.querySelector('.t-rate__item'));
    expect(document.querySelectorAll('.t-rate__item--full')).toHaveLength(1);

    fireEvent.mouseLeave(document.querySelector('.t-rate__item'));
    expect(document.querySelectorAll('.t-rate__item--full')).toHaveLength(3);
  });

  // 数量测试
  test('count', async () => {
    render(<Rate count={10} />);
    expect(document.querySelectorAll('.t-rate__item')).toHaveLength(10);
  });

  describe('props', () => {
    test('disable', async () => {
      const clickFn = vi.fn();
      render(<Rate disabled onChange={clickFn} />);
      fireEvent.click(document.querySelector('.t-rate__item'));
      expect(clickFn).toBeCalledTimes(0);
    });

    test('icon', () => {
      const { container } = render(<Rate icon={<span className="custom-node">TNode</span>} />);
      expect(container.firstChild.classList.contains('t-rate')).toBeTruthy();
      expect(document.querySelectorAll('.custom-node')).toHaveLength(10);
    });

    test('allowHalf', () => {
      render(<Rate allowHalf={true} defaultValue={2.5} />);
      // 默认展示
      expect(document.querySelector('.t-rate__item--half')).toBeTruthy();

      const mockedRect = {
        width: 50, // 默认宽度是50
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
      window.Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue(mockedRect);

      // 点击全区域
      fireEvent.mouseMove(document.querySelector('.t-rate__item'), {
        clientX: 30,
      });
      expect(document.querySelector('.t-rate__item--half')).toBeFalsy();

      // 点击半区域
      fireEvent.mouseMove(document.querySelector('.t-rate__item'), {
        clientX: 5,
      });
      expect(document.querySelector('.t-rate__item--half')).toBeTruthy();
    });
  });
});
