import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import Rate from '../Rate';

describe('Rate', () => {
  describe('props', () => {
    test('count', async () => {
      const { container } = render(<Rate />);
      expect(container.children[0].classList.contains('t-rate')).toBeTruthy();
      expect(document.querySelectorAll('.t-rate__item')).toHaveLength(5);
    });

    test('count[number]', async () => {
      render(<Rate count={10} />);
      expect(document.querySelectorAll('.t-rate__item')).toHaveLength(10);
    });

    test('icon[TNode]', () => {
      const { container } = render(<Rate icon={<span className="custom-node">TNode</span>} />);
      expect(container.children[0].classList.contains('t-rate')).toBeTruthy();
      expect(document.querySelectorAll('.custom-node')).toHaveLength(10);
    });

    test('allowHalf', () => {
      render(<Rate allowHalf={true} defaultValue={2.5} />);
      expect(document.querySelector('.t-rate__item--half')).toBeTruthy();

      const mockedRect = {
        width: 50,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
      window.Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue(mockedRect);

      fireEvent.mouseMove(document.querySelector('.t-rate__item'), {
        clientX: 30,
      });
      expect(document.querySelector('.t-rate__item--half')).toBeFalsy();

      fireEvent.mouseMove(document.querySelector('.t-rate__item'), {
        clientX: 5,
      });
      expect(document.querySelector('.t-rate__item--half')).toBeTruthy();
    });

    test('clearable', () => {
      const { container } = render(<Rate defaultValue={1} clearable />);
      expect(container.querySelectorAll('.t-rate__item--full')).toHaveLength(1);
      fireEvent.click(container.querySelectorAll('.t-rate__item')[1]);
      expect(container.querySelectorAll('.t-rate__item--full')).toHaveLength(2);
      fireEvent.click(container.querySelectorAll('.t-rate__item')[1]);
      expect(container.querySelectorAll('.t-rate__item--full')).toHaveLength(0);
    });
  });

  describe('events', () => {
    test('onChange', async () => {
      const clickFn = vi.fn();
      render(<Rate onChange={clickFn} />);
      fireEvent.click(document.querySelector('.t-rate__item'));
      expect(clickFn).toHaveBeenCalledTimes(1);
    });

    test('disabled prevents onChange', async () => {
      const clickFn = vi.fn();
      render(<Rate disabled onChange={clickFn} />);
      fireEvent.click(document.querySelector('.t-rate__item'));
      expect(clickFn).toHaveBeenCalledTimes(0);
    });

    test('mouse', async () => {
      render(<Rate defaultValue={3} showText />);
      expect(document.querySelectorAll('.t-rate__item--full')).toHaveLength(3);

      fireEvent.mouseMove(document.querySelector('.t-rate__item'));
      expect(document.querySelectorAll('.t-rate__item--full')).toHaveLength(1);

      fireEvent.mouseLeave(document.querySelector('.t-rate__item'));
      expect(document.querySelectorAll('.t-rate__item--full')).toHaveLength(3);
    });
  });
});
