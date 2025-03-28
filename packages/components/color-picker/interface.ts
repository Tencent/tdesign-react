import React from 'react';
import type { Color } from '@tdesign/common-js/color-picker/color';
import { ColorObject, ColorPickerChangeTrigger, TdColorPickerProps } from '.';
import { StyledProps } from '../common';

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
