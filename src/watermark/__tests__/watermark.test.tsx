import React from 'react';
import { render, vi, mockDelay } from '@test/utils';
import Watermark from '../Watermark';

describe('Watermark 组件测试', () => {
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
      globalAlpha: 0.5,
      font: '',
      textAlign: '',
      textBaseline: '',
      fillStyle: '',
      fillText: vi.fn(),
    });
    mockGetCanvasToDataURL.mockReturnValue('test');
  });

  function renderWatermark(watermark) {
    const { container } = render(watermark);
    return container.firstChild;
  }

  test('base', async () => {
    const watermark = renderWatermark(
      <Watermark watermarkContent={{ text: '@水印' }} y={100}>
        <div style={{ height: 300 }}></div>
      </Watermark>,
    );
    expect(watermark).toHaveClass('t-watermark');
    expect(watermark.lastChild).toHaveStyle({ 'background-repeat': 'repeat' });
  });

  test('movable ', async () => {
    const watermark = renderWatermark(
      <Watermark moveInterval={15} movable watermarkContent={{ text: '@水印' }} y={100}>
        <div style={{ height: 300 }}></div>
      </Watermark>,
    );
    expect(watermark.lastChild).toHaveStyle({ animation: 'watermark infinite 1s' });
  });

  test('mutationObserver', async () => {
    const wrapper = render(
      <Watermark watermarkContent={{ text: '@水印' }} className="test-observer" y={100}>
        <div data-testid={childTestID} style={{ height: 300 }}></div>
      </Watermark>,
    );
    const child = document.createElement('div');
    child.innerText = 'testing';
    child.id = 'test';

    const watermarkWrap = wrapper.container.querySelector('.t-watermark');
    const watermarkWrapParent = watermarkWrap.parentElement;
    const watermarkEle = wrapper.container.querySelector('.test-observer');

    watermarkWrap.removeChild(watermarkEle);
    const afterMarkRemove = wrapper.container.querySelector('.test-observer');
    expect(afterMarkRemove).toBeNull();
    // 删除了水印元素，还会被立即追加回去
    await mockDelay(10);
    const waitAfterMarkRemove = wrapper.container.querySelector('.test-observer');
    expect(waitAfterMarkRemove).not.toBeNull();

    watermarkWrapParent.removeChild(watermarkWrap);
    const afterWrapRemove = wrapper.container.querySelector('.t-watermark');
    expect(afterWrapRemove).toBeNull();
    // 删除了水印wrap元素，还会被立即追加回去
    await mockDelay(10);
    const waitAfterWrapRemove = wrapper.container.querySelector('.t-watermark');
    expect(waitAfterWrapRemove).not.toBeNull();
  });
});
