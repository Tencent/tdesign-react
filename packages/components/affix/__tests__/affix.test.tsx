import React from 'react';
import { render, describe, vi, mockTimeout, fireEvent } from '@test/utils';
import Affix from '../index';

describe('Affix 组件测试', () => {
  const mockFn = vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect');
  const mockScrollTo = async (top: number) => {
    mockFn.mockImplementation(() => ({
      top,
      bottom: 0,
      left: 0,
      right: 0,
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
  };

  beforeEach(async () => {
    await mockScrollTo(0);
  });

  test('render perfectly', async () => {
    const { queryByText } = render(
      <Affix>
        <div>固钉</div>
      </Affix>,
    );

    expect(queryByText('固钉')).toBeInTheDocument();
  });

  test('className', async () => {
    const { container } = render(
      <Affix className="custom-class-name">
        <div>固钉</div>
      </Affix>,
    );

    const affixElement = container.querySelector('.custom-class-name');
    expect(affixElement).not.toBeNull();
    expect(affixElement?.className).toContain('custom-class-name');
  });

  test('style', async () => {
    const { container } = render(
      <Affix style={{ background: 'red' }} className="custom-class-name">
        <div>固钉</div>
      </Affix>,
    );
    const affixElement = container.querySelector('.custom-class-name');
    expect(affixElement).not.toBeNull();
    expect((affixElement as HTMLElement)?.style.background).toBe('red');
  });

  test('content', async () => {
    const Children = () => <div>固钉</div>;
    const { queryByText } = render(<Affix content={<Children />} />);
    expect(queryByText('固钉')).toBeInTheDocument();
  });

  test('offsetTop trigger onFixedChange and zIndex', async () => {
    const onFixedChangeMock = vi.fn();

    const { getByText } = render(
      <Affix offsetTop={20} onFixedChange={onFixedChangeMock} zIndex={2}>
        <div>固钉</div>
      </Affix>,
    );

    // 默认
    expect(onFixedChangeMock).toHaveBeenCalledTimes(0);
    expect(getByText('固钉').parentNode).not.toHaveClass('t-affix');
    expect(getByText('固钉').parentElement?.style.zIndex).toBe('');

    // offsetTop
    await mockScrollTo(30);
    await mockScrollTo(10);
    await mockTimeout(() => false, 200);

    Object.defineProperty(window, 'scrollTop', { value: 50, writable: true });
    await fireEvent.scroll(window);

    expect(onFixedChangeMock).toHaveBeenCalledTimes(1);

    expect(getByText('固钉').parentNode).toHaveClass('t-affix');
    expect(getByText('固钉').parentElement?.style.zIndex).toBe('2');
  });

  test('offsetBottom  trigger onFixedChange and zIndex', async () => {
    const onFixedChangeMock = vi.fn();

    const { getByText } = render(
      <Affix offsetBottom={20} offsetTop={20} onFixedChange={onFixedChangeMock} zIndex={2}>
        <div>固钉</div>
      </Affix>,
    );
    // 默认
    expect(onFixedChangeMock).toHaveBeenCalledTimes(0);
    expect(getByText('固钉').parentNode).not.toHaveClass('t-affix');
    expect(getByText('固钉').parentElement?.style.zIndex).toBe('');

    // offsetBottom
    await mockScrollTo(30);
    await mockScrollTo(10);
    await mockTimeout(() => false, 200);

    Object.defineProperty(window, 'scrollTop', { value: 50, writable: true });
    await fireEvent.scroll(window);

    expect(onFixedChangeMock).toHaveBeenCalledTimes(1);

    expect(getByText('固钉').parentNode).toHaveClass('t-affix');
    expect(getByText('固钉').parentElement?.style.zIndex).toBe('2');
  });

  test('offsetTop and offsetBottom trigger onFixedChange and zIndex', async () => {
    const onFixedChangeMock = vi.fn();

    const { getByText } = render(
      <Affix offsetBottom={20} offsetTop={20} onFixedChange={onFixedChangeMock} zIndex={2}>
        <div>固钉</div>
      </Affix>,
    );
    // 默认
    expect(onFixedChangeMock).toHaveBeenCalledTimes(0);
    expect(getByText('固钉').parentNode).not.toHaveClass('t-affix');
    expect(getByText('固钉').parentElement?.style.zIndex).toBe('');

    // offsetTop
    await mockScrollTo(30);
    await mockScrollTo(10);
    await mockTimeout(() => false, 200);
    Object.defineProperty(window, 'scrollTop', { value: 50, writable: true });
    await fireEvent.scroll(window);
    expect(onFixedChangeMock).toHaveBeenCalledTimes(1);

    //  offsetBottom
    await mockScrollTo(30);
    await mockScrollTo(10);
    await mockTimeout(() => false, 200);

    Object.defineProperty(window, 'scrollTop', { value: 50, writable: true });
    await fireEvent.scroll(window);

    expect(onFixedChangeMock).toHaveBeenCalledTimes(2);

    expect(getByText('固钉').parentNode).toHaveClass('t-affix');
    expect(getByText('固钉').parentElement?.style.zIndex).toBe('2');
  });
});
