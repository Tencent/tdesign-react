import React, { FC, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import padStart from 'lodash/padStart';
import range from 'lodash/range';

import useConfig from '../../_util/useConfig';
import noop from '../../_util/noop';

import { TdTimePickerProps } from '../type';
import { EPickerCols } from '../interfaces';

import { MERIDIEM_LIST, AM, PM, useTimePickerTextConfig } from '../consts';

const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];

export type SinglePanelProps = Pick<
  TdTimePickerProps,
  'steps' | 'format' | 'disableTime' | 'value' | 'hideDisabledTime' | 'onChange'
>;

const SinglePanel: FC<SinglePanelProps> = (props) => {
  const { steps, format, onChange = noop, value, hideDisabledTime = true, disableTime } = props;
  const { classPrefix } = useConfig();
  const TEXT_CONFIG = useTimePickerTextConfig();

  const panelClassName = `${classPrefix}-time-picker-panel`;

  const [cols, setCols] = useState<Array<EPickerCols>>([]);
  const colsRef = useRef([]);
  const maskRef = useRef(null);

  const dayjsValue = useMemo(() => {
    const isStepsSet = !!steps.filter((v) => v > 1).length;

    if (value) {
      return dayjs(value, format);
    }
    if (isStepsSet) {
      return dayjs()
        .hour(Number(steps[0]) - 1)
        .minute(Number(steps[1]) - 1)
        .second(Number(steps[2]) - 1);
    }
    return dayjs();
  }, [value, format, steps]);

  useEffect(() => {
    colsRef.current = colsRef.current.slice(0, cols.length);
  }, [cols]);

  useEffect(() => {
    const match = format.match(/(a\s+|A\s+)?(h+|H+)?:?(m+)?:?(s+)?(\s+a|\s+A)?/);
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
    const timeItemTotalHeight = maskDom.offsetHeight + parseInt(getComputedStyle(maskDom).margin, 10);
    return timeItemTotalHeight;
  }, []);

  const closestLookup = (availableArr: Array<any>, calcVal: number, step: number) => {
    if (step <= 1) return calcVal;
    return availableArr.sort((a, b) => Math.abs(calcVal + 1 - a) - Math.abs(calcVal + 1 - b))[0];
  };

  const timeItemCanUsed = (col: EPickerCols, el: string | number) => {
    const colIdx = timeArr.indexOf(col);
    if (colIdx !== -1) {
      const params: [number, number, number] = [dayjsValue.hour(), dayjsValue.minute(), dayjsValue.second()];
      params[colIdx] = el as number;
      return !(disableTime && disableTime?.(...params));
    }
    return true;
  };

  // 获取需要渲染的column
  const getColList = useCallback(
    (col: EPickerCols) => {
      let count = 0;

      if (timeArr.includes(col)) {
        // hour/minute/second column scorller render
        const colIdx = timeArr.indexOf(col);
        const colStep = steps[colIdx];
        if (col === EPickerCols.hour) {
          count = /[h]{1}/.test(format) ? 11 : 23;
        } else {
          count = 59;
        }
        const colList =
          range(Number(colStep) - 1, count + 1, Number(colStep)).map((v) => padStart(String(v), 2, '0')) || [];

        return hideDisabledTime && !!disableTime
          ? colList.filter((t) => {
              const params: [number, number, number] = [dayjsValue.hour(), dayjsValue.minute(), dayjsValue.second()];
              params[colIdx] = Number(t);
              return !disableTime?.(...params);
            })
          : colList;
      }
      // meridiem column scroller render
      return MERIDIEM_LIST;
    },
    [steps, format, hideDisabledTime, dayjsValue, disableTime],
  );

  const getScrollDistance = useCallback(
    (col: EPickerCols, time: number | string) => {
      if (col === EPickerCols.hour && /[h]{1}/.test(format)) {
        // eslint-disable-next-line no-param-reassign
        (time as number) %= 12; // 一定是数字 直接cast
      }

      const itemIdx = getColList(col).indexOf(padStart(String(time), 2, '0'));

      const timeItemTotalHeight = getItemHeight();
      const distance = Math.abs(itemIdx * timeItemTotalHeight + timeItemTotalHeight / 2);
      return distance;
    },
    [getItemHeight, getColList, format],
  );

  const handleScroll = (col: EPickerCols, idx: number) => {
    let val: number;
    const scrollTop = colsRef.current[idx]?.scrollTop;
    if (timeArr.includes(col)) {
      // hour/minute/second col scorll
      let max = 59;
      if (col === EPickerCols.hour) {
        max = /[h]{1}/.test(format) ? 11 : 23;
      }
      const colIdx = timeArr.indexOf(col);

      val = Math.min(Math.abs(Math.round(scrollTop / getItemHeight())), max);

      val = closestLookup(
        range(Number(steps[colIdx]) - 1, max + 1, Number(steps[colIdx])),
        Number(getColList(col)[val]),
        Number(steps[colIdx]),
      );
      if (col === EPickerCols.hour && cols.includes(EPickerCols.meridiem) && dayjsValue.hour() > 12) {
        // 如果是十二小时制需要再判断
        val = Number(val) + 12;
      }
      if (timeItemCanUsed(col, val))
        value ? onChange(dayjsValue[col]?.(val).format(format)) : onChange(dayjsValue[col]?.(val).format(format));
    } else {
      // meridiem col scorll
      const val = Math.min(Math.abs(Math.round(scrollTop / getItemHeight())), 1);
      const m = MERIDIEM_LIST[val].toLowerCase(); // 处理PM/AM与am/pm
      const currentHour = dayjsValue.hour();
      if (m === AM && currentHour >= 12) {
        onChange(dayjsValue.hour(currentHour - 12).format(format));
      } else if (m === PM && currentHour < 12) {
        onChange(dayjsValue.hour(currentHour + 12).format(format));
      }
    }
    const distance = getScrollDistance(col, val);

    if (distance !== scrollTop) {
      const scroller = colsRef.current[cols.indexOf(col)];
      if (!distance || !scroller || scroller.scrollTop === distance) return;

      scroller.scrollTo({
        top: distance,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTime = useCallback(
    (col: EPickerCols, time: number | string, idx: number, behavior: 'auto' | 'smooth' = 'auto') => {
      const distance = getScrollDistance(col, time);
      const scroller = colsRef.current[idx];
      if (!distance || !scroller || scroller.scrollTop === distance) return;

      scroller.scrollTo({
        top: distance,
        behavior,
      });
    },
    [getScrollDistance],
  );

  const handleTimeItemClick = (col: EPickerCols, el: string | number) => {
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

  function renderScrollers() {
    return cols.map((col, idx) => (
      <ul
        key={`${col}_${idx}`}
        ref={(el) => (colsRef.current[idx] = el)}
        className={`${panelClassName}__body-scroll`}
        onWheel={debounce(() => handleScroll(col, idx), 50)}
      >
        {getColList(col).map((el) => (
          <li
            key={el}
            className={classNames(`${panelClassName}__body-scroll-item`, {
              [`${classPrefix}-is-disabled`]: !timeItemCanUsed(col, el),
              [`${classPrefix}-is-current`]: isCurrent(col, el),
            })}
            onClick={() => handleTimeItemClick(col, el)}
          >
            {timeArr.includes(col) ? el : TEXT_CONFIG[el]}
          </li>
        ))}
      </ul>
    ));
  }

  return (
    <div className={`${panelClassName}__body`}>
      {/* render mask */}
      <div className={`${panelClassName}__body-active-mask`} ref={maskRef}>
        {cols.map((col, idx) => (
          <div key={`${col}_${idx}`} />
        ))}
      </div>
      {renderScrollers()}
    </div>
  );
};

export default SinglePanel;
