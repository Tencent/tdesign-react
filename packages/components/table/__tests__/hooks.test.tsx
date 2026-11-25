import { renderHook, vi } from '@test/utils';

import useRowspanAndColspan from '../hooks/useRowspanAndColspan';

describe('useRowspanAndColspan', () => {
  const columns = [{ colKey: 'id' }, { colKey: 'name' }];
  const rowKeyError = 'rowKey is wrong, can not get unique identifier of row.';

  afterEach(() => vi.restoreAllMocks());

  test('skips virtual placeholders while marking spans and still reports a missing row key', () => {
    const data = [
      { __VIRTUAL_FAKE_DATA: 'FIRST_FULL_ROW' },
      { id: 40 },
      { id: 41 },
      { __VIRTUAL_FAKE_DATA: 'LAST_FULL_ROW' },
      { name: 'Missing id' },
    ];
    const callback = vi.fn(({ rowIndex, colIndex }) =>
      rowIndex === 1 && colIndex === 0 ? { rowspan: 3, colspan: 2 } : {},
    );
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { result } = renderHook(() => useRowspanAndColspan(data, columns, 'id', callback));

    expect(callback.mock.calls).toEqual(
      [1, 2, 4].flatMap((rowIndex) =>
        columns.map((col, colIndex) => [{ row: data[rowIndex], rowIndex, col, colIndex }]),
      ),
    );
    expect(result.current.skipSpansMap).toEqual(
      new Map([
        ['40_id', { rowspan: 3, colspan: 2 }],
        ['40_name', { skipped: true }],
        ['41_id', { skipped: true }],
        ['41_name', { skipped: true }],
      ]),
    );
    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledWith(expect.stringContaining(rowKeyError));
  });

  test('keeps an empty span map ready after the full-row placeholder leaves the virtual window', () => {
    const callback = () => ({});
    const firstWindow = [{ __VIRTUAL_FAKE_DATA: 'FIRST_FULL_ROW' }, { id: 1 }];
    const nextWindow = [{ id: 30 }, { id: 31 }];
    const { result, rerender } = renderHook(
      ({ data: windowData }) => useRowspanAndColspan(windowData, columns, 'id', callback, true),
      { initialProps: { data: firstWindow } },
    );

    expect(result.current.spansResolved).toBe(true);
    rerender({ data: nextWindow });
    expect(result.current.spansResolved).toBe(true);
  });
});
