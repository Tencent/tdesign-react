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

describe('useMirror', () => {
  test('initial state', () => {
    const { result } = renderHook(() => useMirror());
    expect(result.current.mirror).toBe(1);
  });

  test('onMirror', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(1);

    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);
  });

  test('onResetMirror', () => {
    const { result } = renderHook(() => useMirror());

    act(() => result.current.onMirror());
    act(() => result.current.onMirror());
    act(() => result.current.onMirror());
    expect(result.current.mirror).toBe(-1);

    act(() => result.current.onResetMirror());
    expect(result.current.mirror).toBe(1);
  });

  test('repeated toggles', () => {
    const { result } = renderHook(() => useMirror());

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.onMirror();
      }
    });
    expect(result.current.mirror).toBe(1);
  });

  test('onResetMirror idempotency', () => {
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
  test('initial state', () => {
    const { result } = renderHook(() => useRotate());
    expect(result.current.rotateZ).toBe(0);
  });

  test('onRotate', () => {
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

  test('rotation overflow', () => {
    const { result } = renderHook(() => useRotate());

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.onRotate();
      }
    });
    expect(result.current.rotateZ).toBe(-450);
  });

  describe('onResetRotate', () => {
    test('normalizes reflex angles', () => {
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

    test('handles the half-turn boundary', () => {
      const { result } = renderHook(() => useRotate());

      act(() => {
        result.current.onRotate();
        result.current.onRotate();
      });
      expect(result.current.rotateZ).toBe(-180);

      act(() => result.current.onResetRotate());
      expect(result.current.rotateZ).toBe(0);
    });

    test('preserves the initial state', () => {
      const { result } = renderHook(() => useRotate());

      act(() => result.current.onResetRotate());
      expect(result.current.rotateZ).toBe(0);
    });

    test('resets before the next rotation', () => {
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
});

// ─── useImageScale ───────────────────────────────────────────────────────
describe('useImageScale', () => {
  test('options[undefined]', () => {
    const { result } = renderHook(() => useImageScale());
    expect(result.current.max).toBe(DEFAULT_IMAGE_SCALE.max);
    expect(result.current.min).toBe(DEFAULT_IMAGE_SCALE.min);
    expect(result.current.step).toBe(DEFAULT_IMAGE_SCALE.step);
    expect(result.current.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });

  test('options accept partial fields', () => {
    const { result } = renderHook(() => useImageScale({ max: 5 }));
    expect(result.current.max).toBe(5);
    expect(result.current.min).toBe(DEFAULT_IMAGE_SCALE.min);
    expect(result.current.step).toBe(DEFAULT_IMAGE_SCALE.step);
    expect(result.current.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });

  test('defaultScale clamps values above the maximum', () => {
    const { result } = renderHook(() => useImageScale({ max: 3, defaultScale: 5 }));
    expect(result.current.defaultScale).toBe(3);
  });

  test('defaultScale clamps values below the minimum', () => {
    const { result } = renderHook(() => useImageScale({ min: 2, defaultScale: 1 }));
    expect(result.current.defaultScale).toBe(2);
  });

  test('defaultScale preserves values within range', () => {
    const { result } = renderHook(() => useImageScale({ max: 5, min: 0.1, step: 0.5, defaultScale: 2 }));
    expect(result.current.defaultScale).toBe(2);
  });

  test('defaultScale[undefined]', () => {
    const { result } = renderHook(() => useImageScale({ max: 3, min: 0.5, step: 0.1 }));
    expect(result.current.defaultScale).toBe(DEFAULT_IMAGE_SCALE.defaultScale);
  });

  test('defaultScale applies the maximum', () => {
    const { result } = renderHook(() => useImageScale({ max: 2, defaultScale: 2 }));
    expect(result.current.defaultScale).toBe(2);
  });

  test('defaultScale applies the minimum', () => {
    const { result } = renderHook(() => useImageScale({ min: 0.5, defaultScale: 0.5 }));
    expect(result.current.defaultScale).toBe(0.5);
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

  test('defaultScale', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));
    expect(result.current.scale).toBe(1);
  });

  test('defaultScale applies a custom value', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.1, defaultScale: 1.5 }, true));
    expect(result.current.scale).toBe(1.5);
  });

  test('defaultScale clamps values above the maximum', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 5 }, true));
    expect(result.current.scale).toBe(2);
  });

  test('defaultScale clamps values below the minimum', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 1.5, step: 0.2, defaultScale: 0.5 }, true));
    expect(result.current.scale).toBe(1.5);
  });

  test('onZoomIn', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomIn();
    });
    expect(result.current.scale).toBeCloseTo(1.2);
  });

  test('onZoomOut', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomOut();
    });
    expect(result.current.scale).toBeCloseTo(0.8);
  });

  test('onZoomIn stops at the maximum', () => {
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

  test('onZoomOut stops at the minimum', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.3, defaultScale: 0.6 }, true));

    act(() => {
      result.current.onZoomOut();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBe(0.5);
  });

  test('onResetScale', () => {
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

  test('step applies a small increment', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.05, defaultScale: 1 }, true));

    act(() => {
      result.current.onZoomIn();
      vi.advanceTimersByTime(100);
    });
    expect(result.current.scale).toBeCloseTo(1.05);
  });

  test('scale supports a wide range', () => {
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
  describe('zoom options', () => {
    test('onZoomIn updates centered translation', () => {
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
      expect(zoomResult.newTranslate).toEqual({
        translateX: 120,
        translateY: 60,
      });
    });

    test('onZoomIn applies the pointer offset', () => {
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

    test('onZoomOut updates translation', () => {
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
      expect(zoomResult.newTranslate).toEqual({
        translateX: 60,
        translateY: 60,
      });
    });

    test('mouseOffset accepts partial coordinates', () => {
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

    test('onZoomIn stops at the maximum', () => {
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

    test('onZoomIn preserves the existing translation', () => {
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

    test('onZoomOut handles viewport overflow', () => {
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

    test('onZoomOut handles repeated viewport overflow', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.5, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomIn();
        result.current.onZoomIn();
      });
      expect(result.current.scale).toBe(2);

      let translate = { translateX: 600, translateY: 400 };
      act(() => {
        const r = result.current.onZoomOut({
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          currentTranslate: translate,
        });
        translate = r.newTranslate;
      });
      expect(result.current.scale).toBe(1.5);
      expect(translate.translateX).toBeCloseTo(450);
      expect(translate.translateY).toBeCloseTo(300);

      act(() => {
        const r = result.current.onZoomOut({
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          currentTranslate: translate,
        });
        translate = r.newTranslate;
      });
      expect(result.current.scale).toBe(1);
      expect(translate.translateX).toBeCloseTo(300);
      expect(translate.translateY).toBeCloseTo(200);
    });
  });

  // 无节流，每次调用都直接生效
  describe('rapid zoom', () => {
    test('onZoomIn', () => {
      const { result } = renderHook(() => useScale({ max: 5, min: 0.5, step: 0.2, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomIn();
        result.current.onZoomIn();
        result.current.onZoomIn();
      });
      expect(result.current.scale).toBeCloseTo(1.6);
    });

    test('onZoomOut', () => {
      const { result } = renderHook(() => useScale({ max: 5, min: 0.1, step: 0.2, defaultScale: 1 }, true));

      act(() => {
        result.current.onZoomOut();
        result.current.onZoomOut();
        result.current.onZoomOut();
      });
      expect(result.current.scale).toBeCloseTo(0.4);
    });
  });

  describe('wheel listener', () => {
    test('visible[false]', () => {
      const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, false));

      const wheelEvent = new WheelEvent('wheel', {
        deltaY: -120,
        bubbles: true,
        cancelable: true,
      });
      act(() => {
        document.dispatchEvent(wheelEvent);
      });

      expect(result.current.scale).toBe(1);
    });

    test('visible[boolean]', () => {
      const onWheel = vi.fn();
      const { rerender } = renderHook(
        ({ visible }) => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, visible, onWheel),
        { initialProps: { visible: false } },
      );

      const wheelEvent = new WheelEvent('wheel', {
        deltaY: -120,
        bubbles: true,
        cancelable: true,
      });
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
describe('usePosition', () => {
  const createHook = (initPosition?: [number, number]) => {
    const ref = { current: document.createElement('div') };
    return renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>, { initPosition }));
  };

  test('initial position', () => {
    const { result } = createHook();
    expect(result.current.position).toEqual([0, 0]);
    expect(result.current.isDragging).toBe(false);
  });

  test('initPosition', () => {
    const { result } = createHook([100, 200]);
    expect(result.current.position).toEqual([100, 200]);
  });

  test('resetPosition', () => {
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

  test('resetPosition restores the default coordinates', () => {
    const { result } = createHook();

    act(() => {
      result.current.setPosition([123, 456]);
    });
    act(() => {
      result.current.resetPosition();
    });
    expect(result.current.position).toEqual([0, 0]);
  });

  test('setPosition', () => {
    const { result } = createHook();

    act(() => {
      result.current.setPosition([42, 99]);
    });
    expect(result.current.position).toEqual([42, 99]);
  });

  test('mousedown', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          screenX: 10,
          screenY: 20,
          button: 0,
        }),
      );
    });
    expect(result.current.isDragging).toBe(true);
    document.body.removeChild(divEl);
  });

  test('mouseup', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          screenX: 0,
          screenY: 0,
          button: 0,
        }),
      );
    });
    expect(result.current.isDragging).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(result.current.isDragging).toBe(false);
    document.body.removeChild(divEl);
  });

  test('drag', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          screenX: 100,
          screenY: 100,
          button: 0,
        }),
      );
    });
    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          screenX: 150,
          screenY: 130,
        }),
      );
    });

    expect(result.current.position[0]).toBe(50);
    expect(result.current.position[1]).toBe(30);
    document.body.removeChild(divEl);
  });

  test('repeated drag', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          screenX: 0,
          screenY: 0,
          button: 0,
        }),
      );
    });
    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          screenX: 100,
          screenY: 50,
        }),
      );
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(result.current.position).toEqual([100, 50]);

    act(() => {
      divEl.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          screenX: 200,
          screenY: 200,
          button: 0,
        }),
      );
    });
    act(() => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          bubbles: true,
          screenX: 250,
          screenY: 230,
        }),
      );
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(result.current.position).toEqual([150, 80]);
    document.body.removeChild(divEl);
  });
});

// ─── useViewerScale ───────────────────────────────────────────────────────
describe('useViewerScale', () => {
  test('options[undefined]', () => {
    const { result } = renderHook(() => useViewerScale(undefined));
    expect(result.current).toEqual({ minWidth: 1000, minHeight: 1000 });
  });

  test('options accept an empty object', () => {
    const { result } = renderHook(() => useViewerScale({}));
    expect(result.current).toEqual({ minWidth: 1000, minHeight: 1000 });
  });

  test('minWidth', () => {
    const { result } = renderHook(() => useViewerScale({ minWidth: 800 }));
    expect(result.current).toEqual({ minWidth: 800, minHeight: 1000 });
  });

  test('minHeight', () => {
    const { result } = renderHook(() => useViewerScale({ minHeight: 600 }));
    expect(result.current).toEqual({ minWidth: 1000, minHeight: 600 });
  });

  test('minWidth and minHeight', () => {
    const { result } = renderHook(() => useViewerScale({ minWidth: 500, minHeight: 400 }));
    expect(result.current).toEqual({ minWidth: 500, minHeight: 400 });
  });

  test('dimensions handle zero bounds', () => {
    const { result } = renderHook(() => useViewerScale({ minWidth: 0, minHeight: 0 }));
    expect(result.current).toEqual({ minWidth: 0, minHeight: 0 });
  });
});

// ─── useScale: 双指缩放 ────────────────────────────────────────────────────
describe('useScaleTouch', () => {
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

  test('touchstart initializes a multi-touch gesture', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));
    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });
    expect(result.current.scale).toBe(1);
  });

  test('touchstart ignores a single-touch gesture', () => {
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

  test('touchmove handles pinch-out gestures', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchstart'));
    });

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 200, 0, 'touchmove'));
    });

    expect(result.current.scale).toBeCloseTo(1.2);
  });

  test('touchmove handles pinch-in gestures', () => {
    const { result } = renderHook(() => useScale({ max: 3, min: 0.5, step: 0.2, defaultScale: 1 }, true));

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 200, 0, 'touchstart'));
    });

    act(() => {
      document.dispatchEvent(createTouchEvent(0, 0, 100, 0, 'touchmove'));
    });

    expect(result.current.scale).toBeCloseTo(0.8);
  });

  test('touchmove ignores a single-touch gesture', () => {
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

  test('touchend', () => {
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
describe('useIndex', () => {
  const createImages = (count: number) => Array.from({ length: count }, (_, i) => `img-${i}.jpg`);

  test('defaultIndex', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(3)));
    expect(result.current.index).toBe(0);
  });

  test('defaultIndex applies a custom index', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 2 }, createImages(5)));
    expect(result.current.index).toBe(2);
  });

  test('next', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(5)));
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  test('prev', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 2 }, createImages(5)));
    act(() => result.current.prev());
    expect(result.current.index).toBe(1);
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });

  test('next handles the last image boundary', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 2 }, createImages(3)));
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  test('prev handles the first image boundary', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(3)));
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });

  describe('onIndexChange', () => {
    test('reports the previous boundary', () => {
      const onIndexChange = vi.fn();
      const { result } = renderHook(() => useIndex({ defaultIndex: 0, onIndexChange }, createImages(3)));
      act(() => result.current.prev());
      expect(result.current.index).toBe(0);
      expect(onIndexChange).not.toHaveBeenCalled();
    });

    test('reports the next boundary', () => {
      const onIndexChange = vi.fn();
      const { result } = renderHook(() => useIndex({ defaultIndex: 2, onIndexChange }, createImages(3)));
      act(() => result.current.next());
      expect(result.current.index).toBe(2);
      expect(onIndexChange).not.toHaveBeenCalled();
    });

    test('trigger', () => {
      const onNext = vi.fn();
      const { result: nextResult } = renderHook(() =>
        useIndex({ defaultIndex: 0, onIndexChange: onNext }, createImages(3)),
      );
      act(() => nextResult.current.next());
      expect(onNext).toHaveBeenCalledWith(1, { trigger: 'next' });

      const onPrev = vi.fn();
      const { result: prevResult } = renderHook(() =>
        useIndex({ defaultIndex: 2, onIndexChange: onPrev }, createImages(3)),
      );
      act(() => prevResult.current.prev());
      expect(onPrev).toHaveBeenCalledWith(1, { trigger: 'prev' });

      const onSetIndex = vi.fn();
      const { result: setIndexResult } = renderHook(() =>
        useIndex({ defaultIndex: 0, onIndexChange: onSetIndex }, createImages(5)),
      );
      act(() => setIndexResult.current.setIndex(3, { trigger: 'current' }));
      expect(onSetIndex).toHaveBeenCalledWith(3, { trigger: 'current' });
    });
  });

  test('setIndex', () => {
    const onIndexChange = vi.fn();
    const { result } = renderHook(() => useIndex({ defaultIndex: 0, onIndexChange }, createImages(5)));
    act(() => result.current.setIndex(3, { trigger: 'current' }));
    expect(result.current.index).toBe(3);
  });

  test('index follows controlled updates', () => {
    const { result, rerender } = renderHook(
      ({ index }) => useIndex({ index, onIndexChange: vi.fn() }, createImages(5)),
      { initialProps: { index: 0 } },
    );
    expect(result.current.index).toBe(0);
    rerender({ index: 3 });
    expect(result.current.index).toBe(3);
  });

  test('navigation handles a single image', () => {
    const { result } = renderHook(() => useIndex({ defaultIndex: 0 }, createImages(1)));
    act(() => result.current.next());
    expect(result.current.index).toBe(0);
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });
});

// ─── Hooks 组合 ──────────────────────────────────────────────────────────
describe('hooks integration', () => {
  test('image transforms', () => {
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

  test('rapid transforms', () => {
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
describe('usePosition mouse button', () => {
  test('mousedown ignores the right mouse button', () => {
    const divEl = document.createElement('div');
    document.body.appendChild(divEl);
    const ref = { current: divEl };
    const { result } = renderHook(() => usePosition(ref as React.RefObject<HTMLDivElement>));

    act(() => {
      divEl.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          screenX: 10,
          screenY: 20,
          button: 2,
        }),
      );
    });
    expect(result.current.isDragging).toBe(false);
    document.body.removeChild(divEl);
  });
});

// ─── useScale 已达极限值时返回空 ──────────────────────────────────────────
describe('useScale limits', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('onZoomOut stops at the minimum', () => {
    const { result } = renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 0.5 }, true));
    const ret = result.current.onZoomOut();
    expect(ret).toEqual({});
    expect(result.current.scale).toBe(0.5);
  });

  test('onZoomIn stops at the maximum', () => {
    const { result } = renderHook(() => useScale({ max: 1.2, min: 0.5, step: 0.2, defaultScale: 1.2 }, true));
    const ret = result.current.onZoomIn();
    expect(ret).toEqual({});
    expect(result.current.scale).toBe(1.2);
  });
});

// ─── useScale onWheel 回调 ─────────────────────────────────────────────
describe('useScale onWheel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('visible', () => {
    const onWheel = vi.fn();
    renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, true, onWheel));

    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -120,
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      document.dispatchEvent(wheelEvent);
    });
    expect(onWheel).toHaveBeenCalledTimes(1);
  });

  test('visible[false]', () => {
    const onWheel = vi.fn();
    renderHook(() => useScale({ max: 2, min: 0.5, step: 0.2, defaultScale: 1 }, false, onWheel));

    const wheelEvent = new WheelEvent('wheel', {
      deltaY: -120,
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      document.dispatchEvent(wheelEvent);
    });
    expect(onWheel).not.toHaveBeenCalled();
  });
});
