import React from 'react';
import glob from 'glob';
import MockDate from 'mockdate';
import { vi } from 'vitest';
import { render } from '@test/utils';

import { IGNORE_ASYNC_EXAMPLE_LIST } from './ssr.test';

// 固定时间，当使用 new Date() 时，返回固定时间，防止“当前时间”的副作用影响，导致 snapshot 变更，mockDate 插件见 https://github.com/boblauer/MockDate
MockDate.set('2020-12-28 00:00:00');

// Mock DOM layout properties that JSDOM does not implement.
Object.defineProperties(HTMLElement.prototype, {
  clientWidth: { value: 200 },
  clientHeight: { value: 100 },
  offsetWidth: { value: 200 },
  offsetHeight: { value: 100 },
});

class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return this;
  }

  unobserve() {
    return this;
  }

  disconnect() {
    return this;
  }
}

function normalizeIconMaskIds(container) {
  const instanceIndexes = new Map();
  const maskIdReplacements = new Map();

  container.querySelectorAll('mask[id*="-instance-"][id*="-overlap-"]').forEach((mask) => {
    const matched = /^(t-icon-.+)-instance-([a-zA-Z0-9_]+)(-overlap-.+)$/.exec(mask.id);
    if (!matched) return;

    const instanceKey = `${matched[1]}-instance-${matched[2]}`;
    if (!instanceIndexes.has(instanceKey)) {
      instanceIndexes.set(instanceKey, instanceIndexes.size);
    }

    const normalizedId = `${matched[1]}-instance-snapshot${instanceIndexes.get(instanceKey)}${matched[3]}`;
    maskIdReplacements.set(mask.id, normalizedId);
    mask.id = normalizedId;
  });

  container.querySelectorAll('[mask]').forEach((element) => {
    const maskReference = /^url\(#(.+)\)$/.exec(element.getAttribute('mask') || '');
    const normalizedId = maskReference && maskIdReplacements.get(maskReference[1]);
    if (normalizedId) {
      element.setAttribute('mask', `url(#${normalizedId})`);
    }
  });
}

function runTest() {
  const files = glob.sync('packages/components/**/_example/*.tsx', {
    ignore: IGNORE_ASYNC_EXAMPLE_LIST,
  }).sort();

  describe('csr snapshot test', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn();
    global.ResizeObserver = ResizeObserver;

    files.forEach((file) => {
      it(`csr test ${file}`, async () => {
        const demo = await import(`../../${file}`);
        const RealDemoComp = demo.default ? demo.default : demo;
        const { container } = render(<RealDemoComp />);
        normalizeIconMaskIds(container);
        expect(container).toMatchSnapshot();
      });
    });
  });
}

runTest();
