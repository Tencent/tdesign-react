import React, { useState, Ref } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useDefaultValue from '../_util/useDefaultValue';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import Popup from '../popup';
import Input from '../input';
import TimeRangePicker from './TimeRangePicker';
import TIconTime from '../icon/icons/TimeIcon';
import TimePickerPanel from './panel/TimePickerPanel';
import InputItems from './InputItems';

import { DEFAULT_STEPS, DEFAULT_FORMAT, TEXT_CONFIG } from './consts';

import { StyledProps } from '../_type';
import { TdTimePickerProps } from '../_type/components/time-picker';

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

export interface TimePickerProps extends TdTimePickerProps, StyledProps {}

const TimePicker = forwardRefWithStatics(
  (props: TimePickerProps, ref: Ref<HTMLDivElement>) => {
    const {
      allowInput,
      className,
      clearable,
      disabled,
      format = DEFAULT_FORMAT,
      hideDisabledTime = true,
      placeholder = TEXT_CONFIG.placeholder,
      style,
      size = 'medium',
      steps = DEFAULT_STEPS,
      value,
      disableTime,
      onBlur = noop,
      onChange,
      onClose = noop,
      onFocus = noop,
      onInput = noop,
      onOpen = noop,
    } = useDefaultValue(props);

    const [isPanelShowed, setPanelShow] = useState(false);

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
      onChange(null);
    };

    return (
      <Popup
        content={
          <TimePickerPanel
            steps={steps}
            format={format}
            disableTime={disableTime}
            hideDisabledTime={hideDisabledTime}
            isFooterDisplay={true}
            onChange={onChange}
            handleConfirmClick={() => setPanelShow(false)}
            value={value}
          />
        }
        disabled={disabled}
        visible={isPanelShowed}
        onVisibleChange={handleShowPopup}
        overlayClassName={classNames(`${name}-panel__container`)}
        placement="bottom-left"
        trigger="click"
      >
        {/* TODO active与date picker保持一致 */}
        <div className={classNames(name, className)} ref={ref} style={style}>
          <Input
            readonly={true}
            disabled={disabled}
            size={size}
            clearable={clearable}
            value={value ? ' ' : undefined}
            onClear={handleClear}
            placeholder={!value ? placeholder : undefined}
            className={inputClasses}
            suffixIcon={<TIconTime />}
          />
          {value ? (
            <InputItems
              disabled={disabled}
              format={format}
              allowInput={allowInput}
              value={[value]}
              onBlur={onBlur}
              onFocus={onFocus}
              onInput={onInput}
              onChange={onChange}
            />
          ) : null}
        </div>
      </Popup>
    );
  },
  {
    displayName: 'TimePicker',
    TimeRangePicker,
  },
);

export default TimePicker;
