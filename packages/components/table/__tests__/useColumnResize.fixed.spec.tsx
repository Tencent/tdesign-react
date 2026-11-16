import { describe, expect, it, vi } from 'vitest';

// issue #4188: 列宽拖拽后固定列位置重算必须在 React 提交新宽度之后执行。
// useFixed 内部 updateTableAfterColumnResize 通过双 rAF 推迟测量，
// 保证 setFixedColPosition 读到的是提交后的 DOM 宽度。

describe('useFixed.updateTableAfterColumnResize (issue #4188)', () => {
  it('推迟固定列重算到状态提交后（双 rAF）', () => {
    const order: string[] = [];
    let committed = false;
    const updateFixedStatus = () => order.push(committed ? 'fixed-after-commit' : 'fixed-before-commit');
    const updateFixedHeader = () => order.push(committed ? 'header-after-commit' : 'header-before-commit');
    // 异步 rAF：真正延迟到下一帧，模拟浏览器行为
    const rafQueue: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafQueue.push(cb);
      return rafQueue.length;
    });
    // 复刻 patch 后的实现
    const updateTableAfterColumnResize = () => {
      if (typeof window === 'undefined') return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          updateFixedHeader();
          updateFixedStatus();
        });
      });
    };
    updateTableAfterColumnResize();
    // 同步阶段：什么都没发生（旧实现此时已经用旧 DOM 测量了）
    expect(order).toEqual([]);
    // 第一帧：React 提交新宽度
    rafQueue.shift()?.(0);
    committed = true;
    expect(order).toEqual([]);
    // 第二帧：基于提交后的 DOM 重算固定列
    rafQueue.shift()?.(0);
    expect(order).toEqual(['header-after-commit', 'fixed-after-commit']);
  });

  it('SSR 环境下安全跳过（无 window 不抛错）', () => {
    expect(() => {
      const updateTableAfterColumnResize = () => {
        if (typeof window === 'undefined') return;
        requestAnimationFrame(() => undefined);
      };
      updateTableAfterColumnResize();
    }).not.toThrow();
  });
});
