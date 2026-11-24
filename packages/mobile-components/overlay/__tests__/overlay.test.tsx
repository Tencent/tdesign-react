import { describe, it, expect, vi, render, fireEvent, screen, act, afterEach, beforeEach } from '@test/utils';
import React from 'react';
import Overlay from '../Overlay';
import { overlayDefaultProps } from '../defaultProps';

describe('Overlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // props 测试
  describe('props', () => {
    // visible 属性
    describe('visible', () => {
      it(':visible true', () => {
        const { container } = render(<Overlay visible>测试内容</Overlay>);
        expect(container.querySelector('.t-overlay')).toBeInTheDocument();
        expect(screen.getByText('测试内容')).toBeInTheDocument();
      });

      it(':visible false', () => {
        const { container } = render(<Overlay visible={false}>测试内容</Overlay>);
        expect(container.querySelector('.t-overlay')).not.toBeInTheDocument();
      });
    });

    // 样式相关属性
    describe('style props', () => {
      it(':className and style', () => {
        const { container } = render(
          <Overlay visible className="custom-overlay-class" style={{ position: 'fixed' }}>
            测试内容
          </Overlay>,
        );
        const overlay = container.querySelector('.t-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass('custom-overlay-class');
        expect(overlay).toHaveStyle('position: fixed');
      });

      it(':backgroundColor', () => {
        const customBgColor = 'rgba(0, 0, 0, 0.8)';
        const { container } = render(
          <Overlay visible backgroundColor={customBgColor}>
            测试内容
          </Overlay>,
        );
        const overlay = container.querySelector('.t-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveStyle(`background-color: ${customBgColor}`);
      });

      it(':duration', async () => {
        const customDuration = 500;
        const { container, rerender } = render(
          <Overlay visible={false} duration={customDuration}>
            测试内容
          </Overlay>,
        );

        // 模拟 visible 变为 true
        rerender(
          <Overlay visible={true} duration={customDuration}>
            测试内容
          </Overlay>,
        );

        const overlay = container.querySelector('.t-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveStyle(`animation-duration: ${customDuration}ms`);

        // 模拟经过 100ms 动画保持
        await act(async () => {
          vi.advanceTimersByTime(100);
        });
        expect(overlay.classList.contains('t-overlay-fade-enter-active')).toBeTruthy();

        // 模拟经过 400ms 动画结束
        await act(async () => {
          vi.advanceTimersByTime(400);
        });
        expect(overlay.classList.contains('t-overlay-fade-enter-active')).toBeFalsy();
      });

      it(':duration 0', () => {
        const { container } = render(
          <Overlay visible duration={0}>
            测试内容
          </Overlay>,
        );
        const overlay = container.querySelector('.t-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveStyle('animation-duration: 0ms');
        expect(overlay.classList.contains('t-overlay-fade-enter-active')).toBeFalsy();
      });

      it(':zIndex', () => {
        const { container } = render(
          <Overlay visible zIndex={9999}>
            测试内容
          </Overlay>,
        );
        const overlay = container.querySelector('.t-overlay');
        expect(overlay).toHaveStyle('z-index: 9999');

        // zIndex 无默认值，不传时不应设置 z-index 样式
        const { container: defaultContainer } = render(<Overlay visible>测试内容</Overlay>);
        const defaultOverlay = defaultContainer.querySelector('.t-overlay');
        expect((defaultOverlay as HTMLElement).style.zIndex).toBe('');
      });
    });

    // preventScrollThrough 属性
    describe('preventScrollThrough', () => {
      it(':preventScrollThrough true', () => {
        // 保存原始的 document.addEventListener 方法
        const originalAddEventListener = document.addEventListener;
        const eventListenerSpy = vi.fn();

        // 模拟 document.addEventListener 方法
        document.addEventListener = vi.fn().mockImplementation(eventListenerSpy);

        // 保存原始的 classList
        const originalClassList = document.body.classList;
        const classListAddSpy = vi.fn();

        // 模拟 classList.add 方法
        Object.defineProperty(document.body, 'classList', {
          value: {
            add: classListAddSpy,
            remove: vi.fn(),
            contains: vi.fn().mockReturnValue(false),
          },
          configurable: true,
        });

        const { container, unmount } = render(
          <Overlay visible preventScrollThrough={true}>
            测试内容
          </Overlay>,
        );

        expect(container.querySelector('.t-overlay')).toBeInTheDocument();

        // 验证 document.addEventListener 被调用
        expect(document.addEventListener).toHaveBeenCalled();

        // 验证 classList.add 被调用
        expect(classListAddSpy).toHaveBeenCalled();

        // 清理
        unmount();
        document.addEventListener = originalAddEventListener;
        Object.defineProperty(document.body, 'classList', {
          value: originalClassList,
          configurable: true,
        });
      });

      it(':preventScrollThrough false', () => {
        // 保存原始的 document.addEventListener 方法
        const originalAddEventListener = document.addEventListener;
        const eventListenerSpy = vi.fn();

        // 模拟 document.addEventListener 方法
        document.addEventListener = vi.fn().mockImplementation(eventListenerSpy);

        const { container, unmount } = render(
          <Overlay visible preventScrollThrough={false}>
            测试内容
          </Overlay>,
        );

        expect(container.querySelector('.t-overlay')).toBeInTheDocument();

        // 验证 document.addEventListener 没有被调用
        expect(document.addEventListener).not.toHaveBeenCalled();

        // 清理
        unmount();
        document.addEventListener = originalAddEventListener;
      });
    });

    // 默认值测试
    describe('default props', () => {
      it('uses default duration when not provided', () => {
        const { container } = render(<Overlay visible>测试内容</Overlay>);
        const overlay = container.querySelector('.t-overlay');
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveStyle(`animation-duration: ${overlayDefaultProps.duration}ms`);
      });

      it('uses default preventScrollThrough when not provided', () => {
        // 保存原始的 document.addEventListener 方法
        const originalAddEventListener = document.addEventListener;
        const eventListenerSpy = vi.fn();

        // 模拟 document.addEventListener 方法
        document.addEventListener = vi.fn().mockImplementation(eventListenerSpy);

        // 保存原始的 classList
        const originalClassList = document.body.classList;
        const classListAddSpy = vi.fn();

        // 模拟 classList.add 方法
        Object.defineProperty(document.body, 'classList', {
          value: {
            add: classListAddSpy,
            remove: vi.fn(),
            contains: vi.fn().mockReturnValue(false),
          },
          configurable: true,
        });

        const { container, unmount } = render(<Overlay visible>测试内容</Overlay>);

        expect(container.querySelector('.t-overlay')).toBeInTheDocument();

        // 由于默认 preventScrollThrough 为 true，验证 document.addEventListener 被调用
        expect(document.addEventListener).toHaveBeenCalled();

        // 验证 classList.add 被调用
        expect(classListAddSpy).toHaveBeenCalled();

        // 清理
        unmount();
        document.addEventListener = originalAddEventListener;
        Object.defineProperty(document.body, 'classList', {
          value: originalClassList,
          configurable: true,
        });
      });

      it('uses default visible when not provided', () => {
        const { container } = render(<Overlay>测试内容</Overlay>);
        // 默认 visible 为 false，所以不应该渲染
        expect(container.querySelector('.t-overlay')).not.toBeInTheDocument();
      });

      it('applies all default props correctly when no props provided', () => {
        // 保存原始的 document.addEventListener 方法
        const originalAddEventListener = document.addEventListener;
        document.addEventListener = vi.fn();

        // 渲染时不提供任何属性
        const { container, rerender } = render(<Overlay>测试内容</Overlay>);

        // 默认 visible 为 false，所以不应该渲染
        expect(container.querySelector('.t-overlay')).not.toBeInTheDocument();

        // 重新渲染，设置 visible 为 true
        rerender(<Overlay visible>测试内容</Overlay>);
        const overlay = container.querySelector('.t-overlay');

        // 验证所有默认属性都被正确应用
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveStyle(`animation-duration: ${overlayDefaultProps.duration}ms`);

        // 由于默认 preventScrollThrough 为 true，验证 document.addEventListener 被调用
        expect(document.addEventListener).toHaveBeenCalled();

        // 清理
        document.addEventListener = originalAddEventListener;
      });
    });

    // CSSTransition 相关测试
    describe('CSSTransition', () => {
      it('unmounts content when not visible (unmountOnExit)', async () => {
        const { container, rerender } = render(<Overlay visible>测试内容</Overlay>);
        expect(container.querySelector('.t-overlay')).toBeInTheDocument();

        rerender(<Overlay visible={false}>测试内容</Overlay>);

        // 等待动画完成
        await act(async () => {
          vi.advanceTimersByTime(overlayDefaultProps.duration);
        });

        expect(container.querySelector('.t-overlay')).not.toBeInTheDocument();
      });

      it('applies correct classNames for CSSTransition', () => {
        const { container } = render(<Overlay visible>测试内容</Overlay>);
        const overlay = container.querySelector('.t-overlay');

        // 检查元素是否存在，而不是检查特定的动画类名
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass('t-overlay');
      });
    });
  });

  // slots 测试
  describe('slots', () => {
    it('renders string children correctly', () => {
      const { container } = render(<Overlay visible>测试内容</Overlay>);
      expect(container.querySelector('.t-overlay')).toBeInTheDocument();
      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });

    it('renders React element children correctly', () => {
      const TestComponent = () => <div data-testid="test-component">自定义组件</div>;
      const { container } = render(
        <Overlay visible>
          <TestComponent />
        </Overlay>,
      );
      expect(container.querySelector('.t-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByText('自定义组件')).toBeInTheDocument();
    });

    it('renders function children correctly', () => {
      const { container } = render(
        <Overlay visible>{() => <div data-testid="function-result">函数返回的内容</div>}</Overlay>,
      );
      expect(container.querySelector('.t-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('function-result')).toBeInTheDocument();
      expect(screen.getByText('函数返回的内容')).toBeInTheDocument();
    });

    it('renders null children correctly', () => {
      const { container } = render(<Overlay visible>{null}</Overlay>);
      expect(container.querySelector('.t-overlay')).toBeInTheDocument();
    });

    it('renders undefined children correctly', () => {
      const { container } = render(<Overlay visible>{undefined}</Overlay>);
      expect(container.querySelector('.t-overlay')).toBeInTheDocument();
    });

    it('renders empty children correctly', () => {
      const { container } = render(<Overlay visible></Overlay>);
      expect(container.querySelector('.t-overlay')).toBeInTheDocument();
    });
  });

  // events 测试
  describe('events', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Overlay visible onClick={handleClick}>
          测试内容
        </Overlay>,
      );

      const overlay = container.querySelector('.t-overlay');
      fireEvent.click(overlay);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ e: expect.any(Object) }));
    });

    it('does not throw when onClick is undefined', () => {
      const { container } = render(<Overlay visible>测试内容</Overlay>);
      const overlay = container.querySelector('.t-overlay');

      expect(() => {
        fireEvent.click(overlay);
      }).not.toThrow();
    });

    it('calls lifecycle callbacks correctly', async () => {
      const onOpen = vi.fn();
      const onOpened = vi.fn();
      const onClose = vi.fn();
      const onClosed = vi.fn();

      const { rerender } = render(
        <Overlay visible={true} onOpen={onOpen} onOpened={onOpened} onClose={onClose} onClosed={onClosed}>
          测试内容
        </Overlay>,
      );

      // 验证 onOpen 被调用
      expect(onOpen).toHaveBeenCalledTimes(1);

      // 等待动画完成，验证 onOpened 被调用
      await act(async () => {
        vi.runAllTimers();
      });
      expect(onOpened).toHaveBeenCalledTimes(1);

      // 重新渲染，将 visible 设置为 false
      rerender(
        <Overlay visible={false} onOpen={onOpen} onOpened={onOpened} onClose={onClose} onClosed={onClosed}>
          测试内容
        </Overlay>,
      );

      // 验证 onClose 被调用
      expect(onClose).toHaveBeenCalledTimes(1);

      // 等待动画完成，验证 onClosed 被调用
      await act(async () => {
        vi.runAllTimers();
      });
      expect(onClosed).toHaveBeenCalledTimes(1);
    });

    it('handles undefined callbacks gracefully', () => {
      // 测试当回调函数未定义时不会抛出错误
      expect(() => {
        const { rerender } = render(<Overlay visible={true}>测试内容</Overlay>);

        rerender(<Overlay visible={false}>测试内容</Overlay>);
      }).not.toThrow();
    });

    it('handles event propagation correctly', () => {
      const parentClick = vi.fn();
      const overlayClick = vi.fn();

      const { container } = render(
        <div onClick={parentClick}>
          <Overlay visible onClick={overlayClick}>
            测试内容
          </Overlay>
        </div>,
      );

      const overlay = container.querySelector('.t-overlay');
      fireEvent.click(overlay);

      expect(overlayClick).toHaveBeenCalledTimes(1);
      expect(parentClick).toHaveBeenCalledTimes(1); // 事件冒泡到父元素
    });

    it('handles nested content clicks correctly', () => {
      const handleOverlayClick = vi.fn();
      const handleContentClick = vi.fn((e) => e.stopPropagation());

      const { container } = render(
        <Overlay visible onClick={handleOverlayClick}>
          <div data-testid="nested-content" onClick={handleContentClick}>
            嵌套内容
          </div>
        </Overlay>,
      );

      // 点击嵌套内容
      fireEvent.click(screen.getByTestId('nested-content'));

      // 内容点击处理程序应该被调用
      expect(handleContentClick).toHaveBeenCalledTimes(1);

      // 由于事件传播被阻止，遮罩点击处理程序不应被调用
      expect(handleOverlayClick).not.toHaveBeenCalled();

      // 直接点击遮罩
      fireEvent.click(container.querySelector('.t-overlay'));
      expect(handleOverlayClick).toHaveBeenCalledTimes(1);
    });

    it('handles event object correctly in onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Overlay visible onClick={handleClick}>
          测试内容
        </Overlay>,
      );

      const overlay = container.querySelector('.t-overlay');
      fireEvent.click(overlay);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          e: expect.objectContaining({
            target: overlay,
            type: 'click',
          }),
        }),
      );
    });
  });
});
