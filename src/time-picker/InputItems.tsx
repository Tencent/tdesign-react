import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { TdTimePickerProps } from '../_type/components/time-picker';
import useConfig from '../_util/useConfig';
import { TimeInputType, KEYBOARD_DIRECTION, EPickerCols } from './interfaces';

export interface TimePickerInputItemsProps
  extends Pick<
    TdTimePickerProps,
    'allowInput' | 'disabled' | 'format' | 'size' | 'onBlur' | 'onFocus' | 'onInput' | 'onChange' | 'value'
  > {
  isRangePicker?: boolean;
}

const TimePickerInputItems: FC<TimePickerInputItemsProps> = (props: TimePickerInputItemsProps) => {
  const { allowInput, format, disabled, value, onBlur, onChange, onFocus, onInput } = props;

  const { classPrefix } = useConfig();
  const inputItemClass = `${classPrefix}-time-picker__input`;

  const [formatedValue, changeFormatedValue] = useState<Record<EPickerCols, string> | undefined>(undefined);

  useEffect(() => {
    const dayjsValue = dayjs(value, format);
    let hour: number | string = dayjsValue.hour();
    let minute: number | string = dayjsValue.minute();
    let second: number | string = dayjsValue.second();

    if (/[h]{1}/.test(format)) {
      hour %= 12;
    }
    if (/[h|H]{2}/.test(format)) {
      hour = hour < 10 ? `0${hour}` : hour;
    }
    if (/[m|M]{2}/.test(format)) {
      minute = minute < 10 ? `0${minute}` : minute;
    }
    if (/[s|S]{2}/.test(format)) {
      second = second < 10 ? `0${second}` : second;
    }
    changeFormatedValue({
      hour: String(hour),
      minute: String(minute),
      second: String(second),
      meridiem: dayjsValue.format('a'),
    });
  }, [value, format]);

  const handleInputChange = (type: TimeInputType, result: number | string, index?: number) => {
    console.log(index, 'TODO');
    const currentDayjsValue = dayjs(value, format);

    onChange(currentDayjsValue[type]?.(result).format(format));
  };
  // handle keyboard event
  const handleInputKeydown = (e: any, type: TimeInputType, index?: number) => {
    console.log(index, 'TODO');
    if (!allowInput) return;
    const { up, down, left, right } = KEYBOARD_DIRECTION;
    // TODO: `which` is deprecated
    const { which } = e;

    // handle plus and reduce
    if ([up, down].includes(which)) {
      if (type === EPickerCols.meridiem) return;

      const current = formatedValue[type] ? Number(formatedValue[type]) : 0;
      const operate = which === up ? -1 : 1;
      let result = current + operate;

      if (type === 'hour') {
        const maxHour = /[h]{1}/.test(format) ? 11 : 23;
        if (result > maxHour) {
          result = 0;
        } else if (result < 0) {
          result = maxHour;
        }
      } else if (result > 59) {
        result = 1;
      } else if (result < 0) {
        result = 59;
      }
      handleInputChange(type, result);
    } else if ([left, right].includes(which)) {
      // move to pre/next input area item
      const parentNode = e?.target?.parentNode;
      const focus = which === left ? parentNode.previousSibling : parentNode.nextSibling;

      if (focus) {
        const input = focus.querySelector('input');
        if (!input.focus) return;
        input.focus();
      }
    }
  };

  const renderTimeItem = (inputValue: string, type: Exclude<TimeInputType, 'meridiem'>, showColon: boolean) => {
    const itemClasses = classNames(`${inputItemClass}-item`, {
      [`${inputItemClass}-item-disabled`]: disabled,
    });
    const inputClass = `${inputItemClass}-item-input`;
    // const currentValue =
    return (
      <span className={itemClasses}>
        {showColon ? ':' : null}
        <input
          className={inputClass}
          value={inputValue}
          disabled={!allowInput}
          onChange={(e) => handleInputChange(type, e?.target?.value)}
          onKeyDown={(e) => handleInputKeydown(e, type)}
          onInput={(e) => onInput({ e, input: inputValue, value })}
          onBlur={(e) => onBlur({ e, trigger: type, input: inputValue, value })}
          onFocus={(e) => onFocus({ e, trigger: type, input: inputValue, value })}
        />
      </span>
    );
  };

  const renderItems = (itemValue: Record<EPickerCols, string>) => {
    const showSec = /[hH]{1,2}:m{1,2}:s{1,2}/.test(format); // format有秒的正则
    const showMin = /[hH]{1,2}:m{1,2}/.test(format); // format有分的正则

    return (
      <>
        {renderTimeItem(itemValue?.hour, EPickerCols.hour, false)}
        {showMin ? renderTimeItem(itemValue?.minute, EPickerCols.minute, true) : null}
        {showSec ? renderTimeItem(itemValue?.second, EPickerCols.second, true) : null}
      </>
    );
  };
  return <div className={inputItemClass}>{renderItems(formatedValue)}</div>;
};

export default TimePickerInputItems;
