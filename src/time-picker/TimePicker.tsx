import * as React from 'react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { TdTimePickerProps } from '../_type/components/time-picker';
import PanelCol from './panel/Panel';

export interface TimePickerProps extends TdTimePickerProps, StyledProps {}

enum PHASE {
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  MERIDIEM = 'meridiem',
}

type Cell = number | string;

export interface Time {
  [PHASE.HOUR]: number;
  [PHASE.MINUTE]: number;
  [PHASE.SECOND]: number;
  [PHASE.MERIDIEM]: '' | 'am' | 'pm' | 'AM' | 'PM';
}

const formatParser = {
  getUseHour: (format: string): 0 | 1 | 2 => {
    if (/hh|HH/.test(format)) return 2;
    if (/[hH]/.test(format)) return 1;
    return 0;
  },
  getUseMinute: (format: string): 0 | 1 | 2 => {
    if (/mm|MM/.test(format)) return 2;
    if (/[mM]/.test(format)) return 1;
    return 0;
  },
  getUseSecond: (format: string): 0 | 1 | 2 => {
    if (/ss|SS/.test(format)) return 2;
    if (/[sS]/.test(format)) return 1;
    return 0;
  },
  getUseMeridiem: (format: string): '' | 'a' | 'A' => {
    if (format.search('a') >= 0) return 'a';
    if (format.search('A') >= 0) return 'A';
    return '';
  },
  getFormatIsValid: (format: string): boolean => {
    const useHour = formatParser.getUseHour(format);
    const useMinute = formatParser.getUseMinute(format);
    const useSecond = formatParser.getUseSecond(format);

    if (useHour === 1 && useMinute === 1 && useSecond === 1) return true;
    if (useHour === 2 && useMinute === 2 && useSecond === 2) return true;
    if (useHour === 1 && useMinute === 1 && useSecond === 0) return true;
    if (useHour === 2 && useMinute === 2 && useSecond === 0) return true;
    if (useHour === 0 && useMinute === 1 && useSecond === 1) return true;
    return useHour === 0 && useMinute === 2 && useSecond === 2;
  },
  getValueIsValid: (value: string, format: string): boolean => {
    if (!formatParser.getFormatIsValid(format)) return false;
    const [timePrefix, meridiem] = value.split(' ');
    const [hour, minute, second] = timePrefix.split(':');

    const validHour = formatParser.getUseHour(format) && Number(hour) >= 0 && Number(hour) <= 59;
    const validMinute = formatParser.getUseMinute(format) && Number(minute) >= 0 && Number(hour) <= 59;
    const useSecond = formatParser.getUseSecond(format);
    const validSecond = !useSecond || (useSecond && Number(second) >= 0 && Number(second) <= 59);
    const useMeridiem = formatParser.getUseMeridiem(format);
    const validMeridiem = (() => {
      if (!useMeridiem && !meridiem) return true;
      if (useMeridiem === 'a' && ['am', 'pm'].includes(meridiem)) return true;
      return useMeridiem === 'A' && ['AM', 'PM'].includes(meridiem);
    })();

    return validHour && validMinute && validSecond && validMeridiem;
  },
};

const prefixCell = (cell: Cell): string => {
  if (cell < 0) return '';
  return cell <= 9 ? `0${cell}` : String(cell);
};

const blockName = 'time-picker';

const TimePanel: React.FC<TimePickerProps> = (props) => {
  const {
    value = '',
    // inputWidth = '100%',
    // clearable = false,
    allowInput = false,
    disabled = false,
    // placeholder = '请选择时间',
    // hideDisabledHours = false,
    // hideDisabledMinutes = false,
    // hideDisabledSeconds = false,
    // hideDropdown = false,
    format = 'hh:mm:ss',
    // hourRange = [],
    // minuteRange = [],
    // secondRange = [],
    steps = [1, 1, 1],
    onChange = noop,
    onOpen = noop,
    onClose = noop,
    onBlur = noop,
    onFocus = noop,
    className = '',
    style = {},
  } = props;

  const { classPrefix } = useConfig();

  const prefixCls = React.useCallback(
    (...args: (string | [string, string?, string?])[]) => {
      let className = '';
      args.forEach((item, index) => {
        if (item && index > 0) className = className.concat(' ');
        if (item instanceof Array) {
          const [block, element, modifier] = item;
          className = className.concat(classPrefix, '-', block);
          if (element) className = className.concat('__', element);
          if (modifier) className = className.concat('--', modifier);
        } else if (typeof item === 'string') {
          className = className.concat(classPrefix, '-', item);
        }
      });
      return className;
    },
    [classPrefix],
  );
  const defaultTime = React.useMemo<Time>(() => {
    const hour = formatParser.getUseHour(format) ? 0 : -1;
    const minute = formatParser.getUseMinute(format) ? 0 : -1;
    const second = formatParser.getUseSecond(format) ? 0 : -1;
    const meridiem = (() => {
      const useMeridiem = formatParser.getUseMeridiem(format);
      if (!useMeridiem) return '';
      if (useMeridiem === 'a') return 'am';
      if (useMeridiem === 'A') return 'AM';
    })();
    return { hour, minute, second, meridiem };
  }, [format]);

  const [time, setTime] = React.useState<Time>(defaultTime);
  const display = React.useMemo(() => {
    const hour: string = (() => {
      if (formatParser.getUseHour(format) === 2) return prefixCell(time.hour);
      if (formatParser.getUseHour(format) === 1) return String(time.hour);
      return '';
    })();

    const minute: string = (() => {
      if (formatParser.getUseMinute(format) === 2) return prefixCell(time.minute);
      if (formatParser.getUseMinute(format) === 1) return String(time.minute);
      return '';
    })();

    const second: string = (() => {
      if (formatParser.getUseSecond(format) === 2) return prefixCell(time.second);
      if (formatParser.getUseSecond(format) === 1) return String(time.second);
      return '';
    })();

    const { meridiem } = time;
    const result = ''.concat(
      hour ? `${hour}:` : '',
      minute ? `${minute}${second ? ':' : ''}` : '',
      second ? second : '',
      meridiem ? ` ${meridiem}` : '',
    );
    onChange(result);
    return result;
  }, [time, onChange, format]);
  const setTimeByValue = React.useCallback(
    (data: string) => {
      if (!data) {
        setTime(defaultTime);
        return;
      }

      if (!formatParser.getValueIsValid(data, format)) return;

      const [timePrefix, meridiem] = data.split(' ');
      const [hour, minute, second] = timePrefix.split(':');
      setTime({
        hour: Number(hour) ?? 0,
        minute: Number(minute) ?? 0,
        second: Number(second) ?? 0,
        meridiem: (() => {
          const useMeridiem = formatParser.getUseMeridiem(format);
          if (useMeridiem && ('am' === meridiem || 'pm' === meridiem || 'AM' === meridiem || 'PM' === meridiem)) {
            return meridiem;
          }
          return '';
        })(),
      });
    },
    [defaultTime, format, setTime],
  );
  /**
   * 通过value字符串初始值转为time结构体
   */
  useEffect(() => {
    setTimeByValue(value as string);
  }, [setTimeByValue, value]);

  const [showPanel, setShowPanel] = useState(false);
  const makeSure = () => {
    setShowPanel(false);
  };
  const nowAction = () => {
    const t = new Date();
    setTime({
      hour: t.getHours(),
      minute: t.getMinutes(),
      second: t.getSeconds(),
      meridiem: t.getHours() <= 12 ? 'am' : 'pm',
    });
    setShowPanel(false);
  };
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });
  const closePanel = (e) => {
    document.removeEventListener('click', closePanel);
    setShowPanel(false);
    onClose(e);
  };

  const openPanel = (e) => {
    onOpen(e);
    if (disabled) return;
    document.addEventListener('click', closePanel);
    setShowPanel(true);
    setTimeout(() => {
      setTime({ ...time });
    });
  };
  /**
   * 数字前面加0
   */
  const add0 = useCallback((value) => (value <= 9 ? `0${value}` : value), []);

  const renderPopperList = useCallback(() => {
    const result: Array<JSX.Element> = [];

    if (formatParser.getUseHour(format)) {
      result.push(<PanelCol count={24} step={Number(steps[0])} time={time} timeType={'hour'} setTime={setTime} />);
    }
    if (formatParser.getUseMinute(format)) {
      result.push(<PanelCol count={60} step={Number(steps[1])} time={time} timeType={'minute'} setTime={setTime} />);
    }

    if (formatParser.getUseSecond(format)) {
      result.push(<PanelCol count={60} step={Number(steps[2])} time={time} timeType={'second'} setTime={setTime} />);
    }

    if (formatParser.getUseMeridiem(format)) {
      result.push(
        <ul className={prefixCls(['time-picker-panel', 'body-scroll'])}>
          <li className={prefixCls(['time-picker-panel', 'body-scroll-item'])}>am</li>
          <li className={prefixCls(['time-picker-panel', 'body-scroll-item'])}>pm</li>
        </ul>,
      );
    }
    return result;
  }, [format, prefixCls, time, steps]);

  /**
   * 渲染当前时间为字符串形式
   */
  const displayTime = useCallback(
    (timeType) => {
      let type: number;
      if (timeType === 'hour') {
        type = formatParser.getUseHour(format);
      } else if (timeType === 'minute') {
        type = formatParser.getUseMinute(format);
      } else if (timeType === 'second') {
        type = formatParser.getUseSecond(format);
      } else {
      }
      if (type === 2) {
        return add0(time[timeType]);
      }
      return time[timeType];
    },
    [add0, format, time],
  );
  const timeInput = useCallback(
    (e: FormEvent, timeType: string) => {
      if (disabled) return;
      const input = e.target as any;
      if (!allowInput) return;
      // e.persist();
      const value: string = (e.nativeEvent as any).data;
      if (value >= '0' && value <= '9') {
        const inputValue = input.value.slice(0, -1) | 0; // 输入之前的
        const keyValue = Number(value); // 键入的值
        if (inputValue < 10) {
          let value2 = inputValue * 10;
          value2 += keyValue;
          if (value2 >= 60) return;
          if (timeType === 'hour' && value2 >= 24) return;
          time[timeType] = value2;
          setTimeout(() => setTime({ ...time }));
        } else {
          time[timeType] = keyValue;
          setTimeout(() => setTime({ ...time }));
        }
      }
    },
    [allowInput, disabled, time],
  );

  return (
    <>
      <span
        className={prefixCls(blockName).concat(' ', className)}
        style={style}
        onClick={(e) => {
          openPanel(e);
          e.nativeEvent.stopImmediatePropagation();
        }}
        ref={setReferenceElement}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        <div className={prefixCls([blockName, 'group']) + (disabled ? ' disabled' : '')}>
          <span className={prefixCls([blockName, 'input'])}>
            {!!formatParser.getUseHour(format) && (
              <span className={prefixCls([blockName, 'input-item'])}>
                <input
                  className={prefixCls([blockName, 'input-item-input'])}
                  value={displayTime('hour')}
                  onInput={(e) => timeInput(e, 'hour')}
                />
                :
              </span>
            )}
            {!!formatParser.getUseMinute(format) && (
              <span className={prefixCls([blockName, 'input-item'])}>
                <input
                  className={prefixCls([blockName, 'input-item-input'])}
                  value={displayTime('minute')}
                  onInput={(e) => timeInput(e, 'minute')}
                />
              </span>
            )}
            {!!formatParser.getUseSecond(format) && (
              <span className={prefixCls([blockName, 'input-item'])}>
                :
                <input
                  className={prefixCls([blockName, 'input-item-input'])}
                  value={displayTime('second')}
                  onInput={(e) => timeInput(e, 'second')}
                />
              </span>
            )}
          </span>
        </div>
      </span>
      <div
        className={prefixCls(['time-picker-panel'], ['time-picker-panel', 'container'])}
        ref={setPopperElement}
        style={{ ...styles.popper, display: showPanel ? 'block' : 'none' }}
        onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
        {...attributes.popper}
      >
        <div className={prefixCls(['time-picker-panel-section', 'body'])}>
          <div className={prefixCls('time-picker-panel')}>
            <div className={prefixCls(['time-picker-panel', 'header'])}>{display}</div>
            <div className={prefixCls(['time-picker-panel', 'body'])}>{renderPopperList()}</div>
          </div>
        </div>
        <div className={prefixCls(['time-picker-panel-section', 'footer'])}>
          <button
            onClick={nowAction.bind(this)}
            type="button"
            className={prefixCls('button', 'size-m', 'button--variant-base', 'button--theme-default')}
          >
            此刻
          </button>
          <button
            onClick={makeSure.bind(this)}
            type="button"
            className={prefixCls(
              'button',
              'size-m',
              'button--variant-base',
              'button--theme-default',
              'time-picker-panel-section__footer-button',
            )}
          >
            确定
          </button>
        </div>
      </div>
    </>
  );
};
// TODO: timeRangePicker api还未定稿 暂不实现
const TimeRange: React.FC<TimePickerProps> = (props) => {
  const { value = [], onChange = noop } = props;
  const { classPrefix } = useConfig();

  const prefixCls = React.useCallback(
    (...args: (string | [string, string?, string?])[]) => {
      let className = '';
      args.forEach((item, index) => {
        if (item && index > 0) className = className.concat(' ');
        if (item instanceof Array) {
          const [block, element, modifier] = item;
          className = className.concat(classPrefix, '-', block);
          if (element) className = className.concat('__', element);
          if (modifier) className = className.concat('--', modifier);
        } else if (typeof item === 'string') {
          className = className.concat(classPrefix, '-', item);
        }
      });
      return className;
    },
    [classPrefix],
  );

  const [time1, setTime1] = React.useState<string>('');
  const [time2, setTime2] = React.useState<string>('');

  React.useEffect(() => onChange([time1, time2]), [time1, time2, onChange]);

  React.useEffect(() => {
    setTime1(value[0]);
    setTime2(value[1]);
  }, [value]);

  return (
    <div className={prefixCls(`${blockName}-section`)}>
      <div className={prefixCls([`${blockName}-section`, 'body'])}>
        <TimePanel {...props} value={value[0]} onChange={(time: string) => setTime1(time)} />
        <div className={prefixCls([blockName, 'gap'])}>
          <div className={prefixCls([blockName, 'gap-top'])}>至</div>
        </div>
        <TimePanel {...props} value={value[1]} onChange={(time: string) => setTime2(time)} />
      </div>
    </div>
  );
};

const TimePicker: React.FC<TimePickerProps> = (props) => {
  if (typeof props.value === 'string') return <TimePanel {...props} />;
  if (props.value instanceof Array) return <TimeRange {...props} />;
  return null;
};

export default TimePicker;
