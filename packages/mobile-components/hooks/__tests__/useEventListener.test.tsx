import React, { useRef, useState } from 'react';
import { describe, expect, it, vi } from '@test/utils';
import { render, fireEvent, screen } from '@testing-library/react';
import useEventListener from '../useEventListener';

describe('useEventListener', () => {
  it(': 绑定原生监听并回调', () => {
    const handler = vi.fn();
    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener(ref, 'click', handler);
      return <div ref={ref} data-testid="target" />;
    };
    render(<Probe />);

    fireEvent.click(screen.getByTestId('target'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it(': handler 始终持有最新闭包，无需重新绑定', () => {
    const handler = vi.fn((label: string) => label);

    const Probe = ({ label }: { label: string }) => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener(ref, 'click', () => handler(label));
      return <div ref={ref} data-testid="target" />;
    };
    const { rerender } = render(<Probe label="old" />);

    const target = screen.getByTestId('target');
    const addSpy = vi.spyOn(target, 'addEventListener');

    rerender(<Probe label="new" />);
    // 重渲染不应重复绑定
    expect(addSpy).not.toHaveBeenCalled();

    fireEvent.click(target);
    expect(handler).toHaveBeenCalledWith('new');
    addSpy.mockRestore();
  });

  it(': enabled 为 false 时不绑定，恢复后重新绑定', () => {
    const handler = vi.fn();
    const Probe = ({ enabled }: { enabled: boolean }) => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener(ref, 'click', handler, { enabled });
      return <div ref={ref} data-testid="target" />;
    };
    const { rerender } = render(<Probe enabled={false} />);

    fireEvent.click(screen.getByTestId('target'));
    expect(handler).not.toHaveBeenCalled();

    rerender(<Probe enabled />);
    fireEvent.click(screen.getByTestId('target'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it(': 目标元素延迟挂载时自动绑定', () => {
    const handler = vi.fn();
    const Probe = ({ show }: { show: boolean }) => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener(ref, 'click', handler);
      return show ? <div ref={ref} data-testid="target" /> : null;
    };
    const { rerender } = render(<Probe show={false} />);

    rerender(<Probe show />);
    fireEvent.click(screen.getByTestId('target'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it(': 卸载时移除监听', () => {
    const handler = vi.fn();
    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener(ref, 'click', handler);
      return <div ref={ref} data-testid="target" />;
    };
    const { unmount } = render(<Probe />);
    const target = screen.getByTestId('target');

    unmount();
    fireEvent.click(target);
    expect(handler).not.toHaveBeenCalled();
  });

  it(': touchmove 以 passive: false 监听时可 preventDefault', () => {
    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      useEventListener(
        ref,
        'touchmove',
        (event) => {
          event.preventDefault();
        },
        { passive: false },
      );
      return <div ref={ref} data-testid="target" />;
    };
    render(<Probe />);

    const target = screen.getByTestId('target');
    target.dispatchEvent(new Event('touchmove', { cancelable: true }));
    // jsdom 中 cancelable 事件被 preventDefault 后 defaultPrevented 为 true
    // fireEvent 的返回值同样依据 defaultPrevented
    expect(fireEvent.touchMove(target)).toBe(false);
  });

  it(': 状态更新后 preventDefault 仍然生效（最新闭包）', () => {
    const Probe = () => {
      const ref = useRef<HTMLDivElement>(null);
      const [dragging, setDragging] = useState(false);
      useEventListener(
        ref,
        'touchmove',
        (event) => {
          if (dragging) {
            event.preventDefault();
          }
        },
        { passive: false },
      );
      return <div ref={ref} data-testid="target" onClick={() => setDragging(true)} />;
    };
    render(<Probe />);

    const target = screen.getByTestId('target');
    // dragging 为 false，不阻止默认行为
    expect(fireEvent.touchMove(target)).toBe(true);

    // 触发状态更新后，同一次绑定内的 handler 读取到最新状态
    fireEvent.click(target);
    expect(fireEvent.touchMove(target)).toBe(false);
  });
});
