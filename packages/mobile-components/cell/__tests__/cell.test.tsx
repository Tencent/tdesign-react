import { describe, it, expect, vi, render, fireEvent, screen } from '@test/utils';
import React from 'react';
import Cell from '../Cell';

describe('Cell', () => {
  describe('slots', () => {
    it(': default', () => {
      const { getByText } = render(
        <Cell title="Test Title" description="Test Description">
          Test Children
        </Cell>,
      );

      expect(getByText('Test Title')).toBeInTheDocument();
      expect(getByText('Test Description')).toBeInTheDocument();
      expect(getByText('Test Children')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it(': leftIcon and image', () => {
      const { getByTestId } = render(
        <Cell
          leftIcon={<div data-testid="left-icon">Left Icon</div>}
          image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"
        >
          Test Children
        </Cell>,
      );

      expect(getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it(': image', () => {
      const { container } = render(<Cell image="https://tdesign.gtimg.com/mobile/demos/avatar1.png"></Cell>);

      expect(container.querySelector('.t-cell__left-image')).toBeInTheDocument();
    });

    it(': rightIcon', () => {
      const { getByTestId } = render(<Cell rightIcon={<div data-testid="right-icon">Right Icon</div>} />);

      expect(getByTestId('right-icon')).toBeInTheDocument();
    });

    it(': required', () => {
      const { container, rerender } = render(<Cell title="Required Field" />);

      expect(container.querySelector('.t-cell--required')).not.toBeInTheDocument();

      rerender(<Cell title="Required Field" required />);
      expect(container.querySelector('.t-cell--required')).toBeInTheDocument();
      expect(container.querySelector('.t-cell--required')).toHaveTextContent('*');
    });

    it(': arrow', () => {
      const { container, rerender } = render(<Cell />);

      const rightIcon = container.querySelector('.t-cell__right-icon');
      expect(rightIcon).not.toBeInTheDocument();

      rerender(<Cell arrow />);

      expect(container.querySelector('.t-cell__right-icon')).toBeInTheDocument();
      // 检查是否包含箭头图标
      expect(container.querySelector('.t-cell__right-icon > svg')).toBeInTheDocument();
    });

    it(': arrow and rightIcon', () => {
      const { container } = render(<Cell arrow rightIcon={<div data-testid="custom-right-icon">Custom Icon</div>} />);

      const rightIcon = container.querySelector('.t-cell__right-icon');
      expect(rightIcon).toBeInTheDocument();
      // 应该显示箭头图标而不是自定义图标
      expect(rightIcon.querySelector('svg')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="custom-right-icon"]')).not.toBeInTheDocument();
    });

    it(': note', () => {
      const { container, getByText } = render(<Cell note="Test Note" />);

      const noteElement = container.querySelector('.t-cell__note');
      expect(noteElement).toBeInTheDocument();
      expect(getByText('Test Note')).toBeInTheDocument();
    });

    it(': renders note instead of children when both note and children are provided', () => {
      const { container, getByText, queryByText } = render(<Cell note="Test Note">Test Children Content</Cell>);

      const noteElement = container.querySelector('.t-cell__note');
      expect(noteElement).toBeInTheDocument();
      expect(getByText('Test Note')).toBeInTheDocument();
      expect(queryByText('Test Children Content')).not.toBeInTheDocument();
    });

    it(': onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(<Cell onClick={handleClick} />);

      fireEvent.click(container.firstChild);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
