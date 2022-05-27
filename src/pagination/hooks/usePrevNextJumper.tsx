import React from 'react';
import classNames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-react';
import useConfig from '../../_util/useConfig';

export default function usePrevNextJumper(props) {
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-pagination`;

  const { showPreviousAndNextBtn, disabled, current, pageCount, changeCurrent } = props;

  const prevJumper = showPreviousAndNextBtn && (
    <div
      className={classNames(`${name}__btn`, `${name}__btn-prev`, {
        [`${classPrefix}-is-disabled`]: disabled || current === 1,
      })}
      onClick={() => changeCurrent(current - 1)}
    >
      <ChevronLeftIcon />
    </div>
  );

  const nextJumper = showPreviousAndNextBtn && (
    <div
      className={classNames(`${name}__btn`, `${name}__btn-next`, {
        [`${classPrefix}-is-disabled`]: disabled || current === pageCount,
      })}
      onClick={() => changeCurrent(current + 1)}
    >
      <ChevronRightIcon />
    </div>
  );

  return { prevJumper, nextJumper };
}
