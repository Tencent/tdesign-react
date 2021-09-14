import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import ChevronLeftIcon from '../icon/icons/ChevronLeftIcon';
import ChevronLeftDoubleIcon from '../icon/icons/ChevronLeftDoubleIcon';
import ChevronRightIcon from '../icon/icons/ChevronRightIcon';
import ChevronRightDoubleIcon from '../icon/icons/ChevronRightDoubleIcon';
import EllipsisIcon from '../icon/icons/EllipsisIcon';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import Select from '../select';

import { TdPaginationProps } from '../_type/components/pagination';
import { StyledProps } from '../_type/StyledProps';
import { pageSizeValidator } from './validators';

export type { PageInfo } from '../_type/components/pagination';

export interface PaginationProps extends TdPaginationProps, StyledProps {}

const { Option } = Select;

enum KeyCode {
  ENTER = 13,
}

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  const {
    current: currentFromProps = 1,
    theme = 'default',
    size = 'medium',
    total = 0,
    pageSize: pageSizeFromProps = 10,
    showJumper = false,
    disabled = false,
    foldedMaxPageBtn = 5,
    maxPageBtn = 10,
    totalContent = true,
    pageSizeOptions = [5, 10, 20, 50],
    onChange = noop,
    onCurrentChange = noop,
    onPageSizeChange = noop,
  } = props;

  const [current, setCurrent] = useState(currentFromProps);
  const [pageSize, setPageSize] = useState(pageSizeFromProps);
  const [pageCount, setPageCount] = useState(1);
  const [hoverPreMore, toggleHoverPreMore] = useState(false); // 处理left ellipsis展示逻辑
  const [hoverNextMore, toggleHoverNextMore] = useState(false); // 处理right ellipsis展示逻辑
  const simpleInputRef = useRef<HTMLInputElement>(null);

  const min = 1;
  const pivot = Math.ceil((foldedMaxPageBtn - 1) / 2);
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`; // t-pagination

  useEffect(() => setCurrent(currentFromProps), [currentFromProps]);
  useEffect(() => setPageSize(pageSizeFromProps), [pageSizeFromProps]);

  useEffect(() => {
    const calCount = Math.ceil(total / pageSize);
    setPageCount(calCount > 0 ? calCount : 1);
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
  const changeCurrent = (nextCurrent: number, nextPageSize?: number) => {
    /**
     * @author kenzyyang
     * @date 2021-03-29
     * @desc currentChange 时判断 size 是否合法
     * */
    if (!nextPageSize && !pageSizeValidator(nextPageSize)) {
      // eslint-disable-next-line
      nextPageSize =
        pageSize ?? (typeof pageSizeOptions[0] === 'number' ? pageSizeOptions[0] : pageSizeOptions[0]?.value);
    }

    if (disabled) return;
    if (pageCount < nextCurrent) {
      setCurrent(pageCount);
      return;
    }
    if (nextCurrent < min) {
      setCurrent(min);
      return;
    }
    setCurrent(nextCurrent);
    if (simpleInputRef.current) {
      simpleInputRef.current.value = String(nextCurrent);
    }
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });

    // currentPageChange的回调
    onCurrentChange(nextCurrent, { current: nextCurrent, previous: current, pageSize: nextPageSize });
  };

  // 处理改变pageSize的逻辑
  const changePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    const nextCurrent = Math.min(current, Math.ceil(total / nextPageSize));
    onPageSizeChange(nextPageSize, {
      current: nextCurrent,
      previous: current,
      pageSize: nextPageSize,
    });

    if (current !== nextCurrent) changeCurrent(nextCurrent, nextPageSize);
  };

  // 处理极简版的当前页ga的逻辑
  const onSimpleCurrentChange = (nextCurrent: number) => {
    if (disabled || pageCount < nextCurrent || nextCurrent < min) return;
    setCurrent(nextCurrent);
    onChange({
      current: nextCurrent,
      previous: current,
      pageSize,
    });

    // currentPageChange的回调
    onCurrentChange(nextCurrent, { current: nextCurrent, previous: current, pageSize });
  };

  const onPageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = Number(target.value);
    if (Number.isNaN(value) || value < min) target.value = '';
    else if (value > pageCount) target.value = String(pageCount);

    // currentPageChange的回调
    onCurrentChange(value, { current: value, previous: current, pageSize });
  };

  const onPageInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== KeyCode.ENTER) return;
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value)) changeCurrent(value);
  };

  // 渲染total相关逻辑
  const renderTotalContent = () => {
    if (typeof totalContent === 'boolean') {
      return totalContent ? `共 ${total} 项数据` : null;
    }
    if (typeof totalContent === 'string') return totalContent;
    if (typeof totalContent === 'function') {
      const start = (current - min) * pageSize;
      const end = Math.min(total, start + pageSize);
      return totalContent(total, [start + min, end]);
    }
  };

  const renderPaginationBtns = () => {
    const isFolded = pageCount > maxPageBtn; // 判断是否为需要折叠

    return (
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
                onMouseOver={() => toggleHoverPreMore(true)}
                onMouseOut={() => toggleHoverPreMore(false)}
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
                onMouseOver={() => toggleHoverNextMore(true)}
                onMouseOut={() => toggleHoverNextMore(false)}
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
  };

  return (
    <div
      className={classNames(name, {
        [`${classPrefix}-size-s`]: size === 'small',
      })}
    >
      {totalContent && <div className={`${name}__total`}>{renderTotalContent()}</div>}
      {pageSizeOptions instanceof Array && pageSizeOptions.length ? (
        <div className={`${name}__select`}>
          <Select size={size} value={pageSize} disabled={disabled} onChange={changePageSize}>
            {pageSizeOptions.map(
              // eslint-disable-next-line no-confusing-arrow
              (item) =>
                // eslint-disable-next-line implicit-arrow-linebreak
                typeof item === 'number' ? (
                  <Option key={item} label={`${item}条/页`} value={item} />
                ) : (
                  <Option key={item.value} label={item.label} value={item.value} />
                ),
            )}
          </Select>
        </div>
      ) : null}
      <div
        className={classNames(`${name}__btn`, `${name}__btn--prev`, {
          [`${classPrefix}-is-disabled`]: disabled || current === min,
        })}
        onClick={() => changeCurrent(current - 1)}
      >
        <ChevronLeftIcon />
      </div>
      {theme === 'default' && <ul className={`${name}__pager`}>{renderPaginationBtns()}</ul>}
      {/* 极简版 */}
      {theme === 'simple' && (
        <div className={`${name}__select`}>
          <Select size={size} value={current} disabled={disabled} onChange={onSimpleCurrentChange}>
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
      <div
        className={classNames(`${name}__btn`, `${name}__btn--next`, {
          [`${classPrefix}-is-disabled`]: disabled || current === pageCount,
        })}
        onClick={() => changeCurrent(current + 1)}
      >
        <ChevronRightIcon />
      </div>
      {showJumper && (
        <div className={`${name}__jump`}>
          跳转
          <div className={classNames(`${classPrefix}-input`, { [`${classPrefix}-input__is-disabled`]: disabled })}>
            <input
              className={`${classPrefix}-input__inner`}
              disabled={disabled}
              onChange={onPageInputChange}
              onKeyUp={onPageInputKeyUp}
            />
          </div>
          页
        </div>
      )}
    </div>
  );
};

export default Pagination;
