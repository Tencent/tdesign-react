import React from 'react';
import { describe, expect, it, act, beforeEach, afterEach } from '@test/utils';
import { AppIcon } from 'tdesign-icons-react';
import { vi } from 'vitest';
import Toast from '../index';

const ICON_CLASS_MAP = {
  loading: '.t-icon-loading',
  success: '.t-icon-check-circle',
  warning: '.t-icon-error-circle',
  error: '.t-icon-close-circle',
};

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('props', () => {
    it(': message', async () => {
      const message = 'Hello TDesign';
      expect(document.querySelector('.t-toast')).toBeFalsy();

      await act(async () => {
        await Toast(message);
      });
      expect(document.querySelector('.t-toast')).toBeTruthy();
      expect(document.querySelector('.t-toast__text').innerHTML.trim()).toBe(message);
    });

    it(': direction', async () => {
      const textDirection = async (direction, target?: string) => {
        await act(async () => {
          await Toast({ direction });
        });
        expect(document.querySelector(`.t-toast--${target || direction}`)).toBeTruthy();
      };
      await textDirection('column');
      await textDirection('row');
      await textDirection(undefined, 'row');
    });

    it(': icon', async () => {
      expect(document.querySelector('.t-icon-app')).toBeFalsy();
      await act(async () => {
        await Toast({
          icon: <AppIcon />,
        });
      });
      expect(document.querySelector('.t-icon-app')).toBeTruthy();
    });

    it(': theme', async () => {
      const testTheme = async (theme, target) => {
        expect(document.querySelector(target)).toBeFalsy();
        await act(async () => {
          await Toast({
            theme,
            message: '1',
          });
        });
        expect(document.querySelector(target)).toBeTruthy();
      };
      await testTheme('loading', ICON_CLASS_MAP.loading);
      await testTheme('success', ICON_CLASS_MAP.success);
      await testTheme('warning', ICON_CLASS_MAP.warning);
      await testTheme('error', ICON_CLASS_MAP.error);
    });

    it(': showOverlay', async () => {
      const testShowOverlay = async (showOverlay) => {
        await act(async () => {
          await Toast({
            showOverlay,
          });
        });
        const overlay = document.querySelector('.t-overlay');
        if (showOverlay) {
          expect(overlay).toBeTruthy();
        } else {
          expect(overlay).toBeFalsy();
        }
      };
      await testShowOverlay(true);
      await testShowOverlay(false);
    });

    it(': overlayProps', async () => {
      const duration = 1000;
      await act(async () => {
        await Toast({
          showOverlay: true,
          overlayProps: {
            duration,
          },
        });
      });
      const overlay = document.querySelector('.t-overlay');
      expect(overlay).toBeTruthy();
      expect(window.getComputedStyle(overlay).animationDuration).toBe(`${duration}ms`);
    });

    it(': placement', async () => {
      const testPlacement = async (placement, target) => {
        await act(async () => {
          await Toast({
            placement,
          });
        });
        const wrapper = document.querySelector('.t-toast');
        expect(wrapper).toBeTruthy();
        expect(window.getComputedStyle(wrapper).top).toBe(target);
      };
      await testPlacement('top', '25%');
      await testPlacement('bottom', '75%');
      await testPlacement('middle', '45%');
      await testPlacement(undefined, '45%');
    });

    it(': preventScrollThrough', async () => {
      const testPreventScrollThrough = async (preventScrollThrough, target) => {
        const lockClass = 't-toast--lock';
        document.body.classList.remove(lockClass);
        await act(async () => {
          await Toast({
            preventScrollThrough,
          });
        });
        expect(!!document.querySelector(`.${lockClass}`)).toBe(target);
      };
      await testPreventScrollThrough(true, true);
      await testPreventScrollThrough(false, false);
    });
    // vi.useFakeTimers() 只能模拟 setTimeout ，无法模拟 CSS 动画，如果不想用 sleep()，可以使用 Mock CSSTransition 跳过动画
    it(': duration(vi.useFakeTimers())', async () => {
      vi.mock('react-transition-group', () => ({
        CSSTransition: ({ children, in: visible }) => (visible ? children : null),
      }));
      const testDuration = async (duration) => {
        await act(async () => {
          await Toast({ duration });
        });
        expect(document.querySelector('.t-toast')).toBeTruthy();
        if (duration) {
          await act(async () => {
            vi.advanceTimersByTime(2000);
          });
          expect(document.querySelector('.t-toast')).toBeFalsy();
        } else {
          expect(document.querySelector('.t-toast')).toBeTruthy();
        }
      };
      await testDuration(1000);
      await testDuration(0);
    });

    // sleep() + act() 可以模拟 CSS 动画，但是会阻塞测试，建议使用 vi.useFakeTimers()
    // it(': duration', async () => {
    //   const sleep = (time) =>
    //     new Promise((resolve) => {
    //       setTimeout(resolve, time);
    //     });

    //   const testDuration = async (duration) => {
    //     await act(async () => {
    //       await Toast({ duration });
    //     });
    //     expect(document.querySelector('.t-toast')).toBeTruthy();
    //     if (duration) {
    //       await sleep(duration + 300);

    //       await act(async () => {
    //         // tips: 这里可以空操作，仅为了让 React 处理 pending 状态
    //       });

    //       expect(document.querySelector('.t-toast')).toBeFalsy();
    //     } else {
    //       expect(document.querySelector('.t-toast')).toBeTruthy();
    //     }
    //   };
    //   await testDuration(1000);
    //   await testDuration(0);
    // });
  });

  describe('event', () => {
    it(': close and destroy after duration', async () => {
      const onClose = vi.fn();
      const onDestroy = vi.fn();
      await act(async () => {
        await Toast({
          onClose,
          onDestroy,
        });
      });
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });

    it(': clear triggers close only', async () => {
      const onClose = vi.fn();
      const onDestroy = vi.fn();
      await act(async () => {
        await Toast({
          onClose,
          onDestroy,
          message: ' ',
          duration: 10000,
        });
      });
      await act(async () => {
        Toast.clear();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onDestroy).not.toHaveBeenCalled();
    });
  });

  describe('method', () => {
    it.each([0, 10000])(': clear releases the interaction lock with duration %i', async (duration) => {
      const onDestroy = vi.fn();
      const onClose = vi.fn();
      await act(async () => {
        Toast({ theme: 'loading', preventScrollThrough: true, duration, onDestroy, onClose });
      });
      expect(document.body).toHaveClass('t-toast--lock');

      await act(async () => {
        Toast.clear();
        Toast.clear();
      });

      expect(document.querySelector('.t-toast')).toBeNull();
      expect(document.body).not.toHaveClass('t-toast--lock');
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onDestroy).not.toHaveBeenCalled();
      await act(async () => {
        vi.advanceTimersByTime(10000);
      });
      expect(onDestroy).not.toHaveBeenCalled();
    });

    it(': method', async () => {
      const testMethod = async (method, target, props) => {
        let handler;
        await act(async () => {
          handler = await Toast[method](props); // 调用 Toast 方法
        });
        await act(async () => {
          vi.advanceTimersByTime(300);
        });
        expect(document.querySelector(target)).toBeTruthy();
        await act(async () => {
          await handler.destroy?.();
        });
      };
      const message = 'Hello';
      await testMethod('loading', ICON_CLASS_MAP.loading, message);
      await testMethod('success', ICON_CLASS_MAP.success, message);
      await testMethod('error', ICON_CLASS_MAP.error, { message });
      await testMethod('warning', ICON_CLASS_MAP.warning, { message });
    });

    it(': attach', async () => {
      const spyConsole = vi.spyOn(console, 'error');
      await act(async () => {
        await Toast({
          message: ' ',
          attach: 'abc',
        });
      });
      expect(spyConsole).toHaveBeenCalledWith('attach is not exist');
      expect(document.querySelector('.t-toast')).toBeFalsy();

      const testClass = 'test-toast';
      const testDom = document.createElement('div');
      testDom.classList.add(testClass);
      document.body.appendChild(testDom);
      await act(async () => {
        await Toast({
          message: ' ',
          attach: `.${testClass}`,
        });
      });
      expect(testDom.querySelector('.t-toast')).toBeTruthy();
    });
  });
});
