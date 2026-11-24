import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';
import { AppIcon } from 'tdesign-icons-react';
import Navbar from '../index';

const prefix = 't';
const name = `.${prefix}-navbar`;

describe('Navbar', () => {
  describe('props', () => {
    it(': animation', () => {
      const { container, rerender } = render(<Navbar animation />);
      expect(container.querySelector(`${name}--visible-animation`)).toBeTruthy();

      rerender(<Navbar animation={false} />);
      expect(container.querySelector(`${name}--visible-animation`)).toBeFalsy();
    });

    it(': capsule', () => {
      const { container } = render(<Navbar capsule={<div className="custom-capsule">胶囊</div>} />);
      expect(container.querySelector('.custom-capsule')).toBeTruthy();
    });

    it(': fixed', () => {
      const { container } = render(<Navbar fixed />);
      expect(container.querySelector(`${name}--fixed`)).toBeTruthy();
    });

    it(': left', () => {
      const leftText = '返回';
      const { container, queryByText, rerender } = render(<Navbar left={leftText} />);
      expect(queryByText(leftText)).toBeInTheDocument();

      rerender(<Navbar left={<AppIcon />} />);
      expect(container.querySelector('.t-icon-app')).toBeTruthy();
    });

    it(': leftArrow', () => {
      const { container } = render(<Navbar leftArrow />);
      expect(container.querySelector(`${name}__left-arrow`)).toBeTruthy();
    });

    it(': placeholder', () => {
      const { container } = render(<Navbar fixed placeholder />);
      expect(container.querySelector(`${name}__placeholder`)).toBeTruthy();
    });

    it(': right', () => {
      const rightText = '更多';
      const { queryByText } = render(<Navbar right={rightText} />);
      expect(queryByText(rightText)).toBeInTheDocument();
    });

    it(': safeAreaInsetTop', () => {
      const { container } = render(<Navbar safeAreaInsetTop />);
      expect(container.querySelector(`.${prefix}-safe-area-top`)).toBeTruthy();
    });

    it(': title', () => {
      const title = '页面标题';
      const { queryByText } = render(<Navbar title={title} />);
      expect(queryByText(title)).toBeInTheDocument();
    });

    it(': titleMaxLength', () => {
      const title = '这是一个很长的标题内容';
      const { container, rerender } = render(<Navbar title={title} titleMaxLength={5} />);
      expect(container.querySelector(`${name}__center-title`)).toHaveTextContent('这是一个很...');

      rerender(<Navbar title={title} titleMaxLength={0} />);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Navbar title={title} titleMaxLength={0} />);
      expect(consoleSpy).toHaveBeenCalledWith('titleMaxLength must be greater than 0');
      consoleSpy.mockRestore();
    });

    it(': children', () => {
      const children = '自定义标题';
      const { queryByText } = render(<Navbar>{children}</Navbar>);
      expect(queryByText(children)).toBeInTheDocument();
    });

    it(': visible', () => {
      const { container, rerender } = render(<Navbar visible />);
      expect(container.querySelector(`${name}--visible-animation`)).toBeTruthy();

      rerender(<Navbar visible={false} />);
      expect(container.querySelector(`${name}--hide-animation`)).toBeTruthy();
    });

    it(': zIndex', () => {
      const { container } = render(<Navbar zIndex={999} />);
      const navbar = container.querySelector(name) as HTMLElement;
      expect(navbar.style.zIndex).toBe('999');
    });
  });

  describe('events', () => {
    it(': onLeftClick', () => {
      const handleLeftClick = vi.fn();
      const { container } = render(<Navbar left="返回" onLeftClick={handleLeftClick} />);
      const leftElement = container.querySelector(`${name}__left`);
      fireEvent.click(leftElement);
      expect(handleLeftClick).toHaveBeenCalledTimes(1);
    });

    it(': onRightClick', () => {
      const handleRightClick = vi.fn();
      const { container } = render(<Navbar right="更多" onRightClick={handleRightClick} />);
      const rightElement = container.querySelector(`${name}__right`);
      fireEvent.click(rightElement);
      expect(handleRightClick).toHaveBeenCalledTimes(1);
    });
  });
});
