import glob from 'glob';
import MockDate from 'mockdate';
import { vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockdate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2020-12-28 00:00:00');

export const IGNORE_ASYNC_EXAMPLE_LIST = [
  'packages/components/watermark/_example/*.tsx',
  'packages/components/table/_example/pagination-ajax.tsx',
];

function runTest() {
  const files = glob.sync('packages/components/**/_example/*.tsx', {
    ignore: IGNORE_ASYNC_EXAMPLE_LIST,
  });

  vi.mock('react-dom', async () => ({
    ...(await vi.importActual('react-dom')),
    createPortal: (node) => node,
  }));

  describe('ssr snapshot test', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn();

    files.forEach((file) => {
      it(`ssr test ${file}`, async () => {
        const demo = await import(`../../${file}`);
        const RealDemoComp = demo.default ? demo.default : demo;
        const html = renderToString(<RealDemoComp />);
        expect(html).toMatchSnapshot();
      });
    });
  });
}

runTest();
