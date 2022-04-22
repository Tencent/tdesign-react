import React from 'react';
import { ColorObject, ColorPickerChangeTrigger, TdColorPickerProps } from '.';
import { StyledProps } from '../common';
import type { Color } from '../_common/js/color-picker/color';

export interface ColorPickerProps extends TdColorPickerProps, StyledProps {
  togglePopup?: Function;
  ref?: React.MutableRefObject<HTMLDivElement>;
}

// color modes
export type TdColorModes = 'monochrome' | 'linear-gradient';

// color context
export interface TdColorContext {
  color: ColorObject;
  trigger: ColorPickerChangeTrigger;
}

// 控件通用属性
export interface TdColorBaseProps {
  disabled: Boolean;
  color: Color;
  onChange?: Function;
  baseClassName: string;
}

export type TdColorSaturationData = {
  saturation: number;
  value: number;
};
