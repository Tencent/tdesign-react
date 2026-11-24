import React from 'react';
import { vi } from 'vitest';
import { describe, it, expect, render, fireEvent } from '@test/utils';
import { RateIcon } from '../RateIcon';

describe('RateIcon', () => {
  describe('props', () => {
    it('should render default star icon', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      expect(container.querySelector('.t-rate__icon')).toBeInTheDocument();
    });

    it(':isSelected', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={false} isSelected={true} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveClass('t-rate__icon--selected');
    });

    it(':isCurrent', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={true} isSelected={false} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveClass('t-rate__icon--current');
    });

    it(':isHalf', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={false} isSelected={true} isHalf={true} />,
      );
      expect(container.querySelector('.t-rate__icon-left')).toBeInTheDocument();
    });

    it(':color', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="#ff0000" isCurrent={false} isSelected={true} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveStyle('--td-rate-selected-color: #ff0000');
    });

    it(':size', () => {
      const { container } = render(
        <RateIcon size={32} icon={[]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveStyle('font-size: 32px');
    });

    it(':icon with custom function', () => {
      const CustomIcon = () => <span>★</span>;
      const { container } = render(
        <RateIcon size={24} icon={[CustomIcon]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      expect(container.querySelector('.t-rate__icon')).toBeInTheDocument();
    });

    it(':icon with custom element', () => {
      const customIcon = <span>☆</span>;
      const { container } = render(
        <RateIcon size={24} icon={[customIcon]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      expect(container.querySelector('.t-rate__icon')).toBeInTheDocument();
    });

    it(':color with array', () => {
      const { container } = render(
        <RateIcon
          size={24}
          icon={[]}
          color={['#ff0000', '#000000']}
          isCurrent={false}
          isSelected={true}
          isHalf={false}
        />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveStyle('--td-rate-selected-color: #ff0000');
      expect(icon).toHaveStyle('--td-rate-unselected-color: #000000');
    });

    it('should handle unselected state correctly', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveClass('t-rate__icon--unselected');
    });

    it('should handle half selected state correctly', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={false} isSelected={true} isHalf={true} />,
      );
      const leftIcon = container.querySelector('.t-rate__icon-left');
      expect(leftIcon).toHaveClass('t-rate__icon-left--selected');
    });

    it('should handle half unselected state correctly', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={false} isSelected={false} isHalf={true} />,
      );
      const leftIcon = container.querySelector('.t-rate__icon-left');
      expect(leftIcon).toHaveClass('t-rate__icon-left--unselected');
    });

    it('should handle undefined color values', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color={undefined} isCurrent={false} isSelected={true} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toBeInTheDocument();
    });

    it('should handle empty color array', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color={[]} isCurrent={false} isSelected={true} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toBeInTheDocument();
    });

    it('should handle single color in array', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color={['#ff0000']} isCurrent={false} isSelected={true} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveStyle('--td-rate-selected-color: #ff0000');
    });

    it('should handle undefined icon values', () => {
      const { container } = render(
        <RateIcon size={24} icon={undefined} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      expect(container.querySelector('.t-rate__icon')).toBeInTheDocument();
    });

    it('should handle null icon values', () => {
      const { container } = render(
        <RateIcon size={24} icon={[null, null]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      expect(container.querySelector('.t-rate__icon')).toBeInTheDocument();
    });

    it('should handle string icon values', () => {
      const { container } = render(
        <RateIcon size={24} icon={['★', '☆']} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      expect(container.querySelector('.t-rate__icon')).toBeInTheDocument();
    });

    it(':size with zero value', () => {
      const { container } = render(
        <RateIcon size={0} icon={[]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveStyle('font-size: 0px');
    });

    it(':size with negative value', () => {
      const { container } = render(
        <RateIcon size={-10} icon={[]} color="" isCurrent={false} isSelected={false} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveStyle('font-size: -10px');
    });

    it('should handle current and selected together', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={true} isSelected={true} isHalf={false} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveClass('t-rate__icon--current');
      expect(icon).toHaveClass('t-rate__icon--selected');
    });

    it('should handle current and half together', () => {
      const { container } = render(
        <RateIcon size={24} icon={[]} color="" isCurrent={true} isSelected={true} isHalf={true} />,
      );
      const icon = container.querySelector('.t-rate__icon');
      expect(icon).toHaveClass('t-rate__icon--current');
      expect(container.querySelector('.t-rate__icon-left')).toBeInTheDocument();
    });
  });

  describe('event', () => {
    it(':click left side', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RateIcon
          size={24}
          icon={[]}
          color=""
          isCurrent={false}
          isSelected={false}
          isHalf={false}
          onClick={handleClick}
        />,
      );

      const icon = container.querySelector('.t-rate__icon') as Element;
      const rect = {
        x: 100,
        width: 24,
        height: 24,
        y: 100,
        top: 100,
        bottom: 124,
        left: 100,
        right: 124,
        toJSON: () => {},
      };
      vi.spyOn(icon, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      fireEvent.click(icon, { clientX: 105 });
      expect(handleClick).toHaveBeenCalledWith('left', expect.any(Object));
    });

    it(':click right side', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <RateIcon
          size={24}
          icon={[]}
          color=""
          isCurrent={false}
          isSelected={false}
          isHalf={false}
          onClick={handleClick}
        />,
      );

      const icon = container.querySelector('.t-rate__icon') as Element;
      const rect = {
        x: 100,
        width: 24,
        height: 24,
        y: 100,
        top: 100,
        bottom: 124,
        left: 100,
        right: 124,
        toJSON: () => {},
      };
      vi.spyOn(icon, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      fireEvent.click(icon, { clientX: 115 });
      expect(handleClick).toHaveBeenCalledWith('right', expect.any(Object));
    });
  });
});
