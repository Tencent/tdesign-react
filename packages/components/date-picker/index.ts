import { withDayjsProvider } from './DayjsProvider';

import _DatePicker from './DatePicker';
import _DatePickerPanel from './DatePickerPanel';
import _DateRangePicker from './DateRangePicker';
import _DateRangePickerPanel from './DateRangePickerPanel';

import './style/index.js';

export type { DatePickerProps } from './DatePicker';
export type { DatePickerPanelProps } from './DatePickerPanel';
export type { DateRangePickerProps } from './DateRangePicker';
export type { DateRangePickerPanelProps } from './DateRangePickerPanel';

export * from './type';

export const DatePicker = withDayjsProvider(_DatePicker);
export const DateRangePicker = withDayjsProvider(_DateRangePicker);
export const DatePickerPanel = withDayjsProvider(_DatePickerPanel);
export const DateRangePickerPanel = withDayjsProvider(_DateRangePickerPanel);

export default DatePicker;
