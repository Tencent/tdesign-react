import { vi } from 'vitest';
import ResizeObserverMock from './mocks/ResizeObserverMock.js';
import Touch from './mocks/Touch.js';

global.Touch = Touch;

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
vi.stubGlobal('Touch', Touch);
