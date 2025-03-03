import React from 'react';
import { render, describe, vi, mockTimeout } from '@test/utils';
import Affix from '../index';

describe('Affix 组件测试', () => {
  const mockFn = vi.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect');
  const mockScrollTo = async (top: number) => {
    mockFn.mockImplementation(() => ({ top, bottom: 0 }));
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
    const onFixedChangeMock = vi.fn();

    const { getByText } = render(
      <Affix offsetTop={-1} onFixedChange={onFixedChangeMock} zIndex={2}>
        <div>固钉</div>
      </Affix>,
    );

    expect(onFixedChangeMock).toBeCalledTimes(0);
    expect(getByText('固钉').parentNode).not.toHaveClass('t-affix');
    expect(getByText('固钉').parentElement.style.zIndex).toBe('');

    await mockScrollTo(-10);

    await mockTimeout(() => false, 200);
    expect(onFixedChangeMock).toHaveBeenCalledTimes(1);
    expect(getByText('固钉').parentNode).toHaveClass('t-affix');
    expect(getByText('固钉').parentElement.style.zIndex).toBe('2');
  });
});
