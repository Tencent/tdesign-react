/**
 * hooks.test.tsx — ImageViewer hooks 单元测试
 *
 * 测试以下 hooks:
 * - useScale（含 ZoomOptions 中心缩放、节流、双指缩放）
 * - useMirror
 * - useRotate
 * - useImageScale
 * - usePosition（拖拽位移）
 * - useViewerScale（弹窗尺寸配置）
 * - useIndex（图片切换下标）
 */
import { DEFAULT_IMAGE_SCALE } from '@tdesign/common-js/image-viewer/transform';
import { act, renderHook, vi } from '@test/utils';

import useImageScale from '../hooks/useImageScale';
import useIndex from '../hooks/useIndex';
import useMirror from '../hooks/useMirror';
import usePosition from '../hooks/usePosition';
import useRotate from '../hooks/useRotate';
import useScale from '../hooks/useScale';
import useViewerScale from '../hooks/useViewerScale';

import type React from 'react';

// ─── useMirror ───────────────────────────────────────────────────────────
describe('useMirror 镜像', () => {
  test('初始值为 1', () => {
    const { result } = renderHook(() => useMirror());
    expect(result.current.mirror).toBe(1);
  });

  test('在 1 和 -1 之间切换', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(1);

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);
  });

  test('resetMirror 恢复为 1', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    act(() => result.current.onMirror());
    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);

    act(() => result.current.onResetMirror());
    expect(result.current.mirror).toBe(1);
  });

  test('连续切换 10 次回到 1', () => {
    const { result } = renderHook(() => useMirror());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.onMirror();
      }
    });
    expect(result.current.mirror).toBe(1);
  });

  test('多次 resetMirror 幂等', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    act(() => result.current.onResetMirror());
    act(() => result.current.onResetMirror());
    act(() => result.current.onResetMirror());
    expect(result.current.mirror).toBe(1);
  });
});

// ─── useRotate ───────────────────────────────────────────────────────────
describe('useRotate 旋转', () => {
  test('初始值为 0', () => {
    const { result } = renderHook(() => useRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  test('每次旋转 -90°', () => {
    const { result } = renderHook(() => useRotate());

    act(() => result.current.onRotate());
    expect(result.current.rotateZ).toBe(-90);

    act(() => result.current.onRotate());
    expect(result.current.rotateZ).toBe(-180);

    act(() => result.current.onRotate());
    expect(result.current.rotateZ).toBe(-270);

    act(() => result.current.onRotate());
    expect(result.current.rotateZ).toBe(-360);
  });

  test('超过 360° 继续累加（5 次 = -450°）', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.onRotate();
      }
    });
    expect(result.current.rotateZ).toBe(-450);
  });

  test('从 -270° resetRotate（最短路径到 0°）', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      for (let i = 0; i < 3; i++) {
        result.current.onRotate();
      }
    });
    expect(result.current.rotateZ).toBe(-270);

    act(() => result.current.onResetRotate());
    expect(result.current.rotateZ).toBe(-360);
  });

  test('从 -180° resetRotate（边界值）', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      result.current.onRotate();
      result.current.onRotate();
    });
    expect(result.current.rotateZ).toBe(-180);

    act(() => result.current.onResetRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  test('从 0° resetRotate 无变化', () => {
    const { result } = renderHook(() => useRotate());

    act(() => result.current.onResetRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  test('旋转过程中重置', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      result.current.onRotate(); // -90
      result.current.onRotate(); // -180
    });
    expect(result.current.rotateZ).toBe(-180);

    act(() => result.current.onResetRotate()); // → 0

    act(() => result.current.onRotate()); // -90
    expect(result.current.rotateZ).toBe(-90);
  });
});

// ─── useImageScale ───────────────────────────────────────────────────────
describe('useImageScale 缩放配置', () => {
  test('无配置：返回 DEFAULT_IMAGE_SCALE 的所有字段', () => {
    const { result } = renderHook(() => useImageScale());
    expect(result.current.max).toBe(DEFAULT_IMAGE_SCALE.max);
    expect(result.current.min).toBe(DEFAULT_IMAGE_SCALE.min);
    expect(result.current.step).toBe(DEFAULT_IMAGE_SCALE.step);
    expect(result.current.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });

  test('部分配置：仅覆盖指定字段', () => {
    const { result } = renderHook(() => useImageScale({ max: 5 }));
    expect(result.current.max).toBe(5);
    expect(result.current.min).toBe(DEFAULT_IMAGE_SCALE.min);
    expect(result.current.step).toBe(DEFAULT_IMAGE_SCALE.step);
    expect(result.current.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });

  test('defaultScale 大于 max 时截断为 max', () => {
    const { result } = renderHook(() => useImageScale({ max: 3, defaultScale: 5 }));
    expect(result.current.defaultScale).toBe(3);
  });

  test('defaultScale 小于 min 时截断为 min', () => {
    const { result } = renderHook(() => useImageScale({ min: 2, defaultScale: 1 }));
    expect(result.current.defaultScale).toBe(2);
  });

  test('defaultScale 在范围内不被截断', () => {
    const { result } = renderHook(() => useImageScale({ max: 5, min: 0.1, step: 0.5, defaultScale: 2 }));
    expect(result.current.defaultScale).toBe(2);
  });

  test('未传 defaultScale：使用默认值', () => {
    const { result } = renderHook(() => useImageScale({ max: 3, min: 0.5, step: 0.1 }));
    expect(result.current.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });

  test('defaultScale 恰好等于 max 不截断', () => {
    const { result } = renderHook(() => useImageScale({ max: 2, defaultScale: 2 }));
    expect(result.current.defaultScale).toBe(2);
  });

  test('defaultScale 恰好等于 min 不截断', () => {
    const { result } = renderHook(() => useImageScale({ min: 0.5, defaultScale: 0.5 }));
    expect(result.current.defaultScale).toBe(0.5);
  });
});

// ─── useScale ────────────────────────────────────────────────────────────
describe('useScale 缩放', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('默认缩放值为 1', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));
    expect(result.current.scale).toBe(1);
  });

  test('自定义 defaultScale', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.1, defaultScale: 1.5 }, true));
    expect(result.current.scale).toBe(1.5);
  });

  test('defaultScale 超过 max 被截断', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 5 }, true));
    expect(result.current.scale).toBe(2);
  });

  test('defaultScale 低于 min 被截断', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 1.5, step: 0.2, defaultScale: 0.5 }, true));
    expect(result.current.scale).toBe(1.5);
  });

  test('onZoomIn 放大', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomIn();
    });
    expect(result.current.scale).toBeCloseTo(1.2);
  });

  test('onZoomOut 缩小', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomOut();
    });
    expect(result.current.scale).toBeCloseTo(0.8);
  });

  test('放大不超过最大值', () => {
    const { result } = renderHook(() => useScale({ max: 1.5, min: 0.5, step: 0.5, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(1.5);

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(1.5);
  });

  test('缩小不低于最小值', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.3, defaultScale: 0.6 }, true));

    act(() => {
      result.current.onZoomOut();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(0.5);
  });

  test('onResetScale 恢复默认缩放值', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBeCloseTo(1.4);

    act(() => result.current.onResetScale());
    expect(result.current.scale).toBe(1);
  });

  test('小步长缩放', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.05, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBeCloseTo(1.05);
  });

  test('大范围缩放值', () => {
    const { result } = renderHook(() => useScale({ max: 10, min: 0.1, step: 1, defaultScale: 5 }, true));
    expect(result.current.scale).toBe(5);

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(6);

    act(() => {
      result.current.onZoomOut();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(5);
  });

  // ─── ZoomOptions（中心缩放）──────────────────────────────────────────
  describe('ZoomOptions 中心缩放', () => {
    test('onZoomIn 中心缩放（偏移为 0）', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          currentTranslate: { translateX: 100, translateY: 50 },
        });
      });

      expect(result.current.scale).toBeCloseTo(1.2);
      expect(zoomResult.newTranslate).toEqual({ translateX: 120, translateY: 60 });
    });

    test('onZoomIn 非中心偏移缩放', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 100,
          mouseOffsetY: 50,
          currentTranslate: { translateX: 0, translateY: 0 },
        });
      });

      expect(result.current.scale).toBeCloseTo(1.2);
      expect(zoomResult.newTranslate.translateX).toBeCloseTo(-20);
      expect(zoomResult.newTranslate.translateY).toBeCloseTo(-10);
    });

    test('onZoomOut 带位移时保持缩放位移', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomOut({
          mouseOffsetX: 100,
          mouseOffsetY: 100,
          currentTranslate: { translateX: 50, translateY: 50 },
        });
      });

      expect(result.current.scale).toBeCloseTo(0.8);
      expect(zoomResult.newTranslate).toEqual({ translateX: 60, translateY: 60 });
    });

    test('缺少 mouseOffset 返回空结果', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetY: 50,
          currentTranslate: { translateX: 0, translateY: 0 },
        });
      });
      expect(zoomResult.newTranslate).toBeUndefined();
    });

    test('已达最大值时 ZoomIn 返回空结果', () => {
      const { result } = renderHook(() => useScale({ max: 1.2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomIn();
        vi.advanceTimersByTime(100);
      });
      expect(result.current.scale).toBe(1.2);

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 100,
          mouseOffsetY: 100,
          currentTranslate: { translateX: 0, translateY: 0 },
        });
      });
      expect(zoomResult).toEqual({});
    });

    test('带已有位移和非零偏移的缩放', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 200,
          mouseOffsetY: 100,
          currentTranslate: { translateX: 100, translateY: 50 },
        });
      });

      expect(zoomResult.newTranslate.translateX).toBeCloseTo(80);
      expect(zoomResult.newTranslate.translateY).toBeCloseTo(40);
    });

    test('放大到最大 → 拖出视口 → 缩小向中心收敛', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.5, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomIn();
        result.current.onZoomIn();
      });
      expect(result.current.scale).toBe(2);

      let zoomResult: any;
      act(() => {
        zoomResult = result.current.onZoomOut({
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          currentTranslate: { translateX: 500, translateY: 400 },
        });
      });

      expect(result.current.scale).toBe(1.5);
      expect(zoomResult.newTranslate.translateX).toBeCloseTo(375);
      expect(zoomResult.newTranslate.translateY).toBeCloseTo(300);
    });

    test('放大到最大 → 拖出视口 → 多次缩小持续向中心收敛', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.5, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomIn();
        result.current.onZoomIn();
      });
      expect(result.current.scale).toBe(2);

      let translate = { translateX: 600, translateY: 400 };
      act(() => {
        const r = result.current.onZoomOut({ mouseOffsetX: 0, mouseOffsetY: 0, currentTranslate: translate });
        translate = r.newTranslate;
      });
      expect(result.current.scale).toBe(1.5);
      expect(translate.translateX).toBeCloseTo(450);
      expect(translate.translateY).toBeCloseTo(300);

      act(() => {
        const r = result.current.onZoomOut({ mouseOffsetX: 0, mouseOffsetY: 0, currentTranslate: translate });
        translate = r.newTranslate;
      });
      expect(result.current.scale).toBe(1);
      expect(translate.translateX).toBeCloseTo(300);
      expect(translate.translateY).toBeCloseTo(200);
    });
  });

  // 无节流，每次调用都直接生效
  describe('快速连续缩放（无节流）', () => {
    test('快速连续 onZoomIn 都生效', () => {
      const { result } = renderHook(() => useScale({ max: 5, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomIn();
        result.current.onZoomIn();
        result.current.onZoomIn();
      });
      expect(result.current.scale).toBeCloseTo(1.6);
    });

    test('快速连续 onZoomOut 都生效', () => {
      const { result } = renderHook(() => useScale({ max: 5, min: 0.1, step: 0.2, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomOut();
        result.current.onZoomOut();
        result.current.onZoomOut();
      });
      expect(result.current.scale).toBeCloseTo(0.4);
    });
  });

  describe('visible=false 时不注册事件监听', () => {
    test('visible=false 时 wheel 事件不触发缩放', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, false));

      const wheelEvent = new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
      act(() => {
        document.dispatchEvent(wheelEvent);
      });

      expect(result.current.scale).toBe(1);
    });

    test('visible=true 时 wheel 事件触发回调', () => {
      const onWheel = vi.fn();
      const { rerender } = renderHook(
        ({ visible }) => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, visible, onWheel),
        { initialProps: { visible: false } },
      );

      const wheelEvent = new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
      act(() => {
        document.dispatchEvent(wheelEvent);
      });
      expect(onWheel).not.toHaveBeenCalled();

      rerender({ visible: true });
      act(() => {
        document.dispatchEvent(wheelEvent);
      });
      expect(onWheel).toHaveBeenCalledTimes(1);
    });
  });
});

// ─── usePosition ─────────────────────────────────────────────────────────
describe('usePosition 拖拽位移', () => {
  const createHook = (initPosition?: [number, number]) => {
    const ref = { current: document.createElement('div') };
    return renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>, { initPosition }));
  };

  test('默认位置为 [0, 0]', () => {
    const { result } = createHook();
    expect(result.current.position).toEqual([0, 0]);
    expect(result.current.isDragging).toBe(false);
  });

  test('自定义 initPosition', () => {
    const { result } = createHook([100, 200]);
    expect(result.current.position).toEqual([100, 200]);
  });

  test('resetPosition 恢复到 initPosition', () => {
    const { result } = createHook([50, 80]);

    act(() => {
      result.current.setPosition([300, 400]);
    });
    expect(result.current.position).toEqual([300, 400]);

    act(() => {
      result.current.resetPosition();
    });
    expect(result.current.position).toEqual([50, 80]);
  });

  test('默认 [0,0] 的 resetPosition', () => {
    const { result } = createHook();

    act(() => {
      result.current.setPosition([123, 456]);
    });
    act(() => {
      result.current.resetPosition();
    });
    expect(result.current.position).toEqual([0, 0]);
  });

  test('setPosition 直接设置位置', () => {
    const { result } = createHook();

    act(() => {
      result.current.setPosition([42, 99]);
    });
    expect(result.current.position).toEqual([42, 99]);
  });

  test('mousedown 设置 isDragging 为 true', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 10, screenY: 20, button: 0 }));
    });
    expect(result.current.isDragging).toBe(true);
    document.body.removeChild(divEl);
  });

  test('mouseup 重置 isDragging 为 false', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 0, screenY: 0, button: 0 }));
    });
    expect(result.current.isDragging).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(result.current.isDragging).toBe(false);
    document.body.removeChild(divEl);
  });

  test('拖拽移动位置', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 100, screenY: 100, button: 0 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, screenX: 150, screenY: 130 }));
    });

    expect(result.current.position[0]).toBe(50);
    expect(result.current.position[1]).toBe(30);
    document.body.removeChild(divEl);
  });

  test('连续拖拽累积位移', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 0, screenY: 0, button: 0 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, screenX: 100, screenY: 50 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(result.current.position).toEqual([100, 50]);

    act(() => {
      divEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 200, screenY: 200, button: 0 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, screenX: 250, screenY: 230 }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(result.current.position).toEqual([150, 80]);
    document.body.removeChild(divEl);
  });
});

// ─── useViewerScale ───────────────────────────────────────────────────────
describe('useViewerScale 弹窗尺寸', () => {
  test('无配置返回默认值', () => {
    const { result } = renderHook(() => useViewerScale(undefined));
    expect(result.current).toEqual({ minWidth: 1000, minHeight: 1000 });
  });

  test('空对象返回默认值', () => {
    const { result } = renderHook(() => useViewerScale({}));
    expect(result.current).toEqual({ minWidth: 1000, minHeight: 1000 });
  });

  test('仅覆盖 minWidth', () => {
    const { result } = renderHook(() => useViewerScale({ minWidth: 800 }));
    expect(result.current).toEqual({ minWidth: 800, minHeight: 1000 });
  });

  test('仅覆盖 minHeight', () => {
    const { result } = renderHook(() => useViewerScale({ minHeight: 600 }));
    expect(result.current).toEqual({ minWidth: 1000, minHeight: 600 });
  });

  test('同时覆盖 minWidth 和 minHeight', () => {
    const { result } = renderHook(() => useViewerScale({ minWidth: 500, minHeight: 400 }));
    expect(result.current).toEqual({ minWidth: 500, minHeight: 400 });
  });

  test('零值可接受', () => {
    const { result } = renderHook(() => useViewerScale({ minWidth: 0, minHeight: 0 }));
    expect(result.current).toEqual({ minWidth: 0, minHeight: 0 });
  });
});

// ─── useScale: 双指缩放 ────────────────────────────────────────────────────
describe('useScale 触摸事件', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const createTouchEvent = (x1: number, y1: number, x2: number, y2: number, type: string) => {
    const t1 = { pageX: x1, pageY: y1 } as Touch;
    const t2 = { pageX: x2, pageY: y2 } as Touch;
    return new TouchEvent(type, { touches: [t1, t2], cancelable: true });
  };

  test('双指触摸记录初始距离', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));
    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });
    expect(result.current.scale).toBe(1);
  });

  test('单指触摸不触发缩放', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ pageX: 0, pageY: 0 } as Touch],
      cancelable: true,
    });
    act(() => {
      document.dispatchEvent(touchStart);
    });
    expect(result.current.scale).toBe(1);
  });

  test('双指外扩（pinch out）放大', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 200, 0, 'touchmove'));
    });

    expect(result.current.scale).toBeCloseTo(1.2);
  });

  test('双指内收（pinch in）缩小', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 200, 0, 'touchstart'));
    });

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchmove'));
    });

    expect(result.current.scale).toBeCloseTo(0.8);
  });

  test('单指移动不触发缩放', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));
    const touchMove = new TouchEvent('touchmove', {
      touches: [{ pageX: 100, pageY: 0 } as Touch],
      cancelable: true,
    });
    act(() => {
      document.dispatchEvent(touchMove);
    });
    expect(result.current.scale).toBe(1);
  });

  test('touchEnd 重置距离后，新 touchMove 重新计算缩放', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });
    act(() => {
      document.dispatchEvent(new TouchEvent('touchend', { cancelable: true }));
    });
    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 200, 0, 'touchmove'));
    });
    expect(result.current.scale).toBeCloseTo(1.2);
  });
});

// ─── useIndex ────────────────────────────────────────────────────────────
describe('useIndex 图片切换下标', () => {
  const createImages = (count: number) => Array.from({ length: count }, (_, i) => `img-${i}.jpg`);

  test('默认 index 为 0', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(3)));
    expect(result.current.index).toBe(0);
  });

  test('defaultIndex 设置初始下标', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 2 }, createImages(5)));
    expect(result.current.index).toBe(2);
  });

  test('next 递增 index', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(5)));
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  test('prev 递减 index', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 2 }, createImages(5)));
    act(() => result.current.prev());
    expect(result.current.index).toBe(1);
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });

  test('next 到最后一张不再递增', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 2 }, createImages(3)));
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  test('prev 到第一张不再递减', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(3)));
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });

  test('prev 在 index=0 时不触发 onIndexChange', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 0, onIndexChange }, createImages(3)));
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  test('next 在最后一帧时不触发 onIndexChange', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 2, onIndexChange }, createImages(3)));
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  test('setIndex 直接设置下标', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 0, onIndexChange }, createImages(5)));
    act(() => result.current.setIndex(3, { trigger: 'current' }));
    expect(result.current.index).toBe(3);
  });

  test('onIndexChange 回调在 next 时携带 trigger: next', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 0, onIndexChange }, createImages(3)));
    act(() => result.current.next());
    expect(onIndexChange).toHaveBeenCalledWith(1, { trigger: 'next' });
  });

  test('onIndexChange 回调在 prev 时携带 trigger: prev', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 2, onIndexChange }, createImages(3)));
    act(() => result.current.prev());
    expect(onIndexChange).toHaveBeenCalledWith(1, { trigger: 'prev' });
  });

  test('onIndexChange 回调在 setIndex 时携带 trigger: current', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 0, onIndexChange }, createImages(5)));
    act(() => result.current.setIndex(3, { trigger: 'current' }));
    expect(onIndexChange).toHaveBeenCalledWith(3, { trigger: 'current' });
  });

  test('受控 index 模式', () => {
    const { result, rerender } = renderHook(
      ({ index }) => useIndex({ index, onIndexChange: vi.fn() }, createImages(5)),
      { initialProps: { index: 0 } },
    );
    expect(result.current.index).toBe(0);
    rerender({ index: 3 });
    expect(result.current.index).toBe(3);
  });

  test('单图列表：next/prev 不越界', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(1)));
    act(() => result.current.next());
    expect(result.current.index).toBe(0);
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });
});

// ─── Hooks 组合 ──────────────────────────────────────────────────────────
describe('Hooks 组合使用', () => {
  test('所有 hooks 协同完成图片变换', () => {
    vi.useFakeTimers();

    const { result: mirrorResult } = renderHook(() => useMirror());
    const { result: rotateResult } = renderHook(() => useRotate());
    const { result: scaleResult } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      mirrorResult.current.onMirror();
      rotateResult.current.onRotate();
      rotateResult.current.onRotate();
      scaleResult.current.onZoomIn();
    });

    expect(mirrorResult.current.mirror).toBe(-1);
    expect(rotateResult.current.rotateZ).toBe(-180);
    expect(scaleResult.current.scale).toBeCloseTo(1.2);

    act(() => {
      mirrorResult.current.onResetMirror();
      rotateResult.current.onResetRotate();
      scaleResult.current.onResetScale();
    });

    expect(mirrorResult.current.mirror).toBe(1);
    expect(rotateResult.current.rotateZ).toBe(0);
    expect(scaleResult.current.scale).toBe(1);

    vi.useRealTimers();
  });

  test('跨 hooks 快速连续操作', () => {
    vi.useFakeTimers();

    const { result: scaleResult } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.1, defaultScale: 1 }, true));
    const { result: mirrorResult } = renderHook(() => useMirror());
    const { result: rotateResult } = renderHook(() => useRotate());

    act(() => {
      for (let i = 0; i < 5; i++) {
        scaleResult.current.onZoomIn();
        vi.advanceTimersByTime(60);
        mirrorResult.current.onMirror();
        rotateResult.current.onRotate();
      }
    });

    expect(scaleResult.current.scale).toBeCloseTo(1.5);
    expect(mirrorResult.current.mirror).toBe(-1);
    expect(rotateResult.current.rotateZ).toBe(-450);

    vi.useRealTimers();
  });
});

// ─── usePosition 右键和非左键不触发拖拽 ──────────────────────────────────
describe('usePosition 右键和非左键', () => {
  test('右键不触发拖拽', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, screenX: 10, screenY: 20, button: 2 }));
    });
    expect(result.current.isDragging).toBe(false);
    document.body.removeChild(divEl);
  });
});

// ─── useScale 已达极限值时返回空 ──────────────────────────────────────────
describe('useScale 极限值', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('已达最小值时 onZoomOut 返回空', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 0.5 }, true));
    const ret = result.current.onZoomOut();
    expect(ret).toEqual({});
    expect(result.current.scale).toBe(0.5);
  });

  test('已达最大值时 onZoomIn 不带 options 返回空', () => {
    const { result } = renderHook(() => useScale({ max: 1.2, min: 0.5, step: 0.2, defaultScale: 1.2 }, true));
    const ret = result.current.onZoomIn();
    expect(ret).toEqual({});
    expect(result.current.scale).toBe(1.2);
  });
});

// ─── useScale onWheel 回调 ─────────────────────────────────────────────
describe('useScale onWheel 回调', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('visible=true 时 wheel 事件调用 onWheel 回调', () => {
    const onWheel = vi.fn();
    renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true, onWheel));

    const wheelEvent = new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
    act(() => {
      document.dispatchEvent(wheelEvent);
    });
    expect(onWheel).toHaveBeenCalledTimes(1);
  });

  test('visible=false 时 wheel 事件不调用 onWheel', () => {
    const onWheel = vi.fn();
    renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, false, onWheel));

    const wheelEvent = new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
    act(() => {
      document.dispatchEvent(wheelEvent);
    });
    expect(onWheel).not.toHaveBeenCalled();
  });
});
