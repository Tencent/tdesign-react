import React, { forwardRef } from 'react';
import isObject from 'lodash/isObject';
import classNames from 'classnames';
// import { useLocaleReceiver } from '../locale/LocalReceiver';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDatePickerProps } from './type';
import SelectInput from '../select-input';
import { isEnabledDate } from './utils';
import DatePanel from './panel/Date';
import useInput from './hooks/useInput';

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();
  const name = `${classPrefix}-date-picker`;

  const {
    className,
    style,
    timePickerProps,
    mode = 'month',
    disabled,
    disableDate,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    format = 'YYYY-MM-DD',
    valueType = 'YYYY-MM-DD',
    presets,
    enableTimePicker,
  } = props;

  const {
    value,
    onChange,
    inputValue,
    setInputValue,
    popupVisible,
    setPopupVisible,
    inputProps,
    popupProps,
    formatDate,
  } = useInput(props);

  const panelProps = {
    value,
    onChange,
    inputValue,
    setInputValue,
    setPopupVisible,
    formatDate,
    timePickerProps,
    mode,
    format,
    presets,
    valueType,
    enableTimePicker,
    firstDayOfWeek: firstDayOfWeek ?? 1,
    disableDate: (date: Date) => !isEnabledDate({ value: date, disableDate, mode, format }),
    minDate: isObject(disableDate) && 'before' in disableDate ? new Date(disableDate.before) : null,
    maxDate: isObject(disableDate) && 'after' in disableDate ? new Date(disableDate.after) : null,
  };

  return (
    <div className={classNames(name, className)} style={style} ref={ref}>
      <SelectInput
        disabled={disabled}
        value={inputValue}
        popupProps={popupProps}
        inputProps={inputProps}
        popupVisible={popupVisible}
        onPopupVisibleChange={setPopupVisible}
        panel={<DatePanel {...panelProps} />}
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
