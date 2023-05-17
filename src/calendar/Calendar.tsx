import React, { useMemo, useState, useCallback, useEffect, forwardRef } from 'react';
import dayjs from 'dayjs';
import Button from '../button';
import Select from '../select';
import Radio from '../radio';
import CheckTag from '../tag/CheckTag';
import noop from '../_util/noop';
import usePrefixClass from './hooks/usePrefixClass';
import useLayoutEffect from '../_util/useLayoutEffect';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdCalendarProps, ControllerOptions, CalendarCell, CalendarValue, CalendarController } from './type';
import { StyledProps } from '../common';
import { blockName, minYear, createDateList, createMonthList } from './_util';
import CalendarCellComp from './CalendarCellComp';
import { calendarDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface CalendarProps extends TdCalendarProps, StyledProps {}

export interface CalendarMethods {
  /**
   * 显示当前月份\年份
   */
  toCurrent: (value: CalendarValue) => void;
}

// 组件内部将 controllerConfigData 参数类型转换为 CalendarController 处理，将 bool 时候的值作为 visible 并入其中
interface InternalCalendarController extends Required<CalendarController> {
  visible: boolean;
}

const getDefaultControllerConfigData = (visible = true): InternalCalendarController => ({
  visible, // 是否显示（全部控件）
  disabled: false, // 是否禁用（全部控件）
  // 模式切换单选组件设置
  mode: {
    visible: true, // 是否显示
    radioGroupProps: {}, // 用于透传 props 给该 radioGroup 组件
  },
  // 年份选择框组件相关设置
  year: {
    visible: true, // 是否显示
    selectProps: { popupProps: { overlayInnerStyle: { width: '110px' } } }, // 用于透传props给该select组件
  },
  // 年份选择框组件相关设置
  month: {
    visible: true, // 是否显示（“year”模式下本身是不显示该组件的）
    selectProps: { popupProps: { overlayInnerStyle: { width: '90px' } } }, // 用于透传props给该select组件
  },
  // 隐藏\显示周末按钮组件相关设置
  weekend: {
    visible: true, // 是否显示
    showWeekendButtonProps: {}, // 用于透传 props 给显示周末按钮组件
    hideWeekendButtonProps: {}, // 用于透传 props 给隐藏周末按钮组件
  },
  // “今天\本月”按钮组件相关设置
  current: {
    visible: true, // 是否显示
    currentDayButtonProps: {}, // 用于透传 props 给“今天”钮组件（“month”模式下有效）
    currentMonthButtonProps: {}, // 用于透传props给“本月”按钮组件（“year”模式下有效）
  },
});

const Calendar = forwardRef<CalendarMethods, CalendarProps>((props, ref) => {
  const {
    className,
    style,
    mode: modeFromProps,
    value: valueFromProps,
    firstDayOfWeek,
    format,
    range,
    head,
    cell,
    cellAppend,
    week,
    theme,
    controllerConfig,
    isShowWeekendDefault = true,
    preventCellContextmenu = false,
    month: monthProps,
    year: yearProps,
    onControllerChange = noop,
    onCellClick = noop,
    onCellDoubleClick = noop,
    onCellRightClick = noop,
    onMonthChange = noop,
    fillWithZero,
  } = useDefaultProps<CalendarProps>(props, calendarDefaultProps);

  // 组装配置信息
  const controllerConfigData: InternalCalendarController =
    typeof controllerConfig === 'boolean'
      ? getDefaultControllerConfigData(controllerConfig)
      : { ...getDefaultControllerConfigData(), ...controllerConfig };

  // 处理 monthProps 与 yearProps 比 controllerConfig 优先的情况
  if (typeof controllerConfig !== 'boolean') {
    if (monthProps) {
      controllerConfigData.month.visible = true;
    }
    if (yearProps) {
      controllerConfigData.year.visible = true;
    }
  }

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

  const [mode, setMode] = useState<string>('month');
  const [value, setValue] = useState<dayjs.Dayjs>(dayjs(valueFromProps || dayjs().format('YYYY-MM-DD')));
  const [year, setYear] = useState<number>(yearProps ? Number(yearProps) : value.year());
  const [month, setMonth] = useState<number>(monthProps ? Number(monthProps) : parseInt(value.format('M'), 10));
  const [isShowWeekend, setIsShowWeekend] = useState<boolean>(isShowWeekendDefault);

  const [local, t] = useLocaleReceiver('calendar');

  // 表头数组
  const weekLabelList = t(local.week).split(',');
  const colHeaderList = useMemo(() => {
    if (mode === 'year') return [];
    const weekTextArr = Array.isArray(week) && week.length >= 7 ? week : [...weekLabelList];
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
  }, [mode, firstDayOfWeek, isShowWeekend, week, weekLabelList]);

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

  // 将基础的 CalendarCell 与 ControllerOptions 进行合并
  const createCalendarCell = useCallback(
    (cellData: CalendarCell): CalendarCell => ({
      ...cellData,
      ...controllerOptions,
    }),
    [controllerOptions],
  );

  const toCurrent = useCallback((valueIn: CalendarValue = null) => {
    const now: dayjs.Dayjs = dayjs(valueIn).isValid() ? dayjs(valueIn) : dayjs(dayjs().format('YYYY-MM-DD'));
    setValue(now);
    setYear(now.year());
    setMonth(parseInt(now.format('M'), 10));
  }, []);

  React.useImperativeHandle(ref, () => ({ toCurrent }), [toCurrent]);

  // 月份 select change 事件回调
  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    onMonthChange({ month: String(newMonth), year: String(year) });
  };

  // 事件回调处理函数
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

  // 单元格单击
  const clickCell = (event, calendarCell: CalendarCell) => {
    setValue(dayjs(calendarCell.formattedDate));
    execCellEvent(event, calendarCell, onCellClick);
  };

  // 单元格双击
  const doubleClickCell = (event, calendarCell: CalendarCell) => {
    execCellEvent(event, calendarCell, onCellDoubleClick);
  };

  // 单元格右击
  const rightClickCell = (event, calendarCell: CalendarCell) => {
    if (preventCellContextmenu) event.preventDefault();
    execCellEvent(event, calendarCell, onCellRightClick);
  };

  // 监听 current 参数
  useEffect(() => {
    toCurrent(valueFromProps);
  }, [valueFromProps, toCurrent]);

  // 监听 month 参数
  useEffect(() => {
    if (monthProps) {
      setMonth(Number(monthProps));
    }
  }, [monthProps]);

  // 监听 year 参数
  useEffect(() => {
    if (yearProps) {
      setYear(Number(yearProps));
    }
  }, [yearProps]);

  // 监听 mode 参数
  useEffect(() => {
    setMode(modeFromProps);
  }, [modeFromProps]);

  // 监听 isShowWeekend 参数
  useEffect(() => {
    setIsShowWeekend(isShowWeekendDefault);
  }, [isShowWeekendDefault]);

  // 右上角控件组选中值有变化的时候触发
  useLayoutEffect(() => {
    onControllerChange(controllerOptions);
  }, [controllerOptions, onControllerChange]);

  const prefixCls = usePrefixClass();
  const currentDate = dayjs().format('YYYY-MM-DD');
  const currentMonth = dayjs().format('YYYY-MM');
  const controlSectionSize = theme === 'card' ? 'small' : 'medium';

  return (
    <div className={prefixCls(blockName, [blockName, '', theme]).concat(' ', className)} style={style}>
      {/* 操作部分 */}
      {visible && (
        <div className={prefixCls([blockName, 'control'])}>
          <div className={prefixCls([blockName, 'title'])}>
            {(() => {
              if (head && typeof head === 'function') return head(controllerOptions);
              if (head && typeof head !== 'function') return head;
            })()}
          </div>
          <div className={prefixCls([blockName, 'control-section'])}>
            {/* 年份选择框 */}
            <div className={prefixCls([blockName, 'control-section-cell'])}>
              {visibleForYear && (
                <Select
                  autoWidth={true}
                  size={controlSectionSize}
                  value={year}
                  disabled={disabled}
                  options={yearSelectList.map((item) => ({
                    label: t(local.yearSelection, { year: item.value }),
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
                  autoWidth={true}
                  size={controlSectionSize}
                  value={month}
                  options={monthSelectList.map((item) => ({
                    label: t(local.monthSelection, { month: item.value }),
                    value: item.value,
                    disabled: item.disabled,
                  }))}
                  disabled={disabled}
                  onChange={handleMonthChange}
                  {...selectPropsForMonth}
                />
              )}
            </div>
            {/* 模式切换 */}
            <div className={prefixCls([blockName, 'control-section-cell'])} style={{ height: 'auto' }}>
              {visibleForMode && (
                <Radio.Group
                  variant="default-filled"
                  size={controlSectionSize}
                  value={mode}
                  disabled={disabled}
                  onChange={(value) => setMode(value as string)}
                  {...radioGroupPropsForMode}
                >
                  <Radio.Button value="month">{t(local.monthRadio)}</Radio.Button>
                  <Radio.Button value="year">{t(local.yearRadio)}</Radio.Button>
                </Radio.Group>
              )}
            </div>
            {/* 周末隐藏显示切换 */}
            {mode === 'month' && theme === 'full' && visibleForWeekendToggle && (
              <div className={prefixCls([blockName, 'control-section-cell'])}>
                <CheckTag
                  className="t-calendar__control-tag"
                  checked={!isShowWeekend}
                  disabled={disabled}
                  size={controlSectionSize}
                  onClick={() => {
                    setIsShowWeekend(!isShowWeekend);
                  }}
                  {...(isShowWeekend ? hideWeekendButtonProps : showWeekendButtonProps)}
                >
                  {`${isShowWeekend ? t(local.hideWeekend) : t(local.showWeekend)}`}
                </CheckTag>
              </div>
            )}
            {/* 回到当前按钮 */}
            {theme === 'full' && visibleForCurrent && (
              <div className={prefixCls([blockName, 'control-section-cell'])}>
                <Button
                  size={controlSectionSize}
                  disabled={disabled}
                  onClick={() => {
                    toCurrent();
                  }}
                  {...(mode === 'year' ? currentMonthButtonProps : currentDayButtonProps)}
                >
                  {mode === 'year' ? t(local.thisMonth) : t(local.today)}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 主体部分 */}
      <div className={prefixCls([blockName, 'panel'], [blockName, `panel--${mode}`])}>
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
                    // 若不显示周末，隐藏 day 为 6 或 7 的元素
                    if (!isShowWeekend && [6, 7].indexOf(dateCell.day) >= 0) return null;
                    // 其余日期正常显示
                    const isNow = dateCell.formattedDate === currentDate;
                    return (
                      <CalendarCellComp
                        key={dateCellIndex}
                        mode={mode}
                        theme={theme}
                        cell={cell}
                        cellData={dateCell}
                        cellAppend={cellAppend}
                        fillWithZero={fillWithZero}
                        isCurrent={dateCell.isCurrent}
                        isNow={isNow}
                        isDisabled={dateCell.belongTo !== 0}
                        createCalendarCell={createCalendarCell}
                        onCellClick={(event) => clickCell(event, dateCell)}
                        onCellDoubleClick={(event) => doubleClickCell(event, dateCell)}
                        onCellRightClick={(event) => rightClickCell(event, dateCell)}
                      />
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
                  {monthRow.map((monthCell, monthCellIndex) => {
                    const isNow = monthCell.formattedDate.startsWith(currentMonth);
                    return (
                      <CalendarCellComp
                        key={monthCellIndex}
                        mode={mode}
                        theme={theme}
                        cell={cell}
                        cellData={monthCell}
                        cellAppend={cellAppend}
                        fillWithZero={fillWithZero}
                        isCurrent={monthCell.isCurrent}
                        isNow={isNow}
                        createCalendarCell={createCalendarCell}
                        onCellClick={(event) => clickCell(event, monthCell)}
                        onCellDoubleClick={(event) => doubleClickCell(event, monthCell)}
                        onCellRightClick={(event) => rightClickCell(event, monthCell)}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;
