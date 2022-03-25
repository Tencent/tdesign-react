import React, { forwardRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
// import { useLocaleReceiver } from '../locale/LocalReceiver';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDateRangePickerProps } from './type';
import { RangeInputPopup } from '../range-input';
import DateRangePanel from './panel/DateRangePanel';
import useRange from './hooks/useRange';
import useFormat from './hooks/useFormat';
import { subtractMonth, addMonth, extractTimeObj } from '../_common/js/date-picker/utils-new';

export interface DateRangePickerProps extends TdDateRangePickerProps, StyledProps {}

const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>((props, ref) => {
  const { classPrefix, datePicker: globalDatePickerConfig } = useConfig();

  const {
    className,
    style,
    disabled,
    mode,
    enableTimePicker,
    disableDate,
    firstDayOfWeek = globalDatePickerConfig.firstDayOfWeek,
    presets,
    timePickerProps,
    onPick,
  } = props;

  const {
    inputValue,
    popupVisible,
    rangeInputProps,
    popupProps,
    value,
    year,
    month,
    timeValue,
    activeIndex,
    isHoverCell,
    setActiveIndex,
    onChange,
    setIsHoverCell,
    setInputValue,
    setPopupVisible,
    setTimeValue,
    setYear,
    setMonth,
    isFirstValueSelected,
    setIsFirstValueSelected,
    cacheValue,
    setCacheValue,
  } = useRange(props);

  const { formatTime, formatDate, isValidDate, format } = useFormat({
    mode,
    value,
    enableTimePicker,
    format: props.format,
    valueType: props.valueType,
  });

  // 记录面板是否选中过
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    // 面板展开重置数据
    if (popupVisible) {
      setIsSelected(false);
      setCacheValue(formatDate(value || []));
      setTimeValue(formatTime(value || []));
    }
    // eslint-disable-next-line
  }, [value, popupVisible]);

  // 日期 hover
  function onCellMouseEnter(date: Date) {
    setIsHoverCell(true);
    const nextValue = [...inputValue];
    nextValue[activeIndex] = formatDate(date);
    setInputValue(nextValue);
  }

  // 日期 leave
  function onCellMouseLeave() {
    setIsHoverCell(false);
    setInputValue(cacheValue);
  }

  // 日期点击
  function onCellClick(date: Date, { e, partial }) {
    onPick?.(date, { e, partial });

    setIsHoverCell(false);
    setIsSelected(true);

    const nextValue = [...inputValue];
    nextValue[activeIndex] = formatDate(date);
    setCacheValue(nextValue);
    setInputValue(nextValue);

    if (enableTimePicker) return;

    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v));

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (notValidIndex === -1 && nextValue.length === 2 && !enableTimePicker && isFirstValueSelected) {
      onChange(
        formatDate(nextValue, 'valueType'),
        nextValue.map((v) => dayjs(v)),
      );
      setIsFirstValueSelected(false);
      setPopupVisible(false);
    } else {
      setIsFirstValueSelected(true);
      if (notValidIndex !== -1) {
        setActiveIndex(notValidIndex);
      } else {
        setActiveIndex(activeIndex ? 0 : 1);
      }
    }
  }

  // 头部快速切换
  function onJumperClick(flag: number, { partial }) {
    const partialIndex = partial === 'start' ? 0 : 1;

    const monthCountMap = { date: 1, month: 12, year: 120 };
    const monthCount = monthCountMap[mode] || 0;
    const current = new Date(year[partialIndex], month[partialIndex]);

    let next = null;
    if (flag === -1) {
      next = subtractMonth(current, monthCount);
    } else if (flag === 0) {
      next = new Date();
    } else if (flag === 1) {
      next = addMonth(current, monthCount);
    }

    const nextYear = [...year];
    nextYear[partialIndex] = next.getFullYear();
    const nextMonth = [...month];
    nextMonth[partialIndex] = next.getMonth();

    setYear(nextYear);
    setMonth(nextMonth);
  }

  // timepicker 点击
  function onTimePickerChange(val: string) {
    const nextTimeValue = [...timeValue];
    nextTimeValue[activeIndex] = val;
    setTimeValue(nextTimeValue);
    setIsSelected(true);

    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(val);

    const nextInputValue = [...inputValue];
    const changedInputValue = inputValue[activeIndex];
    const currentDate = !dayjs(changedInputValue, format).isValid() ? dayjs() : dayjs(changedInputValue, format);
    // am pm 12小时制转化 24小时制
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;

    const nextDate = currentDate.hour(nextHours).minute(minutes).second(seconds).millisecond(milliseconds).toDate();
    nextInputValue[activeIndex] = nextDate;
    setInputValue(formatDate(nextInputValue));
  }

  // 确定
  function onConfirmClick() {
    const nextValue = [...inputValue];

    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v));

    // 首次点击不关闭、确保两端都有有效值并且无时间选择器时点击后自动关闭
    if (notValidIndex === -1 && nextValue.length === 2 && isFirstValueSelected) {
      onChange(
        formatDate(nextValue, 'valueType'),
        nextValue.map((v) => dayjs(v)),
      );
      setIsFirstValueSelected(false);
      setPopupVisible(false);
    } else {
      setIsSelected(false);
      setIsFirstValueSelected(true);
      if (notValidIndex !== -1) {
        setActiveIndex(notValidIndex);
      } else {
        setActiveIndex(activeIndex ? 0 : 1);
      }
    }
  }

  // 预设
  function onPresetClick(preset: any) {
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }
    if (!Array.isArray(presetValue)) {
      console.error(`preset: ${preset} 预设值必须是数组!`);
    } else {
      onChange(
        formatDate(presetValue, 'valueType'),
        presetValue.map((p) => dayjs(p)),
      );
      setPopupVisible(false);
    }
  }

  function onYearChange(nextVal: number, { partial }) {
    let partialIndex = partial === 'start' ? 0 : 1;
    if (enableTimePicker) partialIndex = activeIndex;

    const nextYear = [...year];
    nextYear[partialIndex] = nextVal;

    setYear(nextYear);
  }

  function onMonthChange(nextVal: number, { partial }) {
    let partialIndex = partial === 'start' ? 0 : 1;
    if (enableTimePicker) partialIndex = activeIndex;

    const nextMonth = [...month];
    nextMonth[partialIndex] = nextVal;

    setMonth(nextMonth);
  }

  // 根据交互状态不同使用不同的 value 控制面板信息
  function getPanelValue() {
    let panelValue = cacheValue;
    // 时间面板场景下首次选择使用 cacheValue
    if (enableTimePicker) {
      if (isFirstValueSelected) {
        // 第二次选择在确定后使用 cacheValue
        panelValue = isSelected ? cacheValue : inputValue;
      } else {
        panelValue = cacheValue;
      }
    } else {
      // 无时间面板场景在 hover 状态下使用 inputValue
      panelValue = isHoverCell ? inputValue : cacheValue;
    }
    return panelValue;
  }

  const panelProps = {
    value: getPanelValue(),
    year,
    month,
    mode,
    format,
    presets,
    timeValue,
    disableDate,
    firstDayOfWeek,
    timePickerProps,
    enableTimePicker,
    activeIndex,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    onJumperClick,
    onConfirmClick,
    onPresetClick,
    onYearChange,
    onMonthChange,
    onTimePickerChange,
  };

  return (
    <div className={classNames(`${classPrefix}-date-picker`, className)} style={style} ref={ref}>
      <RangeInputPopup
        disabled={disabled}
        inputValue={inputValue}
        popupProps={popupProps}
        rangeInputProps={rangeInputProps}
        popupVisible={popupVisible}
        panel={<DateRangePanel {...panelProps} />}
      />
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

DateRangePicker.defaultProps = {
  mode: 'date',
  allowInput: false,
  clearable: false,
  enableTimePicker: false,
  presetsPlacement: 'bottom',
};

export default DateRangePicker;
