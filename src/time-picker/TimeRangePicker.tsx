import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';

import { TimeIcon as TdTimeIcon } from 'tdesign-icons-react';
import noop from '../_util/noop';
import useControlled from '../hooks/useControlled';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { RangeInputPopup, RangeInputPosition } from '../range-input';
import TimePickerPanel from './panel/TimePickerPanel';

import { useTimePickerTextConfig } from './hooks/useTimePickerTextConfig';
import { formatInputValue, validateInputValue } from '../_common/js/time-picker/utils';
import { TIME_PICKER_EMPTY } from '../_common/js/time-picker/const';

import { TdTimeRangePickerProps, TimeRangeValue, TimeRangePickerPartial } from './type';
import { StyledProps } from '../common';
import { timeRangePickerDefaultProps } from './defaultProps';

export interface TimeRangePickerProps extends TdTimeRangePickerProps, StyledProps {}

const defaultArrVal = [undefined, undefined];

const TimeRangePicker: FC<TimeRangePickerProps> = (props) => {
  const TEXT_CONFIG = useTimePickerTextConfig();

  const {
    allowInput,
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

  const handleShowPopup = (visible: boolean) => {
    setPanelShow(visible);
  };

  const handleClear = (context: { e: React.MouseEvent }) => {
    const { e } = context;
    e.stopPropagation();
    onChange(undefined);
  };

  const handleClick = ({ position }: { position: 'first' | 'second' }) => {
    setCurrentPanelIdx(position === 'first' ? 0 : 1);
  };

  const handleTimeChange = (newValue: string) => {
    if (currentPanelIdx === 0) {
      setCurrentValue([newValue, currentValue[1] ?? newValue]);
    } else {
      setCurrentValue([currentValue[0] ?? newValue, newValue]);
    }
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
    onInput({ value, e, position: position as TimeRangePickerPartial });
  };

  const handleClickConfirm = () => {
    const isValidTime = !currentValue.find((v) => !validateInputValue(v, format));
    if (isValidTime) onChange(currentValue);
    setPanelShow(false);
  };

  const handleFocus = (
    value: TimeRangeValue,
    { e, position }: { e: React.FocusEvent<HTMLInputElement>; position: RangeInputPosition },
  ) => {
    onFocus({ value, e, position: position as TimeRangePickerPartial });
  };

  useEffect(() => {
    setCurrentValue(isPanelShowed ? value ?? TIME_PICKER_EMPTY : defaultArrVal);
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
        inputValue={isPanelShowed ? currentValue : value ?? defaultArrVal}
        rangeInputProps={{
          size,
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
          />
        }
      />
    </div>
  );
};

TimeRangePicker.displayName = 'TimeRangePicker';
TimeRangePicker.defaultProps = timeRangePickerDefaultProps;

export default TimeRangePicker;
