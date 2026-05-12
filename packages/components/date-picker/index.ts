import './style/index.js';

import _DatePicker from './DatePicker';
import _DatePickerPanel from './DatePickerPanel';
import _DateRangePicker from './DateRangePicker';
import _DateRangePickerPanel from './DateRangePickerPanel';

export type { DatePickerProps } from './DatePicker';
export type { DatePickerPanelProps } from './DatePickerPanel';
export type { DateRangePickerProps } from './DateRangePicker';
export type { DateRangePickerPanelProps } from './DateRangePickerPanel';
export * from './type';

export const DatePicker = _DatePicker;
export const DateRangePicker = _DateRangePicker;
export const DatePickerPanel = _DatePickerPanel;
export const DateRangePickerPanel = _DateRangePickerPanel;

export default DatePicker;
