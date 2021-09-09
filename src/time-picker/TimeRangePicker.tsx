import React, { FC, useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import { TdTimeRangePickerProps } from '../_type/components/time-picker';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import noop from '../_util/noop';
import Popup from '../popup';
import Input from '../input';
import TimePickerPanel from './TimePickerPanel';
import InputItems from './InputItems';
import TIconTime from '../icon/icons/TimeIcon';

export interface TimeRangePickerProps extends TdTimeRangePickerProps, StyledProps {}

const TimeRangePicker: FC<TimeRangePickerProps> = (props) => {
  const { classPrefix } = useConfig();

  const name = `${classPrefix}-time-picker`; // t-time-picker

  const {
    allowInput,
    clearable,
    disabled,
    format = 'HH:mm:ss',
    hideDisabledTime,
    placeholder = '选择时间',
    size,
    steps,
    value,
    defaultValue,
    disableTime = noop,
    onBlur = noop,
    onChange = noop,
    onClose = noop,
    onFocus = noop,
    onInput = noop,
    onOpen = noop,
  } = props;
  const [showPopup, setShowPopup] = useState(false);
  const timePickerRef = useRef(null);

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
          disabled={disabled}
          size={size}
          clearable={clearable}
          placeholder={placeholder}
          className={showPopup ? `${classPrefix}-is-focused` : ''}
          suffixIcon={<TIconTime />}
        />
        {value || defaultValue ? (
          <InputItems
            size={size}
            disabled={disabled}
            format={format}
            allowInput={allowInput}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        ) : null}
      </div>
    </Popup>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
