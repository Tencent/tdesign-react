import React, { FC, useState } from 'react';
import classNames from 'classnames';

import noop from '../_util/noop';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import Popup from '../popup';
import Input from '../input';
import TimeRangePickerPanel from './TimeRangePickerPanel';
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
    hideDisabledTime,
    placeholder,
    size = 'medium',
    steps = [1, 1, 1],
    value,
    // disableTime,
    onBlur = noop,
    onChange,
    onFocus = noop,
    onInput = noop,
  } = useDefaultValue(props);
  const [isPanelShowed, togglePanelShow] = useState(false);

  const handleShowPopup = (visible: boolean) => {
    togglePanelShow(visible);
  };

  return (
    <Popup
      content={
        <TimeRangePickerPanel
          steps={steps}
          format={format}
          hideDisabledTime={hideDisabledTime}
          isFooterDisplay={true}
          value={value}
          onChange={onChange}
        />
      }
      placement="bottom-left"
      visible={isPanelShowed}
      onVisibleChange={handleShowPopup}
    >
      <div className={classNames(name)}>
        <Input
          readonly={true}
          size={size}
          clearable={clearable}
          className={isPanelShowed ? `${classPrefix}-is-focused` : ''}
          suffixIcon={<TIconTime />}
        />
        {value ? (
          <InputItems
            disabled={disabled}
            format={format}
            placeholder={placeholder}
            allowInput={allowInput}
            value={value}
            onBlur={onBlur}
            onFocus={onFocus}
            onInput={onInput}
            onChange={onChange}
          />
        ) : null}
      </div>
    </Popup>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
