import React from 'react';
import { fireEvent, mockTimeout, render, screen, waitFor } from '@test/utils';

import Tooltip from '../Tooltip';

import type { TdTooltipProps } from '../type';

describe('Tooltip', () => {
  const tooltipText = '弹出层内容';
  const tooltipTestId = 'tooltip-test-id';
  const triggerElement = '触发元素';

  function getTooltip() {
    return screen.queryByTestId(tooltipTestId)?.parentNode?.parentNode as HTMLDivElement;
  }

  async function renderWithProps(props: TdTooltipProps) {
    const ref = {
      current: null,
    };
    const result = render(
      <Tooltip content={<div data-testid={tooltipTestId}>{tooltipText}</div>} {...props} ref={ref}>
        {props.children || triggerElement}
      </Tooltip>,
    );

    await fireEvent.mouseEnter(result.getByText(triggerElement));
    await waitFor(() => result.queryByTestId(tooltipTestId));

    return {
      ...result,
      mouseLeave: () => {
        fireEvent.mouseLeave(result.getByText(triggerElement));
      },
      ref,
    };
  }

  describe('props', () => {
    (['primary', 'light'] as TdTooltipProps['theme'][]).forEach((theme) => {
      test(`theme[${theme}]`, async () => {
        await renderWithProps({ theme });
        expect(getTooltip()).toHaveClass(`t-tooltip--${theme}`);
      });
    });

    [true, false].forEach((showArrow) => {
      test(`showArrow[${showArrow}]`, async () => {
        await renderWithProps({ showArrow });
        const arrow = getTooltip().querySelector('.t-popup__content--arrow');
        if (showArrow) {
          expect(arrow).not.toBeNull();
        } else {
          expect(arrow).toBeNull();
        }
      });
    });

    test('duration[number]', async () => {
      const { ref } = await renderWithProps({
        duration: 1000,
      });

      ref.current.setVisible(true);

      expect(getTooltip()).toBeTruthy();

      await mockTimeout(() => expect(getTooltip()).toBeFalsy(), 1500);
    });

    (['bottom', 'left'] as TdTooltipProps['placement'][]).forEach((placement) => {
      test(`placement[${placement}]`, async () => {
        await renderWithProps({ placement });
        expect(getTooltip().dataset.popperPlacement).toEqual(placement);
      });
    });

    [true, false].forEach((destroyOnClose) => {
      test(`destroyOnClose[${destroyOnClose}]`, async () => {
        const { mouseLeave } = await renderWithProps({ destroyOnClose });
        expect(getTooltip()).toBeTruthy();
        mouseLeave();
        if (!destroyOnClose) {
          expect(getTooltip()).toBeTruthy();
          return;
        }
        await mockTimeout(() => expect(getTooltip()).toBeFalsy());
      });
    });
  });

  describe('events', () => {
    test('trigger[hover]', async () => {
      const { getByText, queryByTestId } = render(
        <Tooltip placement="top" destroyOnClose={false} content={<div data-testid={tooltipTestId}>{tooltipText}</div>}>
          {triggerElement}
        </Tooltip>,
      );

      expect(queryByTestId(tooltipTestId)).toBeNull();

      await fireEvent.mouseEnter(getByText(triggerElement));

      const popupElement = queryByTestId(tooltipTestId);
      expect(popupElement).not.toBeNull();
      expect(popupElement).toHaveTextContent(tooltipText);
      expect(popupElement.parentElement).toHaveStyle({
        display: 'block',
      });

      await fireEvent.mouseLeave(getByText(triggerElement));

      const popupElement2 = queryByTestId(tooltipTestId);
      expect(popupElement2).not.toBeNull();
      expect(getTooltip()).toHaveClass('t-popup--animation-leave-active');
    });
  });
});
