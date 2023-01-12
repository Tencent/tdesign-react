import React, {
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  CSSProperties,
  MouseEvent,
  UIEvent,
} from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import padStart from 'lodash/padStart';
import range from 'lodash/range';

import useConfig from '../../hooks/useConfig';
import noop from '../../_util/noop';
import { useTimePickerTextConfig } from '../hooks/useTimePickerTextConfig';
import {
  AM,
  PM,
  EPickerCols,
  TIME_FORMAT,
  MERIDIEM_LIST,
  TWELVE_HOUR_FORMAT,
} from '../../_common/js/time-picker/const';
import { closestLookup } from '../../_common/js/time-picker/utils';

import { TdTimePickerProps, TimeRangePickerPartial } from '../type';
import useDebounce from '../../hooks/useDebounce';
import { usePropRef } from '../../hooks/usePropsRef';

const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second, EPickerCols.milliSecond];

const panelOffset = {
  top: 15,
  bottom: 21,
};

export interface SinglePanelProps
  extends Pick<TdTimePickerProps, 'steps' | 'format' | 'value' | 'hideDisabledTime' | 'onPick'> {
  disableTime?: (
    h: number,
    m: number,
    s: number,
    context?: { partial: TimeRangePickerPartial },
  ) => Partial<{ hour: number[]; minute: number[]; second: number[] }>;
  position?: TimeRangePickerPartial;
  triggerScroll?: boolean;
  resetTriggerScroll?: () => void;
  isVisible?: boolean;
  onChange: Function;
}

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

const SinglePanel: FC<SinglePanelProps> = (props) => {
  const {
    steps,
    format,
    onChange = noop,
    value,
    hideDisabledTime = true,
    disableTime,
    position = 'start',
    triggerScroll,
    resetTriggerScroll,
    isVisible,
  } = props;
  const { classPrefix } = useConfig();
  const TEXT_CONFIG = useTimePickerTextConfig();
  const panelClassName = `${classPrefix}-time-picker__panel`;

  const [cols, setCols] = useState<Array<EPickerCols>>([]);
  const colsRef = useRef([]);
  const maskRef = useRef(null);

  const dayjsValue = useMemo(() => {
    const isStepsSet = !!steps.filter((v) => v > 1).length;

    if (value) return dayjs(value, format);

    if (isStepsSet) return dayjs().hour(0).minute(0).second(0);

    return dayjs();
  }, [value, format, steps]);

  useEffect(() => {
    colsRef.current = colsRef.current.slice(0, cols.length);
  }, [cols]);

  useEffect(() => {
    const match = format.match(TIME_FORMAT);
    const [, startCol, hourCol, minuteCol, secondCol, milliSecondCol, endCol] = match;
    const { meridiem, hour, minute, second, milliSecond } = EPickerCols;

    const renderCol = [
      startCol && meridiem,
      hourCol && hour,
      minuteCol && minute,
      secondCol && second,
      milliSecondCol && milliSecond,
      endCol && meridiem,
    ].filter((v) => !!v);

    setCols(renderCol);
  }, [format]);

  // 获取每个时间的高度
  const getItemHeight = useCallback(() => {
    const maskDom = maskRef?.current?.querySelector('div');
    if (!maskDom) {
      return {
        offsetHeight: 0,
        margin: 0,
      };
    }
    return {
      offsetHeight: maskDom.offsetHeight,
      margin: parseInt(getComputedStyle(maskDom).marginTop, 10),
    };
  }, []);

  const timeItemCanUsed = useCallback(
    (col: EPickerCols, el: string | number) => {
      const colIdx = timeArr.indexOf(col);
      if (colIdx !== -1) {
        const params: [number, number, number] = [dayjsValue.hour(), dayjsValue.minute(), dayjsValue.second()];
        params[colIdx] = Number(el);
        return !(disableTime && disableTime?.(...params, { partial: position }))?.[col]?.includes(Number(el));
      }
      return true;
    },
    [position, disableTime, dayjsValue],
  );

  // 获取需要渲染的column
  const getColList = useCallback(
    (col: EPickerCols) => {
      let count = 0;

      if (timeArr.includes(col)) {
        // hour、minute and second columns
        const colIdx = timeArr.indexOf(col);
        const colStep = steps[colIdx] || 1;

        if (col === EPickerCols.hour) count = TWELVE_HOUR_FORMAT.test(format) ? 11 : 23;
        // 小时最大为23 12小时制最大为11
        else if (col === EPickerCols.milliSecond) count = 999;
        // 毫秒最大为999
        else count = 59;

        const colList = range(0, count + 1, Number(colStep)).map((v) => padStart(String(v), 2, '0')) || [];

        return hideDisabledTime && !!disableTime
          ? colList.filter((t) => {
              const params: [number, number, number] = [dayjsValue.hour(), dayjsValue.minute(), dayjsValue.second()];
              params[colIdx] = Number(t);
              return !disableTime?.(...params, { partial: position })?.[col]?.includes(Number(t));
            })
          : colList;
      }
      // meridiem column
      return MERIDIEM_LIST;
    },
    [steps, format, hideDisabledTime, dayjsValue, disableTime, position],
  );

  const getScrollDistance = useCallback(
    (col: EPickerCols, time: number | string) => {
      if (col === EPickerCols.hour && /[h]{1}/.test(format))
        // eslint-disable-next-line no-param-reassign
        (time as number) %= 12; // 一定是数字，直接 cast

      const itemIdx = getColList(col).indexOf(padStart(String(time), 2, '0'));
      const { offsetHeight, margin } = getItemHeight();
      const timeItemTotalHeight = offsetHeight + margin;
      const distance = Math.abs(Math.max(0, itemIdx) * timeItemTotalHeight);
      return distance;
    },
    [getItemHeight, getColList, format],
  );

  const isVisibleRef = usePropRef(isVisible);

  const handleScroll = useDebounce((col: EPickerCols, idx: number, e: MouseEvent | UIEvent) => {
    // 如果不可见，不处理 scroll 事件
    if (!isVisibleRef.current) {
      return;
    }

    let val: number | string;
    let formattedVal: string;
    const scrollTop = colsRef.current[idx]?.scrollTop + panelOffset.top;
    const { offsetHeight, margin } = getItemHeight();
    const timeItemTotalHeight = offsetHeight + margin;
    let colStep = Math.abs(Math.round(scrollTop / timeItemTotalHeight + 0.5));
    const meridiem = MERIDIEM_LIST[Math.min(colStep - 1, 1)].toLowerCase(); // 处理PM、AM与am、pm

    if (Number.isNaN(colStep)) colStep = 1;
    if (timeArr.includes(col)) {
      // hour、minute and second columns
      let max = 59;
      if (col === EPickerCols.hour) max = /[h]{1}/.test(format) ? 11 : 23;
      // 小时最大为23 12小时制最大为11
      else if (col === EPickerCols.milliSecond) max = 999; // 毫秒最大为999

      const colIdx = timeArr.indexOf(col);
      const availableArr = range(0, max + 1, Number(steps[colIdx]) || 1);

      val = closestLookup(
        availableArr,
        Number(getColList(col)[Math.min(colStep - 1, max + 1, availableArr.length - 1)]),
        Number(steps[colIdx]) || 1,
      );
      if (Number.isNaN(val)) val = availableArr[availableArr.length - 1];
      if (col === EPickerCols.hour && cols.includes(EPickerCols.meridiem) && dayjsValue.hour() >= 12) {
        // 如果是十二小时制需要再判断
        val = Number(val) + 12;
      }
    }
    // meridiem columns
    else val = meridiem;

    const distance = getScrollDistance(col, val);
    if (
      !dayjs(dayjsValue).isValid() ||
      // 过滤键盘错误输入
      (value && !dayjs(value, format, true).isValid())
    ) {
      return;
    }
    if (timeArr.includes(col)) {
      if (timeItemCanUsed(col, val)) formattedVal = dayjsValue[col]?.(val).format(format);
    } else {
      const currentHour = dayjsValue.hour();
      if (meridiem === AM && currentHour >= 12) {
        formattedVal = dayjsValue.hour(currentHour - 12).format(format);
      } else if (meridiem === PM && currentHour < 12) {
        formattedVal = dayjsValue.hour(currentHour + 12).format(format);
      } else {
        formattedVal = dayjsValue.format(format);
      }
    }

    if (formattedVal !== value) {
      onChange(formattedVal, e);
    }

    if (distance !== scrollTop) {
      const scrollCtrl = colsRef.current[cols.indexOf(col)];
      if (!scrollCtrl || scrollCtrl.scrollTop === distance) return;

      scrollCtrl.scrollTo?.({
        top: distance,
        behavior: 'smooth',
      });
    }
  }, 50);

  const scrollToTime = useCallback(
    (col: EPickerCols, time: number | string, idx: number, behavior: 'auto' | 'smooth' = 'auto') => {
      const distance = getScrollDistance(col, time);
      const scrollCtrl = colsRef.current[idx];
      if (!scrollCtrl || scrollCtrl.scrollTop === distance || !timeItemCanUsed(col, time)) return;

      scrollCtrl.scrollTo?.({
        top: distance,
        behavior,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getScrollDistance],
  );

  // update each columns scroll distance
  const updateTimeScrollPos = useCallback(
    (isAutoScroll = false) => {
      const behavior = value && !isAutoScroll ? 'smooth' : 'auto';
      const isStepsSet = !!steps.filter((v) => v > 1).length;

      cols.forEach((col: EPickerCols, idx: number) => {
        if (!isStepsSet || (isStepsSet && value)) {
          // 如果没有设置大于1的steps或设置了大于1的step 正常处理滚动
          scrollToTime(col, timeArr.includes(col) ? dayjsValue[col]?.() : dayjsValue.format('a'), idx, behavior);
        } else {
          // 否则初始化到每列第一个选项
          scrollToTime(col, getColList(col)?.[0], idx, behavior);
        }
      });
      resetTriggerScroll();
    },
    [cols, scrollToTime, dayjsValue, value, steps, getColList, resetTriggerScroll],
  );

  const handleTimeItemClick = (col: EPickerCols, el: string | number, idx: number, e: MouseEvent) => {
    if (!timeItemCanUsed(col, el)) return;
    if (timeArr.includes(col)) {
      if (col === EPickerCols.hour && dayjsValue.format('a') === PM && cols.includes(EPickerCols.meridiem)) {
        // eslint-disable-next-line no-param-reassign
        el = Number(el) + 12;
      }
      scrollToTime(col, el, idx, 'smooth');

      setTimeout(() => {
        onChange(dayjsValue[col]?.(el).format(format), e);
      }, 100);
    } else {
      const currentHour = dayjsValue.hour();
      if (el === AM && currentHour >= 12) {
        onChange(dayjsValue.hour(currentHour - 12).format(format), e);
      } else if (el === PM && currentHour < 12) {
        onChange(dayjsValue.hour(currentHour + 12).format(format), e);
      }
    }
  };

  useEffect(() => {
    if (value) updateTimeScrollPos(true);
  }, [value, updateTimeScrollPos]);

  useEffect(() => {
    if (triggerScroll) updateTimeScrollPos(true);
  }, [triggerScroll, updateTimeScrollPos]);

  const isCurrent = useCallback(
    (col: EPickerCols, colItem: string | number) => {
      let colVal: number;
      if (col === EPickerCols.meridiem) {
        const currentMeridiem = dayjsValue.format('a');
        return currentMeridiem === colItem;
      }
      colVal = dayjsValue[col]?.();
      if (col === EPickerCols.hour && /[h]{1}/.test(format)) {
        colVal %= 12;
      }
      return colVal === Number(colItem);
    },
    [format, dayjsValue],
  );

  function renderScrollCtrl() {
    return cols.map((col, idx) => (
      <ul
        key={`${col}_${idx}`}
        ref={(el) => (colsRef.current[idx] = el)}
        className={`${panelClassName}-body-scroll`}
        onScroll={(e) => handleScroll(col, idx, e)}
        style={
          {
            '--timePickerPanelOffsetTop': panelOffset.top,
            '--timePickerPanelOffsetBottom': panelOffset.bottom,
          } as CSSProperties
        }
      >
        {getColList(col).map((el) => (
          <li
            key={el}
            className={classNames(`${panelClassName}-body-scroll-item`, {
              [`${classPrefix}-is-disabled`]: !timeItemCanUsed(col, el),
              [`${classPrefix}-is-current`]: isCurrent(col, el),
            })}
            onClick={(e) => handleTimeItemClick(col, el, idx, e)}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {timeArr.includes(col)
              ? TWELVE_HOUR_FORMAT.test(format) && col === EPickerCols.hour && el === '00'
                ? '12'
                : el
              : TEXT_CONFIG[el]}
          </li>
        ))}
      </ul>
    ));
  }

  return (
    <div className={`${panelClassName}-body`}>
      {/* render mask */}
      <div className={`${panelClassName}-body-active-mask`} ref={maskRef}>
        {cols.map((col, idx) => (
          <div key={`${col}_${idx}`} />
        ))}
      </div>
      {renderScrollCtrl()}
    </div>
  );
};

export default SinglePanel;
