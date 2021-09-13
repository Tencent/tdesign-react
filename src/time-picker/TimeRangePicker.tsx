import React, { FC, useState } from 'react';
import classNames from 'classnames';

import useConfig from '../_util/useConfig';
// import noop from '../_util/noop';
import Popup from '../popup';
import Input from '../input';
import TimePickerPanel from './TimePickerPanel';
import InputItems from './InputItems';
import TIconTime from '../icon/icons/TimeIcon';

import { TdTimeRangePickerProps } from '../_type/components/time-picker';
import { StyledProps } from '../_type';

export interface TimeRangePickerProps extends TdTimeRangePickerProps, StyledProps {}

const TimeRangePicker: FC<TimeRangePickerProps> = (props) => {
  const { classPrefix } = useConfig();

  const name = `${classPrefix}-time-picker`; // t-time-picker

  const {
    allowInput,
    clearable,
    disabled,
    format = 'HH:mm:ss',
    // hideDisabledTime,
    // placeholder,
    size,
    // steps,
    value,
    defaultValue,
    // disableTime,
    // onBlur,
    // onChange,
    // onClose,
    // onFocus,
    // onInput,
    // onOpen,
  } = props;
  const [showPopup, setShowPopup] = useState(false);
  // const timePickerRef = useRef(null);

  const onTimePickerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setShowPopup(!showPopup);
    }
  };

  const renderContent = () => <TimePickerPanel />;
  return (
    <Popup content={renderContent()} placement="bottom-left" visible={showPopup}>
      <div onClick={onTimePickerClick} className={classNames(name)}>
        <Input
          readonly={true}
          size={size}
          clearable={clearable}
          className={showPopup ? `${classPrefix}-is-focused` : ''}
          suffixIcon={<TIconTime />}
        />
        {value || defaultValue ? (
          <InputItems
            size={size}
            disabled={disabled}
            format={format}
            // placeholder={placeholder}
            allowInput={allowInput}
            // onBlur={onBlur}
            // onFocus={onFocus}
          />
        ) : null}
      </div>
    </Popup>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
