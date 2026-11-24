import React from 'react';
import { describe, it, expect, render, fireEvent, vi } from '@test/utils';
import List from '../list';

const prefix = 't';
const name = `.${prefix}-list`;
const listText = '列表项';
const headerText = '列表头部';
const footerText = '列表底部';

describe('List', () => {
  describe('props', () => {
    it(': className', () => {
      const className = 'custom-class';
      const { container } = render(<List className={className} />);
      expect(container.firstChild).toHaveClass(className);
      expect(container.firstChild).toHaveClass(`${prefix}-list`);
    });

    it(': style', () => {
      const style = { backgroundColor: 'red' };
      const { container } = render(<List style={style} />);
      expect(container.firstChild).toHaveAttribute('style', expect.stringContaining('background-color: red'));
    });

    it(': children', () => {
      const { container } = render(<List>{listText}</List>);
      expect(container.innerHTML).toContain(listText);
    });

    it(': header as string', () => {
      const { container } = render(<List header={headerText} />);
      expect(container.innerHTML).toContain(headerText);
    });

    it(': header as ReactNode', () => {
      const { container } = render(<List header={<div className="custom-header">{headerText}</div>} />);
      expect(container.querySelector('.custom-header')).toHaveTextContent(headerText);
    });

    it(': footer as string', () => {
      const { container } = render(<List footer={footerText} />);
      expect(container.innerHTML).toContain(footerText);
    });

    it(': footer as ReactNode', () => {
      const { container } = render(<List footer={<div className="custom-footer">{footerText}</div>} />);
      expect(container.querySelector('.custom-footer')).toHaveTextContent(footerText);
    });

    it(': asyncLoading="loading" renders TLoading with indicator and "加载中" text', () => {
      const { container } = render(<List asyncLoading="loading" />);
      expect(container.querySelector('.t-loading')).toBeInTheDocument();
      expect(container.querySelector('.t-loading__text')).toHaveTextContent('加载中');
    });

    it(': asyncLoading="load-more" renders TLoading with "加载更多" text and no indicator', () => {
      const { container } = render(<List asyncLoading="load-more" />);
      expect(container.querySelector('.t-loading')).toBeInTheDocument();
      expect(container.querySelector('.t-loading__text')).toHaveTextContent('加载更多');
    });

    it(': asyncLoading invalid string does not render TLoading', () => {
      const { container } = render(<List asyncLoading={'invalid' as any} />);
      expect(container.querySelector('.t-loading')).not.toBeInTheDocument();
    });

    it(': asyncLoading non-string value does not render TLoading', () => {
      const { container } = render(<List asyncLoading={false as any} />);
      expect(container.querySelector('.t-loading')).not.toBeInTheDocument();
    });

    it(': loading wrapper exists regardless of asyncLoading', () => {
      const { container } = render(<List />);
      expect(container.querySelector(`${name}__loading--wrapper`)).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it(': onLoadMore triggered when asyncLoading is "load-more"', () => {
      const handleLoadMore = vi.fn();
      const { container } = render(<List asyncLoading="load-more" onLoadMore={handleLoadMore} />);
      const loadingWrapper = container.querySelector(`${name}__loading--wrapper`);
      fireEvent.click(loadingWrapper);
      expect(handleLoadMore).toHaveBeenCalledTimes(1);
    });

    it(': onLoadMore not triggered when asyncLoading is "loading"', () => {
      const handleLoadMore = vi.fn();
      const { container } = render(<List asyncLoading="loading" onLoadMore={handleLoadMore} />);
      const loadingWrapper = container.querySelector(`${name}__loading--wrapper`);
      fireEvent.click(loadingWrapper);
      expect(handleLoadMore).not.toHaveBeenCalled();
    });

    it(': onLoadMore not triggered when asyncLoading is empty', () => {
      const handleLoadMore = vi.fn();
      const { container } = render(<List onLoadMore={handleLoadMore} />);
      const loadingWrapper = container.querySelector(`${name}__loading--wrapper`);
      fireEvent.click(loadingWrapper);
      expect(handleLoadMore).not.toHaveBeenCalled();
    });

    it(': onLoadMore not provided does not throw when clicking', () => {
      const { container } = render(<List asyncLoading="load-more" />);
      const loadingWrapper = container.querySelector(`${name}__loading--wrapper`);
      expect(() => fireEvent.click(loadingWrapper)).not.toThrow();
    });

    it(': onScroll receives bottomDistance and scrollTop', () => {
      const handleScroll = vi.fn();
      render(<List onScroll={handleScroll} />);

      const scrollEvent = new Event('scroll', { bubbles: true });
      Object.defineProperty(scrollEvent, 'currentTarget', {
        value: {
          scrollTop: 100,
          offsetHeight: 200,
          scrollHeight: 500,
        },
        enumerable: true,
      });

      window.dispatchEvent(scrollEvent);
      expect(handleScroll).toHaveBeenCalledTimes(1);
      // bottomDistance = scrollHeight - scrollTop - offsetHeight = 500 - 100 - 200 = 200
      expect(handleScroll).toHaveBeenCalledWith(200, 100);
    });

    it(': scroll without onScroll prop should not throw', () => {
      expect(() => {
        render(<List />);
        const scrollEvent = new Event('scroll', { bubbles: true });
        Object.defineProperty(scrollEvent, 'currentTarget', {
          value: { scrollTop: 0, offsetHeight: 100, scrollHeight: 100 },
          enumerable: true,
        });
        window.dispatchEvent(scrollEvent);
      }).not.toThrow();
    });

    it(': addEventListener called on mount and removeEventListener called on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(<List />);
      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it(': should not bind scroll listener when getScrollParent returns null', async () => {
      vi.resetModules();
      vi.doMock('../../_util/getScrollParent', () => ({
        __esModule: true,
        default: vi.fn().mockReturnValue(null),
      }));
      const { default: ListReimported } = await import('../list');
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      expect(() => render(<ListReimported />)).not.toThrow();
      const scrollCalls = addEventListenerSpy.mock.calls.filter((c) => c[0] === 'scroll');
      expect(scrollCalls.length).toBe(0);

      addEventListenerSpy.mockRestore();
      vi.doUnmock('../../_util/getScrollParent');
      vi.resetModules();
    });

    it(': should early return in useEffect when wrapperRef.current is null', async () => {
      vi.resetModules();
      const getScrollParentMock = vi.fn().mockReturnValue(window);
      vi.doMock('../../_util/getScrollParent', () => ({
        __esModule: true,
        default: getScrollParentMock,
      }));
      // list.tsx imports `useRef` as a named export from 'react'. Mock the named export
      // so that wrapperRef.current is locked to null, triggering the early-return branch.
      vi.doMock('react', async () => {
        const actual = await vi.importActual<typeof React>('react');
        return {
          ...actual,
          useRef: () => {
            const refLike: any = {};
            Object.defineProperty(refLike, 'current', {
              get() {
                return null;
              },
              set() {
                /* swallow assignment from React */
              },
              configurable: true,
            });
            return refLike;
          },
        };
      });
      const { default: ListReimported } = await import('../list');

      expect(() => render(<ListReimported />)).not.toThrow();
      expect(getScrollParentMock).not.toHaveBeenCalled();

      vi.doUnmock('react');
      vi.doUnmock('../../_util/getScrollParent');
      vi.resetModules();
    });
  });

  describe('slots', () => {
    it(': render header / children / footer together', () => {
      const { container } = render(
        <List header={headerText} footer={footerText}>
          <div className="list-item">{listText}</div>
        </List>,
      );

      expect(container.innerHTML).toContain(headerText);
      expect(container.querySelector('.list-item')).toHaveTextContent(listText);
      expect(container.innerHTML).toContain(footerText);
    });

    it(': render with header / children / footer and asyncLoading together', () => {
      const { container } = render(
        <List header={headerText} footer={footerText} asyncLoading="load-more">
          <div className="list-item">{listText}</div>
        </List>,
      );

      expect(container.innerHTML).toContain(headerText);
      expect(container.querySelector('.list-item')).toHaveTextContent(listText);
      expect(container.innerHTML).toContain(footerText);
      expect(container.querySelector('.t-loading__text')).toHaveTextContent('加载更多');
    });
  });
});
