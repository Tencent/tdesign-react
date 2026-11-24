import { render, fireEvent, act } from '@test/utils';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import Popup from '../Popup';

describe('Popup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  // 受控：可见
  describe('props', () => {
    test(':visible true', async () => {
      render(<Popup visible={true} />);
      const el = document.querySelector('.t-popup');
      expect(el).toBeTruthy();
      expect(el).not.toHaveStyle({ display: 'none' });
    });

    // 受控：不可见
    test(':visible false', async () => {
      render(<Popup visible={false} />);
      const el = document.querySelector('.t-popup');
      expect(el).toBeTruthy();
      expect(el).toHaveStyle({ display: 'none' });
    });
    // 非受控：可见
    test(':defaultVisible', async () => {
      render(<Popup defaultVisible={true} />);
      expect(document.querySelector('.t-popup')).toBeTruthy();
    });

    // duration
    test(':duration', async () => {
      const { rerender } = render(<Popup visible={false} duration={500} placement="center" />);

      const el = document.querySelector('.t-popup');
      expect(el).toBeTruthy();
      expect(document.querySelector('.t-popup--center')).toBeTruthy();

      // 模拟 visible 变为 true
      rerender(<Popup visible={true} duration={500} placement="center" />);

      // 模拟经过 100ms 动画保持
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(el.classList.contains('fade-zoom-enter-active')).toBeTruthy();

      // 模拟经过 100ms 动画保持
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(el.classList.contains('fade-zoom-enter-active')).toBeTruthy();

      // 模拟经过 300ms 动画结束
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(el.classList.contains('fade-zoom-enter-active')).toBeFalsy();

      render(<Popup visible={true} duration={0} />);
      const el1 = document.querySelector('.t-popup');
      expect(el1).toBeTruthy();
      expect(el1.classList.contains('fade-zoom-enter-active')).toBeFalsy();
    });

    // 放置位置：top
    test(':placement top', async () => {
      render(<Popup visible={true} placement="top" />);
      expect(document.querySelector('.t-popup--top')).toBeTruthy();
    });

    // 放置位置：center
    test(':placement center', async () => {
      render(<Popup visible={true} placement="center" />);
      expect(document.querySelector('.t-popup--center')).toBeTruthy();
    });

    // 放置位置：bottom
    test(':placement bottom', async () => {
      render(<Popup visible={true} placement="bottom" />);
      expect(document.querySelector('.t-popup--bottom')).toBeTruthy();
    });

    // 放置位置：left
    test(':placement left', async () => {
      render(<Popup visible={true} placement="left" />);
      expect(document.querySelector('.t-popup--left')).toBeTruthy();
    });

    // 放置位置：right
    test(':placement right', async () => {
      render(<Popup visible={true} placement="right" />);
      expect(document.querySelector('.t-popup--right')).toBeTruthy();
    });

    // zIndex
    test(':zIndex', async () => {
      render(<Popup visible={true} zIndex={9999} />);
      const popup = document.querySelector('.t-popup');
      expect(popup).toBeTruthy();
      expect((popup as HTMLElement).style.zIndex).toBe('9999');
    });

    // showOverlay: true
    test(':showOverlay true', async () => {
      render(<Popup visible={true} showOverlay={true} />);
      expect(document.querySelector('.t-overlay')).toBeTruthy();
    });

    // showOverlay: false
    test(':showOverlay false', async () => {
      render(<Popup visible={true} showOverlay={false} />);
      expect(document.querySelector('.t-overlay')).toBeFalsy();
    });

    // closeBtn
    test(':closeBtn', async () => {
      render(<Popup visible={true} closeBtn={<span className="close-button">Button</span>} />);
      expect(document.querySelector('.close-button')).toBeTruthy();
    });

    // attach
    test(':attach', async () => {
      const { container } = render(
        <div>
          <Popup visible={true} attach={() => document.querySelector('#popup-attach')} />
          <div id="popup-attach"></div>
        </div>,
      );
      const mountedInAttach = container.querySelector('#popup-attach .t-popup');
      expect(mountedInAttach).toBeTruthy();
    });

    // destroyOnClose
    test(':destroyOnClose', async () => {
      const { rerender } = render(<Popup visible={true} destroyOnClose={true} duration={100} />);

      expect(document.querySelector('.t-popup')).not.toBeNull();

      rerender(<Popup visible={false} destroyOnClose={true} duration={100} />);
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      expect(document.querySelector('.t-popup')).toBeNull();
    });

    test(':preventScrollThrough', async () => {
      render(<Popup visible={true} showOverlay={true} preventScrollThrough={true} />);

      const classNames = document.body.className;
      expect(classNames).toBe('t-overlay--lock t-popup--lock');
    });

    test(':overlayProps backgroundColor', () => {
      const backgroundColor = 'rgba(0, 0, 0, 0.5)';

      render(
        <Popup
          visible={true}
          showOverlay={true}
          overlayProps={{ backgroundColor }} // 传递 overlayProps
        />,
      );

      const overlay = document.querySelector('.t-overlay');
      expect(overlay).toHaveStyle(`background-color: ${backgroundColor}`);
    });
  });

  describe('interaction', () => {
    test('close on overlay click (uncontrolled)', async () => {
      const onClose = vi.fn();
      const onVisibleChange = vi.fn();
      render(
        <Popup
          defaultVisible={true}
          showOverlay
          closeOnOverlayClick
          onClose={onClose}
          onVisibleChange={onVisibleChange}
        />,
      );
      const overlay = document.querySelector('.t-overlay');
      fireEvent.click(overlay);
      vi.advanceTimersByTime(0);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onVisibleChange).toHaveBeenCalledWith(false, 'overlay');
      const popup = document.querySelector('.t-popup');
      expect(popup.classList.contains('slide-top-leave-active')).toBe(true);
    });

    test('close on close button click (uncontrolled)', async () => {
      const onClose = vi.fn();
      const onVisibleChange = vi.fn();
      render(<Popup defaultVisible={true} closeBtn onClose={onClose} onVisibleChange={onVisibleChange} />);
      const closeBtn = document.querySelector('.t-popup__close');
      fireEvent.click(closeBtn);
      vi.advanceTimersByTime(0);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onVisibleChange).toHaveBeenCalledWith(false, 'close-btn');
      const popup = document.querySelector('.t-popup');
      expect(popup.classList.contains('slide-top-leave-active')).toBe(true);
    });

    test('overlay click does nothing when closeOnOverlayClick=false', async () => {
      const onClose = vi.fn();
      const onVisibleChange = vi.fn();
      render(
        <Popup
          defaultVisible={true}
          showOverlay
          closeOnOverlayClick={false}
          onClose={onClose}
          onVisibleChange={onVisibleChange}
        />,
      );
      const overlay = document.querySelector('.t-overlay');
      fireEvent.click(overlay);
      vi.advanceTimersByTime(0);
      expect(onClose).not.toHaveBeenCalled();
      expect(onVisibleChange).not.toHaveBeenCalled();
      const popup = document.querySelector('.t-popup');
      expect(popup.className).not.toContain('leave-active');
    });

    test('lifecycle callbacks in controlled mode', async () => {
      const onOpen = vi.fn();
      const onOpened = vi.fn();
      const onClose = vi.fn();
      const onClosed = vi.fn();
      const onVisibleChange = vi.fn();
      const { rerender } = render(
        <Popup
          visible={false}
          onOpen={onOpen}
          onOpened={onOpened}
          onClose={onClose}
          onClosed={onClosed}
          onVisibleChange={onVisibleChange}
        />,
      );

      rerender(
        <Popup
          visible={true}
          onOpen={onOpen}
          onOpened={onOpened}
          onClose={onClose}
          onClosed={onClosed}
          onVisibleChange={onVisibleChange}
        />,
      );
      expect(onOpen).toHaveBeenCalledTimes(1);
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      expect(onOpened).toHaveBeenCalledTimes(1);

      rerender(
        <Popup
          visible={false}
          onOpen={onOpen}
          onOpened={onOpened}
          onClose={onClose}
          onClosed={onClosed}
          onVisibleChange={onVisibleChange}
        />,
      );
      await act(async () => {
        await vi.runAllTimersAsync();
      });
      expect(onClosed).toHaveBeenCalledTimes(1);
      expect(onVisibleChange).not.toHaveBeenCalled();
    });
  });
});
