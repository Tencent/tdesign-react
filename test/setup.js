import { expect, vi } from 'vitest';

import ResizeObserverMock from './mocks/mobile/ResizeObserverMock.js';
import Touch from './mocks/mobile/Touch.js';

// 仅对移动端测试注入全局 mock，隔离桌面端：
const testPath = expect.getState()?.testPath || '';
const isMobileTest = testPath.includes('mobile-components') || testPath.includes('/snap/mobile');

if (isMobileTest) {
  global.Touch = Touch;
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  vi.stubGlobal('Touch', Touch);
}
