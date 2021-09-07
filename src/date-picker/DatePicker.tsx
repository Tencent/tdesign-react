import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { TdDatePickerProps } from '../_type/components/date-picker';
import useCommonClassName from '../_util/useCommonClassName';
import { clickOut } from '../_util/dom';

import IconTime from '../icon/icons/TimeIcon';
import IconCalendar from '../icon/icons/CalendarIcon';
import Popup from '../popup';
import Input from '../input';
import Button from '../button';
import CalendarPresets from './base/CalendarPresets';
import DatePanel from './panel/Date';
import DateRangePanel from './panel/DateRange';
// import TimePickerPanel from '../time-picker/panel';

dayjs.extend(isBetween);

export interface DatePickerProps extends TdDatePickerProps, StyledProps {}

const DatePicker = (props: DatePickerProps) => {
  const {
    allowInput,
    clearable,
    disabled,
    disableDate,
    enableTimePicker,
    format,
    inputProps,
    mode,
    placeholder,
    popupProps,
    prefixIcon,
    presets,
    range,
    size,
    suffixIcon,
    value,
    defaultValue,
    onBlur,
    onChange,
    onFocus,
    onInput,
  } = props;
  const { classPrefix } = useConfig();
  const CLASSNAMES = useCommonClassName();

  const timePickerRef = useRef(null);
  const dropdownPopupRef = useRef(null);
  const inputRef = useRef(null);

  const [popupShow, setPopupShow] = useState(false);
  const [timePanelShow, setTimePanelShow] = useState(false);
  const [timeValue, setTimeValue] = useState(dayjs());
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [formattedValue, setFormattedValue] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [inSelection, setInSelection] = useState(false);
  const [multiSeparator] = useState(',');

  // 收集触发 popup 的 doms
  const els = [];

  function clickAway() {
    if (popupShow) {
      if (selectedDates.length > 1) {
        setStart(selectedDates[0]);
        setEnd(selectedDates[1]);
      }
      close();
    }
  }

  function initClickAway(el: Element) {
    els.push(el);
    if (els.length > 1) {
      clickOut(els, clickAway);
    }
  }

  function createPopover() {
    if (!dropdownPopupRef.current || !inputRef.current) {
      return;
    }

    initClickAway(dropdownPopupRef.current);
  }

  // const onOpenDebounce = debounce(createPopover, 250);

  useEffect(() => {
    initClickAway(timePickerRef.current)
  }, []);

  useEffect(() => {
    updateFormatValue();
  }, [selectedDates])
  

  function showPopup() {
    if (disabled) return;
    setPopupShow(true);
    inputRef.current?.focus();
  }

  function formatDate(date: Date): string {
    let _dateFormat = format || '';
    const arrTime = ['H', 'h', 'm', 's'];
    const hasTime = arrTime.some((f) => String(_dateFormat).includes(f));
    if (enableTimePicker && !hasTime) {
      _dateFormat = [_dateFormat, 'HH:mm:ss'].join(' ');
    }
    const d1 = new Date(date);
    return dayjs(d1).format(_dateFormat);
  }

  function close() {
    if (disabled) return;

    setPopupShow(false);
    setTimePanelShow(false); 
  }

  function clear(e, triggerChange = false): void {
    e.stopPropagation();
    // close picker
    close();

    // set value
    if (!disabled) {
      const selectedDates: any[] = [];
      setSelectedDates(selectedDates);
      setFormattedValue('');
      submitInput(selectedDates, triggerChange);
    }
  }

  function submitInput(selectedDates: any[], triggerChange = true) {
    const pickerMode = range ? 'range' : mode;

    switch (pickerMode) {
      case 'date':
      case 'month':
      case 'year':
        triggerChange && onChange?.(selectedDates.join(multiSeparator));
        break;
      case 'range':
        triggerChange && onChange?.(selectedDates);
        break;
    }
  }

  function clickRange(value) {
    if (Array.isArray(value)) {
      const [start, end] = value as dayjs.ConfigType[];
      setStart(dayjs(start).toDate());
      setEnd(dayjs(end).toDate());
    } else {
      setStart(dayjs(value).toDate());
      setEnd(dayjs(value).toDate());
    }
    clickedApply();
  }

  function clickedApply(closePicker = true): void {
    // 等待 state 更新推到下一个微任务更新 selectedDates
    Promise.resolve().then(() => {
      if (range) {
        setSelectedDates([start, end]);
      }
  
      submitInput(selectedDates.map((d: Date) => formatDate(d)), true);
  
      closePicker && close();
    });
  }

  function toggleTime() {
    setTimeValue(dayjs(start));
    setTimePanelShow(!timePanelShow);

    // this.timeValue = dayjs(this.start);

    // this.showTime = !this.showTime;
    // this.$nextTick(() => {
    //   const timePickerPanel = this.$refs.timePickerPanel;
    //   timePickerPanel && timePickerPanel.panelColUpdate();
    // });
  }

  function normalizeDateTime(value: Date, oldValue: Date): Date {
    const newDate = dayjs(value);
    const oldDate = dayjs(oldValue);
    if (enableTimePicker) {
      newDate.hour(oldDate.hour());
      newDate.minute(oldDate.minute());
      newDate.second(oldDate.second());
      newDate.millisecond(oldDate.millisecond());
    }

    return newDate.toDate();
  }

  function updateFormatValue() {
    const selectedFmtDates: string[] = selectedDates.map((d: Date) => formatDate(d));

    const strMode: string = range ? 'range' : mode;
    let value = '';

    switch (strMode) {
      case 'time':
      case 'date':
      case 'month':
      case 'year':
        value = selectedFmtDates.join('');
        break;
      case 'range':
        if (popupShow) {
          value = [formatDate(start), formatDate(end)].join(' 至 ');
        } else if (selectedFmtDates.length > 1) {
          value = [selectedFmtDates[0], selectedFmtDates[1]].join(' 至 ');
        }
        break;
    }

    setFormattedValue(value);
  }

  function dateClick(value: Date) {
    // @todo add year range and month range
    let pickerMode: string = mode;
    if (range) pickerMode = 'range';
    if (timePanelShow) pickerMode = 'time';

    switch (pickerMode) {
      case 'time':
        setSelectedDates(range ? [start, end] : [value])
        clickedApply(false);
        break;
      case 'year':
      case 'month':
      case 'date':
        const nextDate = normalizeDateTime(value, start);
        setStart(nextDate);
        setSelectedDates([nextDate]);
        // 有时间选择时，点击日期不关闭弹窗
        clickedApply(!enableTimePicker);
        break;
      case 'range':
        if (inSelection) {
          setInSelection(false);
          setStart(normalizeDateTime(value[0], end));
          setEnd(normalizeDateTime(value[1], end));

          if (value[1] < value[0]) {
            setInSelection(true);
            setStart(normalizeDateTime(value[0], start));
          }
        } else {
          setStart(normalizeDateTime(value[0], start));
          setEnd(normalizeDateTime(value[1], end));
          setInSelection(true);
        }
        // 有时间选择时，点击日期不关闭弹窗
        clickedApply(!enableTimePicker);
        break;
    }
  }

  function isEnabled(value: Date): boolean {
    if (!disableDate) return false;

    // 值类型为 Function 则表示返回值为 true 的日期会被禁用
    if (typeof disableDate === 'function') {
      return disableDate(value);
    }

    // 禁用日期，示例：['A', 'B'] 表示日期 A 和日期 B 会被禁用。
    if (Array.isArray(disableDate)) {
      const formatedDisabledDate = disableDate.map((item: string) => dayjs(item, format));
      return formatedDisabledDate.some(item => item.isSame(dayjs(value)));
    }

    // { before: 'A', after: 'B' } 表示在 A 之前和在 B 之后的日期都会被禁用。
    const { before, after } = disableDate;
    if (before && after) {
      const compareMin = dayjs(new Date(disableDate.before)).startOf('day');
      const compareMax = dayjs(new Date(disableDate.after)).startOf('day');

      // check min
      return !dayjs(value).isBetween(compareMin, compareMax, null, '[]');
    }

    // { from: 'A', to: 'B' } 表示在 A 到 B 之间的日期会被禁用。
    const { from, to } = disableDate;
    if (from && to) {
      const compareMin = dayjs(new Date(from)).startOf('day');
      const compareMax = dayjs(new Date(to)).startOf('day');

      // check min
      return dayjs(value).isBetween(compareMin, compareMax, null, '[]');
    }

    return true;
  }

  function renderContent() {
    const pickerStyles = classNames(`${classPrefix}-date-picker--container`, {
      [`${classPrefix}-date-picker--container`]: popupShow,
      [`${classPrefix}-date-picker--ranges-show`]: !!presets && range,
      [`${classPrefix}-date-picker--date`]: !!presets && range,
    });

    const panelProps = {
      mode,
      firstDayOfWeek: 0,
      onChange: dateClick,
      disableDate: isEnabled,
      value: range ? [start, end] : start,
    };

    const panelComponent = range ? <DateRangePanel {...panelProps} /> : <DatePanel {...panelProps} />;

    return (
      <div ref={dropdownPopupRef} className={pickerStyles}>
          {/* {enableTimePicker && timePanelShow && (
            <TimePickerPanel
              ref="timePickerPanel"
              format="HH:mm:ss"
              cols={[EPickerCols.hour, EPickerCols.minute, EPickerCols.second]}
              steps={[1, 1, 1]}
              value={[timeValue]}
              ontime-pick={this.handleTimePick}
              isFooterDisplay={false}
            />
          )} */}
          {!timePanelShow && panelComponent}
          {presets && range && <CalendarPresets presets={presets} onClickRange={clickRange} />}
          {
            enableTimePicker && (
              <div className={`${classPrefix}-date-picker--apply`}>
                {
                  enableTimePicker && (
                    <Button theme="primary" variant="text" onClick={toggleTime}>
                      {timePanelShow ? '选择日期' : '选择时间'}
                    </Button>
                  )
                }
                {<Button theme="primary" onClick={() => clickedApply(true)}>确定</Button>}
              </div>
            )
          }
        </div>
    )
  }

  const triggerClassName = classNames(`${classPrefix}-form-controls`, { [CLASSNAMES.STATUS.active]: popupShow });
  const defaultSuffixIcon = enableTimePicker ? <IconTime /> : <IconCalendar />;
  const timePickerClassName = classNames(`${classPrefix}-date-picker`, CLASSNAMES.SIZE[size], {
    [`${classPrefix}-date-picker--month-picker`]: mode === 'year' || mode === 'month',
  });

  const inputEvents = {
    onChange(value: string) {
      const formatedValue = dayjs(value).format(format);
      console.log('onChange', formatedValue);
      onChange?.(formatedValue);
    },
    // onInput(value: string, { e }) {
    //   console.log('value', value);
    //   const formatedValue = dayjs(value).format(dateFormat);
    //   console.log(dayjs(value))
    //   console.log('formatedValue', formatedValue);
    //   // const val: any = event.target.value;
    //   // this.formattedValue = val;
    //   // const d1: any = this.parseDate(val);

    //   // if (d1 instanceof Date) {
    //   //   const d2: string = this.formatDate(d1);
    //   //   this.$emit('input', d2);
    //   // }
    //   // this.formattedValue = value;
    //   // const day1: any = this.parseDate(value);

    //   // if (day1 instanceof Date) {
    //   //   const day2: string = this.formatDate(day1);
    //   //   this.$emit('input', day2);
    //   // }
    //   onInput?.({ e, value, input: value })
    // },
    onFocus(value: string, { e }) {
      // if (!popupShow) setPopupShow(true);
      
      onFocus?.({ e, value });
    },
    onBlur(value: string, { e }) {
      // if (popupShow) setPopupShow(false);

      onBlur?.({ e, value });
    },
  }

  return (
    <div className={timePickerClassName} ref={timePickerRef}>
      <Popup
        trigger='context-menu'
        placement="bottom-left"
        visible={popupShow}
        content={renderContent()}
        overlayClassName={`${classPrefix}-date-picker`}
        className={`${classPrefix}-date-picker-popup-reference`}
        {...popupProps}
      >
        <div className={triggerClassName} onClick={showPopup}>
          <Input
            ref={inputRef}
            size={size}
            value={formattedValue}
            disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            readonly={!allowInput}
            onClear={({ e }) => clear(e, true)}
            prefixIcon={prefixIcon}
            suffixIcon={suffixIcon || defaultSuffixIcon}
            {...inputEvents}
            {...inputProps}
          />
        </div>
      </Popup>
    </div>
  )
}

DatePicker.displayName = 'DatePicker';

DatePicker.defaultProps = {
  format: 'YYYY-MM-DD',
  mode: 'month',
  placeholder: '',
  size: 'medium',
}

export default DatePicker;
