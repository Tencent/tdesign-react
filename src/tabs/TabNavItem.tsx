import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { CloseIcon } from '../icon';
import { TdTabPanelProps, TdTabsProps } from '../_type/components/tabs';
import noop from '../_util/noop';
import { useTabClass } from './useTabClass';

export interface TabNavItemProps extends TdTabPanelProps {
  // 当前 item 是否处于激活态
  isActive: boolean;
  // 点击事件
  onClick: (e: MouseEvent) => void;
  theme: 'normal' | 'card';
  placement: string;
  size?: 'medium' | 'large';
  index: number;
  onTabsRemove: TdTabsProps['onRemove'];
}

const TabNavItem: React.FC<TabNavItemProps> = (props) => {
  const {
    label,
    removable,
    isActive,
    onClick = noop,
    theme,
    placement,
    onTabsRemove = noop,
    onRemove = noop,
    value,
    size = 'medium',
    disabled = false,
    index,
  } = props;

  // 样式变量和常量定义
  const { tdTabsClassGenerator, tdClassGenerator, tdSizeClassGenerator } = useTabClass();

  return (
    <div
      onClick={disabled ? noop : onClick}
      className={classNames(
        tdTabsClassGenerator('nav-item'),
        theme === 'card' ? tdTabsClassGenerator('nav--card') : '',
        tdSizeClassGenerator(size),
        isActive ? tdClassGenerator('is-active') : '',
        tdClassGenerator(`is-${placement}`),
        disabled ? tdClassGenerator('is-disabled') : '',
      )}
    >
      {label}
      {removable ? (
        <CloseIcon
          name={'close'}
          className={classNames('remove-btn')}
          onClick={(e) => {
            if (disabled) {
              return;
            }
            e.stopPropagation();
            onTabsRemove({ value, e, index });
            onRemove({ value, e });
          }}
        />
      ) : null}
    </div>
  );
};

export default TabNavItem;
