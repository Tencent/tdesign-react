import React, { FC, useState, useContext, useEffect } from 'react';
import classNames from 'classnames';
import { ChevronDownIcon } from 'tdesign-icons-react';
import { SortInfo, PrimaryTableCol, SortType } from '../type';
import { Styles } from '../../common';
import Tooltip from '../../tooltip';
import { ConfigContext } from '../../config-provider';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

export const SortTypeEnum: { [key in SortType]: SortType } = {
  desc: 'desc',
  asc: 'asc',
  all: 'all',
};
interface SorterButtonProps {
  column: PrimaryTableCol;
  onChange: Function;
  singleSort: SortInfo;
}

// 用于点击排序图标时tooltip的顺序显示标准
const sortTypeOrder = [SortTypeEnum.desc, SortTypeEnum.asc, SortTypeEnum.all];

const SorterButton: FC<SorterButtonProps> = (props) => {
  const { column: currentColumn, singleSort: currentSort, onChange } = props;
  const { sortType = SortTypeEnum.all } = currentColumn;
  const { classPrefix } = useContext(ConfigContext);
  const [locale, t] = useLocaleReceiver('table');
  const [currentSortType, setCurrentSortType] = useState<SortType>(SortTypeEnum.all);
  const isAllSortType = sortType === SortTypeEnum.all;
  const nextSortType = getNextSortType(currentSortType);

  // 单个/多个排序：升序，降序，取消；取消时，均使用all
  const tooltips = {
    asc: t(locale.sortAscendingOperationText),
    desc: t(locale.sortDescendingOperationText),
    all: t(locale.sortCancelOperationText),
  };

  /**
   * 设置tooltip文案提示对应的key
   */
  function getNextSortType(currentSortType: SortType): SortType {
    if (isAllSortType) {
      const currentIndex = sortTypeOrder.indexOf(currentSortType);
      const nextIndex = currentIndex === sortTypeOrder.length - 1 ? 0 : currentIndex + 1;
      return sortTypeOrder[nextIndex];
    }
    return currentSortType === SortTypeEnum.all ? sortType : SortTypeEnum.all;
  }

  /**
   * 设置单个排序图标元素，默认为TIconChevronDown
   */
  function renderIcon(direction: string, className: string) {
    let style: Styles = {};
    if (direction === SortTypeEnum.asc) {
      style = {
        transform: 'rotate(-180deg)',
        top: '-1px',
        ...style,
      };
    } else {
      style.bottom = '-1px';
    }
    const sortClassName = classNames([
      `${classPrefix}-table__sort-icon`,
      className,
      `${classPrefix}-table__sort-${direction}`,
    ]);

    return (
      <div key={direction} style={style} className={sortClassName}>
        <ChevronDownIcon size="16px" />
      </div>
    );
  }

  /**
   * 设置多个排序图标元素
   */
  function renderSortIcons() {
    const allowSortTypes = [];
    if (isAllSortType) {
      allowSortTypes.push(SortTypeEnum.asc, SortTypeEnum.desc);
    } else {
      allowSortTypes.push(sortType);
    }
    const sortIcons = allowSortTypes.map((direction: string) => {
      const className =
        direction === currentSortType ? `${classPrefix}-table__sort-icon--active` : `${classPrefix}-icon-sort-default`;
      return renderIcon(direction, className);
    });
    return sortIcons.length > 1 ? <div style={{ lineHeight: 0 }}>{sortIcons}</div> : sortIcons;
  }

  /**
   * 点击排序图标
   */
  function handleSort() {
    const currentSortTypeNew = nextSortType;
    setCurrentSortType(currentSortTypeNew);
    onChange(currentSort, currentSortTypeNew, currentColumn);
  }

  useEffect(() => {
    let currentSortType = SortTypeEnum.all;
    if (currentSort) {
      currentSortType = currentSort.descending ? SortTypeEnum.desc : SortTypeEnum.asc;
    }
    setCurrentSortType(currentSortType);
  }, [currentSort]);

  return (
    <div
      className={classNames([
        `${classPrefix}-table__cell--sort-trigger`,
        { [`${classPrefix}-table__double-icons`]: true },
      ])}
      onClick={handleSort}
    >
      <Tooltip content={tooltips[nextSortType]} showArrow={false}>
        {renderSortIcons()}
      </Tooltip>
    </div>
  );
};

export default SorterButton;
