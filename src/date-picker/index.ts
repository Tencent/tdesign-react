import _DatePicker from './DatePicker';
import _DateRangePicker from './DateRangePicker';
import _DatePanel from './panel/DatePanel';
import _DateRangePanel from './panel/DateRangePanel';

import './style/index.js';

export type { DatePickerProps } from './DatePicker';
export type { DateRangePickerProps } from './DateRangePicker';
export type { DatePanelProps } from './panel/DatePanel';
export type { DateRangePanelProps } from './panel/DateRangePanel';
export * from './type';

export const DatePicker = _DatePicker;
export const DateRangePicker = _DateRangePicker;
export const DatePanel = _DatePanel;
export const DateRangePanel = _DateRangePanel;

export default DatePicker;
