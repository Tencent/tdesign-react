import React from 'react';
import { vi } from 'vitest';
import { describe, it, expect, render, screen, fireEvent } from '@test/utils';
import { RateTips } from '../RateTips';

describe('RateTips', () => {
  describe('props', () => {
    it(':data', () => {
      const data = [
        { icon: <span>★</span>, text: '很差', actived: false },
        { icon: <span>★</span>, text: '一般', actived: true },
      ];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(container.querySelector('.t-rate__tips')).toBeInTheDocument();
      expect(container.querySelector('.t-rate__tips--top')).toBeInTheDocument();
      expect(screen.getByText('很差')).toBeInTheDocument();
      expect(screen.getByText('一般')).toBeInTheDocument();
    });

    it(':placement', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={100} data={data} placement="bottom" onClickOutside={() => {}} />);

      expect(container.querySelector('.t-rate__tips--bottom')).toBeInTheDocument();
    });

    it(':left', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={150} data={data} placement="top" onClickOutside={() => {}} />);

      const tips = container.querySelector('.t-rate__tips');
      expect(tips).toHaveStyle('left: 150px');
    });

    it(':data with empty array', () => {
      const { container } = render(<RateTips left={100} data={[]} placement="top" onClickOutside={() => {}} />);

      const items = container.querySelectorAll('.t-rate__tips-item');
      expect(items).toHaveLength(0);
    });

    it(':placement with undefined', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={100} data={data} placement={undefined} onClickOutside={() => {}} />);

      expect(container.querySelector('.t-rate__tips')).toBeInTheDocument();
    });

    it(':data with null', () => {
      const { container } = render(
        <RateTips left={100} data={null as any} placement="top" onClickOutside={() => {}} />,
      );

      const items = container.querySelectorAll('.t-rate__tips-item');
      expect(items).toHaveLength(0);
    });

    it(':data with undefined', () => {
      const { container } = render(
        <RateTips left={100} data={undefined as any} placement="top" onClickOutside={() => {}} />,
      );

      const items = container.querySelectorAll('.t-rate__tips-item');
      expect(items).toHaveLength(0);
    });

    it(':data with missing properties', () => {
      const data = [{ text: '测试' } as any];

      render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(screen.getByText('测试')).toBeInTheDocument();
    });

    it(':left with zero', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={0} data={data} placement="top" onClickOutside={() => {}} />);

      const tips = container.querySelector('.t-rate__tips');
      expect(tips).toHaveStyle('left: 0px');
    });

    it(':left with negative value', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={-100} data={data} placement="top" onClickOutside={() => {}} />);

      const tips = container.querySelector('.t-rate__tips');
      expect(tips).toHaveStyle('left: -100px');
    });

    it(':left with large value', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={10000} data={data} placement="top" onClickOutside={() => {}} />);

      const tips = container.querySelector('.t-rate__tips');
      expect(tips).toHaveStyle('left: 10000px');
    });

    it(':data with multiple items', () => {
      const data = [
        { icon: <span>★</span>, text: '很差', actived: false },
        { icon: <span>★</span>, text: '一般', actived: true },
        { icon: <span>★</span>, text: '很好', actived: false },
      ];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(screen.getByText('很差')).toBeInTheDocument();
      expect(screen.getByText('一般')).toBeInTheDocument();
      expect(screen.getByText('很好')).toBeInTheDocument();
      expect(container.querySelectorAll('.t-rate__tips-item')).toHaveLength(3);
    });

    it(':data with empty string text', () => {
      const data = [{ icon: <span>★</span>, text: '', actived: false }];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(container.querySelector('.t-rate__tips-text')).toBeInTheDocument();
    });

    it(':data with null text', () => {
      const data = [{ icon: <span>★</span>, text: null as any, actived: false }];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(container.querySelector('.t-rate__tips-text')).toBeInTheDocument();
    });

    it(':data with undefined text', () => {
      const data = [{ icon: <span>★</span>, text: undefined as any, actived: false }];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(container.querySelector('.t-rate__tips-text')).toBeInTheDocument();
    });

    it(':data with null icon', () => {
      const data = [{ icon: null, text: '测试', actived: false }];

      render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(screen.getByText('测试')).toBeInTheDocument();
    });

    it(':data with undefined icon', () => {
      const data = [{ icon: undefined, text: '测试', actived: false }];

      render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      expect(screen.getByText('测试')).toBeInTheDocument();
    });

    it(':data with true actived', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: true }];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      const item = container.querySelector('.t-rate__tips-item');
      expect(item).toHaveClass('t-rate__tips-item--active');
    });

    it(':data with false actived', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      const item = container.querySelector('.t-rate__tips-item');
      expect(item).not.toHaveClass('t-rate__tips-item--active');
    });

    it(':data with undefined actived', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: undefined }];

      const { container } = render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      const item = container.querySelector('.t-rate__tips-item');
      expect(item).not.toHaveClass('t-rate__tips-item--active');
    });
  });

  describe('event', () => {
    it(':click item', () => {
      const handleClick = vi.fn();
      const data = [{ icon: <span>★</span>, text: '测试', actived: false, onClick: handleClick }];

      render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      const item = screen.getByText('测试').parentElement!;
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalledWith(0);
    });

    it(':click outside', () => {
      const handleClickOutside = vi.fn();
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      render(
        <div>
          <div data-testid="outside">Outside</div>
          <RateTips left={100} data={data} placement="top" onClickOutside={handleClickOutside} />
        </div>,
      );

      fireEvent.click(screen.getByTestId('outside'));

      expect(handleClickOutside).toHaveBeenCalled();
    });

    it('should handle data with undefined onClick', () => {
      const data = [{ icon: <span>★</span>, text: '测试', actived: false, onClick: undefined }];

      render(<RateTips left={100} data={data} placement="top" onClickOutside={() => {}} />);

      const item = screen.getByText('测试').parentElement!;
      fireEvent.click(item);

      // Should not throw error
      expect(screen.getByText('测试')).toBeInTheDocument();
    });

    it('should handle onClickOutside correctly', () => {
      const handleClickOutside = vi.fn();
      const data = [{ icon: <span>★</span>, text: '测试', actived: false }];

      render(<RateTips left={100} data={data} placement="top" onClickOutside={handleClickOutside} />);

      // The useClickAway hook should handle the click outside
      expect(handleClickOutside).not.toHaveBeenCalled();
    });
  });
});
