import React from 'react';
import { testExamples, render, act, fireEvent, waitFor } from '@test/utils';
import Tooltip from '../Tooltip';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Tooltip 组件测试', () => {
  const tooltipText = '弹出层内容';
  const tooltipTestId = 'tooltip-test-id';
  const triggerElement = '触发元素';

  test('hover 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Tooltip placement="top" content={<div data-testid={tooltipTestId}>{tooltipText}</div>}>
        {triggerElement}
      </Tooltip>,
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(tooltipTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 tooltipText
    const popupElement2 = await waitFor(() => queryByTestId(tooltipTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(tooltipText);
    expect(popupElement2.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标离开
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(tooltipTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentElement.parentElement).toHaveClass('t-popup_animation-leave-to');
  });
});
