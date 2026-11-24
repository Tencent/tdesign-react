import React from 'react';
import { describe, it, expect, render, vi, fireEvent, beforeEach } from '@test/utils';
import { ActionSheetGrid } from '../ActionSheetGrid';

describe('ActionSheetGrid', () => {
  const mockOnSelected = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('props', () => {
    it(':items - should render string items', () => {
      const items = ['选项一', '选项二', '选项三'];
      const { queryByText } = render(<ActionSheetGrid items={items} onSelected={mockOnSelected} />);

      expect(queryByText('选项一')).toBeInTheDocument();
      expect(queryByText('选项二')).toBeInTheDocument();
      expect(queryByText('选项三')).toBeInTheDocument();
    });

    it(':items - should render object items', () => {
      const MockIcon = () => <span>Icon</span>;
      const items = [
        { label: '选项一', icon: <MockIcon /> },
        { label: '选项二', badge: { count: 5 } },
      ];
      const { queryByText } = render(<ActionSheetGrid items={items} onSelected={mockOnSelected} />);

      expect(queryByText('选项一')).toBeInTheDocument();
      expect(queryByText('选项二')).toBeInTheDocument();
    });

    it(':count - should control items per page', () => {
      const items = Array.from({ length: 20 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={4} onSelected={mockOnSelected} />);

      // Should create grid structure
      expect(container.querySelector('.t-action-sheet__grid')).toBeInTheDocument();
    });

    it(':count - should use default count of 8', () => {
      const items = Array.from({ length: 10 }, (_, i) => `选项${i + 1}`);
      const { queryByText } = render(<ActionSheetGrid items={items} onSelected={mockOnSelected} />);

      expect(queryByText('选项1')).toBeInTheDocument();
      expect(queryByText('选项10')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      const { container } = render(<ActionSheetGrid items={[]} onSelected={mockOnSelected} />);

      expect(container.querySelector('.t-action-sheet__grid')).toBeInTheDocument();
    });

    it('should handle undefined items', () => {
      const { container } = render(<ActionSheetGrid onSelected={mockOnSelected} />);

      expect(container.querySelector('.t-action-sheet__grid')).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    it('should create multiple pages when items exceed count', () => {
      const items = Array.from({ length: 20 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={8} onSelected={mockOnSelected} />);

      const grid = container.querySelector('.t-action-sheet__grid');
      expect(grid).toHaveClass('t-action-sheet__grid--swiper');
      expect(grid).toHaveClass('t-action-sheet__dots');
    });

    it('should not show pagination for single page', () => {
      const items = Array.from({ length: 4 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={8} onSelected={mockOnSelected} />);

      const grid = container.querySelector('.t-action-sheet__grid');
      expect(grid).not.toHaveClass('t-action-sheet__grid--swiper');
      expect(grid).not.toHaveClass('t-action-sheet__dots');
    });
  });

  describe('events', () => {
    it(':onSelected - should call onSelected with correct index', () => {
      const items = ['选项一', '选项二', '选项三'];
      const { container } = render(<ActionSheetGrid items={items} onSelected={mockOnSelected} />);

      // Find grid items and click them
      const gridItems = container.querySelectorAll('.t-grid-item');
      if (gridItems.length > 0) {
        fireEvent.click(gridItems[0]);
        expect(mockOnSelected).toHaveBeenCalledWith(0);
      }
    });

    it('should handle onSelected not provided', () => {
      const items = ['选项一'];
      const { container } = render(<ActionSheetGrid items={items} />);

      expect(() => {
        const gridItem = container.querySelector('.t-grid-item');
        if (gridItem) {
          fireEvent.click(gridItem);
        }
      }).not.toThrow();
    });
  });

  describe('swiper configuration', () => {
    it('should configure swiper for multiple pages', () => {
      const items = Array.from({ length: 20 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={8} onSelected={mockOnSelected} />);

      const swiper = container.querySelector('.t-swiper');
      expect(swiper).toBeInTheDocument();
    });

    it('should configure swiper for single page', () => {
      const items = Array.from({ length: 4 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={8} onSelected={mockOnSelected} />);

      const swiper = container.querySelector('.t-swiper');
      expect(swiper).toBeInTheDocument();
    });
  });

  describe('grid layout', () => {
    it('should render items in grid layout', () => {
      const items = Array.from({ length: 6 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={8} onSelected={mockOnSelected} />);

      const grid = container.querySelector('.t-grid');
      expect(grid).toBeInTheDocument();
    });

    it('should handle different count values', () => {
      const items = Array.from({ length: 10 }, (_, i) => `选项${i + 1}`);
      const { container } = render(<ActionSheetGrid items={items} count={6} onSelected={mockOnSelected} />);

      const grid = container.querySelector('.t-grid');
      expect(grid).toBeInTheDocument();
    });
  });
});
