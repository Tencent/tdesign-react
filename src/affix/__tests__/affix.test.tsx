import React from 'react';
import { act, render, testExamples } from '@test/utils';
import Affix from '../index';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Affix 组件测试', () => {
  const mockFn = jest.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect');
  const mockScrollTo = async (top: number) => {
    mockFn.mockImplementation(
      () =>
        ({
          top,
          bottom: 0,
        } as DOMRect),
    );
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
  test('offsetTop and onFixedChange and zIndex', async () => {
    const onFixedChangeMock = jest.fn();

    const { getByText } = render(
      <Affix offsetTop={-1} onFixedChange={onFixedChangeMock} zIndex={2}>
        <div>固钉</div>
      </Affix>,
    );

    expect(onFixedChangeMock).toBeCalledTimes(0);
    expect(getByText('固钉').parentNode).not.toHaveClass('t-affix');
    expect(getByText('固钉').parentElement.style.zIndex).toBe('');

    await mockScrollTo(-10);

    setTimeout(() => {
      expect(onFixedChangeMock).toHaveBeenCalledTimes(1);
      expect(getByText('固钉').parentNode).toHaveClass('t-affix');
      expect(getByText('固钉').parentElement.style.zIndex).toBe('2');
    }, 20);
    act(() => {
      jest.runAllTimers();
    });
  });
});
