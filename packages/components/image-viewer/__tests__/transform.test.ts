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
import { describe, expect, test } from 'vitest';
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
describe('常量', () => {
  test('DEFAULT_IMAGE_SCALE 默认缩放配置', () => {
    expect(DEFAULT_IMAGE_SCALE).toEqual({
      max: 2,
      min: 0.5,
      step: 0.2,
      defaultScale: 1,
    });
  });

  test('MIRROR_DEFAULT 默认值为 1', () => {
    expect(MIRROR_DEFAULT).toBe(1);
  });

  test('ROTATE_DEG 旋转角度为 -90', () => {
    expect(ROTATE_DEG).toBe(-90);
  });
});

// ─── toggleMirror ────────────────────────────────────────────────────────
describe('toggleMirror 镜像切换', () => {
  test('从默认值 1 切换为 -1', () => {
    expect(toggleMirror(1)).toBe(-1);
  });

  test('从 -1 切换回 1', () => {
    expect(toggleMirror(-1)).toBe(1);
  });

  test('连续切换 10 次回到 1', () => {
    let mirror = MIRROR_DEFAULT;
    for (let i = 0; i < 10; i++) {
      mirror = toggleMirror(mirror);
    }
    expect(mirror).toBe(1);
  });

  test('奇数次切换结果为 -1', () => {
    let mirror = MIRROR_DEFAULT;
    for (let i = 0; i < 5; i++) {
      mirror = toggleMirror(mirror);
    }
    expect(mirror).toBe(-1);
  });
});

// ─── calcResetRotation ──────────────────────────────────────────────────
describe('calcResetRotation 旋转重置', () => {
  test('0° 时无需调整', () => {
    expect(calcResetRotation(0)).toBe(0);
  });

  test('-90° 时保持不变（|deg| ≤ 180）', () => {
    expect(calcResetRotation(-90)).toBe(-90);
  });

  test('-180° 边界值保持不变', () => {
    expect(calcResetRotation(-180)).toBe(-180);
  });

  test('-270° 走最短路径（+90）', () => {
    expect(calcResetRotation(-270)).toBe(90);
  });

  test('-360° 整圈旋转无需调整', () => {
    expect(calcResetRotation(-360)).toBe(0);
  });

  test('-450° 等价于 -90°', () => {
    expect(calcResetRotation(-450)).toBe(-90);
  });

  test('-720° 两圈旋转无需调整', () => {
    expect(calcResetRotation(-720)).toBe(0);
  });

  test('正 90° 保持不变', () => {
    expect(calcResetRotation(90)).toBe(90);
  });

  test('正 270° 走最短路径', () => {
    expect(calcResetRotation(270)).toBe(270);
  });

  test('正 360° 整圈旋转无需调整', () => {
    expect(calcResetRotation(360)).toBe(0);
  });

  test('正 180° 保持不变', () => {
    expect(calcResetRotation(180)).toBe(180);
  });

  test('正 540° 等价于 180°', () => {
    expect(calcResetRotation(540)).toBe(180);
  });

  test('负 630° 最短路径', () => {
    expect(calcResetRotation(-630)).toBe(90);
  });
});

// ─── clampScale ──────────────────────────────────────────────────────────
describe('clampScale 缩放值限制', () => {
  test('范围内值不变', () => {
    expect(clampScale(1, 0.5, 2)).toBe(1);
  });

  test('低于最小值返回最小值', () => {
    expect(clampScale(0.1, 0.5, 2)).toBe(0.5);
  });

  test('超过最大值返回最大值', () => {
    expect(clampScale(5, 0.5, 2)).toBe(2);
  });

  test('等于最小值', () => {
    expect(clampScale(0.5, 0.5, 2)).toBe(0.5);
  });

  test('等于最大值', () => {
    expect(clampScale(2, 0.5, 2)).toBe(2);
  });

  test('零值被限制为最小值', () => {
    expect(clampScale(0, 0.5, 2)).toBe(0.5);
  });

  test('负值被限制为最小值', () => {
    expect(clampScale(-1, 0.5, 2)).toBe(0.5);
  });
});

// ─── calcZoomInScale / calcZoomOutScale ──────────────────────────────────
describe('calcZoomInScale 放大计算', () => {
  test('基本放大', () => {
    expect(calcZoomInScale(1, 0.2, 0.5, 2)).toBeCloseTo(1.2);
  });

  test('放大到最大值时截断', () => {
    expect(calcZoomInScale(1.9, 0.2, 0.5, 2)).toBe(2);
  });

  test('已在最大值时保持不变', () => {
    expect(calcZoomInScale(2, 0.2, 0.5, 2)).toBe(2);
  });

  test('大步长放大', () => {
    expect(calcZoomInScale(1, 1, 0.5, 2)).toBe(2);
  });

  test('小步长放大', () => {
    expect(calcZoomInScale(1, 0.05, 0.5, 2)).toBeCloseTo(1.05);
  });
});

describe('calcZoomOutScale 缩小计算', () => {
  test('基本缩小', () => {
    expect(calcZoomOutScale(1, 0.2, 0.5, 2)).toBeCloseTo(0.8);
  });

  test('缩小到最小值时截断', () => {
    expect(calcZoomOutScale(0.6, 0.2, 0.5, 2)).toBe(0.5);
  });

  test('已在最小值时保持不变', () => {
    expect(calcZoomOutScale(0.5, 0.2, 0.5, 2)).toBe(0.5);
  });

  test('大步长缩小', () => {
    expect(calcZoomOutScale(1, 1, 0.5, 2)).toBe(0.5);
  });
});

// ─── calculateTranslateOffset ────────────────────────────────────────────
describe('calculateTranslateOffset 位移计算', () => {
  test('缺少 mouseOffsetX 时返回 undefined', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetY: 50,
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result).toBeUndefined();
  });

  test('缺少 mouseOffsetY 时返回 undefined', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 50,
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result).toBeUndefined();
  });

  test('两个偏移都缺失时返回 undefined', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result).toBeUndefined();
  });

  test('options 为 undefined 时返回 undefined', () => {
    expect(calculateTranslateOffset(1, 1.2)).toBeUndefined();
  });

  test('中心缩放（偏移为 0）：newT = scaleRatio * T', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      currentTranslate: { translateX: 100, translateY: 50 },
    });
    expect(result).toEqual({ translateX: 120, translateY: 60 });
  });

  test('非中心缩放：公式验证', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 100,
      mouseOffsetY: 50,
      currentTranslate: { translateX: 0, translateY: 0 },
    });
    expect(result.translateX).toBeCloseTo(-20);
    expect(result.translateY).toBeCloseTo(-10);
  });

  test('缩小并带已有位移', () => {
    const result = calculateTranslateOffset(1, 0.8, {
      mouseOffsetX: 100,
      mouseOffsetY: 100,
      currentTranslate: { translateX: 50, translateY: 50 },
    });
    expect(result).toEqual({ translateX: 60, translateY: 60 });
  });

  test('缩放比例为 1 时位移不变', () => {
    const result = calculateTranslateOffset(1, 1, {
      mouseOffsetX: 200,
      mouseOffsetY: 200,
      currentTranslate: { translateX: 50, translateY: 50 },
    });
    expect(result).toEqual({ translateX: 50, translateY: 50 });
  });

  test('缺少 currentTranslate 时默认为 {0, 0}', () => {
    const result = calculateTranslateOffset(1, 1.2, {
      mouseOffsetX: 100,
      mouseOffsetY: 100,
    });
    expect(result.translateX).toBeCloseTo(-20);
    expect(result.translateY).toBeCloseTo(-20);
  });
});

// ─── zoomIn / zoomOut (组合函数) ─────────────────────────────────────────
describe('zoomIn 放大', () => {
  test('无 ZoomOptions 时只返回 newScale', () => {
    const { newScale, zoomResult } = zoomIn(1, 0.2, 0.5, 2);
    expect(newScale).toBeCloseTo(1.2);
    expect(zoomResult.newTranslate).toBeUndefined();
  });

  test('带 ZoomOptions 时计算新位移', () => {
    const { newScale, zoomResult } = zoomIn(1, 0.2, 0.5, 2, {
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      currentTranslate: { translateX: 100, translateY: 50 },
    });
    expect(newScale).toBeCloseTo(1.2);
    expect(zoomResult.newTranslate).toEqual({
      translateX: 120,
      translateY: 60,
    });
  });

  test('已达最大值时只返回 newScale', () => {
    const { newScale, zoomResult } = zoomIn(2, 0.2, 0.5, 2);
    expect(newScale).toBe(2);
    expect(zoomResult.newTranslate).toBeUndefined();
  });
});

describe('zoomOut 缩小', () => {
  test('无 ZoomOptions 时只返回 newScale', () => {
    const { newScale, zoomResult } = zoomOut(1, 0.2, 0.5, 2);
    expect(newScale).toBeCloseTo(0.8);
    expect(zoomResult.newTranslate).toBeUndefined();
  });

  test('带 ZoomOptions 时计算新位移', () => {
    const { newScale, zoomResult } = zoomOut(1, 0.2, 0.5, 2, {
      mouseOffsetX: 100,
      mouseOffsetY: 100,
      currentTranslate: { translateX: 50, translateY: 50 },
    });
    expect(newScale).toBeCloseTo(0.8);
    expect(zoomResult.newTranslate).toEqual({ translateX: 60, translateY: 60 });
  });

  test('已达最小值时只返回 newScale', () => {
    const { newScale, zoomResult } = zoomOut(0.5, 0.2, 0.5, 2);
    expect(newScale).toBe(0.5);
    expect(zoomResult.newTranslate).toBeUndefined();
  });
});

// ─── isImageExceedsViewport ──────────────────────────────────────────────
describe('isImageExceedsViewport 图片是否超出视口', () => {
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

      toJSON: () => {},
      ...rect,
    });
    return el;
  };

  test('图片在视口内', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 700,
      top: 50,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });

  test('图片超出左侧', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: -50,
      right: 700,
      top: 50,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  test('图片超出右侧', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 900,
      top: 50,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  test('图片超出顶部', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 700,
      top: -10,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  test('图片超出底部', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 700,
      top: 50,
      bottom: 650,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  test('图片四边均超出', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: -100,
      right: 900,
      top: -100,
      bottom: 700,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(true);
  });

  test('图片与视口完全重合', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });

  test('图片左边与容器左边对齐（边界不超出）', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 0,
      right: 700,
      top: 50,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });

  test('图片右边与容器右边对齐（边界不超出）', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 800,
      top: 50,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });

  test('图片上边与容器上边对齐（边界不超出）', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 700,
      top: 0,
      bottom: 550,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });

  test('图片下边与容器下边对齐（边界不超出）', () => {
    const container = createMockElement({
      left: 0,
      right: 800,
      top: 0,
      bottom: 600,
    });
    const modalBox = createMockElement({
      left: 100,
      right: 700,
      top: 50,
      bottom: 600,
    });
    expect(isImageExceedsViewport(container, modalBox)).toBe(false);
  });
});
