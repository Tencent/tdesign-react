import React from 'react';
import { describe, it, expect, render, vi, fireEvent, beforeEach } from '@test/utils';
import { ActionSheetList } from '../ActionSheetList';

describe('ActionSheetList', () => {
  const mockOnSelected = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('props', () => {
    it(':items - should render string items', () => {
      const items = ['选项一', '选项二', '选项三'];
      const { queryByText } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(queryByText('选项一')).toBeInTheDocument();
      expect(queryByText('选项二')).toBeInTheDocument();
      expect(queryByText('选项三')).toBeInTheDocument();
    });

    it(':items - should render object items', () => {
      const items = [
        { label: '选项一', color: '#ff0000' },
        { label: '选项二', color: '#00ff00', disabled: true },
      ];
      const { queryByText } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(queryByText('选项一')).toBeInTheDocument();
      expect(queryByText('选项二')).toBeInTheDocument();
    });

    it(':items - should render items with badges', () => {
      const items = [
        {
          label: '带徽标选项',
          badge: { count: 5, dot: false },
        },
        {
          label: '红点选项',
          badge: { dot: true },
        },
      ];
      const { queryByText } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(queryByText('带徽标选项')).toBeInTheDocument();
      expect(queryByText('红点选项')).toBeInTheDocument();
    });

    it(':items - should render items with icons', () => {
      const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
      const items = [{ label: '带图标选项', icon: <MockIcon /> }];
      const { queryByText, queryByTestId } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(queryByText('带图标选项')).toBeInTheDocument();
      expect(queryByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should handle empty items array', () => {
      const { container } = render(<ActionSheetList items={[]} onSelected={mockOnSelected} />);

      const list = container.querySelector('.t-action-sheet__list');
      expect(list).toBeInTheDocument();
      expect(list?.children).toHaveLength(0);
    });

    it('should handle undefined items', () => {
      const { container } = render(<ActionSheetList onSelected={mockOnSelected} />);

      const list = container.querySelector('.t-action-sheet__list');
      expect(list).toBeInTheDocument();
      expect(list?.children).toHaveLength(0);
    });
  });

  describe('events', () => {
    it(':onSelected - should call onSelected when item is clicked', () => {
      const items = ['选项一', '选项二'];
      const { container } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      const buttons = container.querySelectorAll('.t-action-sheet__list-item');
      fireEvent.click(buttons[0]);
      expect(mockOnSelected).toHaveBeenCalledWith(0);

      fireEvent.click(buttons[1]);
      expect(mockOnSelected).toHaveBeenCalledWith(1);
    });

    it(':onSelected - should not call onSelected when disabled item is clicked', () => {
      const items = [
        { label: '正常选项', disabled: false },
        { label: '禁用选项', disabled: true },
      ];
      const { container } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      const buttons = container.querySelectorAll('.t-action-sheet__list-item');

      // Disabled button should not trigger callback
      fireEvent.click(buttons[1]);
      expect(mockOnSelected).not.toHaveBeenCalled();

      // Normal button should trigger callback
      fireEvent.click(buttons[0]);
      expect(mockOnSelected).toHaveBeenCalledWith(0);
    });

    it('should handle onSelected not provided', () => {
      const items = ['选项一'];
      const { container } = render(<ActionSheetList items={items} />);

      expect(() => {
        const button = container.querySelector('.t-action-sheet__list-item');
        if (button) {
          fireEvent.click(button);
        }
      }).not.toThrow();
    });
  });

  describe('styling', () => {
    it('should apply custom colors to items', () => {
      const items = [
        { label: '红色选项', color: '#ff0000' },
        { label: '蓝色选项', color: '#0000ff' },
      ];
      const { container } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      const buttons = container.querySelectorAll('.t-action-sheet__list-item');
      expect(buttons[0]).toHaveStyle({ color: '#ff0000' });
      expect(buttons[1]).toHaveStyle({ color: '#0000ff' });
    });

    it('should render disabled items with proper styling', () => {
      const items = [{ label: '禁用选项', disabled: true }];
      const { container } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      const disabledButton = container.querySelector('.t-action-sheet__list-item');
      expect(disabledButton).toBeDisabled();
    });
  });

  describe('badge functionality', () => {
    it('should render badge with count', () => {
      const items = [
        {
          label: '消息',
          badge: { count: 99, maxCount: 99 },
        },
      ];
      const { queryByText } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(queryByText('消息')).toBeInTheDocument();
    });

    it('should render badge with dot', () => {
      const items = [
        {
          label: '通知',
          badge: { dot: true },
        },
      ];
      const { queryByText } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(queryByText('通知')).toBeInTheDocument();
    });

    it('should render badge with custom content', () => {
      const items = [
        {
          label: '自定义',
          badge: { content: 'NEW', size: 'medium' as const },
        },
      ];
      const { container } = render(<ActionSheetList items={items} onSelected={mockOnSelected} />);

      expect(container.querySelector('.t-badge')).toBeInTheDocument();
    });
  });
});
