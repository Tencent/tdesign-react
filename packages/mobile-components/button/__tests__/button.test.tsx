import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';

import { AppIcon } from 'tdesign-icons-react';
import Button from '../Button';

const prefix = 't';
const name = `.${prefix}-button`;
const buttonText = '按钮组件';

describe('Button', () => {
  describe('props', () => {
    it(': block', () => {
      const { container } = render(<Button block />);
      expect(container.querySelector(`${name}--block`)).toBeTruthy();
    });
    it(': children', () => {
      const { queryByText } = render(<Button>{buttonText}</Button>);
      expect(queryByText(buttonText)).toBeInTheDocument();
    });
    it(': content', () => {
      const { queryByText } = render(<Button content={buttonText} />);
      expect(queryByText(buttonText)).toBeInTheDocument();
    });
    it(': disabled', () => {
      const { container } = render(<Button disabled />);
      expect(container.querySelector(`${name}--disabled`)).toBeTruthy();
    });
    it(': ghost', () => {
      const { container } = render(<Button ghost />);
      expect(container.querySelector(`${name}--ghost`)).toBeTruthy();
    });
    it(': tag', () => {
      const { container, rerender } = render(<Button content={buttonText} />);
      expect(container.firstElementChild?.tagName.toLowerCase()).toBe('button');

      rerender(<Button content={buttonText} tag="a" />);
      expect(container.firstElementChild?.tagName.toLowerCase()).toBe('a');

      rerender(<Button content={buttonText} tag="div" />);
      expect(container.firstElementChild?.tagName.toLowerCase()).toBe('div');
    });
    it(': href', () => {
      const { container } = render(<Button content={buttonText} href="https://tdesign.tencent.com" />);
      const buttonDom = container.firstElementChild;

      expect(buttonDom?.tagName.toLowerCase()).toBe('a');
      expect(buttonDom).toHaveAttribute('href', 'https://tdesign.tencent.com');
    });
    it(': form', () => {
      const { container, rerender } = render(<Button content={buttonText} form="test-form-id" />);
      const buttonDom = container.firstElementChild;

      expect(buttonDom?.tagName.toLowerCase()).toBe('button');
      expect(buttonDom).toHaveAttribute('form', 'test-form-id');

      rerender(<Button content={buttonText} tag="div" form="test-form-id" />);
      expect(container.firstElementChild).not.toHaveAttribute('form');
    });
    it('native button: role/type', () => {
      const { container } = render(<Button content={buttonText} type="submit" />);
      const buttonDom = container.firstElementChild;

      expect(buttonDom?.tagName.toLowerCase()).toBe('button');
      expect(buttonDom).not.toHaveAttribute('role');
      expect(buttonDom).toHaveAttribute('type', 'submit');
    });
    it('custom tag: role/type', () => {
      const { container } = render(<Button content={buttonText} tag="div" type="submit" />);
      const buttonDom = container.firstElementChild;

      expect(buttonDom?.tagName.toLowerCase()).toBe('div');
      expect(buttonDom).toHaveAttribute('role', 'button');
      expect(buttonDom).not.toHaveAttribute('type');
    });
    it(': tag disabled', () => {
      const { container } = render(<Button content={buttonText} tag="a" disabled />);
      const buttonDom = container.firstElementChild;

      expect(buttonDom?.tagName.toLowerCase()).toBe('a');
      expect(buttonDom).not.toHaveAttribute('disabled');
      expect(buttonDom).toHaveAttribute('aria-disabled', 'true');
      expect(buttonDom).toHaveAttribute('tabindex', '-1');
    });
    it(': icon', () => {
      const { container } = render(<Button icon={<AppIcon />} />);
      expect(container.querySelector('.t-icon-app')).toBeTruthy();
    });
    it(': loading', () => {
      const { container } = render(<Button loading />);
      expect(container.querySelector(`${name}--loading`)).toBeTruthy();
    });
    it(': loadingProps', () => {
      const { container } = render(<Button loading loadingProps={{ duration: 1000 }} />);
      expect(container.querySelector('.t-loading')).toBeInTheDocument();
    });
    it(': shape', () => {
      const shapes = ['rectangle', 'square', 'round', 'circle'] as const;
      shapes.forEach((shape) => {
        const { container } = render(<Button shape={shape} />);
        expect(container.querySelector(`${name}--${shape}`)).toBeTruthy();
      });
    });
    it(': size', () => {
      const sizes = ['extra-small', 'small', 'medium', 'large'] as const;
      sizes.forEach((size) => {
        const { container } = render(<Button size={size} />);
        expect(container.querySelector(`${name}--size-${size}`)).toBeTruthy();
      });
    });
    it(': suffix', () => {
      const { container } = render(<Button suffix={<AppIcon />} />);
      expect(container.querySelector('.t-icon-app')).toBeInTheDocument();
    });
    it(': theme', () => {
      const themes = ['default', 'primary', 'danger', 'light'] as const;
      themes.forEach((theme) => {
        const { container } = render(<Button theme={theme} />);
        expect(container.querySelector(`${name}--${theme}`)).toBeTruthy();
      });
    });
    it(': variant', () => {
      const variants = ['base', 'outline', 'dashed', 'text'] as const;
      variants.forEach((variant) => {
        const { container } = render(<Button variant={variant} />);
        expect(container.querySelector(`${name}--${variant}`)).toBeTruthy();
      });
    });
  });

  describe('events', () => {
    it(': onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(<Button onClick={handleClick} />);
      fireEvent.click(container.firstChild);
      expect(handleClick).toHaveBeenCalled();
    });
    it(': onClick disabled', () => {
      const handleClick = vi.fn();
      const { container } = render(<Button disabled onClick={handleClick} />);
      fireEvent.click(container.firstChild);
      expect(handleClick).not.toHaveBeenCalled();
    });
    it(': onClick loading', () => {
      const handleClick = vi.fn();
      const { container } = render(<Button loading onClick={handleClick} />);
      fireEvent.click(container.firstChild);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
