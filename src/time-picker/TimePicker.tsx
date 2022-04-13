import React, { useState, Ref, useEffect } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeIcon } from 'tdesign-icons-react';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';

import SelectInput from '../select-input';
import TimeRangePicker from './TimeRangePicker';
import TimePickerPanel from './panel/TimePickerPanel';

import { useTimePickerTextConfig } from './const';

import { StyledProps } from '../common';
import { TdTimePickerProps } from './type';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';
import { DEFAULT_STEPS, DEFAULT_FORMAT } from '../_common/js/time-picker/const';

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

export interface TimePickerProps extends TdTimePickerProps, StyledProps {}

const TimePicker = forwardRefWithStatics(
  (props: TimePickerProps, ref: Ref<HTMLDivElement>) => {
    const TEXT_CONFIG = useTimePickerTextConfig();
    const {
      allowInput,
      className,
      clearable,
      disabled,
      style,
      value = undefined,
      format = DEFAULT_FORMAT,
      hideDisabledTime = true,
      steps = DEFAULT_STEPS,
      placeholder = TEXT_CONFIG.placeholder,
      disableTime,
      onChange,
      onBlur = noop,
      onClose = noop,
      onFocus = noop,
      onOpen = noop,
    } = useDefaultValue(props);

    const [isPanelShowed, setPanelShow] = useState(false);
    const [currentValue, setCurrentValue] = useState('');

    const { classPrefix } = useConfig();
    const name = `${classPrefix}-time-picker`;
    const inputClasses = classNames(`${name}__group`, {
      [`${classPrefix}-is-focused`]: isPanelShowed,
    });

    const handleShowPopup = (visible: boolean, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
      setPanelShow(visible);
      visible ? onOpen(context) : onClose(context); // trigger on-open and on-close
    };

    const handleClear = (context: { e: React.MouseEvent }) => {
      const { e } = context;
      e.stopPropagation();
      setCurrentValue('');
      onChange(null);
    };

    const handleInputChange = (value: string) => {
      setCurrentValue(value);
    };

    const handleInputBlur = (value: string, { e }: { e: React.FocusEvent<HTMLInputElement> }) => {
      if (allowInput) {
        const isValidTime = validateInputValue(currentValue, format);
        if (isValidTime) {
          onChange(formatInputValue(currentValue, format));
        }
      }
      onBlur({ value, e });
    };

    useEffect(() => {
      setCurrentValue(isPanelShowed ? value ?? '' : '');
    }, [isPanelShowed, value]);

    return (
      <div className={classNames(name, className)} ref={ref} style={style}>
        <SelectInput
          onFocus={onFocus}
          onClear={handleClear}
          disabled={disabled}
          clearable={clearable}
          allowInput={allowInput}
          className={inputClasses}
          suffixIcon={<TimeIcon />}
          popupVisible={isPanelShowed}
          onInputChange={handleInputChange}
          onBlur={handleInputBlur}
          onPopupVisibleChange={handleShowPopup}
          placeholder={!value ? placeholder : undefined}
          value={isPanelShowed ? currentValue : value ?? undefined}
          inputValue={isPanelShowed ? currentValue : value ?? undefined}
          panel={
            <TimePickerPanel
              steps={steps}
              format={format}
              value={currentValue}
              isFooterDisplay={true}
              disableTime={disableTime}
              onChange={setCurrentValue}
              hideDisabledTime={hideDisabledTime}
              handleConfirmClick={() => {
                onChange(currentValue);
                setPanelShow(false);
              }}
            />
          }
        />
      </div>
    );
  },
  {
    displayName: 'TimePicker',
    TimeRangePicker,
    TimePickerPanel,
  },
);

export default TimePicker;
