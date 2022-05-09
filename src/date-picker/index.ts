import _DatePicker from './DatePicker';
import _DateRangePicker from './DateRangePicker';
import _DatePickerPanel from './panel/DatePickerPanel';
import _DateRangePickerPanel from './panel/DateRangePickerPanel';

import './style/index.js';

export type { DatePickerProps } from './DatePicker';
export type { DateRangePickerProps } from './DateRangePicker';
export type { DatePickerPanelProps } from './panel/DatePickerPanel';
export type { DateRangePickerPanelProps } from './panel/DateRangePickerPanel';
export * from './type';

export const DatePicker = _DatePicker;
export const DateRangePicker = _DateRangePicker;
export const DatePickerPanel = _DatePickerPanel;
export const DateRangePickerPanel = _DateRangePickerPanel;

export default DatePicker;
