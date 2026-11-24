import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';

import { Switch } from '..';

describe('Switch', () => {
  it('should render', () => {
    const { container } = render(<Switch />);
    expect(container).toMatchSnapshot();
  });

  describe('props', () => {
    it(':className', () => {
      const { container } = render(<Switch className="custom-class" />);
      expect(container.querySelector('.custom-class')).not.toBe(null);
    });

    it(':style', () => {
      const { container } = render(<Switch style={{ color: 'rgb(255, 0, 0)' }} />);
      expect(container.querySelector('.t-switch')).not.toBe(null);
      expect(container.querySelector('.t-switch')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it(':value', () => {
      const { container } = render(<Switch value={true} />);
      expect(container.querySelector('.t-switch--checked')).not.toBe(null);
    });

    it(':defaultValue', () => {
      const { container } = render(<Switch defaultValue={true} />);
      expect(container.querySelector('.t-switch--checked')).not.toBe(null);
    });

    it(':customValue', () => {
      expect(() => render(<Switch customValue={['true', 'false']} value={true} />)).toThrow(
        `true is not in customValue: ["true","false"]`,
      );

      expect(() => render(<Switch customValue={['true', 'false']} value={'true'} />)).not.toThrow();

      const { container } = render(<Switch customValue={['true', 'false']} value={'true'} />);
      expect(container.querySelector('.t-switch--checked')).not.toBe(null);
    });

    it(':disabled', () => {
      const fn = vi.fn();
      const { container } = render(<Switch disabled={true} onChange={fn} />);

      expect(container.querySelector('.t-switch--disabled')).not.toBe(null);
      fireEvent.click(container.querySelector('.t-switch') as HTMLElement);
      expect(fn).not.toHaveBeenCalled();
    });

    it(':label', () => {
      const labelArr = ['是', '否'];
      const { container, rerender } = render(<Switch label={labelArr} value={true} />);
      expect(container.querySelector('.t-switch').textContent).toBe(labelArr[0]);
      rerender(<Switch label={labelArr} value={false} />);
      expect(container.querySelector('.t-switch').textContent).toBe(labelArr[1]);

      const labelFn = (val: { value: boolean }) => (val.value ? '开' : '关');
      const { container: container2, rerender: rerender2 } = render(<Switch label={labelFn} value={true} />);
      expect(container2.querySelector('.t-switch').textContent).toBe('开');
      rerender2(<Switch label={labelFn} value={false} />);
      expect(container2.querySelector('.t-switch').textContent).toBe('关');

      const labelTNode = <div>自定义</div>;
      const { container: container3 } = render(<Switch label={labelTNode} value={true} />);
      expect(container3.querySelector('.t-switch').textContent).toBe('自定义');
    });

    it(':loading', () => {
      const { container } = render(<Switch loading={true} />);
      expect(container.querySelector('.t-switch__loading')).not.toBe(null);
    });

    it(':size', () => {
      const sizes = ['small', 'medium', 'large'] as const;
      function checkSize(size: (typeof sizes)[number]) {
        const { container } = render(<Switch size={size} />);
        expect(container.querySelector(`.t-switch--${size}`)).not.toBe(null);
      }

      sizes.forEach(checkSize);
    });
  });

  describe('events', () => {
    it(':onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(<Switch onChange={handleChange} />);
      fireEvent.click(container.querySelector('.t-switch') as HTMLElement);
      expect(handleChange).toHaveBeenCalled();
      expect(container.querySelector('.t-switch__label--checked')).not.toBe(null);

      fireEvent.click(container.querySelector('.t-switch') as HTMLElement);
      expect(handleChange).toHaveBeenCalled();

      expect(container.querySelector('.t-switch__label--checked')).toBe(null);
    });
  });
});
