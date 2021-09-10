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

import { TEXT_CONFIG, MERIDIEM_LIST, AM, PM } from './consts';

const timeArr = [EPickerCols.hour, EPickerCols.minute, EPickerCols.second];

export interface TimePickerPanelProps
  extends Pick<TdTimePickerProps, 'steps' | 'format' | 'disableTime' | 'onChange' | 'value' | 'hideDisabledTime'> {
  // 是否展示footer
  isFooterDisplay?: boolean;
  // 是否展示为range
  isRangePicker?: boolean;
}

const TimePickerPanel: FC<TimePickerPanelProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isFooterDisplay, isRangePicker, steps, format, onChange, value, hideDisabledTime, disableTime } = props;
  const { classPrefix } = useConfig();

  const panelClassName = `${classPrefix}-time-picker-panel`;

  const [cols, setCols] = useState<Array<EPickerCols>>([]);
  const colsRef = useRef([]);
  const maskRef = useRef(null);

  useEffect(() => {
    colsRef.current = colsRef.current.slice(0, cols.length);
  }, [cols]);

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

  const handleScroll = (col: EPickerCols, idx: number) => {
    let val: number;
    const scrollTop = colsRef.current[idx]?.scrollTop;
    const dayjsValue = value ? dayjs(value, format) : dayjs();
    if (timeArr.includes(col)) {
      // handle hour/minute/second col scorll
      let max = 59;
      if (col === EPickerCols.hour) {
        max = /[h]{1}/.test(format) ? 11 : 23;
      }
      // const colIdx = timeArr.indexOf(col);
      // const stepHeight = getItemHeight() / Number(steps[colIdx]);
      val = Math.min(Math.abs(Math.round(scrollTop / getItemHeight())), max);
      // scrollVal = this.closestLookup(availableList, scrollVal, Number(this.steps[colIdx]));
      value ? onChange(dayjsValue[col]?.(val).format(format)) : onChange(dayjsValue[col]?.(val).format(format));
    } else {
      // handle meridiem col scorll
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
        // handle hour/minute/second column scorller render
        const colIdx = timeArr.indexOf(col);
        const colStep = steps[colIdx];
        if (col === EPickerCols.hour) {
          count = /[h]{1}/.test(format) ? 11 : 23;
        } else {
          count = 59;
        }
        // why count + 1 ? to reach maximum
        return range(Number(colStep) - 1, count + 1, Number(colStep)).map((v) => padStart(String(v), 2, '0')) || [];
      }
      // render meridiem column
      return MERIDIEM_LIST;
    },
    [steps, format],
  );

  const handleClickConfirm = () => {
    // TODO
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateTimeIdx = (time: number | string, step: number | string, type: EPickerCols) =>
    // timeIdx = disableFilter(Number(timeIdx), type);
    Math.floor(Number(time) / Number(step));

  const getScrollDistance = useCallback(
    (col: EPickerCols, time: number | string) => {
      let itemIdx: number;

      if (timeArr.includes(col)) {
        const colIdx = timeArr.indexOf(col);
        itemIdx = calculateTimeIdx(time, steps[colIdx], col);
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
    (col: EPickerCols, time: number | string, idx: number, behavior: 'auto' | 'smooth' = 'smooth') => {
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

  const handleTimeItemClick = (col: EPickerCols, el: string | number, idx: number) => {
    if (timeArr.includes(col)) {
      value ? onChange(dayjs(value, format)[col]?.(el).format(format)) : onChange(dayjs()[col]?.(el).format(format));
      scrollToTime(col, el, idx, 'smooth');
    } else {
      // TODO
    }
  };

  // update each columns scroll distance
  const updateTimeScrollPos = useCallback(() => {
    const dayjsValue = value ? dayjs(value, format) : dayjs();
    cols.forEach((col: EPickerCols, idx: number) => {
      if (timeArr.includes(col)) scrollToTime(col, dayjsValue[col]?.(), idx);
      else scrollToTime(col, dayjsValue.format('a'), idx);
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
            {timeArr.includes(col) ? el : TEXT_CONFIG[el]}
          </li>
        ))}
      </ul>
    ));

  return (
    <div className={panelClassName}>
      <div className={`${panelClassName}-section__body`}>
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
