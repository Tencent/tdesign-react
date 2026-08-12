import './style/index.js';

import _RangeInput from './RangeInput';
import _RangeInputPopup from './RangeInputPopup';

export type { RangeInputProps, RangeInputRefInterface } from './RangeInput';
export type { RangeInputPopupProps } from './RangeInputPopup';
export * from './type';

export const RangeInput = _RangeInput;
export const RangeInputPopup = _RangeInputPopup;
export default RangeInput;
