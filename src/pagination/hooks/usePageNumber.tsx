import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import {
  EllipsisIcon as TdEllipsisIcon,
  ChevronLeftDoubleIcon as TdChevronLeftDoubleIcon,
  ChevronRightDoubleIcon as TdChevronRightDoubleIcon,
} from 'tdesign-icons-react';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';

export default function usePageNumber(props) {
  const { classPrefix } = useConfig();
  const { EllipsisIcon, ChevronLeftDoubleIcon, ChevronRightDoubleIcon } = useGlobalIcon({
    EllipsisIcon: TdEllipsisIcon,
    ChevronLeftDoubleIcon: TdChevronLeftDoubleIcon,
    ChevronRightDoubleIcon: TdChevronRightDoubleIcon,
  });
  const name = `${classPrefix}-pagination`;

  const [hoverPreMore, toggleHoverPreMore] = useState(false); // 处理 left ellipsis 展示逻辑
  const [hoverNextMore, toggleHoverNextMore] = useState(false); // 处理 right ellipsis 展示逻辑

  const {
    showPageNumber,
    maxPageBtn,
    disabled,
    current,
    pageCount,
    foldedMaxPageBtn,
    changeCurrent,
    pageEllipsisMode,
  } = props;

  const isMidEllipsis = pageEllipsisMode === 'mid';
  const pivot = Math.ceil((foldedMaxPageBtn - 1) / 2);

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
        const foldedStart = isMidEllipsis ? 2 : 1;
        const foldedEnd = isMidEllipsis ? pageCount - 1 : pageCount;
        start = isPrevMoreShow ? pageCount - foldedMaxPageBtn + 1 : foldedStart;
        end = isPrevMoreShow ? foldedEnd : foldedMaxPageBtn;
      }
    } else {
      start = 1;
      end = pageCount;
    }

    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  }, [current, pageCount, foldedMaxPageBtn, isMidEllipsis, maxPageBtn, pivot]);

  const isFolded = pageCount > maxPageBtn; // 判断是否为需要折叠

  const pageNumberContrl = showPageNumber && (
    <ul className={`${name}__pager`}>
      {isFolded && isMidEllipsis && (
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
      {isFolded && isMidEllipsis && (
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
    </ul>
  );

  return { pageNumberContrl };
}
