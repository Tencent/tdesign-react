import React from 'react';
import { describe, it, expect, render, vi, fireEvent, act, beforeEach, afterEach } from '@test/utils';
import { NoticeBar } from '../index';

const mockGetBoundingClientRect = (listWidth: number, itemWidth: number) => {
  const originalGetBCR = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    if (this.classList?.contains('t-notice-bar__content-wrap')) {
      return {
        width: listWidth,
        height: 22,
        top: 0,
        left: 0,
        right: listWidth,
        bottom: 22,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    }
    if (this.classList?.contains('t-notice-bar__content')) {
      return {
        width: itemWidth,
        height: 22,
        top: 0,
        left: 0,
        right: itemWidth,
        bottom: 22,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect;
    }
    return originalGetBCR.call(this);
  };
  return () => {
    Element.prototype.getBoundingClientRect = originalGetBCR;
  };
};

describe('NoticeBar', () => {
  describe('props', () => {
    it('renders string content', () => {
      const { queryByText } = render(<NoticeBar visible content="通知消息" />);
      expect(queryByText('通知消息')).toBeInTheDocument();
    });

    it('renders TNode content', () => {
      const { container } = render(<NoticeBar visible content={<span className="custom">自定义</span>} />);
      expect(container.querySelector('.custom')).toBeTruthy();
    });

    it('renders array content with vertical direction', () => {
      const { container, queryByText } = render(
        <NoticeBar visible content={['消息1', '消息2']} direction="vertical" />,
      );
      expect(queryByText('消息1')).toBeInTheDocument();
      expect(container.querySelector('.t-swiper')).toBeTruthy();
      expect(container.querySelectorAll('.t-notice-bar__content--vertical-item').length).toBe(2);
    });

    it('renders operation text and custom TNode', () => {
      const { queryByText, container, rerender } = render(<NoticeBar visible content="消息" operation="查看" />);
      expect(queryByText('查看')).toBeInTheDocument();
      expect(container.querySelector('.t-notice-bar__operation')?.tagName).toBe('SPAN');

      rerender(<NoticeBar visible content="消息" operation={null} />);
      expect(container.querySelector('.t-notice-bar__operation')).toBeFalsy();
    });

    it('renders theme classes and default icons', () => {
      const themes = [
        { theme: 'info' as const, icon: '.t-icon-info-circle-filled' },
        { theme: 'success' as const, icon: '.t-icon-check-circle-filled' },
        { theme: 'warning' as const, icon: '.t-icon-error-circle-filled' },
        { theme: 'error' as const, icon: '.t-icon-error-circle-filled' },
      ];
      themes.forEach(({ theme, icon }) => {
        const { container } = render(<NoticeBar visible content="消息" theme={theme} />);
        expect(container.querySelector(`.t-notice-bar--${theme}`)).toBeTruthy();
        expect(container.querySelector(icon)).toBeTruthy();
      });
    });

    it('renders custom prefixIcon and hides when null', () => {
      const { container, rerender } = render(
        <NoticeBar visible content="消息" prefixIcon={<span className="my-icon" />} />,
      );
      expect(container.querySelector('.my-icon')).toBeTruthy();
      expect(container.querySelector('.t-notice-bar__prefix-icon')).toBeTruthy();

      rerender(<NoticeBar visible content="消息" prefixIcon={null} />);
      expect(container.querySelector('.t-notice-bar__prefix-icon')).toBeFalsy();
    });

    it('renders custom suffixIcon and hides when not provided', () => {
      const { container, rerender } = render(
        <NoticeBar visible content="消息" suffixIcon={<span className="suffix" />} />,
      );
      expect(container.querySelector('.suffix')).toBeTruthy();
      expect(container.querySelector('.t-notice-bar__suffix-icon')).toBeTruthy();

      rerender(<NoticeBar visible content="消息" />);
      expect(container.querySelector('.t-notice-bar__suffix-icon')).toBeFalsy();
    });

    it('controls visibility with visible and defaultVisible', () => {
      const { container, rerender } = render(<NoticeBar visible={false} content="消息" />);
      expect(container.querySelector('.t-notice-bar')).toBeFalsy();

      rerender(<NoticeBar visible content="消息" />);
      expect(container.querySelector('.t-notice-bar')).toBeTruthy();

      const { container: c2 } = render(<NoticeBar defaultVisible={false} content="消息" />);
      expect(c2.querySelector('.t-notice-bar')).toBeFalsy();
    });

    it('applies custom className and style', () => {
      const { container } = render(<NoticeBar visible content="消息" className="my-class" style={{ color: 'red' }} />);
      const el = container.querySelector('.t-notice-bar') as HTMLElement;
      expect(el.classList.contains('my-class')).toBeTruthy();
      expect(el.style.color).toBe('red');
    });
  });

  describe('marquee', () => {
    let restoreBCR: () => void;

    beforeEach(() => {
      vi.useFakeTimers();
      restoreBCR = mockGetBoundingClientRect(200, 500);
    });

    afterEach(() => {
      restoreBCR();
      vi.useRealTimers();
    });

    it('does not scroll when marquee is false', () => {
      const { container } = render(<NoticeBar visible content="静态" marquee={false} />);
      const content = container.querySelector('.t-notice-bar__content') as HTMLElement;
      expect(content.classList.contains('t-notice-bar__content-wrapable')).toBeTruthy();
      expect(content.style.transform).toBe('');
    });

    it('scrolls with marquee=true using default delay', () => {
      const { container } = render(<NoticeBar visible content="滚动" marquee />);
      // 默认 delay 200ms 内不滚动
      act(() => {
        vi.advanceTimersByTime(100);
      });
      const content = container.querySelector('.t-notice-bar__content') as HTMLElement;
      expect(content.style.transform).toBe('');

      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(content.style.transform).toBe('translateX(-500px)');
    });

    it('scrolls with marquee object config (speed, delay, loop)', () => {
      const { container } = render(<NoticeBar visible content="消息" marquee={{ speed: 80, loop: 3, delay: 500 }} />);
      act(() => {
        vi.advanceTimersByTime(600);
      });
      const content = container.querySelector('.t-notice-bar__content') as HTMLElement;
      expect(content.style.transform).toBe('translateX(-500px)');
      expect(content.style.transitionDuration).toBe('6.25s');
    });

    it('does not scroll when loop is 0', () => {
      const { container } = render(<NoticeBar visible content="消息" marquee={{ loop: 0 }} />);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      const content = container.querySelector('.t-notice-bar__content') as HTMLElement;
      expect(content.style.transform).toBe('');
    });
  });

  describe('events', () => {
    it('onClick triggers with correct trigger type', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <NoticeBar visible content="消息" operation="操作" suffixIcon={<span>X</span>} onClick={handleClick} />,
      );

      fireEvent.click(container.querySelector('.t-notice-bar__prefix-icon')!);
      expect(handleClick).toHaveBeenLastCalledWith('prefix-icon');

      fireEvent.click(container.querySelector('.t-notice-bar__content-wrap')!);
      expect(handleClick).toHaveBeenLastCalledWith('content');

      fireEvent.click(container.querySelector('.t-notice-bar__operation')!);
      expect(handleClick).toHaveBeenLastCalledWith('operation');

      fireEvent.click(container.querySelector('.t-notice-bar__suffix-icon')!);
      expect(handleClick).toHaveBeenLastCalledWith('suffix-icon');

      expect(handleClick).toHaveBeenCalledTimes(4);
    });

    it('does not throw when clicking without onClick handler', () => {
      const { container } = render(<NoticeBar visible content="消息" operation="操作" />);
      expect(() => {
        fireEvent.click(container.querySelector('.t-notice-bar__prefix-icon')!);
        fireEvent.click(container.querySelector('.t-notice-bar__content-wrap')!);
        fireEvent.click(container.querySelector('.t-notice-bar__operation')!);
      }).not.toThrow();
    });
  });

  describe('transitionEnd', () => {
    let restoreBCR: () => void;

    beforeEach(() => {
      vi.useFakeTimers();
      restoreBCR = mockGetBoundingClientRect(200, 500);
    });

    afterEach(() => {
      restoreBCR();
      vi.useRealTimers();
    });

    it('loops and re-scrolls on transitionEnd, stops when loop reaches 0', () => {
      const { container } = render(<NoticeBar visible content="消息" marquee={{ loop: 2, speed: 100 }} />);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      const content = container.querySelector('.t-notice-bar__content') as HTMLElement;
      expect(content.style.transform).toBe('translateX(-500px)');

      // transitionEnd: loop 2 -> 1, 重置后继续
      act(() => {
        fireEvent.transitionEnd(content);
      });
      expect(content.style.transform).toBe('translateX(200px)');
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(content.style.transform).toBe('translateX(-500px)');

      // transitionEnd: loop 1 -> 0, 停止
      act(() => {
        fireEvent.transitionEnd(content);
      });
      expect(content.classList.contains('t-notice-bar__content-wrapable')).toBeTruthy();
    });

    it('continues indefinitely with loop: -1', () => {
      const { container } = render(<NoticeBar visible content="消息" marquee={{ loop: -1, speed: 100 }} />);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      const content = container.querySelector('.t-notice-bar__content') as HTMLElement;

      // 多次 transitionEnd 仍持续滚动
      for (let i = 0; i < 3; i++) {
        act(() => {
          fireEvent.transitionEnd(content);
        });
        act(() => {
          vi.advanceTimersByTime(0);
        });
        expect(content.style.transform).toBe('translateX(-500px)');
      }
    });

    it('re-triggers scrolling when visible toggles from false to true', () => {
      const { container, rerender } = render(<NoticeBar visible content="消息" marquee={{ speed: 100 }} />);
      act(() => {
        vi.advanceTimersByTime(300);
      });

      rerender(<NoticeBar visible={false} content="消息" marquee={{ speed: 100 }} />);
      rerender(<NoticeBar visible content="消息" marquee={{ speed: 100 }} />);
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(container.querySelector('.t-notice-bar')).toBeTruthy();
    });
  });
});
