import { vi } from 'vitest';

class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }

  trigger(entries) {
    this.callback(entries);
  }
}

export default ResizeObserverMock;
