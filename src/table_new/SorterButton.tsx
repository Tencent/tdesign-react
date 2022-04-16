import React, { MouseEvent } from 'react';
import { ChevronDownIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import useClassName from './hooks/useClassName';
import { SortType } from './type';
import Tooltip, { TooltipProps } from '../tooltip';
import { TNode } from '../common';
import { useLocaleReceiver } from '../locale/LocalReceiver';

type SortTypeEnums = Array<'desc' | 'asc'>;

export interface SorterButtonProps {
  sortType: SortType;
  sortOrder: string;
  sortIcon: TNode;
  tooltipProps?: TooltipProps;
  onSortIconClick: (e: MouseEvent<HTMLSpanElement>, p: { descending: boolean }) => void;
}

export default function SorterButton(props: SorterButtonProps) {
  const { sortType = 'all' } = props;
  const { tableSortClasses, negativeRotate180 } = useClassName();
  const [locale, t] = useLocaleReceiver('table');

  const allowSortTypes: SortTypeEnums = sortType === 'all' ? ['asc', 'desc'] : [sortType];

  const onSortIconClick = (e: MouseEvent<HTMLSpanElement>, direction: string) => {
    props?.onSortIconClick(e, { descending: direction === 'desc' });
  };

  function getSortIcon(direction: string, activeClass: string) {
    const defaultIcon = t(locale.sortIcon) || <ChevronDownIcon />;
    const icon = props.sortIcon || defaultIcon;
    const sortClassName = [
      activeClass,
      tableSortClasses.sortIcon,
      tableSortClasses.iconDirection[direction],
      { [negativeRotate180]: direction === 'asc' },
    ];
    return (
      <span
        className={classNames(sortClassName)}
        onClick={(e: MouseEvent<HTMLSpanElement>) => onSortIconClick(e, direction)}
      >
        {icon}
      </span>
    );
  }

  const classes = [tableSortClasses.trigger, { [tableSortClasses.doubleIcon]: allowSortTypes.length > 1 }];
  const tooltips = {
    asc: locale.sortAscendingOperationText,
    desc: locale.sortDescendingOperationText,
  };
  const sortButton = allowSortTypes.map((direction: string) => {
    const activeClass = direction === props.sortOrder ? tableSortClasses.iconActive : tableSortClasses.iconDefault;
    const cancelTips = locale.sortCancelOperationText;
    const tips = direction === props.sortOrder ? cancelTips : tooltips[direction];
    return (
      <Tooltip
        key={direction}
        content={tips}
        placement="right"
        {...props.tooltipProps}
        showArrow={false}
        className={tableSortClasses.iconDirection[direction]}
      >
        {getSortIcon(direction, activeClass)}
      </Tooltip>
    );
  });
  return <div className={classNames(classes)}>{sortButton}</div>;
}

SorterButton.displayName = 'SorterButton';
