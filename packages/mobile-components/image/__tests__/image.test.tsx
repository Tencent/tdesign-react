import '@testing-library/jest-dom';
import { fireEvent, render, waitFor, afterEach } from '@test/utils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import Image from '../Image';

// 在测试文件中定义局部的 IntersectionObserver mock
const mockIntersectionObserver = () => {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  // 使用 vi.fn() 模拟 IntersectionObserver
  const MockIntersectionObserver = vi.fn(() => ({
    observe,
    unobserve,
    disconnect,
  }));

  // 仅在当前测试文件中替换 IntersectionObserver
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

  return {
    observe,
    unobserve,
    disconnect,
    MockIntersectionObserver,
  };
};

describe('Image', () => {
  describe(': props', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it(': src', () => {
      const { getByRole } = render(<Image src="test.png" />);
      expect(getByRole('img')).toBeInTheDocument();
    });

    it(': alt', () => {
      const { getByAltText } = render(<Image alt="测试图片" src="test.png" />);
      expect(getByAltText('测试图片')).toHaveAttribute('src', 'test.png');
    });

    it(': shape', () => {
      const shapes = ['circle', 'round', 'square'] as const;
      shapes.forEach((shape) => {
        const { container } = render(<Image shape={shape} src="test.png" />);
        expect(container.firstChild).toHaveClass(`t-image--${shape}`);
      });
    });

    it(': fit', () => {
      const { container } = render(<Image fit="cover" src="test.png" />);
      const img = container.querySelector('.t-image__img');
      expect(img).toHaveClass('t-image--fit-cover');
    });

    it(': position', () => {
      const { getByRole } = render(<Image position="top center" src="test.png" />);
      expect(getByRole('img')).toHaveClass('t-image--position-top center');
    });

    it(': referrerpolicy', () => {
      const { getByRole } = render(<Image referrerpolicy="no-referrer" src="test.png" />);
      expect(getByRole('img')).toHaveAttribute('referrerPolicy', 'no-referrer');
    });

    // 加载状态测试
    it(': loading(custom)', () => {
      const { container } = render(<Image loading={<span>加载中...</span>} />);
      expect(container.textContent).toContain('加载中');
    });

    it(': loading(default)', () => {
      const { container } = render(<Image />);
      expect(container.querySelector('.t-loading')).toBeInTheDocument();
    });

    it(': error', async () => {
      const { getByRole, getByText } = render(<Image src="invalid.png" error={<span>加载失败</span>} />);
      const img = getByRole('img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(getByText('加载失败')).toBeInTheDocument();
      });
    });

    it(': srcset', () => {
      const srcset = {
        'image/avif': 'test.avif',
        'image/webp': 'test.webp',
      };
      const { getByRole, container } = render(<Image src="test.jpg" srcset={srcset} />);

      const avifSource = container.querySelector('source[type="image/avif"]');
      const webpSource = container.querySelector('source[type="image/webp"]');
      expect(avifSource).toHaveAttribute('srcset', 'test.avif');
      expect(webpSource).toHaveAttribute('srcset', 'test.webp');
      expect(getByRole('img')).toHaveAttribute('src', 'test.jpg');
    });

    it(': lazy', () => {
      const { observe, MockIntersectionObserver } = mockIntersectionObserver();

      const { container } = render(<Image src="test.png" lazy />);

      // 验证 IntersectionObserver 被正确初始化并使用
      expect(MockIntersectionObserver).toHaveBeenCalled();
      expect(observe).toHaveBeenCalledWith(container.firstElementChild);
    });

    it(': onLoad', async () => {
      const onLoad = vi.fn();
      const { getByRole } = render(<Image src="test.png" onLoad={onLoad} />);
      const img = getByRole('img');
      fireEvent.load(img);

      await waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });
    });

    it(': onError', async () => {
      const onError = vi.fn();
      const { getByRole } = render(<Image src="invalid.png" fallback="fallback.png" onError={onError} />);
      const img = getByRole('img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });
});
