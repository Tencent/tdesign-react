import React, { MouseEvent, ReactNode, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronDownIcon } from 'tdesign-icons-react';
import useClassName from './hooks/useClassName';
import type { TNode } from '../common';
import type { SortType } from './type';

type SortTypeEnums = Array<'desc' | 'asc'>;

export interface SorterButtonProps {
  sortType: SortType;
  sortOrder: string;
  sortIcon: TNode;
  hideSortTips?: boolean;
  onSortIconClick: (e: MouseEvent<HTMLSpanElement>, p: { descending: boolean }) => void;
}

export default function SorterButton(props: SorterButtonProps) {
  const { sortType = 'all' } = props;
  const { tableSortClasses, negativeRotate180 } = useClassName();
  const allowSortTypes: SortTypeEnums = useMemo(() => (sortType === 'all' ? ['asc', 'desc'] : [sortType]), [sortType]);
  const classes = useMemo(
    () => [tableSortClasses.trigger, { [tableSortClasses.doubleIcon]: allowSortTypes.length > 1 }],
    [allowSortTypes, tableSortClasses],
  );

  function getSortIcon(direction: string) {
    const defaultIcon = <ChevronDownIcon />;
    const icon = props.sortIcon || defaultIcon;
    const activeClass = direction === props.sortOrder ? tableSortClasses.iconActive : tableSortClasses.iconDefault;
    const sortClassName = [
      activeClass,
      tableSortClasses.sortIcon,
      tableSortClasses.iconDirection[direction],
      { [negativeRotate180]: direction === 'asc' },
    ];
    return (
      <span
        key={direction}
        className={classNames(sortClassName)}
        onClick={(e: MouseEvent<HTMLSpanElement>) => props?.onSortIconClick(e, { descending: direction === 'desc' })}
      >
        {icon as ReactNode}
      </span>
    );
  }

  const sortButton = allowSortTypes.map((direction: string) => getSortIcon(direction));

  return <div className={classNames(classes)}>{sortButton}</div>;
}
