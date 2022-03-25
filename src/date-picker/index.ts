import _DatePicker from './DatePicker';
import _DateRangePicker from './DateRangePicker';

import './style/index.js';

export type { DatePickerProps } from './DatePicker';
export type { DateRangePickerProps } from './DateRangePicker';
export * from './type';

export const DatePicker = _DatePicker;
export const DateRangePicker = _DateRangePicker;

export default DatePicker;
