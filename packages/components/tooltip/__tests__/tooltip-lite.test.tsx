import React from 'react';
import { act, fireEvent, render } from '@test/utils';

import TooltipLite from '../TooltipLite';

describe('TooltipLite 组件测试', () => {
  const triggerText = '触发元素';
  const contentText = '气泡提示内容';

  test('基础 hover 触发与内容渲染', async () => {
    const { getByText, queryByText } = render(
      <TooltipLite content={contentText}>
        <button>{triggerText}</button>
      </TooltipLite>,
    );

    // 初始状态下内容不存在
    expect(queryByText(contentText)).toBeNull();

    // 模拟鼠标进入
    await act(async () => {
      fireEvent.mouseEnter(getByText(triggerText));
    });

    // 鼠标进入后内容出现
    const tipContent = queryByText(contentText);
    expect(tipContent).not.toBeNull();
    expect(tipContent.closest('.t-tooltip')).toHaveClass('t-popup');

    // 模拟鼠标离开
    await act(async () => {
      fireEvent.mouseLeave(getByText(triggerText));
    });
  });

  test('triggerElement prop 支持', async () => {
    const { getByText, queryByText } = render(
      <TooltipLite triggerElement={<span>{triggerText}</span>} content={contentText} />,
    );

    await act(async () => {
      fireEvent.mouseEnter(getByText(triggerText));
    });

    expect(queryByText(contentText)).not.toBeNull();
  });

  test('theme 与 showShadow 支持', async () => {
    const { getByText, queryByText, rerender } = render(
      <TooltipLite theme="light" showShadow={false} content={contentText}>
        <span>{triggerText}</span>
      </TooltipLite>,
    );

    await act(async () => {
      fireEvent.mouseEnter(getByText(triggerText));
    });

    const popupNode = queryByText(contentText)?.closest('.t-tooltip');
    expect(popupNode).toHaveClass('t-tooltip--light');
    expect(popupNode).toHaveClass('t-tooltip--noshadow');

    // 切回 default 主题且显示阴影
    rerender(
      <TooltipLite theme="default" showShadow={true} content={contentText}>
        <span>{triggerText}</span>
      </TooltipLite>,
    );
    expect(popupNode).toHaveClass('t-tooltip--default');
    expect(popupNode).not.toHaveClass('t-tooltip--noshadow');
  });

  test('showArrow 支持', async () => {
    const { getByText } = render(
      <TooltipLite showArrow={true} placement="top" content={contentText}>
        <span>{triggerText}</span>
      </TooltipLite>,
    );

    await act(async () => {
      fireEvent.mouseEnter(getByText(triggerText));
    });

    expect(document.querySelector('.t-popup__arrow')).not.toBeNull();
  });

  test('placement: mouse 跟随定位支持', async () => {
    const { getByText, queryByText } = render(
      <TooltipLite placement="mouse" content={contentText}>
        <span>{triggerText}</span>
      </TooltipLite>,
    );

    const triggerNode = getByText(triggerText);

    await act(async () => {
      fireEvent.mouseMove(triggerNode, { clientX: 100, clientY: 100 });
      fireEvent.mouseEnter(triggerNode, { clientX: 100, clientY: 100 });
    });

    const popupNode = queryByText(contentText)?.closest('.t-tooltip') as HTMLElement;
    expect(popupNode).not.toBeNull();
    expect(popupNode.dataset.popperPlacement).toEqual('mouse');
  });
});
