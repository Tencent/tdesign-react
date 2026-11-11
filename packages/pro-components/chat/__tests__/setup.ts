import '@testing-library/jest-dom';

import ResizeObserver from 'resize-observer-polyfill';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom lacks adopted stylesheets. These shims enable rendering, not CSS/layout assertions.
if (!CSSStyleSheet.prototype.replaceSync) {
  CSSStyleSheet.prototype.replaceSync = function replaceSync() {
    // Adopted sheet CSS is not evaluated by jsdom.
  };
}
if (!CSSStyleSheet.prototype.replace) {
  CSSStyleSheet.prototype.replace = function replace() {
    return Promise.resolve(this);
  };
}
[Document.prototype, ShadowRoot.prototype].forEach((prototype) => {
  const sheets = new WeakMap<Document | ShadowRoot, CSSStyleSheet[]>();
  if (!Object.getOwnPropertyDescriptor(prototype, 'adoptedStyleSheets')) {
    Object.defineProperty(prototype, 'adoptedStyleSheets', {
      configurable: true,
      get() {
        if (!sheets.has(this)) sheets.set(this, []);
        return sheets.get(this);
      },
      set(value: CSSStyleSheet[]) {
        sheets.set(this, value);
      },
    });
  }
});
Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: ResizeObserver });
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}
if (!HTMLElement.prototype.scrollTo) {
  HTMLElement.prototype.scrollTo = function scrollTo(options?: ScrollToOptions | number, y?: number) {
    if (typeof options === 'number') {
      this.scrollLeft = options;
      this.scrollTop = y ?? this.scrollTop;
      return;
    }
    if (!options) return;
    this.scrollTop = options.top ?? this.scrollTop;
    this.scrollLeft = options.left ?? this.scrollLeft;
  };
}
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
