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
import React from 'react';
import { renderHook, act, vi } from '@test/utils';

import { DEFAULT_IMAGE_SCALE } from '@tdesign/common-js/image-viewer/transform';
import useScale from '../hooks/useScale';
import useMirror from '../hooks/useMirror';
import useRotate from '../hooks/useRotate';
import useImageScale from '../hooks/useImageScale';
import usePosition from '../hooks/usePosition';
import useViewerScale from '../hooks/useViewerScale';

// ─── useMirror ───────────────────────────────────────────────────────────
describe('useMirror', () => {
  it('initial value is 1', () => {
    const { result } = renderHook(() => useMirror());
    expect(result.current.mirror).toBe(1);
  });

  it('toggles between 1 and -1', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(1);

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);
  });

  it('resetMirror restores to 1', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    act(() => result.current.onMirror());
    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);

    act(() => result.current.onResetMirror());
    expect(result.current.mirror).toBe(1);
  });

  it('rapid toggles (10 times) return to 1', () => {
    const { result } = renderHook(() => useMirror());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.onMirror();
      }
    });
    expect(result.current.mirror).toBe(1);
  });

  it('multiple resets are idempotent', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    act(() => result.current.onResetMirror());
    act(() => result.current.onResetMirror());
    act(() => result.current.onResetMirror());
    expect(result.current.mirror).toBe(1);
  });
});

// ─── useRotate ───────────────────────────────────────────────────────────
describe('useRotate', () => {
  it('initial value is 0', () => {
    const { result } = renderHook(() => useRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  it('rotates by -90° each time', () => {
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

  it('continues beyond 360°', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.onRotate();
      }
    });
    expect(result.current.rotateZ).toBe(-450);
  });

  it('multiple full rotations', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      for (let i = 0; i < 8; i++) {
        result.current.onRotate();
      }
    });
    expect(result.current.rotateZ).toBe(-720);
  });

  it('resetRotate from -270° (shortest path to 0°)', () => {
    const { result } = renderHook(() => useRotate());

    // Rotate to -270°
    act(() => {
      for (let i = 0; i < 3; i++) {
        result.current.onRotate();
      }
    });
    expect(result.current.rotateZ).toBe(-270);

    // -270 % 360 = -270, |-270| > 180 → adjusted = (-270+360)%360 = 90
    // newRotateZ = -270 - 90 = -360 ≡ 0°
    act(() => result.current.onResetRotate());
    expect(result.current.rotateZ).toBe(-360);
  });

  it('resetRotate from -180° (boundary)', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      result.current.onRotate();
      result.current.onRotate();
    });
    expect(result.current.rotateZ).toBe(-180);

    // -180 % 360 = -180, |-180| ≤ 180 → adjusted = -180
    // newRotateZ = -180 - (-180) = 0
    act(() => result.current.onResetRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  it('resetRotate from 0° does nothing', () => {
    const { result } = renderHook(() => useRotate());

    act(() => result.current.onResetRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  it('reset during rotation sequence', () => {
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
describe('useImageScale', () => {
  it('returns defaults when no config provided', () => {
    const result = useImageScale();
    expect(result).toEqual(DEFAULT_IMAGE_SCALE);
  });

  it('merges partial config with defaults', () => {
    const result = useImageScale({ max: 5 });
    expect(result).toEqual({ ...DEFAULT_IMAGE_SCALE, max: 5 });
  });

  it('clamps defaultScale to max', () => {
    const result = useImageScale({ max: 3, defaultScale: 5 });
    expect(result.defaultScale).toBe(3);
  });

  it('clamps defaultScale to min', () => {
    const result = useImageScale({ min: 2, defaultScale: 1 });
    expect(result.defaultScale).toBe(2);
  });

  it('custom imageScale config fully overrides', () => {
    const config = { max: 5, min: 0.1, step: 0.5, defaultScale: 2 };
    const result = useImageScale(config);
    expect(result).toEqual(config);
  });

  it('defaultScale undefined uses DEFAULT_IMAGE_SCALE.defaultScale', () => {
    const result = useImageScale({ max: 3, min: 0.5, step: 0.1 });
    expect(result.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });
});

// ─── useScale ────────────────────────────────────────────────────────────
describe('useScale', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('default scale value is 1', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));
    expect(result.current.scale).toBe(1);
  });

  it('custom defaultScale', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.1, defaultScale: 1.5 }));
    expect(result.current.scale).toBe(1.5);
  });

  it('defaultScale clamped to max', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 5 }));
    expect(result.current.scale).toBe(2);
  });

  it('defaultScale clamped to min', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 1.5, step: 0.2, defaultScale: 0.5 }));
    expect(result.current.scale).toBe(1.5);
  });

  it('onZoomIn increases scale', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

    act(() => {
      result.current.onZoomIn();
    });
    expect(result.current.scale).toBeCloseTo(1.2);
  });

  it('onZoomOut decreases scale', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

    act(() => {
      result.current.onZoomOut();
    });
    expect(result.current.scale).toBeCloseTo(0.8);
  });

  it('max scale boundary', () => {
    const { result } = renderHook(() => useScale({ max: 1.5, min: 0.5, step: 0.5, defaultScale: 1 }));

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(1.5);

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(1.5); // 不超过 max
  });

  it('min scale boundary', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.3, defaultScale: 0.6 }));

    act(() => {
      result.current.onZoomOut();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(0.5);
  });

  it('onResetScale restores defaultScale', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

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

  it('small step values', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.05, defaultScale: 1 }));

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBeCloseTo(1.05);
  });

  it('large scale values', () => {
    const { result } = renderHook(() => useScale({ max: 10, min: 0.1, step: 1, defaultScale: 5 }));
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
  describe('ZoomOptions (center zoom)', () => {
    it('onZoomIn with center zoom (mouseOffset = 0)', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          currentTranslate: { translateX: 100, translateY: 50 },
        });
      });

      expect(result.current.scale).toBeCloseTo(1.2);
      // scaleRatio = 1.2/1 = 1.2
      // newTx = 1.2 * 100 + (1 - 1.2) * 0 = 120
      // newTy = 1.2 * 50  + (1 - 1.2) * 0 = 60
      expect(zoomResult.newTranslate).toEqual({ translateX: 120, translateY: 60 });
    });

    it('onZoomIn with non-zero mouse offset', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 100,
          mouseOffsetY: 50,
          currentTranslate: { translateX: 0, translateY: 0 },
        });
      });

      expect(result.current.scale).toBeCloseTo(1.2);
      // newTx = 1.2 * 0 + (1 - 1.2) * 100 = -20
      // newTy = 1.2 * 0 + (1 - 1.2) * 50  = -10
      expect(zoomResult.newTranslate.translateX).toBeCloseTo(-20);
      expect(zoomResult.newTranslate.translateY).toBeCloseTo(-10);
    });

    it('onZoomOut with ZoomOptions preserves translate during zoom out', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomOut({
          mouseOffsetX: 100,
          mouseOffsetY: 100,
          currentTranslate: { translateX: 50, translateY: 50 },
        });
      });

      expect(result.current.scale).toBeCloseTo(0.8);
      // scaleRatio = 0.8/1 = 0.8
      // newTx = 0.8 * 50 + (1 - 0.8) * 100 = 40 + 20 = 60
      // newTy = 0.8 * 50 + (1 - 0.8) * 100 = 40 + 20 = 60
      expect(zoomResult.newTranslate).toEqual({ translateX: 60, translateY: 60 });
    });

    it('missing mouseOffset returns empty result', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

      let zoomResult;
      act(() => {
        // 缺少 mouseOffsetX
        zoomResult = result.current.onZoomIn({
          mouseOffsetY: 50,
          currentTranslate: { translateX: 0, translateY: 0 },
        });
      });
      expect(zoomResult.newTranslate).toBeUndefined();
    });

    it('at max boundary, zoom in returns empty result', () => {
      const { result } = renderHook(() => useScale({ max: 1.2, min: 0.5, step: 0.2, defaultScale: 1 }));

      // 先放大到 max
      act(() => {
        result.current.onZoomIn();
        vi.advanceTimersByTime(100);
      });
      expect(result.current.scale).toBe(1.2);

      // 再次放大已达边界
      let zoomResult;
      act(() => {
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 100,
          mouseOffsetY: 100,
          currentTranslate: { translateX: 0, translateY: 0 },
        });
      });
      // 已达边界，prevScale === newScale，返回空 {}
      expect(zoomResult).toEqual({});
    });

    it('zoom with existing translate and non-zero offset', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

      let zoomResult;
      act(() => {
        // scale: 1 → 1.2, scaleRatio = 1.2
        // newTx = 1.2 * 100 + (1 - 1.2) * 200 = 120 - 40 = 80
        // newTy = 1.2 * 50 + (1 - 1.2) * 100 = 60 - 20 = 40
        zoomResult = result.current.onZoomIn({
          mouseOffsetX: 200,
          mouseOffsetY: 100,
          currentTranslate: { translateX: 100, translateY: 50 },
        });
      });

      expect(zoomResult.newTranslate.translateX).toBeCloseTo(80);
      expect(zoomResult.newTranslate.translateY).toBeCloseTo(40);
    });
  });

  // ─── 节流行为 ──────────────────────────────────────────────────────────
  describe('throttle behavior', () => {
    it('throttles rapid onZoomIn calls (50ms, leading-only)', () => {
      const { result } = renderHook(() => useScale({ max: 5, min: 0.5, step: 0.2, defaultScale: 1 }));

      act(() => {
        // 连续快速调用 — 只有第一次生效（leading）
        result.current.onZoomIn();
        result.current.onZoomIn();
        result.current.onZoomIn();
      });
      // 节流期间只执行了一次
      expect(result.current.scale).toBeCloseTo(1.2);

      // 等待节流间隔过去
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.onZoomIn();
      });
      expect(result.current.scale).toBeCloseTo(1.4);
    });

    it('throttles rapid onZoomOut calls', () => {
      const { result } = renderHook(() => useScale({ max: 5, min: 0.1, step: 0.2, defaultScale: 1 }));

      act(() => {
        result.current.onZoomOut();
        result.current.onZoomOut();
        result.current.onZoomOut();
      });
      expect(result.current.scale).toBeCloseTo(0.8);
    });
  });
});

// ─── usePosition ─────────────────────────────────────────────────────────
describe('usePosition', () => {
  // 辅助：创建一个挂载了 usePosition 的测试组件，返回 ref 和 hook 结果
  const createHook = (initPosition?: [number, number]) => {
    const ref = { current: document.createElement('div') };
    return renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>, { initPosition }));
  };

  it('initial position defaults to [0, 0]', () => {
    const { result } = createHook();
    expect(result.current.position).toEqual([0, 0]);
    expect(result.current.isDragging).toBe(false);
  });

  it('custom initPosition', () => {
    const { result } = createHook([100, 200]);
    expect(result.current.position).toEqual([100, 200]);
  });

  it('resetPosition restores to initPosition', () => {
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

  it('resetPosition with default [0,0]', () => {
    const { result } = createHook();

    act(() => {
      result.current.setPosition([123, 456]);
    });
    act(() => {
      result.current.resetPosition();
    });
    expect(result.current.position).toEqual([0, 0]);
  });

  it('setPosition works directly', () => {
    const { result } = createHook();

    act(() => {
      result.current.setPosition([42, 99]);
    });
    expect(result.current.position).toEqual([42, 99]);
  });

  it('mousedown sets isDragging to true', () => {
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

  it('mouseup resets isDragging to false', () => {
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

  it('drag moves position by delta', () => {
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

    expect(result.current.position[0]).toBe(50); // 150 - 100
    expect(result.current.position[1]).toBe(30); // 130 - 100
    document.body.removeChild(divEl);
  });

  it('snapshot: default state', () => {
    const { result } = createHook();
    expect(result.current).toMatchSnapshot('usePosition-default-state');
  });
});

// ─── useViewerScale ───────────────────────────────────────────────────────
describe('useViewerScale', () => {
  it('returns defaults when no config provided', () => {
    const result = useViewerScale(undefined);
    expect(result).toEqual({ minWidth: 1000, minHeight: 1000 });
  });

  it('returns defaults when empty object provided', () => {
    const result = useViewerScale({});
    expect(result).toEqual({ minWidth: 1000, minHeight: 1000 });
  });

  it('overrides minWidth only', () => {
    const result = useViewerScale({ minWidth: 800 });
    expect(result).toEqual({ minWidth: 800, minHeight: 1000 });
  });

  it('overrides minHeight only', () => {
    const result = useViewerScale({ minHeight: 600 });
    expect(result).toEqual({ minWidth: 1000, minHeight: 600 });
  });

  it('overrides both minWidth and minHeight', () => {
    const result = useViewerScale({ minWidth: 500, minHeight: 400 });
    expect(result).toEqual({ minWidth: 500, minHeight: 400 });
  });

  it('zero values are accepted', () => {
    const result = useViewerScale({ minWidth: 0, minHeight: 0 });
    expect(result).toEqual({ minWidth: 0, minHeight: 0 });
  });

  it('snapshot: default config', () => {
    expect(useViewerScale(undefined)).toMatchSnapshot('useViewerScale-default');
  });

  it('snapshot: custom config', () => {
    expect(useViewerScale({ minWidth: 600, minHeight: 480 })).toMatchSnapshot('useViewerScale-custom');
  });
});

// ─── useScale: 双指缩放 ────────────────────────────────────────────────────
describe('useScale: touch events', () => {
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

  it('onTouchStart with 2 fingers records initial distance', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }));
    const touchStart = createTouchEvent(0, 0, 100, 0, 'touchstart');
    act(() => {
      result.current.onTouchStart(touchStart);
    });
    // 初始 distance = 100，不触发缩放，scale 不变
    expect(result.current.scale).toBe(1);
  });

  it('onTouchStart with 1 finger does nothing', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }));
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ pageX: 0, pageY: 0 } as Touch],
      cancelable: true,
    });
    act(() => {
      result.current.onTouchStart(touchStart);
    });
    expect(result.current.scale).toBe(1);
  });

  it('onTouchMove pinch out (spread fingers) zooms in', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }));

    // 初始距离 100
    act(() => {
      result.current.onTouchStart(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });

    // 手指扩大到 200（spread）→ zoom in
    act(() => {
      result.current.onTouchMove(createTouchEvent(0, 0, 200, 0, 'touchmove'));
    });

    expect(result.current.scale).toBeCloseTo(1.2);
  });

  it('onTouchMove pinch in (shrink fingers) zooms out', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }));

    // 初始距离 200
    act(() => {
      result.current.onTouchStart(createTouchEvent(0, 0, 200, 0, 'touchstart'));
    });

    // 手指缩小到 100（pinch）→ zoom out
    act(() => {
      result.current.onTouchMove(createTouchEvent(0, 0, 100, 0, 'touchmove'));
    });

    expect(result.current.scale).toBeCloseTo(0.8);
  });

  it('onTouchMove with 1 finger does nothing', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }));
    const touchMove = new TouchEvent('touchmove', {
      touches: [{ pageX: 100, pageY: 0 } as Touch],
      cancelable: true,
    });
    act(() => {
      result.current.onTouchMove(touchMove);
    });
    expect(result.current.scale).toBe(1);
  });

  it('onTouchEnd resets distance to 0', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }));

    act(() => {
      result.current.onTouchStart(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });
    act(() => {
      result.current.onTouchEnd();
    });
    // 再次 touchmove 时没有有效 distance，依然可以缩放
    act(() => {
      result.current.onTouchMove(createTouchEvent(0, 0, 200, 0, 'touchmove'));
    });
    // distance.current was 0 before this move; 200 > 0 → zoomIn
    expect(result.current.scale).toBeCloseTo(1.2);
  });
});

// ─── Hooks 组合 ──────────────────────────────────────────────────────────
describe('hooks combination', () => {
  it('all hooks work together for image transformations', () => {
    vi.useFakeTimers();

    const { result: mirrorResult } = renderHook(() => useMirror());
    const { result: rotateResult } = renderHook(() => useRotate());
    const { result: scaleResult } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }));

    act(() => {
      mirrorResult.current.onMirror();
      rotateResult.current.onRotate();
      rotateResult.current.onRotate();
      scaleResult.current.onZoomIn();
    });

    expect(mirrorResult.current.mirror).toBe(-1);
    expect(rotateResult.current.rotateZ).toBe(-180);
    expect(scaleResult.current.scale).toBeCloseTo(1.2);

    // 重置全部
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

  it('rapid operations across all hooks', () => {
    vi.useFakeTimers();

    const { result: scaleResult } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.1, defaultScale: 1 }));
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
