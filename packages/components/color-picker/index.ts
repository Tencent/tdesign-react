import './style';

import _ColorPicker from './ColorPicker';
import _ColorPickerPanel from './ColorPickerPanel';

export type { ColorPickerProps } from './interface';
export * from './type';

export const ColorPickerPanel = _ColorPickerPanel;
export const ColorPicker = _ColorPicker;

export default ColorPicker;
