import React, { useState } from 'react';
import { describe, it, expect, render, fireEvent, vi, act, afterEach } from '@test/utils';
import Swiper from '../index';

const prefix = 't';
const swiperClass = `.${prefix}-swiper`;
const swiperItemClass = `.${prefix}-swiper-item`;
const swiperNavClass = `.${prefix}-swiper-nav`;

const createRect = (width = 300, height = 200): DOMRect => ({
  width,
  height,
  top: 0,
  left: 0,
  bottom: height,
  right: width,
  x: 0,
  y: 0,
  toJSON: () => ({}),
});

const mockElementMetrics = (width = 300, height = 200) => {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(height);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => createRect(width, height));
};

const flushEffects = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('Swiper', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders dots navigation with controls and triggers nav changes', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();
    const handleClick = vi.fn();

    const { container } = render(
      <Swiper
        autoplay={false}
        loop
        duration={50}
        navigation={{ type: 'dots', showControls: true, placement: 'outside' }}
        onChange={handleChange}
        onClick={handleClick}
      >
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 3</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector(`${swiperClass}`)).toHaveClass('t-swiper--outside');
    expect(container.querySelectorAll(`${swiperNavClass}__dots-item`).length).toBe(3);
    expect(container.querySelector(`${swiperItemClass}--active`)).toBeInTheDocument();

    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)!;
    fireEvent.click(swiperContainer);
    expect(handleClick).toHaveBeenCalledWith(0);

    const nextBtn = container.querySelector(`${swiperNavClass}__btn--next`)! as HTMLElement;
    fireEvent.click(nextBtn);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });

    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'nav' }));
    expect(container.querySelectorAll(`${swiperItemClass}--next`).length).toBeGreaterThan(0);
    expect(container.querySelector(`${swiperNavClass}__dots-item--active`)).toBeInTheDocument();
  });

  it('autoplays and loops with fraction navigation', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();

    const { getByText } = render(
      <Swiper interval={30} duration={20} navigation={{ type: 'fraction' }} onChange={handleChange}>
        <Swiper.SwiperItem>One</Swiper.SwiperItem>
        <Swiper.SwiperItem>Two</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(getByText('1/2')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });

    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'autoplay' }));
    expect(getByText('2/2')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });

    expect(handleChange).toHaveBeenLastCalledWith(0, expect.any(Object));
    expect(getByText('1/2')).toBeInTheDocument();
  });

  it('respects controlled props and layout styles', async () => {
    vi.useFakeTimers();
    mockElementMetrics(240, 180);
    const handleChange = vi.fn();

    const { container, rerender } = render(
      <Swiper
        autoplay={false}
        direction="vertical"
        previousMargin={24}
        nextMargin="16px"
        height={200}
        duration={10}
        loop
        navigation={{ type: 'dots', minShowNum: 4 }}
        onChange={handleChange}
        current={0}
      >
        <Swiper.SwiperItem>First</Swiper.SwiperItem>
        <Swiper.SwiperItem>Second</Swiper.SwiperItem>
        <Swiper.SwiperItem>Third</Swiper.SwiperItem>
      </Swiper>,
    );

    const containerEl = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    expect(containerEl.style.left).toBe('24px');
    expect(containerEl.style.right).toBe('16px');
    expect(containerEl.style.flexDirection).toBe('column');
    expect(containerEl.style.height).toBe('200px');
    expect(container.querySelector(`${swiperNavClass}`)).not.toBeInTheDocument();

    rerender(
      <Swiper
        autoplay={false}
        direction="vertical"
        previousMargin={24}
        nextMargin="16px"
        height={200}
        duration={10}
        loop
        navigation={{ type: 'dots', minShowNum: 4 }}
        onChange={handleChange}
        current={2}
      >
        <Swiper.SwiperItem>First</Swiper.SwiperItem>
        <Swiper.SwiperItem>Second</Swiper.SwiperItem>
        <Swiper.SwiperItem>Third</Swiper.SwiperItem>
      </Swiper>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(handleChange).toHaveBeenCalledWith(2, expect.any(Object));
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Third');
  });

  it('handles swipe gestures in both directions', async () => {
    vi.useFakeTimers();
    mockElementMetrics(300, 250);
    const handleChange = vi.fn();

    const { container } = render(
      <Swiper autoplay={false} loop duration={15} interval={100} onChange={handleChange}>
        <Swiper.SwiperItem>Alpha</Swiper.SwiperItem>
        <Swiper.SwiperItem>Beta</Swiper.SwiperItem>
        <Swiper.SwiperItem>Gamma</Swiper.SwiperItem>
      </Swiper>,
    );

    await flushEffects();
    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;

    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: 200, clientY: 0 }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: -200, clientY: 0 }] });
    expect(swiperContainer.style.transform).toContain('translateX(-100%)');
    expect(container.querySelectorAll(`${swiperItemClass}--next`).length).toBeGreaterThan(0);
    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: -200, clientY: 0 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15);
    });
    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'touch' }));
    handleChange.mockClear();

    // Test that small movements below threshold don't trigger a change
    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: 20, clientY: 0 }] });
    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: 20, clientY: 0 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15);
    });
    expect(handleChange).not.toHaveBeenCalled();
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Beta');

    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: -200, clientY: 0 }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: 220, clientY: 0 }] });
    expect(swiperContainer.style.transform).toContain('translateX(100%)');
    expect(container.querySelectorAll(`${swiperItemClass}--prev`).length).toBeGreaterThan(0);
    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: 220, clientY: 0 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15);
    });

    expect(handleChange).toHaveBeenCalledWith(0, expect.objectContaining({ source: 'touch' }));
  });

  it('honors disabled state for navigation and gestures', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();

    const { container } = render(
      <Swiper autoplay={false} disabled navigation={{ type: 'dots', showControls: true }} onChange={handleChange}>
        <Swiper.SwiperItem>Left</Swiper.SwiperItem>
        <Swiper.SwiperItem>Right</Swiper.SwiperItem>
      </Swiper>,
    );

    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)!;
    const baselineCalls = handleChange.mock.calls.length;
    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: 120, clientY: 0 }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: 0, clientY: 0 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(handleChange).toHaveBeenCalledTimes(baselineCalls);
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Left');
  });

  it('resets vertical swipe when movement is below threshold', async () => {
    vi.useFakeTimers();
    mockElementMetrics(240, 360);
    const handleChange = vi.fn();

    const { container } = render(
      <Swiper autoplay={false} loop direction="vertical" duration={12} interval={80} onChange={handleChange}>
        <Swiper.SwiperItem>Top</Swiper.SwiperItem>
        <Swiper.SwiperItem>Bottom</Swiper.SwiperItem>
      </Swiper>,
    );

    const baselineCalls = handleChange.mock.calls.length;
    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    const startY = 240;
    const moveY = 180;
    const containerHeight = 360;

    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: 0, clientY: startY }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: 0, clientY: moveY }] });

    const expectedPercent = ((moveY - startY) / containerHeight) * 100;
    expect(swiperContainer.style.transform).toContain(`translateY(${expectedPercent}%)`);

    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: 0, clientY: 180 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(12);
    });

    expect(handleChange.mock.calls.length).toBe(baselineCalls);
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Top');
  });

  it('supports card layout with string sizing and nav placement configs', async () => {
    mockElementMetrics(360, 220);

    const { container, rerender } = render(
      <Swiper
        autoplay={false}
        loop
        type="card"
        previousMargin="5%"
        nextMargin="12%"
        height="180px"
        navigation={{ type: 'dots-bar', paginationPosition: 'bottom', placement: 'outside', minShowNum: 1 }}
      >
        <Swiper.SwiperItem>Slide A</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide B</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide C</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide D</Swiper.SwiperItem>
      </Swiper>,
    );

    const cardContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    expect(cardContainer.style.left).toBe('5%');
    expect(cardContainer.style.right).toBe('12%');
    expect(cardContainer.style.height).toBe('180px');

    await flushEffects();
    expect(container.querySelector(`${swiperClass}`)).toHaveClass('t-swiper--card');

    rerender(
      <Swiper
        autoplay={false}
        loop
        type="card"
        previousMargin="5%"
        nextMargin="12%"
        height="180px"
        navigation={{ type: '' as any, placement: 'outside', paginationPosition: 'bottom' }}
      >
        <Swiper.SwiperItem>Slide A</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide B</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide C</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide D</Swiper.SwiperItem>
      </Swiper>,
    );

    await flushEffects();
    expect(container.querySelector(`${swiperClass}`)).toBeInTheDocument();
  });

  it('normalizes swipe offsets and respects guard fallbacks', async () => {
    vi.useFakeTimers();
    const zeroRect = () => createRect(0, 0);
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(undefined as any);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(undefined as any);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(zeroRect);

    const { container, rerender } = render(
      <Swiper autoplay={false} loop={false} navigation={{ type: 'dots', showControls: true }} duration={30}>
        {/* intentionally empty to hit guards */}
      </Swiper>,
    );

    const emptyContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    fireEvent.touchStart(emptyContainer, { touches: [{ clientX: 10, clientY: 5 }] });
    fireEvent.touchMove(emptyContainer, { touches: [{ clientX: 80, clientY: 5 }] });
    fireEvent.touchEnd(emptyContainer, { changedTouches: [{ clientX: 80, clientY: 5 }], touches: [] });
    expect(emptyContainer.style.transform).toBe('');

    rerender(
      <Swiper autoplay={false} loop={false} navigation={{ type: 'dots', showControls: true }} duration={30}>
        <Swiper.SwiperItem>Solo</Swiper.SwiperItem>
        <Swiper.SwiperItem>Partner</Swiper.SwiperItem>
      </Swiper>,
    );

    const fallbackContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    fireEvent.touchStart(fallbackContainer, { touches: [{ clientX: 100, clientY: 0 }] });
    fireEvent.touchMove(fallbackContainer, { touches: [{ clientX: -260, clientY: 0 }] });
    fireEvent.touchEnd(fallbackContainer, { changedTouches: [{ clientX: -260, clientY: 0 }], touches: [] });
    await flushEffects();
    const swiperItems = Array.from(container.querySelectorAll(`${swiperItemClass}`));
    expect(swiperItems[0]).toHaveTextContent('Solo');

    vi.restoreAllMocks();
    vi.useFakeTimers();
    mockElementMetrics(320, 200);

    rerender(
      <Swiper autoplay={false} loop duration={25} navigation={{ type: 'dots', showControls: true }}>
        <Swiper.SwiperItem>One</Swiper.SwiperItem>
        <Swiper.SwiperItem>Two</Swiper.SwiperItem>
        <Swiper.SwiperItem>Three</Swiper.SwiperItem>
      </Swiper>,
    );

    const activeContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    const nextBtn = container.querySelector(`${swiperNavClass}__btn--next`);
    if (nextBtn) {
      fireEvent.click(nextBtn);
    }

    fireEvent.touchStart(activeContainer, { touches: [{ clientX: 160, clientY: 0 }] });
    fireEvent.touchMove(activeContainer, { touches: [{ clientX: -120, clientY: 0 }] });
    fireEvent.touchEnd(activeContainer, { changedTouches: [{ clientX: -120, clientY: 0 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(25);
    });

    fireEvent.touchStart(activeContainer, { touches: [{ clientX: 0, clientY: 0 }] });
    fireEvent.touchMove(activeContainer, { touches: [{ clientX: -700, clientY: 0 }] });
    expect(activeContainer.style.transform).toContain('translateX(-100%)');
    fireEvent.touchEnd(activeContainer, { changedTouches: [{ clientX: -700, clientY: 0 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(25);
    });
  });
  it('recomputes when items are removed dynamically', async () => {
    vi.useFakeTimers();
    mockElementMetrics();

    const Demo = () => {
      const [visible, setVisible] = useState(true);
      return (
        <div>
          <Swiper autoplay={false} loop duration={20} interval={50}>
            {visible && <Swiper.SwiperItem>Shown</Swiper.SwiperItem>}
            <Swiper.SwiperItem>Persistent</Swiper.SwiperItem>
          </Swiper>
          <button type="button" onClick={() => setVisible(false)}>
            toggle
          </button>
        </div>
      );
    };

    const { getByText } = render(<Demo />);

    fireEvent.click(getByText('toggle'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });

    expect(document.querySelectorAll(`${swiperItemClass}`).length).toBe(1);
  });

  it('clamps navigation at bounds without loop and falls back for custom navigation slot', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();

    const { container, rerender } = render(
      <Swiper
        autoplay={false}
        loop={false}
        duration={0}
        navigation={{ type: 'dots', showControls: true }}
        onChange={handleChange}
      >
        <Swiper.SwiperItem>First</Swiper.SwiperItem>
        <Swiper.SwiperItem>Second</Swiper.SwiperItem>
      </Swiper>,
    );

    await flushEffects();
    const initialCalls = handleChange.mock.calls.length;
    const prevBtn = container.querySelector(`${swiperNavClass}__btn--prev`)! as HTMLElement;
    fireEvent.click(prevBtn);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(18);
    });

    expect(handleChange.mock.calls.length).toBeGreaterThan(initialCalls);
    expect(handleChange).toHaveBeenLastCalledWith(0, expect.objectContaining({ source: 'nav' }));
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('First');

    rerender(
      <Swiper
        autoplay={false}
        loop={false}
        duration={18}
        navigation={() => <span data-testid="custom-nav">slot</span>}
        onChange={handleChange}
      >
        <Swiper.SwiperItem>First</Swiper.SwiperItem>
        <Swiper.SwiperItem>Second</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector('[data-testid="custom-nav"]')).toBeInTheDocument();
  });

  it('handles vertical direction with controls and height from items', async () => {
    vi.useFakeTimers();
    mockElementMetrics(300, 400);
    const handleChange = vi.fn();

    const { container } = render(
      <Swiper
        autoplay={false}
        direction="vertical"
        loop
        duration={20}
        navigation={{ type: 'dots', showControls: true }}
        onChange={handleChange}
      >
        <Swiper.SwiperItem>Top</Swiper.SwiperItem>
        <Swiper.SwiperItem>Bottom</Swiper.SwiperItem>
        <Swiper.SwiperItem>Another</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector(`${swiperClass}__container--card`)).toHaveStyle({ flexDirection: 'column' });
    expect(container.querySelector(`${swiperNavClass}__btn`)).not.toBeInTheDocument(); // controls not shown in vertical
    expect(container.querySelectorAll(`${swiperNavClass}__dots-item`).length).toBe(3);

    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: 0, clientY: 200 }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: 0, clientY: 50 }] });
    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: 0, clientY: 50 }], touches: [] });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20);
    });

    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'touch' }));
  });

  it('renders without navigation and uses height from first item', async () => {
    mockElementMetrics(300, 200);
    const mockRect = {
      width: 300,
      height: 150,
      top: 0,
      left: 0,
      bottom: 150,
      right: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(mockRect);

    const { container } = render(
      <Swiper autoplay={false} loop>
        <Swiper.SwiperItem>Item 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Item 2</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector(`${swiperNavClass}`)).not.toBeInTheDocument();
    expect(container.querySelector(`${swiperClass}__container--card`)).toHaveStyle({ height: '150px' });

    vi.restoreAllMocks();
  });

  it('renders custom navigation as string', async () => {
    const { container } = render(
      <Swiper autoplay={false} navigation="Custom Nav">
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.textContent).toContain('Custom Nav');
  });

  it('handles navigation object without type property', async () => {
    const { container } = render(
      <Swiper autoplay={false} navigation={{ showControls: true }}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector(`${swiperNavClass}__btn`)).toBeInTheDocument();
  });

  it('exposes SwiperItem as static property', () => {
    expect(Swiper.SwiperItem).toBeDefined();
    expect(typeof Swiper.SwiperItem).toBe('function');
    // Test that static properties are properly hoisted
    expect(Object.keys(Swiper)).toContain('SwiperItem');
    expect(Object.getOwnPropertyDescriptor(Swiper, 'SwiperItem')).toBeDefined();
    // Test property descriptor attributes
    const descriptor = Object.getOwnPropertyDescriptor(Swiper, 'SwiperItem');
    expect(descriptor?.writable).toBe(true);
    expect(descriptor?.enumerable).toBe(true);
    expect(descriptor?.configurable).toBe(true);
  });

  it('renders dots-bar navigation with top pagination position', async () => {
    mockElementMetrics();
    const { container } = render(
      <Swiper autoplay={false} navigation={{ type: 'dots-bar', paginationPosition: 'top', placement: 'inside' }}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 3</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector(`${swiperNavClass}__dots-bar`)).toBeInTheDocument();
    // paginationPosition 为 top 时，inside/outside 无意义，外层容器不应有 placement 类名
    expect(container.querySelector(`${swiperClass}`)).not.toHaveClass('t-swiper--inside');
    expect(container.querySelector(`${swiperClass}`)).not.toHaveClass('t-swiper--outside');
  });

  it('renders fraction navigation with bottom pagination position', async () => {
    mockElementMetrics();
    const { container, getByText } = render(
      <Swiper autoplay={false} navigation={{ type: 'fraction', paginationPosition: 'bottom', placement: 'outside' }}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 3</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelector(`${swiperNavClass}__fraction`)).toBeInTheDocument();
    expect(getByText('1/3')).toBeInTheDocument();
    // fraction 类型不在 isBottomPagination 判断中（只有 dots/dots-bar 算），外层容器不应有 placement 类名
    expect(container.querySelector(`${swiperClass}`)).not.toHaveClass('t-swiper--inside');
    expect(container.querySelector(`${swiperClass}`)).not.toHaveClass('t-swiper--outside');
  });

  it('respects minShowNum for navigation visibility', async () => {
    mockElementMetrics();
    const { container } = render(
      <Swiper autoplay={false} navigation={{ type: 'dots', minShowNum: 2 }}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
      </Swiper>,
    );

    await flushEffects();
    expect(container.querySelector(`${swiperNavClass}__dots`)).toBeInTheDocument();
  });

  it('handles card type with loop and margins', async () => {
    vi.useFakeTimers();
    mockElementMetrics(320, 240);
    const handleChange = vi.fn();

    const { container } = render(
      <Swiper
        autoplay={false}
        type="card"
        loop
        previousMargin="10%"
        nextMargin="15%"
        duration={25}
        navigation={{ type: 'dots', showControls: true }}
        onChange={handleChange}
      >
        <Swiper.SwiperItem>Card 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Card 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Card 3</Swiper.SwiperItem>
        <Swiper.SwiperItem>Card 4</Swiper.SwiperItem>
      </Swiper>,
    );

    const cardContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    expect(cardContainer.style.left).toBe('10%');
    expect(cardContainer.style.right).toBe('15%');
    expect(container.querySelector(`${swiperClass}`)).toHaveClass('t-swiper--card');

    const nextBtn = container.querySelector(`${swiperNavClass}__btn--next`)! as HTMLElement;
    fireEvent.click(nextBtn);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(25);
    });

    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'nav' }));
  });

  it('sets height for vertical direction', () => {
    mockElementMetrics(300, 400);
    const { container } = render(
      <Swiper direction="vertical" height={500} autoplay={false}>
        <Swiper.SwiperItem>Vertical 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Vertical 2</Swiper.SwiperItem>
      </Swiper>,
    );

    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)! as HTMLElement;
    expect(swiperContainer.style.height).toBe('500px');
    expect(swiperContainer.style.flexDirection).toBe('column');
  });

  it('handles disabled state completely', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();
    const handleClick = vi.fn();

    const { container } = render(
      <Swiper disabled navigation={{ type: 'dots', showControls: true }} onChange={handleChange} onClick={handleClick}>
        <Swiper.SwiperItem>Disabled 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Disabled 2</Swiper.SwiperItem>
      </Swiper>,
    );

    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)!;
    const nextBtn = container.querySelector(`${swiperNavClass}__btn--next`);

    // Touch should not work
    fireEvent.touchStart(swiperContainer, { touches: [{ clientX: 150, clientY: 0 }] });
    fireEvent.touchMove(swiperContainer, { touches: [{ clientX: 50, clientY: 0 }] });
    fireEvent.touchEnd(swiperContainer, { changedTouches: [{ clientX: 50, clientY: 0 }], touches: [] });

    // Click should not work
    fireEvent.click(swiperContainer);

    // Navigation button should not work
    if (nextBtn) {
      fireEvent.click(nextBtn);
    }

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(handleChange).not.toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles empty children gracefully', () => {
    const { container } = render(<Swiper autoplay={false}></Swiper>);

    expect(container.querySelector(`${swiperClass}`)).toBeInTheDocument();
    expect(container.querySelectorAll(`${swiperItemClass}`).length).toBe(0);
  });

  it('handles single child without loop', () => {
    const { container } = render(
      <Swiper autoplay={false} loop={false}>
        <Swiper.SwiperItem>Single</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(container.querySelectorAll(`${swiperItemClass}`).length).toBe(1);
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Single');
  });

  it('respects custom duration and interval', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();

    render(
      <Swiper duration={100} interval={200} navigation={{ type: 'fraction' }} onChange={handleChange}>
        <Swiper.SwiperItem>Fast 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Fast 2</Swiper.SwiperItem>
      </Swiper>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(handleChange).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'autoplay' }));
  });

  it('handles non-loop mode boundaries', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();

    const { container } = render(
      <Swiper
        autoplay={false}
        loop={false}
        duration={0}
        navigation={{ type: 'dots', showControls: true }}
        onChange={handleChange}
      >
        <Swiper.SwiperItem>First</Swiper.SwiperItem>
        <Swiper.SwiperItem>Second</Swiper.SwiperItem>
        <Swiper.SwiperItem>Third</Swiper.SwiperItem>
      </Swiper>,
    );

    await flushEffects();
    const prevBtn = container.querySelector(`${swiperNavClass}__btn--prev`)! as HTMLElement;
    const nextBtn = container.querySelector(`${swiperNavClass}__btn--next`)! as HTMLElement;

    // Try to go before first
    fireEvent.click(prevBtn);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(handleChange).toHaveBeenCalledWith(0, expect.objectContaining({ source: 'nav' }));

    // Go to last
    fireEvent.click(nextBtn);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    fireEvent.click(nextBtn);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Third');

    // Try to go after last
    fireEvent.click(nextBtn);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(container.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Third');
  });

  it('handles controlled current prop', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const handleChange = vi.fn();

    const { rerender } = render(
      <Swiper current={0} autoplay={false} duration={10} onChange={handleChange}>
        <Swiper.SwiperItem>Controlled 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Controlled 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Controlled 3</Swiper.SwiperItem>
      </Swiper>,
    );

    expect(document.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Controlled 1');

    rerender(
      <Swiper current={2} autoplay={false} duration={10} onChange={handleChange}>
        <Swiper.SwiperItem>Controlled 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Controlled 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Controlled 3</Swiper.SwiperItem>
      </Swiper>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(handleChange).toHaveBeenCalledWith(2, expect.any(Object));
    expect(document.querySelector(`${swiperItemClass}--active`)).toHaveTextContent('Controlled 3');
  });

  it('renders navigation at various pagination positions', async () => {
    mockElementMetrics();
    const positions: Array<
      'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'left' | 'right'
    > = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right', 'left', 'right'];

    for (const position of positions) {
      const { container } = render(
        <Swiper autoplay={false} navigation={{ type: 'dots', paginationPosition: position }}>
          <Swiper.SwiperItem>Test</Swiper.SwiperItem>
          <Swiper.SwiperItem>Test2</Swiper.SwiperItem>
        </Swiper>,
      );
      expect(container.querySelector(`${swiperNavClass}__dots`)).toBeInTheDocument();
      // Note: Some positions may not show controls, but dots should be visible
    }
  });

  it('handles touchable prop when available', () => {
    // Note: touchable prop exists in interface but may not be implemented
    // This test ensures it doesn't break if passed
    const { container } = render(
      <Swiper autoplay={false} touchable={false}>
        <Swiper.SwiperItem>Touchable</Swiper.SwiperItem>
      </Swiper>,
    );
    expect(container.querySelector(`${swiperClass}`)).toBeInTheDocument();
  });

  it('triggers onClick with correct index', () => {
    mockElementMetrics();
    const handleClick = vi.fn();

    const { container } = render(
      <Swiper autoplay={false} onClick={handleClick}>
        <Swiper.SwiperItem>Click 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Click 2</Swiper.SwiperItem>
      </Swiper>,
    );

    const swiperContainer = container.querySelector(`${swiperClass}__container--card`)!;
    fireEvent.click(swiperContainer);
    expect(handleClick).toHaveBeenCalledWith(0);
  });

  it('handles animation prop', () => {
    const { container } = render(
      <Swiper animation="slide" autoplay={false}>
        <Swiper.SwiperItem>Animated</Swiper.SwiperItem>
      </Swiper>,
    );
    expect(container.querySelector(`${swiperClass}`)).toBeInTheDocument();
  });

  it('renders default navigation when navigation is true', async () => {
    mockElementMetrics();
    const { container } = render(
      <Swiper autoplay={false} navigation={true}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 3</Swiper.SwiperItem>
      </Swiper>,
    );

    // 应该显示默认的圆点导航
    expect(container.querySelectorAll(`${swiperNavClass}__dots-item`).length).toBe(3);
    // 默认不显示控制按钮
    expect(container.querySelector(`${swiperNavClass}__btn`)).not.toBeInTheDocument();
    // 默认底部位置
    expect(container.querySelector(`${swiperNavClass}--bottom`)).toBeInTheDocument();
  });

  it('hides navigation when navigation is false', async () => {
    mockElementMetrics();
    const { container } = render(
      <Swiper autoplay={false} navigation={false}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
      </Swiper>,
    );

    // 不应该显示任何导航
    expect(container.querySelector(`${swiperNavClass}__dots-item`)).not.toBeInTheDocument();
    expect(container.querySelector(`${swiperNavClass}__btn`)).not.toBeInTheDocument();
  });

  it('merges navigation config with defaults when navigation is object', async () => {
    vi.useFakeTimers();
    mockElementMetrics();
    const { container } = render(
      <Swiper autoplay={false} navigation={{ showControls: true }}>
        <Swiper.SwiperItem>Slide 1</Swiper.SwiperItem>
        <Swiper.SwiperItem>Slide 2</Swiper.SwiperItem>
      </Swiper>,
    );

    // 应该显示默认的圆点导航（从默认配置合并）
    expect(container.querySelectorAll(`${swiperNavClass}__dots-item`).length).toBe(2);
    // 应该显示控制按钮（用户配置）
    expect(container.querySelector(`${swiperNavClass}__btn`)).toBeInTheDocument();
  });
});
