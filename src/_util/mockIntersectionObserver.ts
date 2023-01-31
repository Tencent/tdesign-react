import { vi } from '@test/utils';

const mockIntersectionObserver = (mockData, mockFunc) => {
  const { boundingClientRect = {}, intersectionRect = {}, rootBounds = {}, thresholds = 0.5 } = mockData;
  const { observe, unobserve, disconnect } = mockFunc;

  const defaultValue = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => '',
  };
  const records: IntersectionObserverEntry[] = [
    {
      isIntersecting: true,
      boundingClientRect: { ...defaultValue, ...boundingClientRect },
      intersectionRatio: 0.5,
      intersectionRect: { ...defaultValue, ...intersectionRect },
      rootBounds: { ...defaultValue, ...rootBounds },
      target: document.createElement('div'),
      time: 0,
    },
  ];

  window.IntersectionObserver = vi.fn((callback, { root, rootMargin }) => ({
    root,
    rootMargin,
    thresholds,
    observe: observe
      ? (element) => {
          observe(element, callback);
        }
      : vi.fn(),
    unobserve: unobserve || vi.fn(),
    disconnect: disconnect || vi.fn(),
    takeRecords: () => records,
  }));
};
export default mockIntersectionObserver;
