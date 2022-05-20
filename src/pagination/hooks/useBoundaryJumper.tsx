import React from 'react';
import classNames from 'classnames';
import { PageFirstIcon, PageLastIcon } from 'tdesign-icons-react';
import useConfig from '../../_util/useConfig';

export default function useBoundaryJumper(props) {
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`;

  const { showFirstAndLastPageBtn, disabled, current, pageCount, changeCurrent } = props;

  const firstPageJumper = showFirstAndLastPageBtn && (
    <div
      className={classNames(`${name}__btn`, `${name}__btn-first-page`, {
        [`${classPrefix}-is-disabled`]: disabled || current === 1,
      })}
      onClick={() => changeCurrent(1)}
    >
      <PageFirstIcon />
    </div>
  );

  const lastPageJumper = showFirstAndLastPageBtn && (
    <div
      className={classNames(`${name}__btn`, `${name}__btn-first-page`, {
        [`${classPrefix}-is-disabled`]: disabled || current === pageCount,
      })}
      onClick={() => changeCurrent(pageCount)}
    >
      <PageLastIcon />
    </div>
  );

  return { firstPageJumper, lastPageJumper };
}
