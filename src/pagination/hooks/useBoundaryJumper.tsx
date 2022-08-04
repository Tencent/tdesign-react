import React from 'react';
import classNames from 'classnames';
import { PageFirstIcon as TdPageFirstIcon, PageLastIcon as TdPageLastIcon } from 'tdesign-icons-react';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';

export default function useBoundaryJumper(props) {
  const { classPrefix } = useConfig();
  const { PageFirstIcon, PageLastIcon } = useGlobalIcon({
    PageLastIcon: TdPageLastIcon,
    PageFirstIcon: TdPageFirstIcon,
  });

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
