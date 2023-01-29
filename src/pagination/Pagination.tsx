import React, { useState, useMemo, forwardRef, useEffect } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import Select from '../select';
import InputNumber from '../input-number';
import InputAdornment from '../input-adornment';
import { useLocaleReceiver } from '../locale/LocalReceiver';

import useBoundaryJumper from './hooks/useBoundaryJumper';
import usePrevNextJumper from './hooks/usePrevNextJumper';
import usePageNumber from './hooks/usePageNumber';
import useTotal from './hooks/useTotal';

import { TdPaginationProps } from './type';
import { StyledProps } from '../common';
import { pageSizeValidator } from './validators';
import { paginationDefaultProps } from './defaultProps';

export type { PageInfo } from './type';

export interface PaginationProps extends TdPaginationProps, StyledProps {}

const { Option } = Select;

const Pagination = forwardRef((props: PaginationProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    theme,
    size,
    total,
    showPageSize,
    showPageNumber,
    showPreviousAndNextBtn,
    showFirstAndLastPageBtn,
    showJumper,
    pageEllipsisMode,
    disabled,
    foldedMaxPageBtn,
    maxPageBtn,
    totalContent,
    pageSizeOptions,
    onChange = noop,
    onCurrentChange,
    onPageSizeChange,
    style,
    className,
    selectProps,
    ...otherProps
  } = props;
  // 原生 html 属性透传
  const restProps = omit(otherProps, ['current', 'pageSize', 'defaultPageSize', 'defaultCurrent']);

  const [locale, t] = useLocaleReceiver('pagination');

  const [pageSize, setPageSize] = useControlled(props, 'pageSize', onPageSizeChange);
  const [current, setCurrent] = useControlled(props, 'current', onCurrentChange);
  const [jumpValue, setJumpValue] = useState(current);

  const min = 1;
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`; // t-pagination

  const pageCount = useMemo<number>(() => {
    const calCount = Math.ceil(total / pageSize);
    return calCount > 0 ? calCount : 1;
  }, [pageSize, total]);

  // 处理改变当前页的逻辑
  const changeCurrent = (_nextCurrent: number, _nextPageSize?: number) => {
    if (disabled || current === _nextCurrent) return;

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

    onChange({
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });
  };

  // 处理改变 pageSize 的逻辑
  const changePageSize = (nextPageSize: number) => {
    const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
    const pageInfo = {
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    };
    setPageSize(nextPageSize, pageInfo);

    // 改变分页大小也需要触发 onChange 回调 如果改变分页大小会改变 currentPage 则由 changeCurrent 内去触发 onChange 否则需要自己触发
    if (current !== nextCurrent) {
      changeCurrent(nextCurrent, nextPageSize);
    } else {
      onChange(pageInfo);
    }
  };

  const { totalContrl } = useTotal({ totalContent, pageSize, current, total });

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

  const { pageNumberContrl } = usePageNumber({
    showPageNumber,
    maxPageBtn,
    disabled,
    current,
    pageCount,
    foldedMaxPageBtn,
    changeCurrent,
    pageEllipsisMode,
  });

  useEffect(() => {
    setJumpValue(current);
  }, [current]);

  const pageSizeContrl =
    showPageSize && pageSizeOptions.length ? (
      <div className={`${name}__select`}>
        <Select
          autoWidth={true}
          size={size}
          value={pageSize}
          disabled={disabled}
          onChange={changePageSize}
          {...selectProps}
        >
          {pageSizeOptions.map((item) =>
            typeof item === 'number' ? (
              <Option key={item} label={t(locale.itemsPerPage, { size: item })} value={item} />
            ) : (
              <Option key={item.value} label={item.label} value={item.value} />
            ),
          )}
        </Select>
      </div>
    ) : null;

  const Jumper = (
    <div className={`${name}__jump`}>
      {t(locale.jumpTo)}
      <InputAdornment append={`/ ${pageCount} ${t(locale.page)}`}>
        <InputNumber
          className={`${classPrefix}-pagination__input`}
          min={min}
          size={size}
          theme="normal"
          max={pageCount}
          disabled={disabled}
          value={jumpValue}
          onChange={(val: number) => setJumpValue(val)}
          onBlur={(val: number) => changeCurrent(val)}
          onEnter={(val: number) => changeCurrent(val)}
          placeholder=""
        />
      </InputAdornment>
    </div>
  );

  return (
    <div
      className={classNames(name, className, {
        [`${classPrefix}-size-s`]: size === 'small',
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      style={style}
      ref={ref}
      {...restProps}
    >
      {/* 总数据 */}
      {totalContrl}
      {/* 分页器 */}
      {pageSizeContrl}
      {/* 首页跳转 */}
      {firstPageJumper}
      {/* 上一页跳转 */}
      {prevJumper}
      {/* 常规版 */}
      {theme === 'default' && pageNumberContrl}
      {/* 极简版 */}
      {theme === 'simple' && Jumper}
      {/* 下一页跳转 */}
      {nextJumper}
      {/* 尾页跳转 */}
      {lastPageJumper}
      {/* 快速跳转 */}
      {theme === 'default' && showJumper && Jumper}
    </div>
  );
});

Pagination.displayName = 'Pagination';
Pagination.defaultProps = paginationDefaultProps;

export default Pagination;
