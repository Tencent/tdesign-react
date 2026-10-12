import React, { useEffect, useRef } from 'react';
import { vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

import ConfigProvider from '../../config-provider/ConfigProvider';
import usePanelVirtualScroll from '../hooks/usePanelVirtualScroll';

import type { SizeEnum, TScroll } from '../../common';
import type { SelectOption, SelectOptionGroup } from '../type';

const createOptions = () =>
  Array.from({ length: 100 }, (_, value) => ({
    label: `Option ${value}`,
    value,
  }));
const defaultScroll: TScroll = { type: 'virtual', threshold: 1, bufferSize: 2 };
const heightMap = { small: 20, medium: 28, large: 36 };

interface PanelProps {
  options: SelectOption[];
  classPrefix?: string;
  gap?: number;
  size?: SizeEnum;
  scroll?: TScroll;
}

function Row({ option, classPrefix, height, onRowMounted }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    onRowMounted({ ref: ref.current, data: option });
    // Match Option: changing the virtual row's data or callback does not trigger another measurement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <li ref={ref} className={`${classPrefix}-select-option`} style={{ height }} data-value={option.value}>
      {option.label}
    </li>
  );
}

// Keep the Select panel's DOM structure while mocking only the layout that JSDOM cannot measure.
function Panel({ options, classPrefix = 't', gap = 2, size = 'medium', scroll = defaultScroll }: PanelProps) {
  const popupContentRef = useRef<HTMLDivElement>(null);
  const { visibleData, handleRowMounted, panelStyle, cursorStyle } = usePanelVirtualScroll({
    popupContentRef,
    options,
    scroll,
    size,
  });
  const height = scroll.rowHeight || heightMap[size];

  return (
    <>
      <style>{`.${classPrefix}-select-option + .${classPrefix}-select-option { margin-top: ${gap}px; }`}</style>
      <div ref={popupContentRef} data-testid="viewport">
        <div style={cursorStyle} data-testid="cursor" />
        <div className={`${classPrefix}-select__dropdown-inner`} style={panelStyle} data-testid="panel">
          <ul className={`${classPrefix}-select__list`}>
            {visibleData.map((option, index) => {
              if (option.group) {
                return (
                  <li key={option.group} className={`${classPrefix}-select-option-group`}>
                    <ul className={`${classPrefix}-select__list`}>
                      {option.children.map((child) => (
                        <li key={child.value} className={`${classPrefix}-select-option`} style={{ height }}>
                          {child.label}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <Row
                  key={index}
                  option={option}
                  classPrefix={classPrefix}
                  height={height}
                  onRowMounted={handleRowMounted}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

function VirtualPanel(props: PanelProps) {
  return (
    <ConfigProvider notSet globalConfig={{ classPrefix: props.classPrefix || 't' }}>
      <Panel {...props} />
    </ConfigProvider>
  );
}

function translateY(element: HTMLElement) {
  return Number(element.style.transform.match(/translate\(0, ([-\d.]+)px\)/)[1]);
}

function scrollTo(viewport: HTMLElement, top: number) {
  fireEvent.scroll(viewport, { target: { scrollTop: top } });
  act(() => vi.advanceTimersByTime(1));
}

function optionTop(panel: HTMLElement, value: number) {
  const option = panel.querySelector<HTMLElement>(`[data-value="${value}"]`);
  expect(option).not.toBeNull();
  let top = translateY(panel);
  for (const sibling of Array.from(option.parentElement.children) as HTMLElement[]) {
    top += parseFloat(getComputedStyle(sibling).marginTop) || 0;
    if (sibling === option) return top;
    top += sibling.offsetHeight;
  }
  throw new Error(`Option ${value} is not rendered`);
}

describe('Select virtual option spacing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
      return parseFloat(this.style.height) || 0;
    });
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 84,
      width: 200,
      height: 84,
      toJSON: () => ({}),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  test.each<SizeEnum>(['small', 'medium', 'large'])(
    'keeps the same option stationary in the list when the rendered window changes (%s)',
    (size) => {
      const { getByTestId } = render(<VirtualPanel options={createOptions()} size={size} />);
      act(() => vi.advanceTimersByTime(1));
      const viewport = getByTestId('viewport');
      const panel = getByTestId('panel');
      const stride = heightMap[size] + 2;

      scrollTo(viewport, 10 * stride);
      const firstValue = panel.querySelector('[data-value]').getAttribute('data-value');
      const before = optionTop(panel, 12) - viewport.scrollTop;
      scrollTo(viewport, 12 * stride);
      const after = optionTop(panel, 12) - viewport.scrollTop;

      expect(panel.querySelector('[data-value]').getAttribute('data-value')).not.toBe(firstValue);
      expect(after - before).toBe(-2 * stride);
      expect(optionTop(panel, 12)).toBe(12 * stride);
      expect(translateY(getByTestId('cursor'))).toBe(100 * heightMap[size] + 99 * 2);
    },
  );

  test('uses the themed sibling margin with a custom class prefix', () => {
    const { getByTestId } = render(<VirtualPanel options={createOptions()} classPrefix="custom" gap={6.5} />);
    act(() => vi.advanceTimersByTime(1));
    const panel = getByTestId('panel');

    scrollTo(getByTestId('viewport'), 345);

    expect(optionTop(panel, 12)).toBe(12 * 34.5);
    expect(translateY(getByTestId('cursor'))).toBe(100 * 28 + 99 * 6.5);
  });

  test('remeasures a changed theme gap without keeping the previous offset', () => {
    const options = createOptions();
    const { getByTestId, rerender } = render(<VirtualPanel options={options} />);
    act(() => vi.advanceTimersByTime(1));
    scrollTo(getByTestId('viewport'), 300);
    expect(optionTop(getByTestId('panel'), 11)).toBe(330);

    rerender(<VirtualPanel options={options} gap={6} />);
    act(() => vi.advanceTimersByTime(1));

    expect(optionTop(getByTestId('panel'), 11)).toBe(374);
    expect(translateY(getByTestId('cursor'))).toBe(100 * 28 + 99 * 6);
  });

  test('adds the measured gap to an explicit fixed row height', () => {
    const scroll = { ...defaultScroll, isFixedRowHeight: true, rowHeight: 48 };
    const { getByTestId } = render(<VirtualPanel options={createOptions()} gap={4} scroll={scroll} />);
    act(() => vi.advanceTimersByTime(1));

    scrollTo(getByTestId('viewport'), 520);

    expect(optionTop(getByTestId('panel'), 11)).toBe(11 * 52);
    expect(translateY(getByTestId('cursor'))).toBe(100 * 48 + 99 * 4);
  });

  test('does not apply a nested option margin to top-level option groups', () => {
    const options: SelectOption[] = [
      {
        group: 'Group',
        children: createOptions().slice(0, 2),
      } as SelectOptionGroup,
      ...createOptions().slice(1),
    ];
    const scroll = { ...defaultScroll, isFixedRowHeight: true };
    const { getByTestId, container } = render(<VirtualPanel options={options} gap={6} scroll={scroll} />);
    act(() => vi.advanceTimersByTime(1));

    expect(getComputedStyle(container.querySelector('.t-select-option-group li + li')).marginTop).toBe('6px');
    expect(translateY(getByTestId('cursor'))).toBe(options.length * 28);
  });
});
