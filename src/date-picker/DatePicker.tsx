import React, { forwardRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { isDate } from 'lodash-es';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdDatePickerProps, PresetDate, DateMultipleValue, DateValue } from './type';
import SelectInput from '../select-input';
import SinglePanel from './panel/SinglePanel';
import useSingle from './hooks/useSingle';
import { parseToDayjs, getDefaultFormat, formatTime, formatDate } from '../_common/js/date-picker/format';
import { subtractMonth, addMonth, extractTimeObj, covertToDate, isSame } from '../_common/js/date-picker/utils';
import { datePickerDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import useLatest from '../hooks/useLatest';
import useUpdateEffect from '../hooks/useUpdateEffect';
import type { TagInputRemoveContext } from '../tag-input';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();

  const props = useDefaultProps<DatePickerProps>(originalProps, datePickerDefaultProps);

  const {
    className,
    style,
    disabled,
    mode,
    enableTimePicker,
    disableDate,
    firstDayOfWeek,
    presets,
    defaultTime,
    timePickerProps,
    presetsPlacement,
    needConfirm,
    multiple,
    label,
    disableTime,
    onPick,
  } = props;

  const {
    inputValue,
    popupVisible,
    inputProps,
    popupProps,
    tagInputProps,
    value,
    year,
    month,
    time,
    inputRef,
    onChange,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setTime,
    setYear,
    setMonth,
    cacheValue,
    setCacheValue,
  } = useSingle(props);

  const [local] = useLocaleReceiver('datePicker');
  const { format, timeFormat, valueType } = getDefaultFormat({
    mode,
    format: props.format,
    valueType: props.valueType,
    enableTimePicker: multiple ? false : enableTimePicker,
  });

  const onTriggerNeedConfirm = useLatest(() => {
    if (!needConfirm && enableTimePicker && !popupVisible) {
      const nextValue = formatDate(inputValue, { format });
      if (nextValue) {
        onChange(formatDate(inputValue, { format, targetFormat: valueType }), {
          dayjsValue: parseToDayjs(inputValue, format),
          trigger: 'confirm',
        });
      } else {
        setInputValue(
          formatDate(value, {
            format,
          }),
        );
      }
    }
  });

  useUpdateEffect(() => {
    //  日期时间选择器不需要点击确认按钮完成的操作
    onTriggerNeedConfirm.current();
  }, [popupVisible]);

  useEffect(() => {
    if (multiple) return;
    // 面板展开重置数据
    // Date valueType、week mode 、quarter mode nad empty string don't need to be parsed
    const dateValue =
      value && !isDate(value) && !['week', 'quarter'].includes(props.mode)
        ? covertToDate(value as string, valueType)
        : value;
    setCacheValue(formatDate(dateValue, { format }));
    setInputValue(formatDate(dateValue, { format }));

    if (popupVisible) {
      setYear(parseToDayjs(value as DateValue, format).year());
      setMonth(parseToDayjs(value as DateValue, format).month());
      setTime(formatTime(value, format, timeFormat, defaultTime));
    } else {
      setIsHoverCell(false);
    }
    // eslint-disable-next-line
  }, [popupVisible]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    if (multiple) return;
    setIsHoverCell(true);
    setInputValue(formatDate(date, { format }));
  }

  // 日期 leave
  function onCellMouseLeave() {
    if (multiple) return;
    setIsHoverCell(false);
    setInputValue(formatDate(cacheValue, { format }));
  }

  // 日期点击
  function onCellClick(date: Date) {
    onPick?.(date);
    setIsHoverCell(false);
    // date 模式自动切换年月
    if (mode === 'date') {
      setYear(date.getFullYear());
      setMonth(date.getMonth());
    }
    if (enableTimePicker) {
      setCacheValue(formatDate(date, { format }));
    } else {
      if (multiple) {
        const newDate = processDate(date);
        onChange(newDate, {
          dayjsValue: parseToDayjs(date, format),
          trigger: 'pick',
        });
        return;
      }
      onChange(formatDate(date, { format, targetFormat: valueType }), {
        dayjsValue: parseToDayjs(date, format),
        trigger: 'pick',
      });
      setPopupVisible(false);
    }
  }
  // 头部快速切换
  const onJumperClick = React.useCallback(
    ({ trigger }) => {
      const monthCountMap = { date: 1, week: 1, month: 12, quarter: 12, year: 120 };
      const monthCount = monthCountMap[mode] || 0;

      const current = new Date(year, month);

      let next = null;
      if (trigger === 'prev') {
        next = subtractMonth(current, monthCount);
      } else if (trigger === 'current') {
        next = new Date();
      } else if (trigger === 'next') {
        next = addMonth(current, monthCount);
      }

      const nextYear = next.getFullYear();
      const nextMonth = next.getMonth();

      setYear(nextYear);
      setMonth(nextMonth);
    },
    [year, month, mode, setYear, setMonth],
  );

  // timePicker 点击
  function onTimePickerChange(val: string) {
    setTime(val);

    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);

    // am pm 12小时制转化 24小时制
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
    const currentDate = !dayjs(inputValue, format).isValid() ? dayjs() : dayjs(inputValue, format);
    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    setInputValue(formatDate(nextDate, { format }));
    setCacheValue(formatDate(nextDate, { format }));

    onPick?.(nextDate);
  }

  // 确定
  function onConfirmClick({ e }) {
    const nextValue = formatDate(inputValue, { format });
    props?.onConfirm?.({ e, date: nextValue });

    if (nextValue) {
      onChange(formatDate(inputValue, { format, targetFormat: valueType }), {
        dayjsValue: parseToDayjs(inputValue, format),
        trigger: 'confirm',
      });
    } else {
      setInputValue(formatDate(value, { format }));
    }
    setPopupVisible(false);
  }

  // 预设
  function onPresetClick(preset, context: { preset: PresetDate; e: React.MouseEvent<HTMLDivElement> }) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    onChange(formatDate(presetValue, { format, targetFormat: valueType }), {
      dayjsValue: parseToDayjs(presetValue, format),
      trigger: 'preset',
    });
    props.onPresetClick?.(context);
    setPopupVisible(false);
  }

  const onYearChange = useCallback((year: number) => {
    setYear(year);
    // eslint-disable-next-line
  }, []);

  const onMonthChange = useCallback((month: number) => {
    setMonth(month);
    // eslint-disable-next-line
  }, []);

  function processDate(date: Date) {
    let isSameDate: boolean;
    const currentValue = (value || []) as DateMultipleValue;
    if (mode !== 'week')
      isSameDate = currentValue.some((val) =>
        isSame(parseToDayjs(val, format).toDate(), date, mode, local.dayjsLocale),
      );
    else {
      isSameDate = currentValue.some((val) => val === dayjs(date).locale(local.dayjsLocale).format(format));
    }
    let currentDate: DateMultipleValue;

    if (!isSameDate) {
      currentDate = currentValue.concat(formatDate(date, { format, targetFormat: valueType }));
    } else {
      currentDate = currentValue.filter(
        (val) =>
          formatDate(val, { format, targetFormat: valueType }) !==
          formatDate(date, { format, targetFormat: valueType }),
      );
    }

    return currentDate?.sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());
  }

  const onTagRemoveClick = (ctx: TagInputRemoveContext) => {
    const removeDate = dayjs(ctx.item).toDate();
    const newDate = processDate(removeDate);
    onChange?.(newDate, {
      dayjsValue: parseToDayjs(removeDate, format),
      trigger: 'pick',
    });
  };

  const onTagClearClick = ({ e }) => {
    e.stopPropagation();
    setPopupVisible(false);
    onChange([], { dayjsValue: dayjs(), trigger: 'clear' });
  };

  const panelProps = {
    value: cacheValue,
    year,
    month,
    mode,
    format,
    presets,
    time: multiple ? false : time,
    disableDate,
    firstDayOfWeek,
    timePickerProps,
    enableTimePicker: multiple ? false : enableTimePicker,
    presetsPlacement,
    popupVisible,
    needConfirm,
    multiple,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
    onPanelClick: () => inputRef.current?.focus?.(),
    disableTime,
  };

  return (
    <div className={classNames(`${classPrefix}-date-picker`, className)} style={style} ref={ref}>
      <SelectInput
        disabled={disabled}
        value={inputValue}
        status={props.status}
        tips={props.tips}
        borderless={props.borderless}
        label={label}
        popupProps={popupProps}
        inputProps={inputProps}
        popupVisible={popupVisible}
        panel={<SinglePanel {...panelProps} />}
        multiple={multiple}
        tagInputProps={{
          onRemove: onTagRemoveClick,
          ...tagInputProps,
        }}
        onClear={onTagClearClick}
      />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
