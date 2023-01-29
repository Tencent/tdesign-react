import React from 'react';
import { render } from '@test/utils';
import Watermark from '../Watermark';

describe('Watermark 组件测试', () => {
  const childTestID = 'childTestID';

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

  test('base', async () => {
    const wrapper = render(
      <Watermark watermarkContent={{ text: '@水印' }} y={100}>
        <div data-testid={childTestID} style={{ height: 300 }}></div>
      </Watermark>,
    );
    const child = document.createElement('div');
    child.innerText = 'testing';
    child.id = 'test';
    const targetDom = wrapper.getByTestId(childTestID);
    targetDom.append(child);
    expect(targetDom.firstChild).toEqual(child);
  });
});
