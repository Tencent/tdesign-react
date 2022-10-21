import React from 'react';
import { render, fireEvent, waitFor, screen, mockTimeout } from '@test/utils';
import Tooltip from '../Tooltip';
import { TdTooltipProps } from '../type';

describe('Tooltip 组件测试', () => {
  const tooltipText = '弹出层内容';
  const tooltipTestId = 'tooltip-test-id';
  const triggerElement = '触发元素';

  function getTooltip() {
    return screen.queryByTestId(tooltipTestId)?.parentNode?.parentNode as HTMLDivElement;
  }

  test('hover 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Tooltip placement="top" destroyOnClose={false} content={<div data-testid={tooltipTestId}>{tooltipText}</div>}>
        {triggerElement}
      </Tooltip>,
    );

    // 鼠标进入前，没有元素存在
    expect(queryByTestId(tooltipTestId)).toBeNull();

    // 模拟鼠标进入
    fireEvent.mouseEnter(getByText(triggerElement));

    // 鼠标进入后，有元素，而且内容为 tooltipText
    const popupElement = queryByTestId(tooltipTestId);
    expect(popupElement).not.toBeNull();
    expect(popupElement).toHaveTextContent(tooltipText);
    expect(popupElement.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标离开
    fireEvent.mouseLeave(getByText(triggerElement));

    // 鼠标离开，style 的 display 应该为 none
    const popupElement2 = queryByTestId(tooltipTestId);
    expect(popupElement2).not.toBeNull();
    expect(getTooltip()).toHaveClass('t-popup--animation-leave-active');
  });

  describe('props', () => {
    async function renderWithProps(props: TdTooltipProps) {
      const ref = {
        current: null,
      };
      const result = render(
        <Tooltip content={<div data-testid={tooltipTestId}>{tooltipText}</div>} {...props} ref={ref}>
          {props.children || triggerElement}
        </Tooltip>,
      );

      fireEvent.mouseEnter(result.getByText(triggerElement));
      await waitFor(() => result.queryByTestId(tooltipTestId));

      return {
        ...result,
        rerender: (props: TdTooltipProps) => {
          result.rerender(
            <Tooltip content={<div data-testid={tooltipTestId}>{tooltipText}</div>} {...props}>
              {props.children || triggerElement}
            </Tooltip>,
          );
        },
        mouseLeave: () => {
          fireEvent.mouseLeave(result.getByText(triggerElement));
        },
        ref,
      };
    }

    test('theme', async () => {
      const { rerender } = await renderWithProps({
        theme: 'primary',
      });
      expect(getTooltip()).toHaveClass('t-tooltip--primary');

      rerender({ theme: 'light' });
      expect(getTooltip()).toHaveClass('t-tooltip--light');
    });

    test('showArrow', async () => {
      const { rerender } = await renderWithProps({
        showArrow: true,
      });

      expect(getTooltip().querySelector('.t-popup__content--arrow')).not.toBeNull();
      rerender({ showArrow: false });
      expect(getTooltip().querySelector('.t-popup__content--arrow')).toBeNull();
    });

    test('duration', async () => {
      const { ref } = await renderWithProps({
        duration: 1000,
      });

      ref.current.setVisible(true);

      expect(getTooltip()).toBeTruthy();

      await mockTimeout(() => expect(getTooltip()).toBeFalsy(), 1500);
    });

    describe('placement', () => {
      test('placement: bottom', async () => {
        await renderWithProps({
          placement: 'bottom',
        });
        expect(getTooltip().dataset.popperPlacement).toEqual('bottom');
      });

      test('placement: left', async () => {
        await renderWithProps({
          placement: 'left',
        });
        expect(getTooltip().dataset.popperPlacement).toEqual('left');
      });
    });

    describe('destroyOnClose', () => {
      test('destroyOnClose: true', async () => {
        const { mouseLeave } = await renderWithProps({
          destroyOnClose: true,
        });
        expect(getTooltip()).toBeTruthy();
        mouseLeave();
        await mockTimeout(() => expect(getTooltip()).toBeFalsy());
      });

      test('destroyOnClose: false', async () => {
        const { mouseLeave } = await renderWithProps({
          destroyOnClose: false,
        });
        expect(getTooltip()).toBeTruthy();
        mouseLeave();
        expect(getTooltip()).toBeTruthy();
      });
    });
  });
});
