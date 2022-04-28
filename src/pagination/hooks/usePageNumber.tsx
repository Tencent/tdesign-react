import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { EllipsisIcon, ChevronLeftDoubleIcon, ChevronRightDoubleIcon } from 'tdesign-icons-react';
import useConfig from '../../_util/useConfig';

export default function usePageNumber(props) {
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`;

  const [hoverPreMore, toggleHoverPreMore] = useState(false); // 处理left ellipsis展示逻辑
  const [hoverNextMore, toggleHoverNextMore] = useState(false); // 处理right ellipsis展示逻辑

  const { showPageNumber, maxPageBtn, disabled, current, pageCount, foldedMaxPageBtn, changeCurrent } = props;

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

  const isFolded = pageCount > maxPageBtn; // 判断是否为需要折叠

  const pageNumberContrl = showPageNumber && (
    <ul className={`${name}__pager`}>
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
    </ul>
  );

  return { pageNumberContrl };
}
