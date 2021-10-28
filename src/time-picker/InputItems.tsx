import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import padStart from 'lodash/padStart';

import { TdTimePickerProps, TdTimeRangePickerProps } from '../_type/components/time-picker';
import useConfig from '../_util/useConfig';
import { useTimePickerTextConfig } from './consts';
import { KeyboardDirection, EPickerCols } from './interfaces';

const preposFormat = /^(a|A)\s+?[h]{1,2}(:[m]{1,2}(:[s]{1,2})?)?$/;
const postposFormat = /^[h]{1,2}(:[m]{1,2}(:[s]{1,2})?)?(\s+(a|A))?$/;
const secondRegExp = /[hH]{1,2}:m{1,2}:s{1,2}/;
const minRegExp = /[hH]{1,2}:m{1,2}/;
export interface TimePickerInputItemsProps
  extends Pick<TdTimePickerProps, 'allowInput' | 'format'>,
    Pick<TdTimeRangePickerProps, 'placeholder' | 'disabled'> {
  value: TdTimeRangePickerProps['value'] | TdTimePickerProps['value'];
  onBlur: TdTimeRangePickerProps['onBlur'] | TdTimePickerProps['onBlur'];
  onFocus: TdTimeRangePickerProps['onFocus'] | TdTimePickerProps['onFocus'];
  onInput: TdTimeRangePickerProps['onInput'] | TdTimePickerProps['onInput'];
  onChange: TdTimeRangePickerProps['onChange'] | TdTimePickerProps['onChange'];
}

const TimePickerInputItems: FC<TimePickerInputItemsProps> = (props: TimePickerInputItemsProps) => {
  const { allowInput, format, disabled, value, onBlur, onChange, onFocus, onInput } = props;

  const { classPrefix } = useConfig();
  const inputItemClass = `${classPrefix}-time-picker__input`;
  const itemClasses = classNames(`${inputItemClass}-item`, {
    [`${inputItemClass}-item-disabled`]: disabled,
  });
  const inputClass = `${inputItemClass}-item-input`;

  const isRangePicker = Array.isArray(value) && value.length > 1;
  const [startTime, endTime] = [...value];

  const [formatedValue, changeFormatedValue] = useState<
    [Record<EPickerCols, string>, Record<EPickerCols, string>] | undefined
  >(undefined);

  useEffect(() => {
    if (!startTime) return;
    const dayjsValue = dayjs(startTime, format);
    const hour = /[h]{1}/.test(format) ? dayjsValue.hour() % 12 : dayjsValue.hour();
    const minute = dayjsValue.minute();
    const second = dayjsValue.second();

    changeFormatedValue((preVal) => [
      {
        hour: padStart(String(hour), 2, '0'),
        minute: padStart(String(minute), 2, '0'),
        second: padStart(String(second), 2, '0'),
        meridiem: dayjsValue.format('a'),
      },
      preVal?.[1],
    ]);
  }, [startTime, format]);

  useEffect(() => {
    if (!endTime) return;
    const dayjsValue = dayjs(endTime, format);
    const hour = /[h]{1}/.test(format) ? dayjsValue.hour() % 12 : dayjsValue.hour();
    const minute = dayjsValue.minute();
    const second = dayjsValue.second();

    changeFormatedValue((preVal) => [
      preVal[0],
      {
        hour: padStart(String(hour), 2, '0'),
        minute: padStart(String(minute), 2, '0'),
        second: padStart(String(second), 2, '0'),
        meridiem: dayjsValue.format('a'),
      },
    ]);
  }, [endTime, format]);

  const handleInputChange = useCallback(
    (type: EPickerCols, result: number | string, index?: number) => {
      if (!isRangePicker) {
        const currentDayjsValue = dayjs(startTime, format);
        onChange(currentDayjsValue[type]?.(result).format(format));
      } else {
        let currentDayjsValue: dayjs.Dayjs;
        if (index === 0) {
          currentDayjsValue = dayjs(startTime, format)[type]?.(result).format(format);
          onChange([currentDayjsValue, endTime] as any);
        } else {
          currentDayjsValue = dayjs(endTime, format)[type]?.(result).format(format);
          onChange([startTime, currentDayjsValue] as any);
        }
      }
    },
    [format, onChange, startTime, isRangePicker, endTime],
  );

  // handle keyboard event
  const handleInputKeydown = useCallback(
    (e: any, type: EPickerCols, index?: number) => {
      if (!allowInput) return;
      const { up, down, left, right } = KeyboardDirection;
      // TODO: `which` is deprecated
      const { which } = e;

      // handle plus and reduce
      if ([up, down].includes(which)) {
        if (type === EPickerCols.meridiem) return;

        const timeValue = formatedValue?.[index]?.[type];
        const current = timeValue ? Number(timeValue) : 0;
        const operate = which === up ? -1 : 1;
        let result = current + operate;

        if (type === EPickerCols.hour) {
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
        handleInputChange(type, result, index);
      } else if ([left, right].includes(which)) {
        // move to pre/next input area item
        const parentNode = e.target?.parentNode;
        const focus = which === left ? parentNode.previousSibling : parentNode.nextSibling;

        if (focus) {
          const input = focus.querySelector?.('input');
          if (input?.focus) input.focus();
        }
      }
    },
    [allowInput, format, formatedValue, handleInputChange],
  );

  const TEXT_CONFIG = useTimePickerTextConfig();

  // render meridiem col input
  function renderMeridiemItem(text: string) {
    return (
      <span className={itemClasses}>
        <input
          readOnly
          disabled={!allowInput}
          value={TEXT_CONFIG[text] || ''}
          onKeyDown={(e) => handleInputKeydown(e, EPickerCols.meridiem)}
          className={classNames(inputClass, `${inputClass}-meridiem`)}
        />
      </span>
    );
  }

  // render hour/minute/second cols input
  function renderTimeItem(
    inputValue: string,
    type: Exclude<EPickerCols, 'meridiem'>,
    showColon: boolean,
    index: number,
  ) {
    const propsValue = isRangePicker ? value : value[0];
    return (
      <span className={itemClasses}>
        {showColon ? ':' : null}
        <input
          value={inputValue || ''}
          className={inputClass}
          disabled={!allowInput}
          onKeyDown={(e) => handleInputKeydown(e, type, index)}
          onInput={(e) => onInput({ e, input: inputValue, value: propsValue as any })}
          onChange={(e) => handleInputChange(type, e?.target?.value)}
          onBlur={(e) => onBlur({ e, trigger: type, input: inputValue, value: propsValue as any })}
          onFocus={(e) => onFocus({ e, trigger: type, input: inputValue, value: propsValue as any })}
        />
      </span>
    );
  }

  function renderItems(itemValue: Record<EPickerCols, string>, index: number) {
    return (
      <>
        {preposFormat.test(format) && renderMeridiemItem(itemValue?.meridiem)}
        {renderTimeItem(itemValue?.hour, EPickerCols.hour, false, index)}
        {minRegExp.test(format) ? renderTimeItem(itemValue?.minute, EPickerCols.minute, true, index) : null}
        {secondRegExp.test(format) ? renderTimeItem(itemValue?.second, EPickerCols.second, true, index) : null}
        {postposFormat.test(format) && renderMeridiemItem(itemValue?.meridiem)}
      </>
    );
  }

  return (
    <div className={inputItemClass}>
      {isRangePicker ? (
        <>
          {renderItems(formatedValue?.[0], 0)} - {renderItems(formatedValue?.[1], 1)}
        </>
      ) : (
        renderItems(formatedValue?.[0], 0)
      )}
    </div>
  );
};

export default TimePickerInputItems;
