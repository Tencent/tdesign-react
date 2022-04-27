import React, { useState, useMemo, forwardRef } from 'react';
import classNames from 'classnames';
import { EllipsisIcon, ChevronLeftDoubleIcon, ChevronRightDoubleIcon } from 'tdesign-icons-react';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import Select from '../select';
import InputNumber from '../input-number';
import { useLocaleReceiver } from '../locale/LocalReceiver';

import useBoundaryJumper from './hooks/useBoundaryJumper';
import usePrevNextJumper from './hooks/usePrevNextJumper';

import { TdPaginationProps } from './type';
import { StyledProps } from '../common';
import { pageSizeValidator } from './validators';

export type { PageInfo } from './type';

export interface PaginationProps extends TdPaginationProps, StyledProps {}

const { Option } = Select;

const Pagination = forwardRef((props: PaginationProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    defaultCurrent = 1,
    current: currentFromProps,
    theme = 'default',
    size = 'medium',
    total = 0,
    defaultPageSize = 10,
    pageSize: pageSizeFromProps,
    showPreviousAndNextBtn = true,
    showFirstAndLastPageBtn = false,
    showJumper = false,
    disabled = false,
    foldedMaxPageBtn = 5,
    maxPageBtn = 10,
    totalContent = true,
    pageSizeOptions = [5, 10, 20, 50],
    onChange = noop,
    onCurrentChange,
    onPageSizeChange,
    style,
    className,
    ...otherProps
  } = props;

  const [locale, t] = useLocaleReceiver('pagination');

  const [pageSize, setPageSize] = useDefault(pageSizeFromProps, defaultPageSize, onPageSizeChange);
  const [current, setCurrent] = useDefault(currentFromProps, defaultCurrent, onCurrentChange);
  const [jumpValue, setJumpValue] = useState(current);

  const [hoverPreMore, toggleHoverPreMore] = useState(false); // 处理left ellipsis展示逻辑
  const [hoverNextMore, toggleHoverNextMore] = useState(false); // 处理right ellipsis展示逻辑

  const min = 1;
  const pivot = Math.ceil((foldedMaxPageBtn - 1) / 2);
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`; // t-pagination

  const pageCount = useMemo<number>(() => {
    const calCount = Math.ceil(total / pageSize);
    return calCount > 0 ? calCount : 1;
  }, [pageSize, total]);

  // 计算pageList的逻辑，用memo避免每次重复计算的消耗
  const pageList = useMemo<Array<number>>(() => {
    const isPrevMoreShow = 2 + pivot < current;
    const isNextMoreShow = pageCount - 1 - pivot > current;
    const array: Array<number> = [];
    let start: number;
    let end: number;

    if (pageCount > maxPageBtn) {
      if (isPrevMoreShow && isNextMoreShow) {
        start = current - pivot;
        end = current + pivot;
      } else {
        start = isPrevMoreShow ? pageCount - foldedMaxPageBtn + 1 : 2;
        end = isPrevMoreShow ? pageCount - 1 : foldedMaxPageBtn;
      }
    } else {
      start = 1;
      end = pageCount;
    }

    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  }, [current, pageCount, foldedMaxPageBtn, maxPageBtn, pivot]);

  // 处理改变当前页的逻辑
  const changeCurrent = (_nextCurrent: number, _nextPageSize?: number) => {
    if (disabled) return;

    let nextCurrent = _nextCurrent;
    let nextPageSize = _nextPageSize;

    if (!nextPageSize && !pageSizeValidator(nextPageSize)) {
      nextPageSize =
        pageSize ?? (typeof pageSizeOptions[0] === 'number' ? pageSizeOptions[0] : pageSizeOptions[0]?.value);
    }

    // 边界处理
    if (nextCurrent < min) nextCurrent = min;
    if (nextCurrent > pageCount) nextCurrent = pageCount;

    setCurrent(nextCurrent, { current: nextCurrent, previous: current, pageSize: nextPageSize });
    setJumpValue(nextCurrent);

    onChange({
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });
  };

  // 处理改变pageSize的逻辑
  const changePageSize = (nextPageSize: number) => {
    const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
    const pageInfo = {
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    };
    setPageSize(nextPageSize, pageInfo);

    // 改变分页大小也需要触发onChange回调 如果改变分页大小会改变currentPage 则由changeCurrent内去触发onChange 否则需要自己触发
    if (current !== nextCurrent) {
      changeCurrent(nextCurrent, nextPageSize);
    } else {
      onChange(pageInfo);
    }
  };

  // 处理极简版的当前页ga的逻辑
  const onSimpleCurrentChange = (nextCurrent: number) => {
    if (disabled || pageCount < nextCurrent || nextCurrent < min) return;
    setCurrent(nextCurrent, { current: nextCurrent, previous: current, pageSize });
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize,
    });
  };

  // 渲染total相关逻辑
  const renderTotalContent = () => {
    if (typeof totalContent === 'boolean') {
      return totalContent ? t(locale.total, { total }) : null;
    }
    if (typeof totalContent === 'string') return totalContent;
    if (typeof totalContent === 'function') {
      const start = (current - min) * pageSize;
      const end = Math.min(total, start + pageSize);
      return totalContent(total, [start + min, end]);
    }
  };

  const { firstPageJumper, lastPageJumper } = useBoundaryJumper({
    disabled,
    current,
    pageCount,
    showFirstAndLastPageBtn,
    changeCurrent,
  });

  const { prevJumper, nextJumper } = usePrevNextJumper({
    disabled,
    current,
    pageCount,
    showPreviousAndNextBtn,
    changeCurrent,
  });

  const Jumper = showJumper && (
    <div className={`${name}__jump`}>
      {t(locale.jumpTo)}
      <InputNumber
        className={`${classPrefix}-pagination__input`}
        min={min}
        size={size}
        theme="normal"
        max={pageCount}
        disabled={disabled}
        value={jumpValue}
        onChange={(val) => setJumpValue(val)}
        onBlur={(val) => changeCurrent(val)}
        onEnter={(val) => changeCurrent(val)}
        placeholder=""
      />
      {t(locale.page)}
    </div>
  );

  const isFolded = pageCount > maxPageBtn; // 判断是否为需要折叠

  const renderPaginationBtns = (
    <>
      {isFolded && (
        <>
          <li
            key={1}
            className={classNames(`${name}__number`, {
              [`${classPrefix}-is-disabled`]: disabled,
              [`${classPrefix}-is-current`]: current === 1,
            })}
            onClick={() => changeCurrent(1)}
          >
            1
          </li>
          {2 + pivot < current && (
            <li
              className={classNames(`${name}__number`, `${name}__number--more`, {
                [`${classPrefix}-is-disabled`]: disabled,
              })}
              onMouseEnter={() => toggleHoverPreMore(true)}
              onMouseLeave={() => toggleHoverPreMore(false)}
              onClick={() => changeCurrent(current - foldedMaxPageBtn)}
            >
              {!hoverPreMore ? <EllipsisIcon /> : <ChevronLeftDoubleIcon />}
            </li>
          )}
        </>
      )}
      {pageList.map((item) => (
        <li
          key={item}
          className={classNames(`${name}__number`, {
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-current`]: current === item,
          })}
          onClick={() => changeCurrent(item)}
        >
          {item}
        </li>
      ))}
      {isFolded && (
        <>
          {pageCount - 1 - pivot > current && (
            <li
              className={classNames(`${name}__number`, `${name}__number--more`, {
                [`${classPrefix}-is-disabled`]: disabled,
              })}
              onMouseEnter={() => toggleHoverNextMore(true)}
              onMouseLeave={() => toggleHoverNextMore(false)}
              onClick={() => changeCurrent(current + foldedMaxPageBtn)}
            >
              {!hoverNextMore ? <EllipsisIcon /> : <ChevronRightDoubleIcon />}
            </li>
          )}
          <li
            key={pageCount}
            className={classNames(`${name}__number`, {
              [`${classPrefix}-is-disabled`]: disabled,
              [`${classPrefix}-is-current`]: current === pageCount,
            })}
            onClick={() => changeCurrent(pageCount)}
          >
            {pageCount}
          </li>
        </>
      )}
    </>
  );

  return (
    <div
      className={classNames(name, className, {
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      style={style}
      ref={ref}
      {...otherProps}
    >
      {totalContent && <div className={`${name}__total`}>{renderTotalContent()}</div>}
      {pageSizeOptions instanceof Array && pageSizeOptions.length ? (
        <div className={`${name}__select`}>
          <Select autoWidth={true} size={size} value={pageSize} disabled={disabled} onChange={changePageSize}>
            {pageSizeOptions.map((item) =>
              typeof item === 'number' ? (
                <Option key={item} label={t(locale.itemsPerPage, { size: item })} value={item} />
              ) : (
                <Option key={item.value} label={item.label} value={item.value} />
              ),
            )}
          </Select>
        </div>
      ) : null}
      {firstPageJumper}
      {prevJumper}
      {theme === 'default' && <ul className={`${name}__pager`}>{renderPaginationBtns}</ul>}
      {/* 极简版 */}
      {theme === 'simple' && (
        <div className={`${name}__select`}>
          <Select autoWidth={true} size={size} value={current} disabled={disabled} onChange={onSimpleCurrentChange}>
            {Array(pageCount)
              .fill(0)
              .map((_, i) => i + 1)
              .map((item) => (
                <Option key={item} label={`${item}/${pageCount}`} value={item}>
                  {item}/{pageCount}
                </Option>
              ))}
          </Select>
        </div>
      )}
      {nextJumper}
      {lastPageJumper}
      {Jumper}
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
