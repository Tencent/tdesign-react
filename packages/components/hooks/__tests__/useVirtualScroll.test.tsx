import { vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';

import useVirtualScroll from '../useVirtualScroll';

import type { UseVirtualScrollParams } from '../useVirtualScroll';

const createData = (length = 20) => Array.from({ length }, (_, id) => ({ id }));

const createParams = (params: Partial<UseVirtualScrollParams> = {}): UseVirtualScrollParams => ({
  data: createData(),
  scroll: { type: 'virtual', rowHeight: 28, bufferSize: 2, threshold: 1, isFixedRowHeight: true },
  ...params,
});

const flushTimers = () => {
  act(() => {
    vi.runOnlyPendingTimers();
  });
};

const renderVirtualScroll = (params: UseVirtualScrollParams, initialScrollTop = 0) => {
  const element = document.createElement('div');
  element.scrollTop = initialScrollTop;
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    ...element.getBoundingClientRect(),
    height: 30,
    bottom: 30,
  });
  const container = { current: element };
  const view = renderHook((props) => useVirtualScroll(container, props), { initialProps: params });
  flushTimers();

  const scrollTo = (scrollTop: number) => {
    act(() => {
      element.scrollTop = scrollTop;
      view.result.current.handleScroll();
    });
    flushTimers();
  };

  return { ...view, scrollTo };
};

const createRow = (height: number) => {
  const row = document.createElement('div');
  Object.defineProperty(row, 'offsetHeight', { value: height });
  return row;
};

describe('useVirtualScroll row spacing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('preserves row heights and offsets when no gap is supplied', () => {
    const { result, scrollTo } = renderVirtualScroll(createParams());

    expect(result.current.scrollHeight).toBe(560);
    scrollTo(151);
    expect(result.current.visibleData[0].id).toBe(3);
    expect(result.current.translateY).toBe(84);
  });

  it.each([
    { rowGap: 2, totalHeight: 598 },
    { rowGap: 5, totalHeight: 655 },
  ])('includes $rowGap px gaps without a trailing gap', ({ rowGap, totalHeight }) => {
    const { result } = renderVirtualScroll(createParams({ rowGap }));

    expect(result.current.isVirtualScroll).toBe(true);
    expect(result.current.scrollHeight).toBe(totalHeight);
    expect(result.current.translateY).toBe(0);
  });

  it('keeps the configured fixed row height separate from the gap', () => {
    const params = createParams({ rowGap: 3 });
    params.scroll.rowHeight = 40;
    const { result } = renderVirtualScroll(params);

    act(() => result.current.handleRowMounted({ ref: createRow(80), data: params.data[0] }));
    flushTimers();

    expect(result.current.scrollHeight).toBe(857);
  });

  it('adds spacing to measured row heights in dynamic mode', () => {
    const params = createParams({ rowGap: 2 });
    params.scroll.isFixedRowHeight = false;
    const { result, scrollTo } = renderVirtualScroll(params);

    expect(result.current.scrollHeight).toBe(598);
    act(() => result.current.handleRowMounted({ ref: createRow(44), data: params.data[0] }));
    flushTimers();

    expect(result.current.scrollHeight).toBe(614);
    scrollTo(167);
    expect(result.current.visibleData[0].id).toBe(3);
    expect(result.current.translateY).toBe(106);
  });

  it('advances the rendered window by the complete row spacing', () => {
    const { result, scrollTo } = renderVirtualScroll(createParams({ rowGap: 2 }));

    scrollTo(151);
    expect(result.current.visibleData.map((row) => row.id)).toEqual([3, 4, 5, 6, 7]);
    expect(result.current.translateY).toBe(90);

    scrollTo(181);
    expect(result.current.visibleData.map((row) => row.id)).toEqual([4, 5, 6, 7, 8]);
    expect(result.current.translateY).toBe(120);
  });

  it('updates the offset when the gap changes without changing the visible range', () => {
    const params = createParams({ rowGap: 2 });
    const { result, rerender, scrollTo } = renderVirtualScroll(params);
    scrollTo(167);

    expect(result.current.visibleData.map((row) => row.id)).toEqual([3, 4, 5, 6, 7]);
    expect(result.current.translateY).toBe(90);

    rerender({ ...params, rowGap: 4 });

    expect(result.current.visibleData.map((row) => row.id)).toEqual([3, 4, 5, 6, 7]);
    expect(result.current.translateY).toBe(96);
    expect(result.current.scrollHeight).toBe(636);
    flushTimers();
    expect(result.current.translateY).toBe(96);
  });

  it('updates the gap count when rows are added or removed', () => {
    const params = createParams({ rowGap: 2 });
    const { result, rerender } = renderVirtualScroll(params);
    expect(result.current.scrollHeight).toBe(598);

    rerender({ ...params, data: createData(30) });
    flushTimers();
    expect(result.current.scrollHeight).toBe(898);

    rerender({ ...params, data: createData(7) });
    flushTimers();
    expect(result.current.scrollHeight).toBe(208);
  });

  it('uses row spacing when mounting at an existing scroll position', () => {
    const { result } = renderVirtualScroll(createParams({ rowGap: 2 }), 167);

    expect(result.current.visibleData[0].id).toBe(3);
    expect(result.current.translateY).toBe(90);
  });

  it('includes the final row without adding spacing after it', () => {
    const { result, scrollTo } = renderVirtualScroll(createParams({ rowGap: 2 }));
    scrollTo(568);

    expect(result.current.visibleData.map((row) => row.id)).toEqual([16, 17, 18, 19]);
    expect(result.current.translateY).toBe(480);
    expect(result.current.scrollHeight).toBe(598);
  });
});
