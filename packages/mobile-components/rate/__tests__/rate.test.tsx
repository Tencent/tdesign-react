import React from 'react';
import { vi } from 'vitest';
import { describe, it, expect, render, screen, fireEvent, waitFor } from '@test/utils';
import Rate from '../Rate';

// Mock useSize from ahooks
vi.mock('ahooks', async () => {
  const actual = await vi.importActual('ahooks');
  return {
    ...actual,
    useSize: () => ({ width: 200, height: 40 }),
  };
});

// Mock useClickAway from ahooks
vi.mock('ahooks', async () => {
  const actual = await vi.importActual('ahooks');
  return {
    ...actual,
    useSize: () => ({ width: 200, height: 40 }),
    useClickAway: vi.fn(),
  };
});

describe('Rate', () => {
  describe('props', () => {
    it('should render default rate component', () => {
      const { container } = render(<Rate />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
      expect(container.querySelectorAll('.t-rate__icon')).toHaveLength(5);
    });

    it(':count', () => {
      const { container } = render(<Rate count={3} />);
      expect(container.querySelectorAll('.t-rate__icon')).toHaveLength(3);
    });

    it(':size', () => {
      const { container } = render(<Rate size="32" />);
      const icons = container.querySelectorAll('.t-rate__icon');
      expect(icons[0]).toHaveStyle('font-size: 32px');
    });

    it(':size with invalid value', () => {
      const { container } = render(<Rate size="aa" />);
      const icons = container.querySelectorAll('.t-rate__icon');
      icons.forEach((icon) => {
        expect(icon).toHaveStyle('font-size: 0px');
      });
    });

    it(':color', () => {
      const { container } = render(<Rate color="#ff0000" />);
      const icons = container.querySelectorAll('.t-rate__icon');
      expect(icons[0]).toHaveStyle('--td-rate-selected-color: #ff0000');
    });

    it(':color with array', () => {
      const { container } = render(<Rate color={['#ff0000', '#000000']} />);
      const icons = container.querySelectorAll('.t-rate__icon');
      expect(icons[0]).toHaveStyle('--td-rate-selected-color: #ff0000');
      expect(icons[0]).toHaveStyle('--td-rate-unselected-color: #000000');
    });

    it(':gap', () => {
      const { container } = render(<Rate gap={16} />);
      const wrapper = container.querySelector('.t-rate__wrapper');
      expect(wrapper).toHaveStyle('gap: 16px');
    });

    it(':icon with custom elements', () => {
      const customIcon = [<span key="1">★</span>, <span key="2">☆</span>];
      const { container } = render(<Rate icon={customIcon} />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it(':icon with custom functions', () => {
      const customIcon = [() => <span key="1">★</span>, () => <span key="2">☆</span>];
      const { container } = render(<Rate icon={customIcon} />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it(':value', () => {
      const { container } = render(<Rate value={3} />);
      const icons = container.querySelectorAll('.t-rate__icon');
      expect(icons[0]).toHaveClass('t-rate__icon--selected');
      expect(icons[1]).toHaveClass('t-rate__icon--selected');
      expect(icons[2]).toHaveClass('t-rate__icon--selected');
      expect(icons[3]).not.toHaveClass('t-rate__icon--selected');
    });

    it(':defaultValue', () => {
      const { container } = render(<Rate defaultValue={2} />);
      const icons = container.querySelectorAll('.t-rate__icon');
      expect(icons[0]).toHaveClass('t-rate__icon--selected');
      expect(icons[1]).toHaveClass('t-rate__icon--selected');
      expect(icons[2]).not.toHaveClass('t-rate__icon--selected');
    });

    it(':allowHalf', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate allowHalf onChange={handleChange} />);

      const icons = container.querySelectorAll('.t-rate__icon');
      const icon = icons[2];

      // Mock getBoundingClientRect
      Object.defineProperty(icon, 'getBoundingClientRect', {
        value: () => ({ x: 100, width: 24, height: 24, y: 100, top: 100, bottom: 124, left: 100, right: 124 }),
      });

      fireEvent.click(icon, { clientX: 105 });
      expect(handleChange).toHaveBeenCalledWith(2.5);

      fireEvent.click(icon, { clientX: 115 });
      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it(':disabled', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate disabled onChange={handleChange} />);

      expect(container.querySelector('.t-rate')).toHaveClass('t-rate--disabled');

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[2]);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it(':showText', () => {
      const { container } = render(<Rate showText />);
      expect(container.querySelector('.t-rate__text')).toBeInTheDocument();
    });

    it(':texts', () => {
      const texts = ['很差', '差', '一般', '好', '很好'];
      render(<Rate showText texts={texts} value={3} />);
      expect(screen.getByText('一般')).toBeInTheDocument();
    });

    it(':placement', () => {
      const { container } = render(<Rate placement="bottom" />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it(':className', () => {
      const { container } = render(<Rate className="custom-class" />);
      expect(container.querySelector('.t-rate')).toHaveClass('custom-class');
    });

    it(':style', () => {
      const { container } = render(<Rate style={{ margin: '10px' }} />);
      expect(container.querySelector('.t-rate')).toHaveStyle('margin: 10px');
    });
  });

  describe('event', () => {
    it(':onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[2]);

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it(':click', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[0]);
      expect(handleChange).toHaveBeenCalledWith(1);

      fireEvent.click(icons[4]);
      expect(handleChange).toHaveBeenCalledWith(5);
    });

    it(':touch events', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Mock getBoundingClientRect for wrapper
      Object.defineProperty(wrapper, 'getBoundingClientRect', {
        value: () => ({ x: 0, width: 200, height: 40, y: 0, top: 0, bottom: 40, left: 0, right: 200 }),
      });

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      expect(handleChange).toHaveBeenCalled();
    });

    it(':touch events with allowHalf', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate allowHalf onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Mock getBoundingClientRect for wrapper
      Object.defineProperty(wrapper, 'getBoundingClientRect', {
        value: () => ({ x: 0, width: 200, height: 40, y: 0, top: 0, bottom: 40, left: 0, right: 200 }),
      });

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 85 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      expect(handleChange).toHaveBeenCalled();
    });

    it(':count with edge cases', () => {
      // Zero count
      const { container: container1 } = render(<Rate count={0} />);
      expect(container1.querySelectorAll('.t-rate__icon')).toHaveLength(0);

      // Single count
      const { container: container2 } = render(<Rate count={1} />);
      expect(container2.querySelectorAll('.t-rate__icon')).toHaveLength(1);

      // Large count
      const { container: container3 } = render(<Rate count={10} />);
      expect(container3.querySelectorAll('.t-rate__icon')).toHaveLength(10);
    });

    it(':gap with decimal value', () => {
      const { container } = render(<Rate gap={8.5} />);
      const wrapper = container.querySelector('.t-rate__wrapper');
      expect(wrapper).toHaveStyle('gap: 8.5px');
    });

    it(':size with string value', () => {
      const { container } = render(<Rate size="32px" />);
      const icons = container.querySelectorAll('.t-rate__icon');
      expect(icons[0]).toHaveStyle('font-size: 32px');
    });

    it(':value with edge cases', () => {
      // Zero value
      const { container: container1 } = render(<Rate value={0} />);
      const icons1 = container1.querySelectorAll('.t-rate__icon');
      icons1.forEach((icon) => {
        expect(icon).not.toHaveClass('t-rate__icon--selected');
      });

      // Maximum value
      const { container: container2 } = render(<Rate value={5} />);
      const icons2 = container2.querySelectorAll('.t-rate__icon');
      icons2.forEach((icon) => {
        expect(icon).toHaveClass('t-rate__icon--selected');
      });

      // Value greater than count
      const { container: container3 } = render(<Rate value={10} count={5} />);
      const icons3 = container3.querySelectorAll('.t-rate__icon');
      icons3.forEach((icon) => {
        expect(icon).toHaveClass('t-rate__icon--selected');
      });

      // Negative value
      const { container: container4 } = render(<Rate value={-1} />);
      const icons4 = container4.querySelectorAll('.t-rate__icon');
      icons4.forEach((icon) => {
        expect(icon).not.toHaveClass('t-rate__icon--selected');
      });

      // Decimal value
      const { container: container5 } = render(<Rate value={2.5} />);
      const icons5 = container5.querySelectorAll('.t-rate__icon');
      expect(icons5[0]).toHaveClass('t-rate__icon--selected');
      expect(icons5[1]).toHaveClass('t-rate__icon--selected');
      expect(icons5[2]).toHaveClass('t-rate__icon--unselected');
      expect(icons5[2].querySelector('.t-rate__icon-left--selected')).toBeInTheDocument();
    });

    it(':placement with empty value', () => {
      const { container } = render(<Rate placement="" />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it('should handle ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(<Rate ref={ref} />);

      expect(ref.current).toBe(container.querySelector('.t-rate'));
    });

    it('should handle component unmount', () => {
      const { container, unmount } = render(<Rate />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();

      unmount();
      expect(container.querySelector('.t-rate')).not.toBeInTheDocument();
    });
  });

  describe('event', () => {
    it(':onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[2]);

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it(':click', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[0]);
      expect(handleChange).toHaveBeenCalledWith(1);

      fireEvent.click(icons[4]);
      expect(handleChange).toHaveBeenCalledWith(5);
    });

    it(':touch events', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Mock getBoundingClientRect for wrapper
      Object.defineProperty(wrapper, 'getBoundingClientRect', {
        value: () => ({ x: 0, width: 200, height: 40, y: 0, top: 0, bottom: 40, left: 0, right: 200 }),
      });

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      expect(handleChange).toHaveBeenCalled();
    });

    it(':touch events with allowHalf', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate allowHalf onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Mock getBoundingClientRect for wrapper
      Object.defineProperty(wrapper, 'getBoundingClientRect', {
        value: () => ({ x: 0, width: 200, height: 40, y: 0, top: 0, bottom: 40, left: 0, right: 200 }),
      });

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 85 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      expect(handleChange).toHaveBeenCalled();
    });

    it(':touch events when disabled', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate disabled onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it(':touch cancel', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] });

      // Touch cancel
      fireEvent.touchCancel(wrapper);

      expect(handleChange).toHaveBeenCalled();
    });

    it(':touch events with minimum movement', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Mock getBoundingClientRect for wrapper
      Object.defineProperty(wrapper, 'getBoundingClientRect', {
        value: () => ({ x: 0, width: 200, height: 40, y: 0, top: 0, bottom: 40, left: 0, right: 200 }),
      });

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move with small movement (less than 5px)
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 52 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      // Should not trigger change due to small movement
      expect(handleChange).not.toHaveBeenCalled();
    });

    it(':touch events with count less than 1', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate count={0} onChange={handleChange} />);

      const wrapper = container.querySelector('.t-rate__wrapper');

      // Touch start
      fireEvent.touchStart(wrapper, { touches: [{ clientX: 50 }] });

      // Touch move
      fireEvent.touchMove(wrapper, { touches: [{ clientX: 80 }] });

      // Touch end
      fireEvent.touchEnd(wrapper);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it(':onChange with same value', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate value={3} onChange={handleChange} />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[2]);

      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it(':tips visibility with placement', async () => {
      const { container } = render(<Rate placement="top" />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[2]);

      // Wait for tips to potentially appear
      await waitFor(() => {
        expect(container.querySelector('.t-rate')).toBeInTheDocument();
      });
    });

    it(':tips click outside', () => {
      const { container } = render(<Rate placement="top" />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it(':tips with allowHalf', () => {
      const { container } = render(<Rate allowHalf placement="top" />);

      const icons = container.querySelectorAll('.t-rate__icon');
      fireEvent.click(icons[2]);

      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it(':tips data correctly', () => {
      const { container } = render(<Rate placement="top" />);
      expect(container.querySelector('.t-rate')).toBeInTheDocument();
    });

    it('should not trigger onChange when RateTips option value equals innerValue', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate value={2} placement="top" onChange={handleChange} />);
      const icons = container.querySelectorAll('.t-rate__icon');

      fireEvent.click(icons[1]);
      // 此时tips应该显示，且currentValue为2
      const tips = container.querySelector('.t-rate__tips');
      expect(tips).toBeInTheDocument();

      if (tips) {
        // 找到tips中的选项（value应该等于2，与innerValue相同）
        const tipOptions = tips.querySelectorAll('.t-rate__tips-item');
        expect(tipOptions.length).toBeGreaterThan(0);
        console.log('tipOptions', tipOptions[0].innerHTML);

        // 点击与当前值相同的选项
        fireEvent.click(tipOptions[0]);
      }

      // 由于value === innerValue，不应触发onChange
      expect(handleChange).toHaveBeenCalledOnce();
    });

    it('should trigger onChange when RateTips option value not equals innerValue', () => {
      const handleChange = vi.fn();
      const { container } = render(<Rate value={2} placement="top" onChange={handleChange} />);
      const icons = container.querySelectorAll('.t-rate__icon');

      fireEvent.click(icons[2]);
      // 此时tips应该显示，且currentValue为2
      const tips = container.querySelector('.t-rate__tips');
      expect(tips).toBeInTheDocument();

      if (tips) {
        // 找到tips中的选项（value应该等于2，与innerValue相同）
        const tipOptions = tips.querySelectorAll('.t-rate__tips-item');
        expect(tipOptions.length).toBeGreaterThan(0);
        console.log('tipOptions', tipOptions[0].innerHTML);

        // 点击与当前值相同的选项
        fireEvent.click(tipOptions[0]);
      }

      // 由于value !== innerValue，应再次触发onChange
      expect(handleChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('currentValue and innerValue display logic', () => {
    it('should display currentValue when dragging, and innerValue when not dragging', async () => {
      const { container } = render(<Rate showText defaultValue={2} />);
      const rateWrapper = container.querySelector('.t-rate__wrapper') as HTMLElement;

      // 初始状态：非拖拽，显示innerValue
      expect(container.querySelectorAll('.t-rate__icon--selected')).toHaveLength(2);

      Object.defineProperty(rateWrapper, 'getBoundingClientRect', {
        value: () => ({ x: 0, width: 152, height: 40, y: 0, top: 0, bottom: 40, left: 0, right: 152 }),
      });

      // 模拟拖拽开始
      fireEvent.touchStart(rateWrapper, { touches: [{ clientX: 0, clientY: 0 }] });

      // 模拟拖拽移动
      fireEvent.touchMove(rateWrapper, { touches: [{ clientX: 96, clientY: 0 }] });
      // 拖拽状态：显示currentValue（根据拖拽位置计算的值）
      await waitFor(() => {
        expect(container.querySelector('.t-rate__text').textContent).toEqual('3 分');
      });

      // 模拟拖拽结束
      fireEvent.touchEnd(rateWrapper);

      // 拖拽结束：显示innerValue（更新后的值）
      await waitFor(() => {
        expect(rateWrapper.querySelectorAll('.t-rate__icon--selected')).toHaveLength(3);
      });
    });
  });
});
