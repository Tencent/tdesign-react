import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { TimeIcon as TdTimeIcon } from 'tdesign-icons-react';
import { isArray } from 'lodash-es';
import noop from '../_util/noop';
import useControlled from '../hooks/useControlled';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { RangeInputPopup } from '../range-input';
import type { RangeInputPopupProps, RangeInputPosition } from '../range-input';
import TimePickerPanel from './panel/TimePickerPanel';

import { useTimePickerTextConfig } from './hooks/useTimePickerTextConfig';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';
import { TIME_PICKER_EMPTY } from '../_common/js/time-picker/const';

import { TdTimeRangePickerProps, TimeRangeValue, TimeRangePickerPartial } from './type';
import { StyledProps } from '../common';
import { timeRangePickerDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface TimeRangePickerProps extends TdTimeRangePickerProps, StyledProps {}

function handlePositionTrans(income: RangeInputPosition): TimeRangePickerPartial {
  return income === 'first' ? 'start' : 'end';
}

const TimeRangePicker: FC<TimeRangePickerProps> = (originalProps) => {
  const props = useDefaultProps<TimeRangePickerProps>(originalProps, timeRangePickerDefaultProps);
  const TEXT_CONFIG = useTimePickerTextConfig();

  const {
    allowInput,
    borderless,
    clearable,
    disabled,
    format,
    hideDisabledTime,
    placeholder = TEXT_CONFIG.rangePlaceholder,
    size,
    steps,
    disableTime,
    onBlur = noop,
    onFocus = noop,
    onInput = noop,
    style,
    className,
    presets,
    label,
  } = props;

  const [value, onChange] = useControlled(props, 'value', props.onChange);

  const { classPrefix } = useConfig();
  const { TimeIcon } = useGlobalIcon({
    TimeIcon: TdTimeIcon,
  });
  const [isPanelShowed, setPanelShow] = useState(false);
  const [currentPanelIdx, setCurrentPanelIdx] = useState(undefined);
  const [currentValue, setCurrentValue] = useState(['', '']);

  const name = `${classPrefix}-time-picker`;

  const inputClasses = classNames(`${name}__group`, {
    [`${classPrefix}-is-focused`]: isPanelShowed,
  });

  const handleShowPopup: RangeInputPopupProps['onPopupVisibleChange'] = (visible, { trigger }) => {
    if (trigger === 'trigger-element-click') {
      setPanelShow(true);
      return;
    }
    setPanelShow(visible);
  };

  function handlePickerValue(pickValue: string | string[], currentValue: string[]) {
    if (Array.isArray(pickValue)) return pickValue;
    return currentPanelIdx === 0
      ? [pickValue, currentValue[1] ?? pickValue]
      : [currentValue[0] ?? pickValue, pickValue];
  }

  const handleOnPick = (pickValue: string[], e: { e: React.MouseEvent }) => {
    let context;
    if (isArray(pickValue)) {
      context = { e };
    } else if (currentPanelIdx.value === 0) {
      context = { e, position: 'start' as TimeRangePickerPartial };
    } else {
      context = { e, position: 'end' as TimeRangePickerPartial };
    }
    props.onPick?.(pickValue, context);
  };

  const handleClear = (context: { e: React.MouseEvent }) => {
    const { e } = context;
    e.stopPropagation();
    onChange(undefined);
    setCurrentValue(TIME_PICKER_EMPTY);
  };

  const handleClick = ({ position }: { position: 'first' | 'second' }) => {
    setCurrentPanelIdx(position === 'first' ? 0 : 1);
  };

  const handleTimeChange = (newValue: string | string[], context: { e: React.MouseEvent }) => {
    const nextCurrentValue = handlePickerValue(newValue, currentValue);
    setCurrentValue(nextCurrentValue);
    handleOnPick(nextCurrentValue, context);
  };

  const autoSwapTime = (valueBeforeConfirm: Array<string>) => {
    const [startTime, endTime] = valueBeforeConfirm;
    const startDayjs = dayjs(startTime, props.format);
    const endDayjs = dayjs(endTime, props.format);

    if (startDayjs.isAfter(endDayjs, 'second')) return [endTime, startTime];

    return [startTime, endTime];
  };

  const handleInputBlur = (value: TimeRangeValue, { e }: { e: React.FocusEvent<HTMLInputElement> }) => {
    if (allowInput) {
      const isValidTime = validateInputValue(currentValue[currentPanelIdx], format);
      if (isValidTime) {
        const formattedVal = formatInputValue(currentValue[currentPanelIdx], format);
        currentPanelIdx === 0
          ? setCurrentValue([formattedVal, currentValue[1] ?? formattedVal])
          : setCurrentValue([currentValue[0] ?? formattedVal, formattedVal]);
      }
    }
    onBlur({ value, e });
  };

  const handleInputChange = (
    inputVal: TimeRangeValue,
    { e, position }: { e: React.FocusEvent<HTMLInputElement>; position: RangeInputPosition },
  ) => {
    setCurrentValue(inputVal);
    onInput({ value, e, position: handlePositionTrans(position) });
  };

  const handleClickConfirm = () => {
    const isValidTime = !currentValue.find((v) => !validateInputValue(v, format));
    if (isValidTime) onChange(props.autoSwap ? autoSwapTime(currentValue) : currentValue);
    setPanelShow(false);
  };

  const handleFocus = (
    value: TimeRangeValue,
    { e, position }: { e: React.FocusEvent<HTMLInputElement>; position: RangeInputPosition },
  ) => {
    onFocus({ value, e, position: handlePositionTrans(position) });
  };

  useEffect(() => {
    // to fix the effect trigger before input blur
    setCurrentValue(isPanelShowed ? value ?? TIME_PICKER_EMPTY : TIME_PICKER_EMPTY);
    if (!isPanelShowed) setCurrentPanelIdx(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPanelShowed]);

  return (
    <div className={classNames(name, className)} style={style}>
      <RangeInputPopup
        style={style}
        disabled={disabled}
        popupVisible={isPanelShowed}
        onPopupVisibleChange={handleShowPopup}
        popupProps={{
          overlayInnerStyle: {
            width: 'auto',
            padding: 0,
          },
          ...props.popupProps,
        }}
        onInputChange={handleInputChange}
        inputValue={isPanelShowed ? currentValue : value ?? TIME_PICKER_EMPTY}
        rangeInputProps={{
          size,
          borderless,
          clearable,
          className: inputClasses,
          value: isPanelShowed ? currentValue : value ?? undefined,
          placeholder,
          suffixIcon: <TimeIcon />,
          onClear: handleClear,
          onClick: handleClick,
          onFocus: handleFocus,
          onBlur: handleInputBlur,
          readonly: !allowInput,
          activeIndex: currentPanelIdx,
          label,
          ...props.rangeInputProps,
        }}
        tips={props.tips}
        status={props.status}
        panel={
          <TimePickerPanel
            steps={steps}
            format={format}
            disableTime={disableTime}
            isShowPanel={isPanelShowed}
            hideDisabledTime={hideDisabledTime}
            isFooterDisplay={true}
            value={currentValue[currentPanelIdx || 0]}
            onChange={handleTimeChange}
            handleConfirmClick={handleClickConfirm}
            position={currentPanelIdx === 0 ? 'start' : 'end'}
            activeIndex={currentPanelIdx}
            presets={presets}
          />
        }
      />
    </div>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';

export default TimeRangePicker;
