import React, { forwardRef } from 'react';
import classNames from 'classnames';
// import { useLocaleReceiver } from '../locale/LocalReceiver';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDatePickerProps } from './type';
import SelectInput from '../select-input';
import DatePanel from './panel/Date';
import useSingle from './hooks/useSingle';

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-date-picker`;

  const { className, style, disabled } = props;

  const { inputValue, popupVisible, setPopupVisible, inputProps, popupProps, panelProps } = useSingle(props);

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
