import React from 'react';
import { render, vi } from '@test/utils';
import PaginationMini from '../PaginationMini';

describe('PaginationMini test', () => {
  test('mount and unmount', () => {
    const wrapper = render(<PaginationMini />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  test('PaginationMini: test Disabled', () => {
    const disabledPrev = {
      prev: true,
      current: false,
      next: false,
    };
    const disabledCurrent = {
      prev: false,
      current: true,
      next: false,
    };
    const disabledNext = {
      prev: false,
      current: false,
      next: true,
    };
    const onChange = vi.fn();
    const { container } = render(<PaginationMini disabled={disabledPrev} onChange={onChange} />);
    const { container: container2 } = render(<PaginationMini disabled={disabledCurrent} onChange={onChange} />);
    const { container: container3 } = render(<PaginationMini disabled={disabledNext} onChange={onChange} />);
    const prev = container.querySelector('.t-pagination-mini__prev');
    const current = container2.querySelector('.t-pagination-mini__current');
    const next = container3.querySelector('.t-pagination-mini__next');
    expect(prev).toHaveClass('t-is-disabled');
    expect(current).toHaveClass('t-is-disabled');
    expect(next).toHaveClass('t-is-disabled');
  });

  test('PaginationMini: test onChange', () => {
    const onChange = vi.fn();
    const { container } = render(<PaginationMini onChange={onChange} />);
    const prev = container.querySelector('.t-pagination-mini__prev');
    const current = container.querySelector('.t-pagination-mini__current');
    const next = container.querySelector('.t-pagination-mini__next');
    prev?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onChange.mock.calls[0][0].trigger).toBe('prev');
    current?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onChange.mock.calls[1][0].trigger).toBe('current');
    next?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onChange.mock.calls[2][0].trigger).toBe('next');
    expect(onChange).toBeCalledTimes(3);
  });

  test('PaginationMini: test title', () => {
    const { container } = render(<PaginationMini tips />);
    const prev = container.querySelector('.t-pagination-mini__prev');
    const current = container.querySelector('.t-pagination-mini__current');
    const next = container.querySelector('.t-pagination-mini__next');

    expect(prev.getAttribute('title')).toBe('上一页');
    expect(current.getAttribute('title')).toBe('当前');
    expect(next.getAttribute('title')).toBe('下一页');
  });

  test('PaginationMini: size variant', () => {
    const { container } = render(<PaginationMini size="small" />);
    container.querySelectorAll('.t-button').forEach((item) => {
      expect(item).toHaveClass('t-size-s');
    });

    expect(container.querySelectorAll('.t-button').length).toBe(3);
  });
});
