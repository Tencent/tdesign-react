import React, { useState, useRef } from 'react';
import dayjs from "dayjs";
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { TdDatePickerProps } from '../_type/components/date-picker';
import Popup from '../popup';
import IconTime from '../icon/icons/TimeIcon';
import IconCalendar from '../icon/icons/CalendarIcon';
// import IconClose from '../icon/icons/CloseIcon';
import Input from '../input';
import useCommonClassName from '../_util/useCommonClassName';
import isBetween from 'dayjs/plugin/isBetween';
import CalendarPresets from './base/CalendarPresets';
import Button from '../button';
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

  const dropdownPopupRef = useRef(null);
  const inputRef = useRef(null);
  const [popupShow, setPopupShow] = useState(false);
  const [dateFormat, setDateFormat] = useState('');
  const [timePanelShow, setTimePanelShow] = useState(false);
  const [formattedValue, setFormattedValue] = useState('');
  const [selectedDates, setSelectedDates] = useState([1,2]);

  function showPopup() {
    if (disabled) return;
    setPopupShow(true);
    inputRef.current?.focus();
  }

  function pickerBlur() {
    setPopupShow(false);
    inputRef.current?.blur();
  };

  function onVisibleChange(visible: boolean): void {
    if (visible) {
      showPopup();
    } else {
      pickerBlur();
    }
  }

  function clear(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (!clearable) return;

    // if (range) {
    //   onChangeHandler(['', '']);
    // } else {
    //   onChangeHandler('');
    // }
  };

  // function onChangeHandler(newTime, fromInput) {
  //   // const { onChange, valueFormat, isRange, type } = this.props;

  //   if (!('value' in this.props)) {
  //     this.setState({
  //       time: newTime,
  //     });
  //   }
  //   if (range) {
  //     onChange?.(valueFormat ? newTime.map((time) => (time ? dateToFormat(time, valueFormat) : time)) : newTime);
  //   } else {
  //     onChange && onChange(valueFormat && newTime ? dateToFormat(newTime, valueFormat) : newTime);
  //   }
  //   if (!fromInput && type.indexOf('time') === -1) {
  //     this.hidePopup();
  //   }
  //   this.context.formChange && this.context.formChange();
  // };


  function formatDate(date: Date, format = ''): string {
    let _dateFormat = format || dateFormat;
    const arrTime = ['H', 'h', 'm', 's'];
    const hasTime = arrTime.some((f) => String(_dateFormat).includes(f));
    if (enableTimePicker && !hasTime) {
      _dateFormat = [_dateFormat, 'HH:mm:ss'].join(' ');
    }
    const d1 = new Date(date);
    return dayjs(d1).format(_dateFormat);
  }

  function parseDate(value: any = '', format = ''): Date | boolean {
    if (value instanceof Date) {
      return new Date(value);
    }
    if (format) {
      const oDate: dayjs.Dayjs = dayjs(value, format);
      if (oDate.isValid()) {
        return new Date(oDate.toDate());
      }
      return false;
    }

    const d2: dayjs.Dayjs = dayjs(value);
    if (d2.isValid()) {
      return new Date(d2.toDate());
    }
    return false;
  }

  function formatValue(val) {
    console.log(val)
    // const vm: any = this;
    // const { min, dateFormat } = vm;
    // if (value) {
    //   if (String(value).length >= String(vm.formatDate(min || new Date())).length && dayjs(value, dateFormat)) {
    //     vm.tempValue = '';
    //     vm.setDate(value, true);
    //   } else {
    //     vm.tempValue = value;
    //   }
    // }
  }
  
  // function clear(triggerChange = false): void {
  //   if (disabled) return;
  //   // close picker
  //   close();

  //   // set value
  //   setSelectedDates([]);
  //   setFormattedValue('');
  //   // submitInput(selectedDates, triggerChange);
  // }

  function submitInput(selectedDates: any[], triggerChange = true) {
    const { multiSeparator } = this;
    const mode = this.range ? 'range' : this.mode;

    switch (mode) {
      case 'date':
      case 'month':
      case 'year':
        // submit formate date
        // onInput?.({ value: selectedDates.join(multiSeparator) });
        if (triggerChange) {
          onChange?.(selectedDates.join(multiSeparator));
        }
        break;
      case 'range':
        // submit formate date
        // this.$emit('input', selectedDates);
        // onInput?.({ e })
        if (triggerChange) {
          this.$emit('change', selectedDates);
        }
        break;
    }
  }

  function clickRange() {

  }

  function dateClick() {

  }

  function renderContent() {
    const panelProps = {
      mode,
      firstDayOfWeek: 0,
      onChange: dateClick,
      // value: range ? [start, end] : start,
    };

    const panelComponent = range ? <DateRangePanel {...panelProps} /> : <DatePanel {...panelProps} />;

    return (
      <div ref={dropdownPopupRef} className={this.pickerStyles}>
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
                    <Button theme="primary" variant="text" onClick={this.toggleTime}>
                      {timePanelShow ? '选择日期' : '选择时间'}
                    </Button>
                  )
                }
                {<Button theme="primary" onClick={this.clickedApply}>确定</Button>}
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
  })

  const inputEvents = {
    onInput(value, { e }) {
      // this.formattedValue = value;
      // const day1: any = this.parseDate(value);

      // if (day1 instanceof Date) {
      //   const day2: string = this.formatDate(day1);
      //   this.$emit('input', day2);
      // }
      onInput?.({ e, value, input: value })
    },
    onFocus(value, { e }) {
      if (!popupShow) showPopup();

      onFocus?.({ e, value });
    },
  }

  return (
    <div className={timePickerClassName}>
      <Popup
        trigger='context-menu'
        placement="bottom-left"
        visible={popupShow}
        content={renderContent()}
        overlayClassName={`${classPrefix}-date-picker`}
        onVisibleChange={onVisibleChange}
        className={`${classPrefix}-date-picker-popup-reference`}
        {...popupProps}
      >
        <div className={triggerClassName} onClick={showPopup}>
          <Input
            ref={inputRef}
            size={size}
            value={formattedValue}
            onChange={formatValue}
            disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            readonly={!allowInput}
            // onClear={() => clear(true)}
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

}

export default DatePicker;
