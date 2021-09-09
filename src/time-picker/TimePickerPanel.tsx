import React, { FC, useCallback, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import range from 'lodash/range';
import padStart from 'lodash/padStart';

import useConfig from '../_util/useConfig';
import Button from '../button';

import { TdTimePickerProps } from '../_type/components/time-picker';
import { EPickerCols, TimeInputType } from './interfaces';

export interface TimePickerPanelProps
  extends Pick<TdTimePickerProps, 'steps' | 'format' | 'disableTime' | 'onChange' | 'value'> {
  // 是否展示footer
  isFooterDisplay?: boolean;
  // 是否展示为range
  isRangePicker?: boolean;
}

const TimePickerPanel: FC<TimePickerPanelProps> = (props) => {
  const { isFooterDisplay, isRangePicker, steps, format, onChange, value, disableTime } = props;
  const { classPrefix } = useConfig();

  const panelClassName = `${classPrefix}-time-picker-panel`;

  const [cols, setCols] = useState<Array<EPickerCols>>([]);
  const colsRef = useRef([]);

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

  useEffect(() => {
    colsRef.current = colsRef.current.slice(0, cols.length);
  }, [cols]);

  const getTimeItemHeight = (col: EPickerCols) => {
    // TODO
    console.log(null);
    return 40;
  };

  const handleScroll = (col: EPickerCols, idx: number) => {
    const scrollTop = colsRef.current[idx]?.scrollTop;
    const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];
    let val: number;
    if (timeArr.includes(col)) {
      // 处理时间相关col的滚动
      const colIdx = timeArr.indexOf(col);
      let max = 59;
      if (col === EPickerCols.hour) {
        max = /[h]{1}/.test(format) ? 11 : 23;
      }
      val = Math.min(Math.abs(Math.round(scrollTop / getTimeItemHeight(col))), max);
      // scrollVal = this.closestLookup(availableList, scrollVal, Number(this.steps[colIdx]));
    } else {
      // 处理非时间col的相关的滚动
    }
    if (value) {
      onChange(dayjs(value, format)[col]?.(val).format(format));
    } else {
      onChange(dayjs()[col]?.(val).format(format));
    }
  };

  const generateColList = useCallback(
    (col: TimeInputType) => {
      let count = 0;

      const timeArr: Array<TimeInputType> = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];
      if (timeArr.includes(col)) {
        // handle hour/minute/second column scorller render
        const colIdx = timeArr.indexOf(col);
        const colStep = steps[colIdx];
        if (col === EPickerCols.hour) {
          count = /[h]{1}/.test(format) ? 12 : 24;
        } else {
          count = 60;
        }

        return range(Number(colStep) - 1, count, Number(colStep)).map((v) => padStart(String(v), 2, '0')) || [];
      }
      return [];
    },
    [steps, format],
  );

  const handleClickConfirm = () => {
    // TODO
  };

  const calculateTimeIdx = (time: number | string, step: number | string, type: EPickerCols) => {
    const timeIdx = time;
    // timeIdx = disableFilter(Number(timeIdx), type);
    return Math.floor(Number(timeIdx) / Number(step));
  };

  const getScrollDistance = (col: EPickerCols, time: number | string) => {
    let timeIndex: number;

    const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];
    if (timeArr.includes(col)) {
      const colIdx = timeArr.indexOf(col);
      timeIndex = calculateTimeIdx(time, steps[colIdx], col);
      if (col === EPickerCols.hour && /[h]{1}/.test(format)) {
        timeIndex %= 12;
      }
    } else {
      // TODO
    }
    const timeItemTotalHeight = getTimeItemHeight(col);
    const distance = timeIndex * timeItemTotalHeight + timeItemTotalHeight / 2;
    return distance;
  };

  const scrollToTime = (col: EPickerCols, time: number | string, idx: number) => {
    const distance = getScrollDistance(col, time);
    const scroller = colsRef.current[idx];
    if (!distance || !scroller) return;
    if (scroller.scrollTop === distance) return;

    scroller.scrollTo({
      top: distance,
      behavior: 'smooth',
    });
  };

  const handleTimeItemClick = (col: EPickerCols, el: string | number, idx: number) => {
    // TODO
    if (value) {
      onChange(dayjs(value, format)[col]?.(el).format(format));
    } else {
      onChange(dayjs()[col]?.(el).format(format));
    }

    scrollToTime(col, el, idx);
  };

  // update each columns scroll distance
  const updateTimeScrollPos = useCallback(() => {
    const dayjsValue = value ? dayjs(value, format) : dayjs();
    cols.forEach((col: EPickerCols, idx: number) => {
      scrollToTime(col, dayjsValue[col]?.(), idx);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, format, scrollToTime]);

  useEffect(() => {
    updateTimeScrollPos();
  }, [updateTimeScrollPos]);

  const isCurrent = useCallback(
    (col: TimeInputType, colItem: string | number) => {
      let colVal: number;
      if (col === EPickerCols.meridiem) {
        // TODO
        return false;
      }
      colVal = dayjs(value, format)[col]?.();
      if (col === EPickerCols.hour && /[h]{1}/.test(format)) {
        colVal %= 12;
      }
      return colVal === Number(colItem);
    },
    [format, value],
  );

  // render scroller
  const renderScrollers = () =>
    cols.map((col, idx) => (
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
                // [`${classPrefix}-is-disabled`]: !timeItemCanUsed(col, el),
                [`${classPrefix}-is-current`]: isCurrent(col, el),
              },
            ])}
            onClick={() => handleTimeItemClick(col, el, idx)}
          >
            {el}
          </li>
        ))}
      </ul>
    ));

  return (
    <div className={panelClassName}>
      <div className={`${panelClassName}-section__body`}>
        <div className={`${panelClassName}__body`}>
          {/* render mask */}
          <div className={`${panelClassName}__body-active-mask`}>
            {cols.map((col, idx) => (
              <div key={`${col}_${idx}`} />
            ))}
          </div>
          {renderScrollers()}
        </div>
      </div>
      {isFooterDisplay ? (
        <div className={`${panelClassName}-section__footer`}>
          {/* row-reverse */}
          <Button theme="primary" variant="base" onClick={handleClickConfirm}>
            确定
          </Button>
          {!isRangePicker ? (
            <Button theme="primary" variant="text" onClick={() => onChange(dayjs().format(format))}>
              此刻
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default TimePickerPanel;
