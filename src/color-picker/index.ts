import _ColorPickerPanel from './ColorPickerPanel';
import _ColorPicker from './ColorPicker';
import { TdColorPickerProps } from './type';

import './style';

export * from './type';

export type ColorPickerProps = TdColorPickerProps;

export const ColorPickerPanel = _ColorPickerPanel;
export const ColorPicker = _ColorPicker;

export default { ColorPicker, ColorPickerPanel };
