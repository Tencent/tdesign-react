import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';
import useRipple from '../_util/useRipple';
import useDomRefCallback from '../hooks/useDomRefCallback';

import { TdTabPanelProps, TdTabsProps } from './type';
import noop from '../_util/noop';
import { useTabClass } from './useTabClass';
import useGlobalIcon from '../hooks/useGlobalIcon';

export interface TabNavItemProps extends TdTabPanelProps {
  // 当前 item 是否处于激活态
  isActive: boolean;
  // 点击事件
  onClick: (e: MouseEvent) => void;
  theme: 'normal' | 'card';
  placement: string;
  size?: 'medium' | 'large';
  index: number;
  innerRef(ref: HTMLElement): void;
  onTabRemove: TdTabsProps['onRemove'];
}

const TabNavItem: React.FC<TabNavItemProps> = (props) => {
  const {
    label,
    removable,
    isActive,
    onClick = noop,
    theme,
    placement,
    onRemove = noop,
    value,
    size = 'medium',
    disabled = false,
    index,
    onTabRemove = noop,
    innerRef,
  } = props;

  const { CloseIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
  });

  const isCard = theme === 'card';

  // 样式变量和常量定义
  const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass();

  // 斜八度动画
  const [navItemDom, setRefCurrent] = useDomRefCallback();
  useRipple(navItemDom);

  return (
    <div
      ref={innerRef}
      onClick={disabled ? noop : onClick}
      className={classNames(
        tdTabsClassGenerator('nav-item'),
        isCard ? tdTabsClassGenerator('nav--card') : '',
        tdSizeClassGenerator(size),
        isActive ? tdClassGenerator('is-active') : '',
        tdClassGenerator(`is-${placement}`),
        disabled ? tdClassGenerator('is-disabled') : '',
      )}
    >
      {/* 根据新的 dom 结构和样式进行改动，卡片类型情况下不需要 nav-item-wrapper 这个 div */}
      {isCard ? (
        <span className={classNames(tdTabsClassGenerator('nav-item-text-wrapper'))}>{label}</span>
      ) : (
        <div ref={setRefCurrent} className={classNames(tdTabsClassGenerator('nav-item-wrapper'))}>
          <span className={classNames(tdTabsClassGenerator('nav-item-text-wrapper'))}>{label}</span>
        </div>
      )}
      {removable ? (
        <CloseIcon
          className={classNames('remove-btn')}
          onClick={(e) => {
            if (disabled) {
              return;
            }
            e.stopPropagation();
            onRemove({ value, e });
            onTabRemove({ value, e, index });
          }}
        />
      ) : null}
    </div>
  );
};

export default TabNavItem;
