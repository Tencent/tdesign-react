import type { TouchEvent } from 'react';
import { DEFAULT_SYSTEM_SWATCH_COLORS } from '../../_common/js/color-picker/constants';
import { Color } from '../../_common/js/color-picker';
import { ColorPickerProps } from '../ColorPicker';
import { PanelRectType } from '../types';

export const getCoordinate = (e: TouchEvent, rect: PanelRectType, isFixed?: boolean) => {
  const { pageX, pageY, clientY } = e?.changedTouches?.[0] || {};
  const offsetY = isFixed ? rect.top : (e.target as HTMLElement).offsetTop;
  return {
    x: Math.min(Math.max(0, pageX - rect.left), rect.width),
    y: Math.min(Math.max(0, (isFixed ? clientY : pageY) - offsetY), rect.height),
  };
};

export const getFormatList = (format: ColorPickerProps['format'], color: Color): [string, Array<string | number>] => {
  const FORMAT_MAP = {
    HSV: Object.values(color.getHsva()),
    HSVA: Object.values(color.getHsva()),

    HSL: Object.values(color.getHsla()),
    HSLA: Object.values(color.getHsla()),

    RGB: Object.values(color.getRgba()),
    RGBA: Object.values(color.getRgba()),
    CMYK: [...Object.values(color.getCmyk()), 0],

    CSS: [color.css, 0],
    HEX: [color.hex, 0],
    HEX8: [color.hex8, 0],
  };

  const cur = FORMAT_MAP[format];
  if (cur) {
    return [format, [...cur.slice(0, cur.length - 1), `${Math.round(color.alpha * 100)}%`]];
  }
  return ['RGB', FORMAT_MAP.RGB];
};

export const genSwatchList = (prop: ColorPickerProps['swatchColors']) => {
  if (prop === undefined) {
    return DEFAULT_SYSTEM_SWATCH_COLORS.slice(0, 10);
  }
  if (!prop || !prop.length) {
    return [];
  }
  return prop;
};
