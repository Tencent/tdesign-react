import { act, describe, expect, fireEvent, it, render, vi } from '@test/utils';
import React from 'react';

import { Color, getColorObject } from '../../_common/js/color-picker';
import ColorPicker, { ColorPickerProps } from '../index';
import { TypeEnum } from '../type';

const prefix = 't';
const name = `.${prefix}-color-picker`;

const makeTouch = (
  el: Element,
  eventName: string,
  touchPosition?: { clientX?: number; clientY?: number; pageX?: number; pageY?: number },
) => {
  const touchInit = {
    changedTouches: [
      new Touch({
        identifier: 0,
        target: el,
        clientX: touchPosition?.clientX || 0,
        clientY: touchPosition?.clientY || 0,
        pageX: touchPosition?.pageX || 0,
        pageY: touchPosition?.pageY || 0,
      }),
    ],
    bubbles: true,
    cancelable: true,
  };

  const event = new TouchEvent(eventName, touchInit);
  el.dispatchEvent(event);
};

const mockBoundingClientRect = (info) => {
  window.HTMLElement.prototype.getBoundingClientRect = () => info;
};

const renderColorPicker = (props: ColorPickerProps) => render(<ColorPicker {...props} />);

describe('ColorPicker', () => {
  describe('props', () => {
    it(': multiple', () => {
      const testCurrentProp = (type: TypeEnum, target: number) => {
        const { container } = renderColorPicker({ type });
        const dom = container.querySelectorAll(`${name}__saturation`);
        expect(dom).toHaveLength(target);
      };
      testCurrentProp(undefined, 0);
      testCurrentProp('base', 0);
      testCurrentProp('multiple', 1);
    });

    it(': enableAlpha', () => {
      const testEnableAlpha = (enableAlpha: boolean) => {
        const { container } = renderColorPicker({ enableAlpha, type: 'multiple' });
        const alphaDom = container.querySelectorAll(`${name}__slider-wrapper--alpha-type`);
        expect(alphaDom).toHaveLength(enableAlpha ? 1 : 0);
      };
      testEnableAlpha(false);
      testEnableAlpha(true);
    });

    it(': swatchColors', () => {
      const testSwatchColors = (swatchColors: Array<string> | null, target: number) => {
        const { container } = renderColorPicker({ swatchColors });
        const dom = container.querySelectorAll(`${name}__swatches-item`);
        expect(dom).toHaveLength(target);
      };
      testSwatchColors(null, 0);
      testSwatchColors([], 0);
      testSwatchColors(undefined, 10);
      testSwatchColors(['red', 'blur'], 2);
    });

    it(': format', () => {
      const testFormat = (format: string, target: string) => {
        const { container } = renderColorPicker({ format: format as ColorPickerProps['format'], type: 'multiple' });
        const dom = container.querySelector(`${name}__format-item--first`);
        expect(dom.innerHTML).toBe(target);
      };
      testFormat('RGB', 'RGB');
      testFormat('123', 'RGB');
      testFormat('HEX', 'HEX');
      testFormat('HEX8', 'HEX8');
    });
  });

  describe('events', () => {
    it(': preset change', async () => {
      const onChange = vi.fn();
      const { container } = renderColorPicker({ onChange });
      const swatch = container.querySelector(`${name}__swatches-item`);

      fireEvent.click(swatch);
      const result = 'rgb(236, 242, 254)';

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith(result, {
        trigger: 'preset',
        color: getColorObject(new Color(result)),
      });
    });

    it(': saturation change', async () => {
      const testSaturation = async (fixed = false) => {
        const onPaletteBarChange = vi.fn();
        const { container } = renderColorPicker({ onPaletteBarChange, type: 'multiple', fixed });
        const el = container.querySelector('.t-color-picker__saturation');

        mockBoundingClientRect({
          left: 0,
          top: 0,
          width: 300,
          height: 50,
        });

        act(() => {
          makeTouch(el, 'touchstart');
          makeTouch(el, 'touchmove', { pageY: 40, pageX: 0, clientY: 40 });
          makeTouch(el, 'touchmove', { pageY: 40, pageX: 0, clientY: 40 });
          makeTouch(el, 'touchmove', { pageY: 30, pageX: 0, clientY: 30 });
          makeTouch(el, 'touchend', { pageY: 30, pageX: 30, clientY: 20 });
        });

        expect(onPaletteBarChange).toHaveBeenCalledTimes(3);
        const result = 'rgba(80, 80, 80, 1)';
        const color = new Color(result);
        color.saturation = 0;
        color.value = fixed ? 0.4 : 0.8214285714285714;

        expect(onPaletteBarChange).toHaveBeenLastCalledWith({
          color: getColorObject(color),
        });
      };

      await testSaturation();
      await testSaturation(true);
    });

    it(': hue slider change', async () => {
      const onChange = vi.fn();
      const { container } = renderColorPicker({ onChange, type: 'multiple' });
      const el = container.querySelector('.t-color-picker__slider');

      mockBoundingClientRect({
        left: 0,
        top: 0,
        width: 300,
        height: 50,
      });

      act(() => {
        makeTouch(el, 'touchstart', { pageY: 0, pageX: 0, clientY: 30 });
        makeTouch(el, 'touchmove', { pageY: 0, pageX: 30, clientY: 30 });
        makeTouch(el, 'touchend', { pageY: 30, pageX: 40, clientY: 30 });
      });

      expect(onChange).toHaveBeenCalledTimes(2);
      const result = 'rgb(151, 91, 0)';
      expect(onChange).toHaveBeenLastCalledWith(result, {
        trigger: 'palette-hue-bar',
        color: getColorObject(new Color(result)),
      });
    });

    it(': alpha slider change', async () => {
      const onChange = vi.fn();
      const { container } = renderColorPicker({ onChange, type: 'multiple', enableAlpha: true });
      const el = container.querySelector('.t-color-picker__slider-wrapper--alpha-type .t-color-picker__slider');

      mockBoundingClientRect({
        left: 0,
        top: 0,
        width: 300,
        height: 50,
      });
      act(() => {
        makeTouch(el, 'touchstart', { pageY: 0, pageX: 0, clientY: 30 });
        makeTouch(el, 'touchmove', { pageY: 0, pageX: 40, clientY: 30 });
        makeTouch(el, 'touchend', { pageY: 30, pageX: 40, clientY: 30 });
      });

      expect(onChange).toHaveBeenCalledTimes(2);
      const result = 'rgb(0, 31, 151)';
      const color = new Color(result);
      color.alpha = 0.13;
      expect(onChange).toHaveBeenLastCalledWith(result, {
        trigger: 'palette-alpha-bar',
        color: getColorObject(color),
      });
    });
  });
});
