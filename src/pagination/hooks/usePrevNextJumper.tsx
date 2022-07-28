import React from 'react';
import classNames from 'classnames';
import { ChevronLeftIcon as TdChevronLeftIcon, ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-react';
import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';

export default function usePrevNextJumper(props) {
  const { classPrefix } = useConfig();
  const { ChevronLeftIcon, ChevronRightIcon } = useGlobalIcon({
    ChevronLeftIcon: TdChevronLeftIcon,
    ChevronRightIcon: TdChevronRightIcon,
  });
  const name = `${classPrefix}-pagination`;

  const { showPreviousAndNextBtn, disabled, current, pageCount, changeCurrent } = props;

  const prevJumper = showPreviousAndNextBtn && (
    <div
      className={classNames(`${name}__btn`, `${name}__btn-prev`, {
        [`${classPrefix}-is-disabled`]: disabled || current === 1,
      })}
      onClick={() => {
        if (disabled || current === 1) return;
        changeCurrent(current - 1);
      }}
    >
      <ChevronLeftIcon />
    </div>
  );

  const nextJumper = showPreviousAndNextBtn && (
    <div
      className={classNames(`${name}__btn`, `${name}__btn-next`, {
        [`${classPrefix}-is-disabled`]: disabled || current === pageCount,
      })}
      onClick={() => {
        if (disabled || current === pageCount) return;
        changeCurrent(current + 1);
      }}
    >
      <ChevronRightIcon />
    </div>
  );

  return { prevJumper, nextJumper };
}
