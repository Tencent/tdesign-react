import { render, fireEvent, describe, test, expect, beforeEach, afterEach } from '@test/utils';
import { vi, type Mock } from 'vitest';
import React from 'react';
import { AppIcon } from 'tdesign-icons-react';
import { useScroll } from 'ahooks';
import BackTop from '../Backtop';
import { canUseDOM } from '../../_util/dom';

vi.mock('ahooks', async () => {
  const actual = await vi.importActual('ahooks');
  return {
    ...actual,
    useScroll: vi.fn(),
  };
});

vi.mock('../../_util/dom', async () => {
  const actual = await vi.importActual('../../_util/dom');
  return {
    ...actual,
    canUseDOM: vi.fn(),
  };
});

describe('BackTop', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('props', () => {
    test(':target', async () => {
      (canUseDOM as Mock).mockReturnValue(true);
      document.documentElement.scrollTo = vi.fn();
      const { container } = render(
        <div>
          <BackTop target={() => document.querySelector('#custom-container') as HTMLElement} />
          <div id="custom-container"></div>
        </div>,
      );
      fireEvent.click(container.querySelector('.t-back-top'));
      expect(document.documentElement.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    test(':fixed', async () => {
      (window.document.documentElement as any).window = window;
      const { container } = render(<BackTop fixed />);
      expect(container.querySelector('.t-back-top--fixed')).toBeTruthy();
    });

    test(':icon', async () => {
      const { container, rerender } = render(<BackTop icon={true} />);
      expect(container.querySelector('.t-back-top__icon')).toBeTruthy();

      rerender(<BackTop icon={<AppIcon />} />);
      expect(container.querySelector('.t-icon-app')).toBeTruthy();
    });

    test(':text', async () => {
      const text = '回到顶部';
      const { queryByText } = render(<BackTop text={text} />);
      expect(queryByText(text)).toBeTruthy();
    });

    test(':theme', async () => {
      const themes = ['round', 'half-round', 'round-dark', 'half-round-dark'] as const;
      themes.forEach((theme) => {
        const { container } = render(<BackTop theme={theme} />);
        expect(container.querySelector(`.t-back-top--${theme}`)).toBeTruthy();
      });
    });

    test(':visibilityHeight', async () => {
      (useScroll as Mock).mockReturnValue({ top: 400 });
      const { container } = render(<BackTop visibilityHeight={200} />);

      expect((container.querySelector('.t-back-top') as HTMLElement).style.opacity).toBe('1');
    });

    test(':container', async () => {
      render(
        <div>
          <BackTop container={() => document.querySelector('#custom-container')} />
          <div id="custom-container"></div>
        </div>,
      );
      document.querySelector('#custom-container').scrollTo = vi.fn();
      fireEvent.click(document.querySelector('.t-back-top'));
      expect(document.querySelector('#custom-container').scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('events', () => {
    test(':onToTop', async () => {
      const onToTop = vi.fn();
      document.documentElement.scrollTo = vi.fn();
      const { container } = render(<BackTop onToTop={onToTop} />);
      fireEvent.click(container.querySelector('.t-back-top'));
      expect(onToTop).toHaveBeenCalled();
    });
  });

  describe('interaction', () => {
    test('should show when scrollY > visibilityHeight', async () => {
      (useScroll as Mock).mockReturnValue({ top: 100 });
      const { container, rerender } = render(<BackTop visibilityHeight={200} />);
      expect((container.querySelector('.t-back-top') as HTMLElement).style.opacity).toBe('0');
      (useScroll as Mock).mockReturnValue({ top: 400 });
      rerender(<BackTop visibilityHeight={200} />);
      expect((container.querySelector('.t-back-top') as HTMLElement).style.opacity).toBe('1');
    });

    test('should scroll to top when clicked', async () => {
      (useScroll as Mock).mockReturnValue({ top: 400 });
      document.documentElement.scrollTo = vi.fn();
      const { container } = render(<BackTop />);
      fireEvent.click(container.querySelector('.t-back-top'));
      expect(document.documentElement.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  describe('edge cases', () => {
    test('should handle empty text', async () => {
      const { container } = render(<BackTop text="" />);
      expect(container.querySelector('.t-back-top__text')).toBeFalsy();
    });

    test('should handle ssr', async () => {
      (canUseDOM as Mock).mockReturnValue(false);
      render(<BackTop />);
      expect(document.querySelector('.t-back-top')).toBeTruthy();
    });
  });
});
