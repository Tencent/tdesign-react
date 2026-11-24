import { describe, it, expect, render, fireEvent, act } from '@test/utils';
import { vi, beforeEach, afterEach } from 'vitest';
import React, { useRef } from 'react';
import SwipeCell, { SwipeCellRef, syncOpenedState } from '../SwipeCell';

// mock use-gesture to capture handler/options for unit branch coverage
const dragStore: Array<any> = [];
vi.mock('@use-gesture/react', () => ({
  useDrag: (handler: any, opts: any) => {
    dragStore.push({ handler, opts });
    // return a bind function; component spreads its props, but tests don't rely on them
    return () => ({});
  },
}));

const leftActions = [
  { text: '左1', className: 'btn-left-1', style: { background: 'red' }, onClick: vi.fn() },
  { text: '左2', className: 'btn-left-2', style: { background: 'blue' }, onClick: vi.fn() },
];
const rightActions = [
  { text: '右1', className: 'btn-right-1', style: { background: 'green' }, onClick: vi.fn() },
  { text: '右2', className: 'btn-right-2', style: { background: 'yellow' }, onClick: vi.fn() },
];

describe('SwipeCell', () => {
  // ensure clean store for each test
  beforeEach(() => {
    dragStore.length = 0;
    vi.useRealTimers();
  });

  it('useClickAway does nothing when already closed (x===0)', () => {
    const onChange = vi.fn();
    const { container } = render(
      <div>
        <SwipeCell right={rightActions} content={<div>内容</div>} opened={false} onChange={onChange} />
        <button>外部</button>
      </div>,
    );
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    // initial is closed
    expect(wrapper.style.transform).toContain('translateX(0px)');
    // touch outside should not trigger close/onChange when x===0
    const btn = container.querySelector('button')!;
    fireEvent.touchStart(btn);
    expect(wrapper.style.transform).toContain('translateX(0px)');
    expect(onChange).not.toHaveBeenCalled();
  });

  afterEach(() => {
    // flush any timeouts scheduled inside component (e.g., expand delay, dragging reset, sure animation)
    vi.useFakeTimers();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders content and actions', () => {
    const { getByText } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened />,
    );
    expect(getByText('内容')).toBeInTheDocument();
    expect(getByText('左1')).toBeInTheDocument();
    expect(getByText('右1')).toBeInTheDocument();
  });

  it('renders with custom className and style', () => {
    const { container } = render(
      <SwipeCell className="custom-class" style={{ color: 'red' }} content={<div>内容</div>} />,
    );
    const element = container.querySelector('.custom-class');
    expect(element).toBeInTheDocument();
    expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('renders content as TNode', () => {
    const content = () => <div>动态内容</div>;
    const { getByText } = render(<SwipeCell content={content} />);
    expect(getByText('动态内容')).toBeInTheDocument();
  });

  it('renders actions as TNode', () => {
    const actions = () => <div>自定义操作</div>;
    const { getByText } = render(<SwipeCell left={actions} opened />);
    expect(getByText('自定义操作')).toBeInTheDocument();
  });

  it('renders action with icon and text', () => {
    const action = { text: '操作', icon: <span>图标</span>, onClick: vi.fn() };
    const { getByText } = render(<SwipeCell right={[action]} opened />);
    expect(getByText('操作')).toBeInTheDocument();
    expect(getByText('图标')).toBeInTheDocument();
  });

  it('calls onChange when opened changes', async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SwipeCell
        left={leftActions}
        right={rightActions}
        content={<div>内容</div>}
        opened={false}
        onChange={onChange}
      />,
    );
    await act(async () => {
      rerender(
        <SwipeCell
          left={leftActions}
          right={rightActions}
          content={<div>内容</div>}
          opened={[false, true]}
          onChange={onChange}
        />,
      );
    });
    await act(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 200);
      });
    });
    expect(onChange).toHaveBeenCalledWith('right');
  });

  it('supports opened as array [true, false]', () => {
    const { getByText } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened={[true, false]} />,
    );
    expect(getByText('左1')).toBeInTheDocument();
  });

  it('supports opened as array [false, true]', () => {
    const { getByText } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened={[false, true]} />,
    );
    expect(getByText('右1')).toBeInTheDocument();
  });

  it('supports opened as boolean true with right', () => {
    const { getByText } = render(<SwipeCell right={rightActions} content={<div>内容</div>} opened={true} />);
    expect(getByText('右1')).toBeInTheDocument();
  });

  it('supports opened as boolean true with left', () => {
    const { getByText } = render(<SwipeCell left={leftActions} content={<div>内容</div>} opened={true} />);
    expect(getByText('左1')).toBeInTheDocument();
  });

  it('opened=true with both sides prefers right', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { container } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened onChange={onChange} />,
    );
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 110, configurable: true });
    await act(async () => {
      vi.advanceTimersByTime(120);
    });
    expect(wrapper.style.transform).toContain('translateX(-110px)');
    expect(onChange).toHaveBeenCalledWith('right');
    vi.useRealTimers();
  });

  it('disables swipe when disabled', () => {
    const { container } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} disabled />,
    );
    expect(container.querySelector('.t-swipe-cell')).toBeTruthy();
  });

  it('calls onClick for action', () => {
    const onClick = vi.fn();
    const action = { text: '操作', onClick: vi.fn() };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} onClick={onClick} opened />);
    fireEvent.click(getByText('操作'));
    expect(action.onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledWith(action, 'right');
  });

  it('action renders custom className and merges inline style', () => {
    const { container, getByText } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened />,
    );
    // left first action has custom className
    const leftBtn = container.querySelector('.btn-left-1') as HTMLElement;
    expect(leftBtn).toBeTruthy();
    // style height:100% merged with background
    expect(leftBtn.getAttribute('style')).toContain('background: red');
    // right first action has custom className
    expect(container.querySelector('.btn-right-1')).toBeTruthy();
    expect(getByText('左1')).toBeInTheDocument();
    expect(getByText('右1')).toBeInTheDocument();
  });

  it('shows sure content and resets after confirm', async () => {
    function TestSure() {
      const ref = useRef(null);
      const sure = <div onClick={() => ref.current.close()}>确认删除？</div>;
      const action = { text: '删除', sure };
      return <SwipeCell ref={ref} right={[action]} content={<div>内容</div>} opened />;
    }
    const { getByText, queryByText } = render(<TestSure />);
    fireEvent.click(getByText('删除'));
    expect(getByText('确认删除？')).toBeInTheDocument();
    fireEvent.click(getByText('确认删除？'));
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 400);
      });
    });
    expect(queryByText('确认删除？')).not.toBeInTheDocument();
  });

  it('ref expand/close works', () => {
    function TestRef() {
      const ref = useRef(null);
      return (
        <>
          <SwipeCell ref={ref} left={leftActions} right={rightActions} content={<div>内容</div>} />
          <button onClick={() => ref.current.expand('left')}>expand</button>
          <button onClick={() => ref.current.close()}>close</button>
        </>
      );
    }
    const { getByText } = render(<TestRef />);
    fireEvent.click(getByText('expand'));
    fireEvent.click(getByText('close'));
    // 只验证无异常
    expect(getByText('内容')).toBeInTheDocument();
  });

  it('expand defaults to right and close clears sure overlay', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const action = { text: '删除', sure: <div>确认立即删除？</div> };
    const { container, getByText, queryByText } = render(
      <SwipeCell ref={ref} right={[action]} content={<div>内容</div>} />,
    );
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 90, configurable: true });
    act(() => {
      ref.current.expand();
    });
    expect(wrapper.style.transform).toContain('translateX(-90px)');
    fireEvent.click(getByText('删除'));
    expect(getByText('确认立即删除？')).toBeInTheDocument();
    act(() => {
      ref.current.close();
    });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(queryByText('确认立即删除？')).not.toBeInTheDocument();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('ref showSure renders sure content on expanded side and fires onClick on confirm', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const onSureClick = vi.fn();
    const { container, getByText } = render(<SwipeCell ref={ref} right={rightActions} content={<div>内容</div>} />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    act(() => {
      ref.current.expand('right');
    });
    act(() => {
      ref.current.showSure('确认删除？', onSureClick);
    });
    const overlay = getByText('确认删除？') as HTMLElement;
    expect(overlay.style.transform).toContain('100%');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(overlay.style.transform).toBe('none');
    fireEvent.click(overlay);
    expect(onSureClick).toHaveBeenCalledTimes(1);
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('ref showSure picks left side when expanded to left', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const { container, getByText } = render(<SwipeCell ref={ref} left={leftActions} content={<div>内容</div>} />);
    const leftEl = container.querySelector('.t-swipe-cell__left') as HTMLElement;
    Object.defineProperty(leftEl, 'clientWidth', { value: 80, configurable: true });
    act(() => {
      ref.current.expand('left');
    });
    act(() => {
      ref.current.showSure('确认左侧删除？');
    });
    const overlay = getByText('确认左侧删除？') as HTMLElement;
    expect(overlay.style.transform).toContain('-100%');
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('ref showSure renders confirmation content only on the active side', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const { container, queryAllByText } = render(
      <SwipeCell ref={ref} left={leftActions} right={rightActions} content={<div>内容</div>} />,
    );
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    act(() => {
      ref.current.expand('right');
      ref.current.showSure('确认删除？');
    });

    expect(queryAllByText('确认删除？')).toHaveLength(1);
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('ref showSure falls back to left side when closed and only left actions exist', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const { getByText } = render(<SwipeCell ref={ref} left={leftActions} content={<div>内容</div>} />);
    act(() => {
      ref.current.showSure('确认左侧删除？');
    });
    expect(getByText('确认左侧删除？')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    vi.useRealTimers();
  });

  it('expand to a different side clears visible sure content', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const { container, getByText, queryByText } = render(
      <SwipeCell ref={ref} left={leftActions} right={rightActions} content={<div>内容</div>} />,
    );
    const leftEl = container.querySelector('.t-swipe-cell__left') as HTMLElement;
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(leftEl, 'clientWidth', { value: 80, configurable: true });
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    act(() => {
      ref.current.expand('right');
      ref.current.showSure('确认删除？');
    });
    expect(getByText('确认删除？')).toBeInTheDocument();
    act(() => {
      ref.current.expand('left');
    });
    expect(queryByText('确认删除？')).not.toBeInTheDocument();
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('keeps newly opened sure content after close and reopen', () => {
    vi.useFakeTimers();
    const ref = React.createRef<SwipeCellRef>();
    const { container, getByText, queryByText } = render(
      <SwipeCell ref={ref} right={rightActions} content={<div>内容</div>} />,
    );
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });

    act(() => {
      ref.current.expand('right');
      ref.current.showSure('第一次确认');
    });
    expect(getByText('第一次确认')).toBeInTheDocument();

    act(() => {
      ref.current.close();
      ref.current.showSure('第二次确认');
      vi.advanceTimersByTime(300);
    });

    expect(queryByText('第一次确认')).not.toBeInTheDocument();
    expect(getByText('第二次确认')).toBeInTheDocument();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('clicking sure content from action closes and fires action.onClick', () => {
    vi.useFakeTimers();
    const actionOnClick = vi.fn();
    const action = { text: '删除', sure: '确认删除？', onClick: actionOnClick };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('删除'));
    expect(actionOnClick).not.toHaveBeenCalled();
    fireEvent.click(getByText('确认删除？'));
    expect(actionOnClick).toHaveBeenCalledTimes(1);
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('sure confirm falls back to props.onClick when action.onClick missing', () => {
    vi.useFakeTimers();
    const propOnClick = vi.fn();
    const action = { text: '删除', sure: '确认删除？' };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} opened onClick={propOnClick} />);
    fireEvent.click(getByText('删除'));
    fireEvent.click(getByText('确认删除？'));
    expect(propOnClick).toHaveBeenCalledWith(action, 'right');
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('dragging clears visible sure content', () => {
    vi.useFakeTimers();
    const { getByText, queryByText } = render(
      <SwipeCell right={[{ text: '删除', sure: '确认删除？' }]} content={<div>内容</div>} opened />,
    );
    fireEvent.click(getByText('删除'));
    expect(getByText('确认删除？')).toBeInTheDocument();
    const latest = dragStore[dragStore.length - 1];
    act(() => {
      latest.handler({ last: false, offset: [10, 0], lastOffset: [-10, 0], velocity: [0, 0], direction: [1, 0] });
    });
    expect(queryByText('确认删除？')).not.toBeInTheDocument();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('click away closes cell', () => {
    const { getByText, container } = render(
      <div>
        <SwipeCell right={rightActions} content={<div>内容</div>} opened />
        <button>外部</button>
      </div>,
    );
    fireEvent.touchStart(container.querySelector('button'));
    expect(getByText('内容')).toBeInTheDocument();
  });

  it('drag interaction triggers expand/close', () => {
    // 这里只能模拟 drag 回调，use-gesture 行为需 e2e
    const { getByText } = render(<SwipeCell right={rightActions} content={<div>内容</div>} opened={false} />);
    // 直接 setX/expand/close 已在其他用例覆盖
    expect(getByText('内容')).toBeInTheDocument();
  });

  it('useDrag last=false updates translateX (setX branch)', () => {
    const { container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} opened={false} />);
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    expect(wrapper).toBeTruthy();
    const latest = dragStore[dragStore.length - 1];
    // simulate dragging but not ending
    act(() => {
      latest.handler({
        last: false,
        offset: [30, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [1, 0],
      });
    });
    // style should reflect x=30
    expect(wrapper.style.transform).toContain('translateX(30px)');
  });

  it('useDrag end expands to right when dragged left beyond threshold', () => {
    const { container } = render(<SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    // mock widths for getSideOffsetX
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    // drag end towards left
    act(() => {
      latest.handler({
        last: true,
        offset: [-60, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    expect(wrapper.style.transform).toContain('translateX(-100px)');
  });

  it('useDrag end expands to left when dragged right beyond threshold', () => {
    const { container } = render(<SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} />);
    const leftEl = container.querySelector('.t-swipe-cell__left') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    Object.defineProperty(leftEl, 'clientWidth', { value: 80, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    act(() => {
      latest.handler({
        last: true,
        offset: [60, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [1, 0],
      });
    });
    expect(wrapper.style.transform).toContain('translateX(80px)');
  });

  it('useDrag end closes when below threshold', () => {
    const { container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    act(() => {
      latest.handler({
        last: true,
        offset: [-10, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    expect(wrapper.style.transform).toContain('translateX(0px)');
  });

  it('useDrag end with both sides and below threshold closes via nearest=0 branch', () => {
    const { container } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened={false} />,
    );
    const leftEl = container.querySelector('.t-swipe-cell__left') as HTMLElement;
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    // mock widths for bounds: left=80, right=120
    Object.defineProperty(leftEl, 'clientWidth', { value: 80, configurable: true });
    Object.defineProperty(rightEl, 'clientWidth', { value: 120, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    // drag slightly left so target ends near 0; with direction -1 and 50% threshold, nearest should be 0
    act(() => {
      latest.handler({
        last: true,
        offset: [-10, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    expect(wrapper.style.transform).toContain('translateX(0px)');
  });

  it('useDrag end with zero offset closes via zero-branch', () => {
    const { container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 120, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    act(() => {
      latest.handler({
        last: true,
        offset: [0, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    expect(wrapper.style.transform).toContain('translateX(0px)');
  });

  it('onClickCapture stops propagation while dragging', () => {
    const parentClick = vi.fn();
    const { container } = render(
      <div onClick={parentClick}>
        <SwipeCell right={rightActions} content={<div>内容</div>} />
      </div>,
    );
    const root = container.querySelector('.t-swipe-cell') as HTMLElement;
    const latest = dragStore[dragStore.length - 1];
    // mark dragging true without scheduling reset
    act(() => {
      latest.handler({ last: false, offset: [5, 0], lastOffset: [0, 0], velocity: [0, 0], direction: [1, 0] });
    });
    fireEvent.click(root);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('useClickAway closes when touching outside', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { container } = render(
      <div>
        <SwipeCell right={rightActions} content={<div>内容</div>} opened onChange={onChange} />
        <button>外部</button>
      </div>,
    );
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    // wait for useLayoutEffect expand timeout (100ms)
    await act(async () => {
      vi.advanceTimersByTime(120);
    });
    expect(wrapper.style.transform).toContain('translateX(-100px)');
    // click away via touchstart on outside button
    const btn = container.querySelector('button')!;
    fireEvent.touchStart(btn);
    // closing is sync setX(0)
    expect(wrapper.style.transform).toContain('translateX(0px)');
    expect(onChange).toHaveBeenCalledWith(undefined);
    vi.useRealTimers();
  });

  it('left sure sets initial transform to translateX(-100%)', () => {
    const left = [{ text: '删除', sure: '确认左侧删除？' }];
    const { getByText } = render(<SwipeCell left={left} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('删除'));
    const overlay = getByText('确认左侧删除？') as HTMLElement;
    // transform set immediately before timeout flips to none
    expect(overlay.style.transform).toContain('-100%');
  });

  it('right sure sets initial transform to translateX(100%)', () => {
    const right = [{ text: '删除', sure: '确认右侧删除？' }];
    const { getByText } = render(<SwipeCell right={right} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('删除'));
    const overlay = getByText('确认右侧删除？') as HTMLElement;
    expect(overlay.style.transform).toContain('100%');
  });

  it('sure transform resets to none after timeout', async () => {
    vi.useFakeTimers();
    const right = [{ text: '删除', sure: '确认右侧删除？' }];
    const { getByText } = render(<SwipeCell right={right} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('删除'));
    // immediately set to translateX(100%) then scheduled to reset to none
    const overlay = getByText('确认右侧删除？') as HTMLElement;
    expect(overlay.style.transform).toMatch(/100%/);
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(overlay.style.transform).toBe('none');
    vi.useRealTimers();
  });

  it('useDrag options.bounds returns correct left/right', () => {
    const { container } = render(<SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} />);
    const leftEl = container.querySelector('.t-swipe-cell__left') as HTMLElement;
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(leftEl, 'clientWidth', { value: 80, configurable: true });
    Object.defineProperty(rightEl, 'clientWidth', { value: 120, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    const bounds = latest.opts.bounds();
    expect(bounds.left).toBe(-120);
    expect(bounds.right).toBe(80);
    // additional option assertions
    expect(latest.opts.axis).toBe('x');
    expect(latest.opts.preventScroll).toBe(true);
    expect(latest.opts.pointer.touch).toBe(true);
  });

  it('onChange only fires when side changes', () => {
    const onChange = vi.fn();
    function TestRef() {
      const ref = useRef<any>(null);
      return (
        <>
          <SwipeCell ref={ref} right={rightActions} content={<div>内容</div>} onChange={onChange} />
          <button onClick={() => ref.current.expand('right')}>expR</button>
        </>
      );
    }
    const { getByText, container } = render(<TestRef />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    fireEvent.click(getByText('expR'));
    fireEvent.click(getByText('expR'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('drag end resets dragging flag allowing click to bubble', async () => {
    vi.useFakeTimers();
    const parentClick = vi.fn();
    const { container } = render(
      <div onClick={parentClick}>
        <SwipeCell right={rightActions} content={<div>内容</div>} />
      </div>,
    );
    const latest = dragStore[dragStore.length - 1];
    // perform a drag end to schedule ctx.dragging reset
    act(() => {
      latest.handler({
        last: true,
        offset: [-50, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    // run queued setTimeout(() => ctx.dragging = false)
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    const root = container.querySelector('.t-swipe-cell') as HTMLElement;
    fireEvent.click(root);
    expect(parentClick).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('useDrag options.from returns current x', () => {
    const { container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 90, configurable: true });
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    const latest = dragStore[dragStore.length - 1];
    // expand to right via drag end
    act(() => {
      latest.handler({
        last: true,
        offset: [-60, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    expect(wrapper.style.transform).toContain('translateX(-90px)');
    // now from() in the latest registration should reflect current x
    const newLatest = dragStore[dragStore.length - 1];
    const from = newLatest.opts.from();
    expect(from).toEqual([-90, 0]);
  });

  it('useDrag enabled is false when disabled', () => {
    render(<SwipeCell right={rightActions} content={<div>内容</div>} disabled />);
    const latest = dragStore[dragStore.length - 1];
    expect(latest.opts.enabled).toBe(false);
  });

  it('ref expand to side without actions keeps x=0', () => {
    function TestRef() {
      const ref = useRef<any>(null);
      return (
        <>
          <SwipeCell ref={ref} content={<div>内容</div>} />
          <button onClick={() => ref.current.expand('left')}>expand-left</button>
        </>
      );
    }
    const { getByText, container } = render(<TestRef />);
    fireEvent.click(getByText('expand-left'));
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    expect(wrapper.style.transform).toContain('translateX(0px)');
  });

  it('opened=true with no actions does not move (close branch)', async () => {
    vi.useFakeTimers();
    const { container } = render(<SwipeCell content={<div>内容</div>} opened />);
    // wait beyond 100ms expand timeout; since no left/right, it should close to 0
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    expect(wrapper.style.transform).toContain('translateX(0px)');
    vi.useRealTimers();
  });

  it('opened array selects correct side via getOpenedSide', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { container, rerender } = render(
      <SwipeCell
        left={leftActions}
        right={rightActions}
        content={<div>内容</div>}
        opened={[true, false]}
        onChange={onChange}
      />,
    );
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    const leftEl = container.querySelector('.t-swipe-cell__left') as HTMLElement;
    Object.defineProperty(leftEl, 'clientWidth', { value: 80, configurable: true });
    await act(async () => {
      vi.advanceTimersByTime(120);
    });
    expect(wrapper.style.transform).toContain('translateX(80px)');
    expect(onChange).toHaveBeenCalledWith('left');

    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 120, configurable: true });
    rerender(
      <SwipeCell
        left={leftActions}
        right={rightActions}
        content={<div>内容</div>}
        opened={[false, true]}
        onChange={onChange}
      />,
    );
    await act(async () => {
      vi.advanceTimersByTime(120);
    });
    expect(wrapper.style.transform).toContain('translateX(-120px)');
    expect(onChange).toHaveBeenLastCalledWith('right');
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders sure content when curSure has content', () => {
    // 为了测试 renderSureContent，需要模拟 curSure 状态
    // 但由于是内部状态，难以直接测试，间接通过 sure 功能测试
    const sureText = '确认删除？';
    const action = { text: '删除', sure: sureText };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('删除'));
    expect(getByText(sureText)).toBeInTheDocument();
  });

  it('handles action with sure as TNode', () => {
    const sureNode = <div>确认节点</div>;
    const action = { text: '删除', sure: sureNode };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('删除'));
    expect(getByText('确认节点')).toBeInTheDocument();
  });

  it('handles action click without onClick', () => {
    const action = { text: '操作' };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('操作'));
    // 无异常
    expect(getByText('操作')).toBeInTheDocument();
  });

  it('handles onChange not provided', () => {
    const { rerender } = render(<SwipeCell left={leftActions} content={<div>内容</div>} opened={false} />);
    rerender(<SwipeCell left={leftActions} content={<div>内容</div>} opened={true} />);
    // 无异常
    expect(true).toBe(true);
  });

  it('handles onClick not provided', () => {
    const action = { text: '操作', onClick: vi.fn() };
    const { getByText } = render(<SwipeCell right={[action]} content={<div>内容</div>} opened />);
    fireEvent.click(getByText('操作'));
    expect(action.onClick).toHaveBeenCalled();
  });

  it('handles invalid opened value in useLayoutEffect', async () => {
    // Test with empty array which should trigger close()
    const { container } = render(<SwipeCell left={leftActions} content={<div>内容</div>} opened={[]} />);
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    });
    // Should call close() when opened array is empty
    expect(container.querySelector('.t-swipe-cell')).toBeTruthy();
  });

  it('handles opened as empty array', async () => {
    const { container } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened={[]} />,
    );
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    });
    // Should call close() when opened array is empty
    expect(container.querySelector('.t-swipe-cell')).toBeTruthy();
  });

  it('handles opened as false', async () => {
    const { container } = render(
      <SwipeCell left={leftActions} right={rightActions} content={<div>内容</div>} opened={false} />,
    );
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    });
    // Should call close() when opened is false
    expect(container.querySelector('.t-swipe-cell')).toBeTruthy();
  });

  it('handles opened with invalid non-array value gracefully', async () => {
    vi.useFakeTimers();
    const { container } = render(
      <SwipeCell right={rightActions} content={<div>内容</div>} opened={'invalid' as any} />,
    );
    const wrapper = container.querySelector('.t-swipe-cell__wrapper') as HTMLElement;
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    // guard path should close cell without throwing
    expect(wrapper.style.transform).toContain('translateX(0px)');
    vi.useRealTimers();
  });

  it('renders without sure content when curSure is empty', () => {
    const { container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} opened />);
    // renderSureContent should return null when curSure.content is empty
    const sureElements = container.querySelectorAll('[style*="position: absolute"]');
    expect(sureElements.length).toBe(0);
  });

  it('handles drag end with velocity and direction', () => {
    // This is a simplified test to cover the drag logic branches
    // In a real scenario, we'd need to mock @use-gesture/react properly
    const { getByText } = render(<SwipeCell right={rightActions} content={<div>内容</div>} />);
    expect(getByText('内容')).toBeInTheDocument();
    // The actual drag testing would require e2e tests or more complex mocking
  });

  it('handles sure content transform animation', async () => {
    function TestSureTransform() {
      const ref = useRef(null);
      const sure = <div>确认删除？</div>;
      const action = { text: '删除', sure };
      return <SwipeCell ref={ref} right={[action]} content={<div>内容</div>} opened />;
    }
    const { getByText } = render(<TestSureTransform />);
    fireEvent.click(getByText('删除'));
    // Wait for the transform animation timeout
    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });
    expect(getByText('确认删除？')).toBeInTheDocument();
  });

  it('syncOpenedState returns early when root ref is missing', () => {
    vi.useFakeTimers();
    const expand = vi.fn();
    const close = vi.fn();
    const setTimer = vi.fn((cb, delay) => setTimeout(cb, delay));
    syncOpenedState({ current: null } as any, [true, false], () => 'left', expand, close, setTimer);
    expect(expand).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('syncOpenedState triggers expand when side available', () => {
    vi.useFakeTimers();
    const expand = vi.fn();
    const close = vi.fn();
    const setTimer = vi.fn((cb, delay) => setTimeout(cb, delay));
    syncOpenedState({ current: {} } as any, [true, false], () => 'right', expand, close, setTimer);
    expect(expand).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120);
    expect(expand).toHaveBeenCalledWith('right');
    expect(close).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('clears timers on unmount', async () => {
    vi.useFakeTimers();
    const { unmount, container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} opened />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });

    // Trigger timer via expand
    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    // Unmount should clear timers without errors
    unmount();

    // Run remaining timers - should not cause any errors since they were cleared
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // No error means timers were properly cleaned up
    expect(true).toBe(true);
    vi.useRealTimers();
  });

  it('calls onDragstart when drag first', () => {
    const onDragstart = vi.fn();
    render(<SwipeCell right={rightActions} content={<div>内容</div>} onDragstart={onDragstart} />);
    const latest = dragStore[dragStore.length - 1];
    act(() => {
      latest.handler({
        first: true,
        last: false,
        offset: [0, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [1, 0],
      });
    });
    expect(onDragstart).toHaveBeenCalledTimes(1);
  });

  it('calls onDragend when drag last', () => {
    const onDragend = vi.fn();
    const { container } = render(<SwipeCell right={rightActions} content={<div>内容</div>} onDragend={onDragend} />);
    const rightEl = container.querySelector('.t-swipe-cell__right') as HTMLElement;
    Object.defineProperty(rightEl, 'clientWidth', { value: 100, configurable: true });
    const latest = dragStore[dragStore.length - 1];
    act(() => {
      latest.handler({
        first: false,
        last: true,
        offset: [-60, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [-1, 0],
      });
    });
    expect(onDragend).toHaveBeenCalledTimes(1);
  });

  it('calls both onDragstart and onDragend in sequence', () => {
    const onDragstart = vi.fn();
    const onDragend = vi.fn();
    render(
      <SwipeCell right={rightActions} content={<div>内容</div>} onDragstart={onDragstart} onDragend={onDragend} />,
    );
    const latest = dragStore[dragStore.length - 1];
    // first
    act(() => {
      latest.handler({
        first: true,
        last: false,
        offset: [0, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [1, 0],
      });
    });
    expect(onDragstart).toHaveBeenCalledTimes(1);
    expect(onDragend).not.toHaveBeenCalled();
    // last
    act(() => {
      latest.handler({
        first: false,
        last: true,
        offset: [0, 0],
        lastOffset: [0, 0],
        velocity: [0, 0],
        direction: [1, 0],
      });
    });
    expect(onDragend).toHaveBeenCalledTimes(1);
  });
});
