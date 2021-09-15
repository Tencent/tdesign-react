import React, { FC, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import padStart from 'lodash/padStart';
import range from 'lodash/range';

import useConfig from '../../_util/useConfig';

import { TdTimePickerProps } from '../../_type/components/time-picker';
import { EPickerCols } from '../interfaces';

import { TEXT_CONFIG, MERIDIEM_LIST, AM, PM } from '../consts';

const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];

export type SinglePanelProps = Pick<
  TdTimePickerProps,
  'steps' | 'format' | 'disableTime' | 'value' | 'hideDisabledTime' | 'onChange'
>;

const SinglePanel: FC<SinglePanelProps> = (props) => {
  const { steps, format, onChange, value, hideDisabledTime, disableTime } = props;
  const { classPrefix } = useConfig();

  const panelClassName = `${classPrefix}-time-picker-panel`;

  const [cols, setCols] = useState<Array<EPickerCols>>([]);
  const colsRef = useRef([]);
  const maskRef = useRef(null);

  useEffect(() => {
    colsRef.current = colsRef.current.slice(0, cols.length);
  }, [cols]);

  const dayjsValue = useMemo(() => (value ? dayjs(value, format) : dayjs()), [value, format]);

  useEffect(() => {
    const match = format.match(/(a\s+|A\s+)?(h+|H+)?:?(m+)?:?(s+)?(\s+a|A)?/);
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
      const stepHeight = getItemHeight() / Number(steps[colIdx]);
      val = Math.min(Math.abs(Math.round(scrollTop / stepHeight)), max);
      val = closestLookup(range(Number(steps[colIdx]) - 1, max + 1, Number(steps[colIdx])), val, Number(steps[colIdx]));
      if (timeItemCanUsed(col, val)) {
        value ? onChange(dayjsValue[col]?.(val).format(format)) : onChange(dayjsValue[col]?.(val).format(format));
      }
    } else {
      // meridiem col scorll
      const val = Math.min(Math.abs(Math.round(scrollTop / getItemHeight())), 1);
      const m = MERIDIEM_LIST[val];
      const currentHour = dayjsValue.hour();
      if (m === AM && currentHour >= 12) {
        onChange(dayjsValue.hour(currentHour - 12).format(format));
      } else if (m === PM && currentHour < 12) {
        onChange(dayjsValue.hour(currentHour + 12).format(format));
      }
    }
  };

  const generateColList = useCallback(
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
        // why count + 1 ? to reach maximum
        const colList =
          range(Number(colStep) - 1, count + 1, Number(colStep)).map((v) => padStart(String(v), 2, '0')) || [];

        return hideDisabledTime && !!disableTime
          ? colList.filter((t) => {
              const params: [number, number, number] = [dayjsValue.hour(), dayjsValue.minute(), dayjsValue.second()];
              params[colIdx] = Number(t);
              return !disableTime?.apply(this, params);
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
      let itemIdx: number;

      if (timeArr.includes(col)) {
        const colIdx = timeArr.indexOf(col);
        itemIdx = Math.floor(Number(time) / Number(steps[colIdx]));
        if (col === EPickerCols.hour && /[h]{1}/.test(format)) {
          itemIdx %= 12;
        }
      } else {
        itemIdx = MERIDIEM_LIST.indexOf(time as string);
      }
      const timeItemTotalHeight = getItemHeight();
      const distance = itemIdx * timeItemTotalHeight + timeItemTotalHeight / 2;
      return distance;
    },
    [format, getItemHeight, steps],
  );

  const scrollToTime = useCallback(
    (col: EPickerCols, time: number | string, idx: number, behavior?: 'auto' | 'smooth') => {
      const distance = getScrollDistance(col, time);
      const scroller = colsRef.current[idx];
      if (!distance || !scroller || scroller.scrollTop === distance) return;

      scroller.scrollTo({
        top: distance,
        behavior: behavior || 'smooth',
      });
    },
    [getScrollDistance],
  );

  const handleTimeItemClick = (col: EPickerCols, el: string | number, idx: number) => {
    if (timeArr.includes(col)) {
      value ? onChange(dayjs(value, format)[col]?.(el).format(format)) : onChange(dayjs()[col]?.(el).format(format));
    } else {
      const currentHour = dayjsValue.hour();
      if (el === AM && currentHour >= 12) {
        onChange(dayjsValue.hour(currentHour - 12).format(format));
      } else if (el === PM && currentHour < 12) {
        onChange(dayjsValue.hour(currentHour + 12).format(format));
      }
    }
    scrollToTime(col, el, idx, 'smooth');
  };

  // update each columns scroll distance
  const updateTimeScrollPos = useCallback(() => {
    cols.forEach((col: EPickerCols, idx: number) => {
      if (timeArr.includes(col)) scrollToTime(col, dayjsValue[col]?.(), idx, 'auto');
      else scrollToTime(col, dayjsValue.format('a'), idx, 'auto');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, format, scrollToTime]);

  useEffect(() => {
    updateTimeScrollPos();
  }, [updateTimeScrollPos]);

  const isCurrent = useCallback(
    (col: EPickerCols, colItem: string | number) => {
      let colVal: number;
      if (col === EPickerCols.meridiem) {
        const currentMeridiem = value ? dayjs(value, format).format('a') : dayjs().format('a');
        return currentMeridiem === colItem;
      }
      colVal = value ? dayjs(value, format)[col]?.() : dayjs()[col]?.();
      if (col === EPickerCols.hour && /[h]{1}/.test(format)) {
        colVal %= 12;
      }
      return colVal === Number(colItem);
    },
    [format, value],
  );

  function renderScrollers() {
    return cols.map((col, idx) => (
      <ul
        className={`${panelClassName}__body-scroll`}
        key={`${col}_${idx}`}
        ref={(el) => (colsRef.current[idx] = el)}
        onWheel={debounce(() => handleScroll(col, idx), 50)}
      >
        {generateColList(col).map((el) => (
          <li
            key={el}
            className={classNames([
              `${panelClassName}__body-scroll-item`,
              {
                [`${classPrefix}-is-disabled`]: !timeItemCanUsed(col, el),
                [`${classPrefix}-is-current`]: isCurrent(col, el),
              },
            ])}
            onClick={() => handleTimeItemClick(col, el, idx)}
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
      {/* render scroller */}
      {renderScrollers()}
    </div>
  );
};

export default SinglePanel;
