/**
 * transform.test.ts — 纯函数测试
 *
 * 测试 @tdesign/common-js/image-viewer/transform 中的所有导出函数：
 * - toggleMirror / MIRROR_DEFAULT
 * - calcResetRotation / ROTATE_DEG
 * - clampScale / calcZoomInScale / calcZoomOutScale
 * - calculateTranslateOffset
 * - zoomIn / zoomOut
 * - isImageExceedsViewport
 * - DEFAULT_IMAGE_SCALE
 */
import { describe, expect, it } from 'vitest';
import {
  calcResetRotation,
  calculateTranslateOffset,
  calcZoomInScale,
  calcZoomOutScale,
  clampScale,
  DEFAULT_IMAGE_SCALE,
  isImageExceedsViewport,
  MIRROR_DEFAULT,
  ROTATE_DEG,
  toggleMirror,
  zoomIn,
  zoomOut,
} from '@tdesign/common-js/image-viewer/transform';

// ─── 常量 ────────────────────────────────────────────────────────────────
describe('constants', () => {
  it('DEFAULT_IMAGE_SCALE', () => {
    expect(DEFAULT_IMAGE_SCALE).toEqual({
      max: 2,
      min: 0.5,
      step: 0.2,
      defaultScale: 1,
    });
  });

  it('MIRROR_DEFAULT = 1', () => {
    expect(MIRROR_DEFAULT).toBe(1);
  });

  it('ROTATE_DEG = -90', () => {
    expect(ROTATE_DEG).toBe(-90);
  });
});

// ─── toggleMirror ────────────────────────────────────────────────────────
describe('toggleMirror', () => {
  it('toggles from default(1) to -1', () => {
    expect(toggleMirror(1)).toBe(-1);
  });

  it('toggles from -1 back to 1', () => {
    expect(toggleMirror(-1)).toBe(1);
  });

  it('rapid toggles (10 times) return to 1', () => {
    let mirror = MIRROR_DEFAULT;
    for (let i = 0; i < 10; i++) {
      mirror = toggleMirror(mirror);
    }
    expect(mirror).toBe(1);
  });

  it('odd number of toggles gives -1', () => {
    let mirror = MIRROR_DEFAULT;
    for (let i = 0; i < 5; i++) {
      mirror = toggleMirror(mirror);
    }
    expect(mirror).toBe(-1);
  });
});

// ─── calcResetRotation ──────────────────────────────────────────────────
describe('calcResetRotation', () => {
  it('0° → no adjustment', () => {
    expect(calcResetRotation(0)).toBe(0);
  });

  it('-90° → -90 (|deg| ≤ 180, same value)', () => {
    expect(calcResetRotation(-90)).toBe(-90);
  });

  it('-180° → -180 (boundary, |deg| = 180)', () => {
    expect(calcResetRotation(-180)).toBe(-180);
  });

  it('-270° → 90 (|deg| > 180, shortest path via +90)', () => {
    expect(calcResetRotation(-270)).toBe(90);
  });

  it('-360° → no adjustment (full rotation)', () => {
    expect(calcResetRotation(-360)).toBe(0);
  });

  it('-450° → -90 (-450 % 360 = -90)', () => {
    expect(calcResetRotation(-450)).toBe(-90);
  });

  it('-720° → no adjustment (two full rotations)', () => {
    expect(calcResetRotation(-720)).toBe(0);
  });

  it('positive 90° → 90', () => {
    expect(calcResetRotation(90)).toBe(90);
  });

  it('positive 270° → shortest path', () => {
    // 270 % 360 = 270, |270| > 180 → (270 + 360) % 360 = 270
    expect(calcResetRotation(270)).toBe(270);
  });
});

// ─── clampScale ──────────────────────────────────────────────────────────
describe('clampScale', () => {
  it('within range returns same value', () => {
    expect(clampScale(1, 0.5, 2)).toBe(1);
  });

  it('below min returns min', () => {
    expect(clampScale(0.1, 0.5, 2)).toBe(0.5);
  });

  it('above max returns max', () => {
    expect(clampScale(5, 0.5, 2)).toBe(2);
  });

  it('equal to min', () => {
    expect(clampScale(0.5, 0.5, 2)).toBe(0.5);
  });

  it('equal to max', () => {
    expect(clampScale(2, 0.5, 2)).toBe(2);
  });

  it('zero', () => {
    expect(clampScale(0, 0.5, 2)).toBe(0.5);
  });

  it('negative value', () => {
    expect(clampScale(-1, 0.5, 2)).toBe(0.5);
  });
});

// ─── calcZoomInScale / calcZoomOutScale ──────────────────────────────────
describe('calcZoomInScale', () => {
  it('basic zoom in', () => {
    expect(calcZoomInScale(1, 0.2, 0.5, 2)).toBeCloseTo(1.2);
  });

  it('clamps at max', () => {
    expect(calcZoomInScale(1.9, 0.2, 0.5, 2)).toBe(2);
  });

  it('already at max returns max', () => {
    expect(calcZoomInScale(2, 0.2, 0.5, 2)).toBe(2);
  });

  it('large step', () => {
    expect(calcZoomInScale(1, 1, 0.5, 2)).toBe(2);
  });

  it('small step', () => {
    expect(calcZoomInScale(1, 0.05, 0.5, 2)).toBeCloseTo(1.05);
  });
});

describe('calcZoomOutScale', () => {
  it('basic zoom out', () => {
    expect(calcZoomOutScale(1, 0.2, 0.5, 2)).toBeCloseTo(0.8);
  });

  it('clamps at min', () => {
    expect(calcZoomOutScale(0.6, 0.2, 0.5, 2)).toBe(0.5);
  });

  it('already at min returns min', () => {
    expect(calcZoomOutScale(0.5, 0.2, 0.5, 2)).toBe(0.5);
  });

  it('large step', () => {
    expect(calcZoomOutScale(1, 1, 0.5, 2)).toBe(0.5);
  });
});

// ─── calculateTranslateOffset ────────────────────────────────────────────
describe('calculateTranslateOffset', () => {
  it('returns undefined when mouseOffsetX is missing', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetY: 50,
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result).toBeUndefined();
  });

  it('returns undefined when mouseOffsetY is missing', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 50,
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result).toBeUndefined();
  });

  it('returns undefined when both offsets missing', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result).toBeUndefined();
  });

  it('returns undefined when options is undefined', () => {
    expect(calculateTranslateOffset(1, 1.2)).toBeUndefined();
  });

  it('center zoom (mouseOffset = 0): newT = scaleRatio * T', () => {
    // scaleRatio = 1.2/1 = 1.2, T = {100, 50}
    // newTx = 1.2 * 100 + (1 - 1.2) * 0 = 120
    // newTy = 1.2 * 50  + (1 - 1.2) * 0 = 60
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      currentTranslate: { translateX: 100, translateY: 50 },
    });
    expect(result).toEqual({ translateX: 120, translateY: 60 });
  });

  it('non-center zoom: formula verification', () => {
    // scaleRatio = 1.2/1 = 1.2
    // newTx = 1.2 * 0 + (1 - 1.2) * 100 = -20
    // newTy = 1.2 * 0 + (1 - 1.2) * 50  = -10
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 100,
      mouseOffsetY: 50,
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result.translateX).toBeCloseTo(-20);
    expect(result.translateY).toBeCloseTo(-10);
  });

  it('zoom out with existing translate', () => {
    // scaleRatio = 0.8/1 = 0.8
    // newTx = 0.8 * 50  + (1 - 0.8) * 100 = 40 + 20 = 60
    // newTy = 0.8 * 50  + (1 - 0.8) * 100 = 40 + 20 = 60
    const result = calculateTranslateOffset(1, 0.8, {
      mouseOffsetX: 100,
      mouseOffsetY: 100,
      currentTranslate: { translateX: 50, translateY: 50 },
    });
    expect(result).toEqual({ translateX: 60, translateY: 60 });
  });

  it('same scale (ratio = 1) returns same translate', () => {
    const result = calculateTranslateOffset(1, 1, {
      mouseOffsetX: 200,
      mouseOffsetY: 200,
      currentTranslate: { translateX: 50, translateY: 50 },
    });
    expect(result).toEqual({ translateX: 50, translateY: 50 });
  });

  it('missing currentTranslate defaults to {0, 0}', () => {
    // scaleRatio = 1.2/1 = 1.2
    // newTx = 1.2 * 0 + (1 - 1.2) * 100 = -20
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 100,
      mouseOffsetY: 100,
    });
    expect(result.translateX).toBeCloseTo(-20);
    expect(result.translateY).toBeCloseTo(-20);
  });
});

// ─── zoomIn / zoomOut (组合函数) ─────────────────────────────────────────
describe('zoomIn', () => {
  it('basic zoom in without options', () => {
    const { newScale, zoomResult } = zoomIn(1, 0.2, 0.5, 2);
    expect(newScale).toBeCloseTo(1.2);
    expect(zoomResult.newTranslate).toBeUndefined();
  });

  it('zoom in with ZoomOptions', () => {
    const { newScale, zoomResult } = zoomIn(1, 0.2, 0.5, 2, {
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      currentTranslate: { translateX: 100, translateY: 50 },
    });
    expect(newScale).toBeCloseTo(1.2);
    expect(zoomResult.newTranslate).toEqual({ translateX: 120, translateY: 60 });
  });

  it('zoom in at max boundary', () => {
    const { newScale, zoomResult } = zoomIn(2, 0.2, 0.5, 2);
    expect(newScale).toBe(2);
    expect(zoomResult.newTranslate).toBeUndefined();
  });
});

describe('zoomOut', () => {
  it('basic zoom out without options', () => {
    const { newScale, zoomResult } = zoomOut(1, 0.2, 0.5, 2);
    expect(newScale).toBeCloseTo(0.8);
    expect(zoomResult.newTranslate).toBeUndefined();
  });

  it('zoom out with ZoomOptions', () => {
    const { newScale, zoomResult } = zoomOut(1, 0.2, 0.5, 2, {
      mouseOffsetX: 100,
      mouseOffsetY: 100,
      currentTranslate: { translateX: 50, translateY: 50 },
    });
    expect(newScale).toBeCloseTo(0.8);
    expect(zoomResult.newTranslate).toEqual({ translateX: 60, translateY: 60 });
  });

  it('zoom out at min boundary', () => {
    const { newScale, zoomResult } = zoomOut(0.5, 0.2, 0.5, 2);
    expect(newScale).toBe(0.5);
    expect(zoomResult.newTranslate).toBeUndefined();
  });
});

// ─── isImageExceedsViewport ──────────────────────────────────────────────
describe('isImageExceedsViewport', () => {
  const createMockElement = (rect: Partial<DOMRect>) => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toJSON: () => {},
      ...rect,
    });
    return el;
  };

  it('image within viewport', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: 100, right: 700, top: 50, bottom: 550 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });

  it('image exceeds left', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: -50, right: 700, top: 50, bottom: 550 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  it('image exceeds right', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: 100, right: 900, top: 50, bottom: 550 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  it('image exceeds top', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: 100, right: 700, top: -10, bottom: 550 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  it('image exceeds bottom', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: 100, right: 700, top: 50, bottom: 650 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  it('image exceeds all sides', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: -100, right: 900, top: -100, bottom: 700 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  it('image matches viewport exactly', () => {
    const container = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    const modalBox = createMockElement({ left: 0, right: 800, top: 0, bottom: 600 });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });
});
