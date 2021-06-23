import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { StyledProps } from '../_type';
import { TdHeadMenuProps } from '../_type/components/menu';
import useConfig from '../_util/useConfig';
import useMenuContext from './hooks/useMenuContext';
import { MenuContext } from './MenuContext';
import checkSubMenuActive from './_util/checkSubMenuActive';

export interface HeadMenuProps extends TdHeadMenuProps, StyledProps {}

const HeadMenu: FC<HeadMenuProps> = (props) => {
  const { children, className, theme = 'light', style, logo, operations } = props;
  const { classPrefix } = useConfig();
  const { value } = useMenuContext({ ...props, children, mode: 'title' });

  const needPlaceholder = useMemo(
    () => value.expandType !== 'popup' && checkSubMenuActive(children, value.active),
    [children, value.expandType, value.active],
  );

  return (
    <MenuContext.Provider value={value}>
      <div
        className={classNames(className, `${classPrefix}-head-menu`, `${classPrefix}-menu--${theme}`)}
        style={{ ...style }}
      >
        <div className={`${classPrefix}-head-menu__inner`}>
          {logo && <div className={`${classPrefix}-menu__logo`}>{logo}</div>}
          <ul className={`${classPrefix}-menu`}>{children}</ul>
          {operations && <div className={`${classPrefix}-menu__options`}>{operations}</div>}
        </div>
        {needPlaceholder && <ul className={`${classPrefix}-head-menu__submenu`}></ul>}
      </div>
    </MenuContext.Provider>
  );
};

export default HeadMenu;
