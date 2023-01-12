import _TimePicker from './TimePicker';
import _TimeRangePicker from './TimeRangePicker';
import _TimePickerPanel from './panel/TimePickerPanel';

import './style/index.js';

export type { TimePickerProps } from './TimePicker';
export type { TimeRangePickerProps } from './TimeRangePicker';
export * from './type';

export const TimePicker = _TimePicker;
export const TimeRangePicker = _TimeRangePicker;
export const TimePickerPanel = _TimePickerPanel;

export default TimePicker;
