import glob from 'glob';
import MockDate from 'mockdate';
import React from 'react';
import { vi } from 'vitest';
import { render } from '@test/utils';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockDate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2020-12-28 00:00:00');

class ResizeObserver {
  observe() {
    return this;
  }

  unobserve() {
    return this;
  }
}

function runTest() {
  const files = glob.sync('src/**/_example/*.jsx', {
    ignore: ['src/watermark/_example/*.jsx'],
  });

  describe('csr snapshot test', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn();
    global.ResizeObserver = ResizeObserver;

    files.forEach((file) => {
      it(`csr test ${file}`, async () => {
        const demo = await import(`../../${file}`);
        const RealDemoComp = demo.default ? demo.default : demo;
        const wrapper = render(<RealDemoComp />);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
}

runTest();
