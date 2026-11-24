import React from 'react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from '@test/utils';
import { cleanup, render } from '@testing-library/react';
import Watermark from '../index';

describe('Watermark', () => {
  const childTestID = 'childTestID';
  const mockGetCanvasContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
  const mockGetCanvasToDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL');

  beforeAll(() => {
    mockGetCanvasContext.mockReturnValue({
      drawImage: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      globalAlpha: 0.5,
      font: '',
      textAlign: 'center',
      textBaseline: 'middle',
      fillStyle: '',
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    mockGetCanvasToDataURL.mockReturnValue('test');
  });

  afterAll(() => {
    mockGetCanvasContext.mockRestore();
    mockGetCanvasToDataURL.mockRestore();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  function renderWatermark(watermark: React.ReactElement) {
    const { container } = render(watermark);
    return container.firstChild as HTMLElement;
  }

  test('base & default props', () => {
    const watermark = renderWatermark(
      <Watermark watermarkContent={{ text: '水印文字' }} y={100}>
        <div style={{ height: 300 }}></div>
      </Watermark>,
    );
    expect(watermark).toHaveClass('t-watermark');
    // 默认 isRepeat = true，非 movable 状态使用 repeat
    expect(watermark.lastChild).toHaveStyle({ 'background-repeat': 'repeat' });
    // 默认 movable = false 时无动画
    expect(watermark.lastChild).toHaveStyle({ animation: 'none' });
  });

  test('content prop renders when children is empty', () => {
    const watermark = renderWatermark(
      <Watermark watermarkContent={{ text: '内容' }} content={<div data-testid={childTestID}>content slot</div>} />,
    );
    expect(watermark.querySelector(`[data-testid="${childTestID}"]`)).not.toBeNull();
  });

  test('custom className & style', () => {
    const watermark = renderWatermark(
      <Watermark className="custom-cls" style={{ color: 'red' }} watermarkContent={{ text: '自定义' }} x={100} y={100}>
        <div></div>
      </Watermark>,
    );
    expect(watermark).toHaveClass('custom-cls');
    // style 会被合并到水印节点的内联样式
    expect((watermark.lastChild as HTMLElement).getAttribute('style')).toContain('color: red');
  });

  test('isRepeat = false', () => {
    const watermark = renderWatermark(
      <Watermark isRepeat={false} watermarkContent={{ text: '水印文字' }}>
        <div></div>
      </Watermark>,
    );
    expect(watermark.lastChild).toHaveStyle({ 'background-repeat': 'no-repeat' });
  });

  test('offset prop overrides default offsetLeft / offsetTop', () => {
    const watermark = renderWatermark(
      <Watermark offset={[20, 30]} watermarkContent={{ text: 'offset' }} x={100} y={100}>
        <div></div>
      </Watermark>,
    );
    // 仅验证渲染成功
    expect(watermark).toHaveClass('t-watermark');
  });

  test('layout = hexagonal', () => {
    const watermark = renderWatermark(
      <Watermark layout="hexagonal" watermarkContent={{ text: '六边形' }}>
        <div></div>
      </Watermark>,
    );
    expect(watermark).toHaveClass('t-watermark');
    expect(watermark.lastChild).not.toBeNull();
  });

  test('multiple watermarkContent (array of text)', () => {
    const watermark = renderWatermark(
      <Watermark
        watermarkContent={[{ text: '第一行', fontSize: 14, fontWeight: 'bold', fontColor: '#000' }, { text: '第二行' }]}
        alpha={0.5}
        zIndex={20}
        lineSpace={20}
        rotate={-30}
      >
        <div></div>
      </Watermark>,
    );
    expect(watermark.lastChild).toHaveStyle({ 'z-index': '20' });
  });

  test('image watermarkContent', () => {
    const watermark = renderWatermark(
      <Watermark watermarkContent={{ url: 'https://example.com/test.png' }}>
        <div></div>
      </Watermark>,
    );
    expect(watermark).toHaveClass('t-watermark');
  });

  test('movable', () => {
    const watermark = renderWatermark(
      <Watermark moveInterval={15} movable watermarkContent={{ text: '水印文字' }} y={100}>
        <div style={{ height: 300 }}></div>
      </Watermark>,
    );
    // 可移动状态使用 no-repeat
    expect(watermark.lastChild).toHaveStyle({ 'background-repeat': 'no-repeat' });
    expect(watermark.lastChild).toHaveStyle({ animation: 'watermark infinite 1s' });
  });

  test('movable with width = 0 (covers backgroundSize fallback branches)', () => {
    const watermark = renderWatermark(
      <Watermark movable width={0} height={0} watermarkContent={{ text: '水印文字' }}>
        <div></div>
      </Watermark>,
    );
    expect(watermark).toHaveClass('t-watermark');
  });

  test('mutationObserver: re-append when removed (removable = false)', async () => {
    const wrapper = render(
      <Watermark watermarkContent={{ text: '水印文字' }} className="test-observer" y={100} removable={false}>
        <div data-testid={childTestID} style={{ height: 300 }}></div>
      </Watermark>,
    );
    const watermarkWrap = wrapper.container.querySelector('.t-watermark') as HTMLElement;
    const watermarkWrapParent = watermarkWrap.parentElement as HTMLElement;
    const watermarkEle = watermarkWrap.querySelectorAll('div')[1];

    // 1) 水印 wrap 被移除 -> 自动恢复
    watermarkWrapParent.removeChild(watermarkWrap);
    expect(watermarkWrapParent.querySelector('.t-watermark')).toBeNull();
    vi.advanceTimersByTime(10);
    await Promise.resolve();
    const recoveredWrap = watermarkWrapParent.querySelector('.t-watermark') as HTMLElement;
    expect(recoveredWrap).not.toBeNull();

    // 2) 水印图层节点被移除 -> 自动恢复
    recoveredWrap.removeChild(watermarkEle);
    expect(recoveredWrap.querySelectorAll('div').length).toBe(1);
    vi.advanceTimersByTime(10);
    await Promise.resolve();
    expect(recoveredWrap.querySelectorAll('div')[1]).not.toBeNull();

    // 3) 水印图层属性被修改 -> 自动复原
    const markEl = recoveredWrap.querySelectorAll('div')[1];
    markEl.setAttribute('any', '11');
    vi.advanceTimersByTime(10);
    await Promise.resolve();
    const restoredMark = (wrapper.container.querySelector('.t-watermark') as HTMLElement).querySelectorAll('div')[1];
    expect(restoredMark.getAttribute('any')).toBeNull();
  });

  test('mutationObserver: do nothing when removable = true (default)', async () => {
    vi.useRealTimers();
    const wrapper = render(
      <Watermark watermarkContent={{ text: '水印文字' }}>
        <div></div>
      </Watermark>,
    );
    const watermarkWrap = wrapper.container.querySelector('.t-watermark') as HTMLElement;
    const parent = watermarkWrap.parentElement as HTMLElement;
    // removable 为 true 时，移除后不会被追加回去
    watermarkWrap.remove();
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
    expect(wrapper.container.querySelector('.t-watermark')).toBeNull();
    // 还原以便 React 卸载时能正确处理节点
    parent.appendChild(watermarkWrap);
  });

  test('mutationObserver: removable = true skips inner observer mutations', async () => {
    vi.useRealTimers();
    const wrapper = render(
      <Watermark watermarkContent={{ text: '水印文字' }}>
        <div></div>
      </Watermark>,
    );
    const watermarkWrap = wrapper.container.querySelector('.t-watermark') as HTMLElement;
    const watermarkEle = watermarkWrap.querySelectorAll('div')[1] as HTMLElement;

    // removable 默认为 true，修改水印图层属性时不会被还原
    watermarkEle.setAttribute('data-test', 'kept');
    await new Promise((resolve) => {
      setTimeout(resolve, 20);
    });
    const sameMark = (wrapper.container.querySelector('.t-watermark') as HTMLElement).querySelectorAll('div')[1];
    expect(sameMark.getAttribute('data-test')).toBe('kept');
  });

  test('mutationObserver: ignore non-watermark child removals when removable = false', async () => {
    const wrapper = render(
      <Watermark watermarkContent={{ text: '水印文字' }} removable={false}>
        <div data-testid={childTestID}></div>
      </Watermark>,
    );
    const watermarkWrap = wrapper.container.querySelector('.t-watermark') as HTMLElement;
    // 删除非水印图层的子节点（即用户的 children），不会触发水印重建
    const userChild = watermarkWrap.querySelector(`[data-testid="${childTestID}"]`) as HTMLElement;
    const watermarkImgBefore = watermarkWrap.querySelectorAll('div')[1];
    userChild.remove();
    vi.advanceTimersByTime(10);
    await Promise.resolve();
    const watermarkImgAfter = watermarkWrap.querySelectorAll('div')[0];
    // 水印图层依然存在且未被替换
    expect(watermarkImgAfter).toBe(watermarkImgBefore);
  });
});
