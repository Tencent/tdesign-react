import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';
import { JumpIcon } from 'tdesign-icons-react';

import Link from '../Link';

const prefix = 't';
const name = `.${prefix}-link`;

describe('Link', () => {
  describe('props', () => {
    it('content[string]', () => {
      const { container } = render(<Link content="link" />);
      expect(container.querySelector(name).textContent).toBe('link');
    });

    it('content[function]', () => {
      const { container } = render(<Link content={() => 'link'} />);
      expect(container.querySelector(name).textContent).toBe('link');
    });

    it('children[string]', () => {
      const { container } = render(<Link>link</Link>);
      expect(container.querySelector(name).textContent).toBe('link');
    });

    it('children[function]', () => {
      const { container } = render(<Link>{() => 'link'}</Link>);
      expect(container.querySelector(name).textContent).toBe('link');
    });

    it('disabled[boolean]', () => {
      const { container } = render(<Link disabled />);
      expect(container.querySelector(`${name}--disabled`)).toBeTruthy();
    });

    it('hover[boolean]', () => {
      const { container } = render(<Link hover />);
      expect(container.querySelector(`${name}--hover`)).toBeTruthy();

      const { container: containerDisabled } = render(<Link hover disabled />);
      expect(containerDisabled.querySelector(`${name}--hover`)).toBeFalsy();
    });

    it('href[string]', () => {
      const { container } = render(<Link href="https://tdesign.tencent.com/" />);
      expect(container.firstChild).toHaveAttribute('href', 'https://tdesign.tencent.com/');
    });

    it('prefixIcon[TElement]', () => {
      const { container } = render(<Link prefixIcon={<JumpIcon />} />);
      expect(container.querySelector(`${name}__prefix-icon`)).toBeTruthy();
    });

    it('size[string]', () => {
      const sizes = ['small', 'medium', 'large'] as const;
      sizes.forEach((size) => {
        const { container } = render(<Link size={size} />);
        expect(container.querySelector(`${name}--${size}`)).toBeTruthy();
      });
    });

    it('size[null]', () => {
      const { container } = render(<Link size={null} />);
      expect(container.querySelector(`${name}--medium`)).toBeTruthy();
    });

    it('suffixIcon[TElement]', () => {
      const { container } = render(<Link suffixIcon={<JumpIcon />} />);
      expect(container.querySelector(`${name}__suffix-icon`)).toBeTruthy();
    });

    it('theme[null]', () => {
      const { container } = render(<Link theme={null} />);
      expect(container.querySelector(`${name}--default`)).toBeTruthy();
    });

    it('theme[string]', () => {
      const themes = ['default', 'primary', 'danger', 'warning', 'success'] as const;
      themes.forEach((theme) => {
        const { container } = render(<Link theme={theme} />);
        expect(container.querySelector(`${name}--${theme}`)).toBeTruthy();
      });
    });

    it('underline[boolean]', () => {
      const { container } = render(<Link underline />);
      expect(container.querySelector(`${name}--underline`)).toBeTruthy();
    });
  });

  describe('events', () => {
    it('onClick', () => {
      const onClick = vi.fn();
      const { container } = render(<Link onClick={onClick} />);
      fireEvent.click(container.firstChild);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('onClick is disabled', () => {
      const onClick = vi.fn();
      const { container } = render(<Link disabled onClick={onClick} />);
      fireEvent.click(container.firstChild);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
