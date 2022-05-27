import React, { FC, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import debounce from 'lodash/debounce';
import padStart from 'lodash/padStart';
import range from 'lodash/range';

import useConfig from '../../_util/useConfig';
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

const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];

export interface SinglePanelProps
  extends Pick<TdTimePickerProps, 'steps' | 'format' | 'value' | 'hideDisabledTime' | 'onChange'> {
  disableTime?: (
    h: number,
    m: number,
    s: number,
    context?: { partial: TimeRangePickerPartial },
  ) => Partial<{ hour: number[]; minute: number[]; second: number[] }>;
  position?: TimeRangePickerPartial;
}

// https://github.com/iamkun/dayjs/issues/1552
dayjs.extend(customParseFormat);

const SinglePanel: FC<SinglePanelProps> = (props) => {
  const { steps, format, onChange = noop, value, hideDisabledTime = true, disableTime, position = 'start' } = props;
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
    const [, startCol, hourCol, minuteCol, secondCol, endCol] = match;
    const { meridiem, hour, minute, second } = EPickerCols;

    const renderCol = [
      startCol && meridiem,
      hourCol && hour,
      minuteCol && minute,
      secondCol && second,
      endCol && meridiem,
    ].filter((v) => !!v);

    setCols(renderCol);
  }, [format]);

  // 获取每个时间的高度
  const getItemHeight = useCallback(() => {
    const maskDom = maskRef?.current?.querySelector('div');
    const timeItemTotalHeight = maskDom.offsetHeight + parseInt(getComputedStyle(maskDom).marginTop, 10);
    return timeItemTotalHeight;
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
        const colStep = steps[colIdx];

        if (col === EPickerCols.hour) count = TWELVE_HOUR_FORMAT.test(format) ? 11 : 23;
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
        (time as number) %= 12; // 一定是数字，直接cast

      const itemIdx = getColList(col).indexOf(padStart(String(time), 2, '0'));
      const timeItemTotalHeight = getItemHeight();
      const distance = Math.abs(itemIdx * timeItemTotalHeight + timeItemTotalHeight / 2);
      return distance;
    },
    [getItemHeight, getColList, format],
  );

  const handleScroll = (col: EPickerCols, idx: number) => {
    let val: number | string;
    let formattedVal: string;
    const scrollTop = colsRef.current[idx]?.scrollTop;

    let colStep = Math.abs(Math.round(scrollTop / getItemHeight() + 0.5));
    const meridiem = MERIDIEM_LIST[Math.min(colStep - 1, 1)].toLowerCase(); // 处理PM、AM与am、pm

    if (Number.isNaN(colStep)) colStep = 1;
    if (timeArr.includes(col)) {
      // hour、minute and second columns
      let max = 59;
      if (col === EPickerCols.hour) {
        max = /[h]{1}/.test(format) ? 11 : 23;
      }
      const colIdx = timeArr.indexOf(col);
      const availableArr = range(0, max + 1, Number(steps[colIdx]));
      val = closestLookup(
        availableArr,
        Number(getColList(col)[Math.min(colStep - 1, max + 1, availableArr.length - 1)]),
        Number(steps[colIdx]),
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

    if (!dayjs(dayjsValue).isValid()) return;
    if (distance !== scrollTop) {
      if (timeArr.includes(col)) {
        if (timeItemCanUsed(col, val)) formattedVal = dayjsValue[col]?.(val).format(format);
      } else {
        const currentHour = dayjsValue.hour();
        if (meridiem === AM && currentHour >= 12) {
          formattedVal = dayjsValue.hour(currentHour - 12).format(format);
        } else if (meridiem === PM && currentHour < 12) {
          formattedVal = dayjsValue.hour(currentHour + 12).format(format);
        }
      }
      onChange(formattedVal);
      const scrollCtrl = colsRef.current[cols.indexOf(col)];
      if (!distance || !scrollCtrl || scrollCtrl.scrollTop === distance) return;

      scrollCtrl.scrollTo({
        top: distance,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTime = useCallback(
    (col: EPickerCols, time: number | string, idx: number, behavior: 'auto' | 'smooth' = 'auto') => {
      const distance = getScrollDistance(col, time);
      const scrollCtrl = colsRef.current[idx];
      if (!distance || !scrollCtrl || scrollCtrl.scrollTop === distance || !timeItemCanUsed(col, time)) return;

      scrollCtrl.scrollTo({
        top: distance,
        behavior,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getScrollDistance],
  );

  const handleTimeItemClick = (col: EPickerCols, el: string | number) => {
    if (!timeItemCanUsed(col, el)) return;
    if (timeArr.includes(col)) {
      if (col === EPickerCols.hour && dayjsValue.format('a') === PM && cols.includes(EPickerCols.meridiem)) {
        // eslint-disable-next-line no-param-reassign
        el = Number(el) + 12;
      }
      value ? onChange(dayjsValue[col]?.(el).format(format)) : onChange(dayjsValue[col]?.(el).format(format));
    } else {
      const currentHour = dayjsValue.hour();
      if (el === AM && currentHour >= 12) {
        onChange(dayjsValue.hour(currentHour - 12).format(format));
      } else if (el === PM && currentHour < 12) {
        onChange(dayjsValue.hour(currentHour + 12).format(format));
      }
    }
  };

  // update each columns scroll distance
  const updateTimeScrollPos = useCallback(() => {
    const behavior = value ? 'smooth' : 'auto';
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
  }, [cols, scrollToTime, dayjsValue, value, steps, getColList]);

  useEffect(() => {
    updateTimeScrollPos();
  });

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
        onScroll={debounce(() => handleScroll(col, idx), 50)}
      >
        {getColList(col).map((el) => (
          <li
            key={el}
            className={classNames(`${panelClassName}-body-scroll-item`, {
              [`${classPrefix}-is-disabled`]: !timeItemCanUsed(col, el),
              [`${classPrefix}-is-current`]: isCurrent(col, el),
            })}
            onClick={() => handleTimeItemClick(col, el)}
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {timeArr.includes(col) ? (TWELVE_HOUR_FORMAT.test(format) && el === '00' ? '12' : el) : TEXT_CONFIG[el]}
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
