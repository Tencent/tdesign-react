import React, { useMemo, useState, useCallback, useEffect, useLayoutEffect, forwardRef } from 'react';
import dayjs from 'dayjs';
import Button from '../button';
import Select from '../select';
import Radio from '../radio';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { TdCalendarProps, ControllerOptions, CalendarCell, CalendarValue } from '../_type/components/calendar';
import { StyledProps } from '../_type/StyledProps';
import { createDateList, createMonthList, getMonthCN } from './_util';

export interface CalendarProps extends TdCalendarProps, StyledProps {}

export interface CalendarMethods {
  /**
   * 显示当前月份\年份
   */
  toCurrent: (value: CalendarValue) => void;
}

const fix0 = (num: number): string => (num <= 9 ? `0${num}` : String(num));

const getDefaultControllerConfigData = (visible = true): Record<string, any> => ({
  visible, // 是否显示（全部控件）
  disabled: false, // 是否禁用（全部控件）
  // 模式切换单选组件设置
  mode: {
    visible: true, // 是否显示
    radioGroupProps: {}, // 用于透传props给该radioGroup组件
  },
  // 年份选择框组件相关设置
  year: {
    visible: true, // 是否显示
    selectProps: { popupProps: { overlayStyle: { width: '110px' } } }, // 用于透传props给该select组件
  },
  // 年份选择框组件相关设置
  month: {
    visible: true, // 是否显示（“year”模式下本身是不显示该组件的）
    selectProps: { popupProps: { overlayStyle: { width: '90px' } } }, // 用于透传props给该select组件
  },
  // 隐藏\显示周末按钮组件相关设置
  weekend: {
    visible: true, // 是否显示
    showWeekendButtonProps: {}, // 用于透传props给显示周末按钮组件
    hideWeekendButtonProps: {}, // 用于透传props给隐藏周末按钮组件
  },
  // “今天\本月”按钮组件相关设置
  current: {
    visible: true, // 是否显示
    currentDayButtonProps: {}, // 用于透传props给“今天”钮组件（“month”模式下有效）
    currentMonthButtonProps: {}, // 用于透传props给“本月”按钮组件（“year”模式下有效）
  },
});

// 抽取配置常量
const blockName = 'calendar'; // 类名前缀
const controlSectionSize = 'medium'; // 操作栏控件尺寸
const minYear = 1970; // 最早选择年份

const Calendar: React.FC<CalendarProps> = forwardRef((props, ref: React.MutableRefObject<CalendarMethods>) => {
  const {
    className = '',
    style = {},
    mode: modeFromProps = 'month',
    value: valueFromProps = null,
    firstDayOfWeek = 1,
    format = 'YYYY-MM-DD',
    range = null,
    head = null,
    cell = null,
    cellAppend = null,
    week = null,
    theme = 'full',
    controllerConfig,
    isShowWeekendDefault = true,
    preventCellContextmenu = false,
    onControllerChange = noop,
    onCellClick = noop,
    onCellDoubleClick = noop,
    onCellRightClick = noop,
  } = props;

  // 组装配置信息
  const controllerConfigData =
    typeof controllerConfig === 'boolean'
      ? getDefaultControllerConfigData(controllerConfig)
      : { ...getDefaultControllerConfigData(), ...controllerConfig };

  // 读配置信息
  const {
    visible,
    disabled,
    mode: modeFromConfig,
    year: yearFromConfig,
    month: monthFromConfig,
    weekend,
    current,
  } = controllerConfigData;
  const { visible: visibleForMode = true, radioGroupProps: radioGroupPropsForMode = {} } = modeFromConfig;
  const { visible: visibleForYear = true, selectProps: selectPropsForYear = {} } = yearFromConfig;
  const { visible: visibleForMonth = true, selectProps: selectPropsForMonth = {} } = monthFromConfig;
  const { visible: visibleForWeekendToggle = true, showWeekendButtonProps = {}, hideWeekendButtonProps = {} } = weekend;
  const { visible: visibleForCurrent = true, currentDayButtonProps = {}, currentMonthButtonProps = {} } = current;

  const { classPrefix } = useConfig();
  const [mode, setMode] = useState<string>('month');
  const [value, setValue] = useState<dayjs.Dayjs>(dayjs(valueFromProps || dayjs().format('YYYY-MM-DD')));
  const [year, setYear] = useState<number>(value.year());
  const [month, setMonth] = useState<number>(parseInt(value.format('M'), 10));
  const [isShowWeekend, setIsShowWeekend] = useState<boolean>(isShowWeekendDefault);

  // 表头数组
  const colHeaderList = useMemo(() => {
    if (mode === 'year') return [];
    const weekTextArr = Array.isArray(week) && week.length >= 7 ? week : ['一', '二', '三', '四', '五', '六', '日'];
    const list = [];
    for (let i = firstDayOfWeek; i <= 7; i++) {
      if (!isShowWeekend && i > 5) {
        break;
      }
      list.push({
        day: i,
        text: weekTextArr[i - 1],
      });
    }
    if (firstDayOfWeek > 1) {
      for (let i = 1; i < firstDayOfWeek; i++) {
        if (!isShowWeekend && i > 5) {
          break;
        }
        list.push({
          day: i,
          text: weekTextArr[i - 1],
        });
      }
    }
    return list;
  }, [mode, firstDayOfWeek, isShowWeekend, week]);

  // 根据传入的 range 参数生成 key 为 from, to 的范围对象
  const rangeFromTo = useMemo(() => {
    if (!range || range.length < 2) {
      return null;
    }
    const [v1, v2] = range;
    if (dayjs(v1).isBefore(dayjs(v2))) {
      return {
        from: v1,
        to: v2,
      };
    }
    return {
      from: v2,
      to: v1,
    };
  }, [range]);

  // 构造基础 controllerOptions
  const controllerOptions: ControllerOptions = useMemo(() => {
    const dayJsFilterDate: dayjs.Dayjs = dayjs(`${year}-${month}`);
    const re = {
      filterDate: dayJsFilterDate.toDate(),
      formattedFilterDate: dayJsFilterDate.format(format),
      mode,
      isShowWeekend,
    };
    return re;
  }, [isShowWeekend, mode, year, month, format]);

  // 年份、月份 Select 选择框选项
  const [yearSelectList, monthSelectList] = useMemo(() => {
    const isRangeValid = rangeFromTo && rangeFromTo.from && rangeFromTo.to;
    const checkMonthSelectorDisabled = (yearIn: number, monthIn: number): boolean => {
      if (isRangeValid) {
        const beginYear = dayjs(rangeFromTo.from).year();
        const endYear = dayjs(rangeFromTo.to).year();
        if (yearIn === beginYear) {
          const beginMon = parseInt(dayjs(rangeFromTo.from).format('M'), 10);
          return monthIn < beginMon;
        }
        if (yearIn === endYear) {
          const endMon = parseInt(dayjs(rangeFromTo.to).format('M'), 10);
          return monthIn > endMon;
        }
      }
      return false;
    };

    const yearList = [];
    const monthList = [];
    // 年列表
    const yearBegin = isRangeValid ? dayjs(rangeFromTo.from).year() : Math.max(minYear, year - 10);
    const yearEnd = isRangeValid ? dayjs(rangeFromTo.to).year() : Math.max(minYear, year + 10);
    for (let i = yearBegin; i <= yearEnd; i++) {
      yearList.push({
        value: i,
        disabled: checkMonthSelectorDisabled(i, month),
      });
    }
    // 月列表
    for (let i = 1; i <= 12; i++) {
      monthList.push({
        value: i,
        disabled: checkMonthSelectorDisabled(year, i),
      });
    }

    return [yearList, monthList];
  }, [rangeFromTo, year, month]);

  // mode为 'month' 时，构造日历列表
  const dateList = useMemo<CalendarCell[][]>(
    () => createDateList(year, month, firstDayOfWeek, value, format),
    [year, month, firstDayOfWeek, format, value],
  );

  // mode为 'year' 时，构造月历列表
  const monthList = useMemo<CalendarCell[][]>(() => createMonthList(year, value, format), [year, value, format]);

  const prefixCls = useCallback(
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

  // 将基础的 CalendarCell 与 ControllerOptions 进行合并
  const createCalendarCell = useCallback(
    (cellData: CalendarCell): CalendarCell => ({
      ...cellData,
      ...controllerOptions,
    }),
    [controllerOptions],
  );

  const toCurrent = useCallback((valueIn = null) => {
    const now: dayjs.Dayjs = dayjs(valueIn).isValid() ? dayjs(valueIn) : dayjs(dayjs().format('YYYY-MM-DD'));
    setValue(now);
    setYear(now.year());
    setMonth(parseInt(now.format('M'), 10));
  }, []);

  React.useImperativeHandle(ref, () => ({ toCurrent }), [toCurrent]);

  // 事件回调统一处理
  const execCellEvent = useCallback(
    (event, calendarCell, handleFunc) => {
      if (handleFunc && typeof handleFunc === 'function') {
        handleFunc({
          cell: createCalendarCell(calendarCell),
          e: event,
        });
      }
    },
    [createCalendarCell],
  );

  const clickCell = useCallback(
    (event, calendarCell: CalendarCell) => {
      execCellEvent(event, calendarCell, onCellClick);
    },
    [onCellClick, execCellEvent],
  );

  const doubleClickCell = useCallback(
    (event, calendarCell: CalendarCell) => {
      execCellEvent(event, calendarCell, onCellDoubleClick);
    },
    [onCellDoubleClick, execCellEvent],
  );

  const rightClickCell = useCallback(
    (event, calendarCell: CalendarCell) => {
      if (preventCellContextmenu) event.preventDefault();
      execCellEvent(event, calendarCell, onCellRightClick);
    },
    [onCellRightClick, execCellEvent, preventCellContextmenu],
  );

  useEffect(() => {
    toCurrent(valueFromProps);
  }, [valueFromProps, toCurrent]);

  useEffect(() => {
    setMode(modeFromProps);
  }, [modeFromProps]);

  useEffect(() => {
    setIsShowWeekend(isShowWeekendDefault);
  }, [isShowWeekendDefault]);

  useLayoutEffect(() => {
    onControllerChange(controllerOptions);
  }, [onControllerChange, controllerOptions]);

  return (
    <div className={prefixCls(blockName, [blockName, '', theme]).concat(' ', className)} style={style}>
      {/* 操作部分 */}
      {visible && (
        <div className={prefixCls([blockName, 'control'])}>
          <div className={prefixCls([blockName, 'control-section'])}>
            {/* 年份选择框 */}
            <div className={prefixCls([blockName, 'control-section-cell'])}>
              {visibleForYear && (
                <Select
                  size={controlSectionSize}
                  disabled={disabled}
                  value={year}
                  options={yearSelectList.map((item) => ({
                    label: `${item.value}年`,
                    value: item.value,
                    disabled: item.disabled,
                  }))}
                  onChange={(selectYear) => setYear(selectYear as number)}
                  {...selectPropsForYear}
                />
              )}
            </div>
            {/* 月份选择框 */}
            <div className={prefixCls([blockName, 'control-section-cell'])}>
              {visibleForMonth && mode === 'month' && (
                <Select
                  size={controlSectionSize}
                  disabled={disabled}
                  value={month}
                  options={monthSelectList.map((item) => ({
                    label: `${item.value}月`,
                    value: item.value,
                    disabled: item.disabled,
                  }))}
                  onChange={(selectMonth) => setMonth(selectMonth as number)}
                  {...selectPropsForMonth}
                />
              )}
            </div>
          </div>
          {/* 模式切换 */}
          <div className={prefixCls([blockName, 'control-section'])} style={{ height: 'auto' }}>
            {visibleForMode && (
              <Radio.Group
                size={controlSectionSize}
                value={mode}
                disabled={disabled}
                onChange={(value) => setMode(value as string)}
                {...radioGroupPropsForMode}
              >
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
              </Radio.Group>
            )}
          </div>
          {/* 周末隐藏显示切换 */}
          {mode === 'month' && theme === 'full' && visibleForWeekendToggle && (
            <div className={prefixCls([blockName, 'control-section'])}>
              <Button
                theme={isShowWeekend ? 'default' : 'primary'}
                size={controlSectionSize}
                disabled={disabled}
                onClick={() => setIsShowWeekend(!isShowWeekend)}
                {...(isShowWeekend ? hideWeekendButtonProps : showWeekendButtonProps)}
              >
                {`${isShowWeekend ? '隐藏' : '显示'}周末`}
              </Button>
            </div>
          )}
          {/* 回到当前按钮 */}
          {theme === 'full' && visibleForCurrent && (
            <div className={prefixCls([blockName, 'control-section'])}>
              <Button
                size={controlSectionSize}
                theme="default"
                disabled={disabled}
                onClick={toCurrent}
                {...(mode === 'year' ? currentMonthButtonProps : currentDayButtonProps)}
              >
                {mode === 'year' ? '本月' : '今天'}
              </Button>
            </div>
          )}
        </div>
      )}
      {/* 主体部分 */}
      <div className={prefixCls([blockName, 'panel'], [blockName, `panel--${mode}`])}>
        <div className={prefixCls([blockName, 'panel-title'])}>{React.isValidElement(head) && head}</div>
        <table className={prefixCls([blockName, 'table'])}>
          {/* 表头部分 */}
          {colHeaderList.length > 0 && (
            <thead className={prefixCls([blockName, 'table-head'])}>
              <tr className={prefixCls([blockName, 'table-head-row'])}>
                {colHeaderList.map((item) => (
                  <th key={item.day} className={prefixCls([blockName, 'table-head-cell'])}>
                    {week && typeof week === 'function' ? week({ day: item.day }) : item.text}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {/* month 模式，输出日期 */}
          {mode === 'month' && (
            <tbody className={prefixCls([blockName, 'table-body'])}>
              {dateList.map((dateRow, dateRowIndex) => (
                <tr key={String(dateRowIndex)} className={prefixCls([blockName, 'table-body-row'])}>
                  {dateRow.map((dateCell, dateCellIndex) => {
                    if (!isShowWeekend && [6, 7].indexOf(dateCell.day) >= 0) return null;
                    return (
                      <td
                        key={String(dateCellIndex)}
                        className={prefixCls(
                          [blockName, 'table-body-cell'],
                          dateCell.belongTo !== 0 && 'is-disabled',
                          dateCell.isCurrent && 'is-checked',
                        )}
                        onClick={(event) => clickCell(event, dateCell)}
                        onDoubleClick={(event) => doubleClickCell(event, dateCell)}
                        onContextMenu={(event) => rightClickCell(event, dateCell)}
                      >
                        {(() => {
                          if (cell && typeof cell === 'function') return cell(createCalendarCell(dateCell));
                          if (cell && typeof cell !== 'function') return cell;
                          return (
                            <div className={prefixCls([blockName, 'table-body-cell-value'])}>
                              {fix0(dateCell.date.getDate())}
                            </div>
                          );
                        })()}
                        {(() => {
                          if (cellAppend && typeof cellAppend === 'function')
                            return cellAppend(createCalendarCell(dateCell));
                          if (cellAppend && typeof cellAppend !== 'function') return cellAppend;
                          return <div className={prefixCls([blockName, 'table-body-cell-content'])} />;
                        })()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
          {/* year 模式，输出月份 */}
          {mode === 'year' && (
            <tbody className={prefixCls([blockName, 'table-body'])}>
              {monthList.map((monthRow, monthRowIndex) => (
                <tr key={String(monthRowIndex)} className={prefixCls([blockName, 'table-body-row'])}>
                  {monthRow.map((monthCell, monthCellIndex) => (
                    <td
                      key={String(monthCellIndex)}
                      className={prefixCls([blockName, 'table-body-cell'], [monthCell.isCurrent && 'is-checked'])}
                      onClick={(event) => clickCell(event, monthCell)}
                      onDoubleClick={(event) => doubleClickCell(event, monthCell)}
                      onContextMenu={(event) => rightClickCell(event, monthCell)}
                    >
                      {(() => {
                        if (cell && typeof cell === 'function') return cell(monthCell);
                        if (cell && typeof cell !== 'function') return cell;
                        const monthCellIndex = monthCell.date.getMonth();
                        const monthText =
                          theme === 'full' ? getMonthCN(monthCellIndex) : `${(monthCellIndex + 1).toString()} 月`;
                        return <div className={prefixCls([blockName, 'table-body-cell-value'])}>{monthText}</div>;
                      })()}
                      {(() => {
                        if (cellAppend && typeof cellAppend === 'function') {
                          return cellAppend(monthCell);
                        }
                        if (cellAppend && typeof cellAppend !== 'function') return cellAppend;
                        return <div className={prefixCls([blockName, 'table-body-cell-content'])} />;
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
});

export default Calendar;
