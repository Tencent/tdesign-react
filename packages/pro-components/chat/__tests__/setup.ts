import '@testing-library/jest-dom';

import ResizeObserver from 'resize-observer-polyfill';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ResizeObserver,
  configurable: true,
});
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
  configurable: true,
});
HTMLElement.prototype.scrollTo = function scrollTo(options: ScrollToOptions) {
  this.scrollTop = options.top || 0;
  this.scrollLeft = options.left || 0;
};
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
