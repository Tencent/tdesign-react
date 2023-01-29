import React from 'react';
import { render, vi } from '@test/utils';
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
      <Watermark movable watermarkContent={{ text: '@水印' }} y={100}>
        <div style={{ height: 300 }}></div>
      </Watermark>,
    );
    expect(watermark.lastChild).toHaveStyle({ 'background-repeat': 'no-repeat' });
  });

  test('mutationObserver', async () => {
    const wrapper = render(
      <Watermark watermarkContent={{ text: '@水印' }} y={100}>
        <div data-testid={childTestID} style={{ height: 300 }}></div>
      </Watermark>,
    );
    const child = document.createElement('div');
    child.innerText = 'testing';
    child.id = 'test';

    const watermarkWrap = wrapper.container.querySelector('.t-watermark');
    watermarkWrap.style.overflow = 'visible';

    watermarkWrap.lastChild.classList.add('test');
    const targetDom1 = watermarkWrap.querySelector('.test');
    expect(targetDom1).not.toBe(null);

    const targetDom2 = wrapper.getByTestId(childTestID);
    targetDom2.append(child);
    expect(targetDom2.firstChild).toEqual(child);
  });
});
