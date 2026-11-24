import { describe, expect, it, renderHook, vi, beforeEach } from '@test/utils';
import useBoundingClientRect from '../hooks/useBoundingClientRect';

describe('useBoundingClientRect', () => {
  let mockElement: HTMLDivElement;

  beforeEach(() => {
    // 创建一个模拟的 DOM 元素
    mockElement = document.createElement('div');

    // 模拟 getBoundingClientRect 方法
    vi.spyOn(mockElement, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      height: 200,
      left: 50,
      right: 250,
      bottom: 300,
      width: 200,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    });
  });

  it('should return correct top and height values', () => {
    const { result } = renderHook(() => useBoundingClientRect(mockElement));

    expect(result.current.top).toBe(100);
    expect(result.current.height).toBe(200);
  });

  it('should call getBoundingClientRect on the element', () => {
    renderHook(() => useBoundingClientRect(mockElement));

    expect(mockElement.getBoundingClientRect).toHaveBeenCalled();
  });

  it('should return updated values when element position changes', () => {
    const { result, rerender } = renderHook(() => useBoundingClientRect(mockElement));

    // 初始值
    expect(result.current.top).toBe(100);
    expect(result.current.height).toBe(200);

    // 更新模拟返回值
    vi.spyOn(mockElement, 'getBoundingClientRect').mockReturnValue({
      top: 150,
      height: 250,
      left: 50,
      right: 250,
      bottom: 400,
      width: 200,
      x: 50,
      y: 150,
      toJSON: () => ({}),
    });

    // 重新渲染 hook
    rerender();

    // 验证更新后的值
    expect(result.current.top).toBe(150);
    expect(result.current.height).toBe(250);
  });

  it('should work with different element types', () => {
    const mockSpanElement = document.createElement('span');

    vi.spyOn(mockSpanElement, 'getBoundingClientRect').mockReturnValue({
      top: 75,
      height: 50,
      left: 25,
      right: 125,
      bottom: 125,
      width: 100,
      x: 25,
      y: 75,
      toJSON: () => ({}),
    });

    const { result } = renderHook(() => useBoundingClientRect(mockSpanElement));

    expect(result.current.top).toBe(75);
    expect(result.current.height).toBe(50);
  });
});
