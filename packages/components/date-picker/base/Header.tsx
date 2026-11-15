import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { PaginationMini } from '../../pagination';
import Select from '../../select';
import { useSelectRange } from '../hooks/useSelectRange';
import useYearScroll from '../hooks/useYearScroll';

import type { TdPaginationMiniProps } from '../../pagination';
import type { YearLoadDirection } from '../hooks/useYearScroll';
import type { SinglePanelProps } from '../panel/SinglePanel';
import type { TdDatePickerProps } from '../type';

export interface DatePickerHeaderProps extends Pick<TdDatePickerProps, 'mode'> {
  year?: number;
  month?: number;
  range?: SinglePanelProps['range'];
  internalYear: Array<number>;
  partial: 'start' | 'end';
  onMonthChange?: Function;
  onYearChange?: Function;
  onJumperClick?: TdPaginationMiniProps['onChange'];
}

const useDatePickerLocalConfig = () => {
  const [local, t] = useLocaleReceiver('datePicker');

  return {
    months: t(local.months),
    nextYear: t(local.nextYear),
    preYear: t(local.preYear),
    nextMonth: t(local.nextMonth),
    preMonth: t(local.preMonth),
    preDecade: t(local.preDecade),
    nextDecade: t(local.nextDecade),
    now: t(local.now),
  };
};

const DatePickerHeader = (props: DatePickerHeaderProps) => {
  const { classPrefix } = useConfig();

  const { mode, year, month, range, onMonthChange, onYearChange, onJumperClick, partial, internalYear = [] } = props;

  const { now, months, preMonth, preYear, nextMonth, nextYear, preDecade, nextDecade } = useDatePickerLocalConfig();

  const {
    paginationDisabled,
    monthHasAnyAllowed,
    yearHasAnyAllowed,
    decadeHasAnyAllowed,
    canLoadMoreTop,
    canLoadMoreBottom,
  } = useSelectRange({
    range,
    mode,
    year,
    month,
  });

  const scrollState = useYearScroll();

  const resetAnchor = useCallback(() => {
    scrollState.anchor = null;
    scrollState.delta = 0;
  }, [scrollState]);

  const initOptions = useCallback(
    (year: number) => {
      const options = [];
      if (mode === 'year') {
        const extraYear = year % 10;
        const minYear = year - extraYear - 100;
        const maxYear = year - extraYear + 100;

        for (let i = minYear; i <= maxYear; i += 10) {
          const end = i + 9;
          // 仅加入可选的年代
          if (decadeHasAnyAllowed(end)) {
            options.push({
              label: `${i} - ${end}`,
              value: i + 9,
              disabled: false,
            });
          }
        }
      } else {
        // 中心年份（仅在可选范围内时加入）
        yearHasAnyAllowed(year) && options.push({ label: `${year}`, value: year, disabled: false });

        for (let i = 1; i <= 10; i++) {
          yearHasAnyAllowed(year + i) &&
            options.push({
              label: `${year + i}`,
              value: year + i,
              disabled: false,
            });
          yearHasAnyAllowed(year - i) &&
            options.unshift({
              label: `${year - i}`,
              value: year - i,
              disabled: false,
            });
        }
      }

      return options;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode],
  );

  const [yearOptions, setYearOptions] = useState(() => initOptions(year));

  // 年份选择展示区间
  const nearestYear: number = useMemo(() => {
    // 右侧面板年份选择需要保持大于左侧面板年份选择
    const extraYear = partial === 'end' && mode === 'year' && internalYear[1] - internalYear[0] <= 9 ? 9 : 0;
    return (
      yearOptions.find((option) => option.value - (year + extraYear) <= 9 && option.value - (year + extraYear) >= 0)
        ?.value || year
    );
  }, [yearOptions, year, mode, partial, internalYear]);

  const monthOptions = months.map((item: string, index: number) => ({
    label: item,
    value: index,
    disabled: !monthHasAnyAllowed(year, index),
  }));

  const canLoadTop = useMemo(() => {
    const options = yearOptions;
    if (!options.length) return false;
    const first = options[0].value;
    return canLoadMoreTop(first);
  }, [canLoadMoreTop, yearOptions]);

  const canLoadBottom = useMemo(() => {
    const options = yearOptions;
    if (!options.length) return false;
    const last = options[options.length - 1].value;
    return canLoadMoreBottom(last);
  }, [canLoadMoreBottom, yearOptions]);

  function loadMoreYear(year: number, type?: 'add' | 'reduce') {
    const options = [];
    if (mode === 'year') {
      const extraYear = year % 10;
      if (type === 'add') {
        for (let i = year - extraYear + 10; i <= year - extraYear + 50; i += 10) {
          const end = i + 9;
          // 仅加入可选的年
          decadeHasAnyAllowed(end) && options.push({ label: `${i} - ${end}`, value: i, disabled: false });
        }
      } else {
        for (let i = year - extraYear - 1; i > year - extraYear - 50; i -= 10) {
          decadeHasAnyAllowed(i) &&
            options.unshift({
              label: `${i - 9} - ${i}`,
              value: i,
              disabled: false,
            });
        }
      }
    } else if (type === 'add') {
      for (let i = year + 1; i <= year + 10; i++) {
        yearHasAnyAllowed(i) && options.push({ label: `${i}`, value: i, disabled: false });
      }
    } else {
      for (let i = year - 1; i > year - 10; i--) {
        yearHasAnyAllowed(i) && options.unshift({ label: `${i}`, value: i, disabled: false });
      }
    }

    return options;
  }

  // hover title
  const labelMap = {
    year: {
      prev: preDecade,
      current: now,
      next: nextDecade,
    },
    month: {
      prev: preYear,
      current: now,
      next: nextYear,
    },
    date: {
      prev: preMonth,
      current: now,
      next: nextMonth,
    },
  };

  const headerClassName = `${classPrefix}-date-picker__header`;
  const showMonthPicker = mode === 'date' || mode === 'week';

  function loadMore(direction: YearLoadDirection) {
    // anchor 非空表示本次加载尚未完成，避免连续滚动重复触发
    if (scrollState.anchor) return;
    if (direction === 'top' ? !canLoadTop : !canLoadBottom) return;

    const edgeYear = direction === 'top' ? yearOptions[0]?.value : yearOptions[yearOptions.length - 1]?.value;
    const options = loadMoreYear(edgeYear, direction === 'top' ? 'reduce' : 'add');
    if (!options.length) return;

    // 用容器高度差补偿 scrollTop
    scrollState.anchor = {
      direction,
      scrollHeight: scrollState.el?.scrollHeight ?? 0,
      scrollTop: scrollState.el?.scrollTop ?? 0,
    };
    setYearOptions((prev) => (direction === 'top' ? [...options, ...prev] : [...prev, ...options]));
  }
  scrollState.loadMore = loadMore;

  function bindWheel(target?: HTMLElement | null) {
    // 同一滚动节点只绑一次
    if (!target || scrollState.el === target) return;
    scrollState.el?.removeEventListener('wheel', scrollState.onWheel);
    scrollState.el = target;
    target.addEventListener('wheel', scrollState.onWheel, { passive: true });
  }

  function handleScroll({ e }: { e: { target: EventTarget } }) {
    const target = e.target as HTMLElement;
    bindWheel(target);
    if (Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 1) {
      loadMore('bottom');
    }
  }

  function handleUpdateScrollTop(content: HTMLElement) {
    // 首次打开弹层时，将选中项滚动到可视区域
    const firstSelectedNode: HTMLDivElement = content?.querySelector(`.${classPrefix}-is-selected`);
    if (!firstSelectedNode) return;
    const { paddingBottom } = getComputedStyle(firstSelectedNode);
    const { marginBottom } = getComputedStyle(content);
    const elementBottomHeight = parseInt(paddingBottom, 10) + parseInt(marginBottom, 10);
    const updateValue =
      firstSelectedNode.offsetTop -
      content.offsetTop -
      (content.clientHeight - firstSelectedNode.clientHeight) +
      elementBottomHeight;
    content.scrollTop = updateValue;
  }

  useEffect(() => {
    resetAnchor();
    setYearOptions(initOptions(year));
  }, [initOptions, resetAnchor, year]);

  useEffect(
    () => () => {
      scrollState.el?.removeEventListener('wheel', scrollState.onWheel);
    },
    [scrollState],
  );

  useLayoutEffect(() => {
    const { el, anchor } = scrollState;
    if (!anchor) return;
    if (!el) {
      resetAnchor();
      return;
    }

    /* Select 通过 Portal 渲染，useLayoutEffect 触发时列表 DOM 尚未更新，scrollHeight 仍是旧值。
       等待内容尺寸变化后再按高度差补偿。 */
    const { direction, scrollHeight, scrollTop } = anchor;
    const ro = new ResizeObserver(() => {
      if (el.scrollHeight <= scrollHeight) return;
      el.scrollTop = direction === 'top' ? scrollTop + el.scrollHeight - scrollHeight : scrollTop;
      resetAnchor();
      ro.disconnect();
    });
    ro.observe(el.firstElementChild || el);
    return () => ro.disconnect();
  }, [resetAnchor, scrollState, yearOptions]);

  return (
    <div className={headerClassName}>
      <div className={`${headerClassName}-controller`}>
        {showMonthPicker && (
          <Select
            className={`${headerClassName}-controller-month`}
            value={month}
            options={monthOptions}
            onChange={(val) => onMonthChange(val)}
            popupProps={{
              attach: (triggerElement: HTMLElement) => triggerElement.parentNode as HTMLElement,
              overlayClassName: `${headerClassName}-controller-month-popup`,
            }}
          />
        )}
        <Select
          className={`${headerClassName}-controller-year`}
          value={mode === 'year' ? nearestYear : year}
          options={yearOptions}
          keyboardCircular={false}
          onKeyboardReachTop={() => loadMore('top')}
          onKeyboardReachBottom={() => loadMore('bottom')}
          onChange={(val) => onYearChange(val)}
          onPopupVisibleChange={(visible) => {
            if (!visible) resetAnchor();
          }}
          popupProps={{
            onScroll: handleScroll,
            updateScrollTop: (el) => {
              // 真正滚动的是外层 .popup__content，scrollTop 写在内层不会生效
              const scrollEl = (el?.closest(`.${classPrefix}-popup__content`) as HTMLElement) || el;
              bindWheel(scrollEl);
              setTimeout(() => handleUpdateScrollTop(scrollEl), 0);
            },
            attach: (triggerElement: HTMLElement) => triggerElement.parentNode as HTMLElement,
            overlayClassName: `${headerClassName}-controller-year-popup`,
          }}
        />
      </div>

      <PaginationMini tips={labelMap[mode]} size="small" disabled={paginationDisabled} onChange={onJumperClick} />
    </div>
  );
};

DatePickerHeader.displayName = 'DatePickerHeader';

export default React.memo(DatePickerHeader);
