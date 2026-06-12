import type { Color } from '@tdesign/common-js/color-picker/color';
import type { StyledProps } from '../common';
import type { ColorObject, ColorPickerChangeTrigger, TdColorPickerProps } from '.';

export interface ColorPickerProps extends TdColorPickerProps, StyledProps {}

// color modes
export type TdColorModes = 'monochrome' | 'linear-gradient';

// color context
export interface TdColorContext {
  color: ColorObject;
  trigger: ColorPickerChangeTrigger;
}

// 控件通用属性
export interface TdColorBaseProps<T = void> {
  disabled: boolean;
  color: Color;
  onChange?: (value: T) => void;
  baseClassName: string;
}

export type TdColorSaturationData = {
  saturation: number;
  value: number;
};
