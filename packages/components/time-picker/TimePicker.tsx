import React, { useState, Ref } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TimeIcon as TdTimeIcon } from 'tdesign-icons-react';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useControlled from '../hooks/useControlled';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import noop from '../_util/noop';

import SelectInput from '../select-input';
import type { SelectInputProps, SelectInputValueChangeContext } from '../select-input';
import TimeRangePicker from './TimeRangePicker';
import TimePickerPanel from './panel/TimePickerPanel';
import type { TimePickerPanelProps } from './panel/TimePickerPanel';

import { useTimePickerTextConfig } from './hooks/useTimePickerTextConfig';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';
import { DEFAULT_STEPS, DEFAULT_FORMAT } from '../_common/js/time-picker/const';
import { timePickerDefaultProps } from './defaultProps';

import type { StyledProps } from '../common';
import type { TdTimePickerProps } from './type';
import useDefaultProps from '../hooks/useDefaultProps';

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

export interface TimePickerProps extends TdTimePickerProps, StyledProps {}

const TimePicker = forwardRefWithStatics(
  (originalProps: TimePickerProps, ref: Ref<HTMLDivElement>) => {
    const props = useDefaultProps<TimePickerProps>(originalProps, timePickerDefaultProps);
    const TEXT_CONFIG = useTimePickerTextConfig();
    const {
      allowInput,
      borderless,
      className,
      clearable,
      disabled,
      style,
      format = DEFAULT_FORMAT,
      hideDisabledTime = true,
      steps = DEFAULT_STEPS,
      placeholder = TEXT_CONFIG.placeholder,
      disableTime,
      onBlur = noop,
      onClose = noop,
      onFocus = noop,
      onOpen = noop,
      onInput = noop,
      onPick = noop,
    } = props;

    const [value, onChange] = useControlled(props, 'value', props.onChange);

    const [isPanelShowed, setPanelShow] = useState(false);
    const [currentValue, setCurrentValue] = useState('');

    const { classPrefix } = useConfig();
    const { TimeIcon } = useGlobalIcon({
      TimeIcon: TdTimeIcon,
    });
    const name = `${classPrefix}-time-picker`;
    const inputClasses = classNames(`${name}__group`, {
      [`${classPrefix}-is-focused`]: isPanelShowed,
    });

    const effectVisibleCurrentValue = (visible: boolean) => {
      setPanelShow(visible);
      setCurrentValue(visible ? value ?? '' : '');
    };

    const handleShowPopup = (visible: boolean, context: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
      effectVisibleCurrentValue(visible);
      visible ? onOpen(context) : onClose(context); // trigger on-open and on-close
    };

    const handleClear = (context: { e: React.MouseEvent }) => {
      const { e } = context;
      e.stopPropagation();
      setCurrentValue('');
      onChange(null);
    };

    const handleInputChange = (value: string, context: SelectInputValueChangeContext) => {
      setCurrentValue(value);
      if (allowInput) {
        onInput({ value, e: context.e as React.FocusEvent<HTMLInputElement> });
      }
    };

    const handleInputBlur: SelectInputProps['onBlur'] = (value, ctx) => {
      if (allowInput) {
        const isValidTime = validateInputValue(currentValue, format);
        if (isValidTime) {
          onChange(formatInputValue(currentValue, format));
        }
      }
      onBlur({ value: String(value), ...ctx });
    };

    const handleClickConfirm = () => {
      const isValidTime = validateInputValue(currentValue, format);
      if (isValidTime) onChange(currentValue);
      effectVisibleCurrentValue(false);
    };

    const handlePanelChange: TimePickerPanelProps['onChange'] = (v, ctx) => {
      setCurrentValue(v);
      onPick?.(v, ctx);
    };

    return (
      <div className={classNames(name, className)} ref={ref} style={style}>
        <SelectInput
          onFocus={onFocus}
          onClear={handleClear}
          disabled={disabled}
          clearable={clearable}
          allowInput={allowInput}
          className={inputClasses}
          borderless={borderless}
          suffixIcon={<TimeIcon />}
          popupVisible={isPanelShowed}
          onInputChange={handleInputChange}
          onBlur={handleInputBlur}
          onPopupVisibleChange={handleShowPopup}
          placeholder={!value ? placeholder : undefined}
          value={isPanelShowed ? currentValue : value ?? undefined}
          inputValue={isPanelShowed ? currentValue : value ?? undefined}
          inputProps={{ ...props.inputProps, size: props.size }}
          popupProps={{ overlayInnerStyle: { width: 'auto', padding: 0 }, ...props.popupProps }}
          tips={props.tips}
          status={props.status}
          label={props.label}
          panel={
            <TimePickerPanel
              steps={steps}
              format={format}
              value={currentValue}
              isFooterDisplay={true}
              isShowPanel={isPanelShowed}
              disableTime={disableTime}
              onChange={handlePanelChange}
              onPick={props.onPick}
              hideDisabledTime={hideDisabledTime}
              handleConfirmClick={handleClickConfirm}
              presets={props.presets}
            />
          }
        />
      </div>
    );
  },
  {
    TimeRangePicker,
    TimePickerPanel,
  },
);

TimePicker.displayName = 'TimePicker';

export default TimePicker;
