import type { FC, ReactElement } from 'react';
import React, { useMemo } from 'react';

import classNames from 'classnames';
import { isObject } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import Tabs from '../tabs';
import checkSubMenuActive from './_util/checkSubMenuActive';
import useMenuContext from './hooks/useMenuContext';
import { MenuContext } from './MenuContext';

import type { TdHeadMenuProps } from './type';
import type { StyledProps } from '../common';

const { TabPanel } = Tabs;

export interface HeadMenuProps extends TdHeadMenuProps, StyledProps {
  children?: React.ReactNode;
}

const HeadMenu: FC<HeadMenuProps> = (props) => {
  const { children, className, theme = 'light', style, logo, operations } = props;
  const { classPrefix } = useConfig();
  const { value } = useMenuContext({ ...props, children, mode: 'title' });

  const childList: ReactElement[] | null = useMemo(() => {
    if (value.expandType === 'popup') return null;
    const activeMenu: ReactElement<any> = checkSubMenuActive(children, value.active);
    if (!activeMenu) return null;
    const child = activeMenu.props.children;
    if (Array.isArray(child)) return child;
    if (isObject(child)) return [child];
    return activeMenu.props.children;
  }, [children, value.expandType, value.active]);

  const currentChildListValues =
    childList?.length > 0 ? childList.map((item: ReactElement<any>) => item.props.value) : [];

  return (
    <MenuContext.Provider value={value}>
      <div
        className={classNames(`${classPrefix}-head-menu`, `${classPrefix}-menu--${theme}`, className)}
        style={{ ...style }}
      >
        <div className={`${classPrefix}-head-menu__inner`}>
          {logo && <div className={`${classPrefix}-menu__logo`}>{logo}</div>}
          <ul className={`${classPrefix}-menu`}>{children}</ul>
          {operations && <div className={`${classPrefix}-menu__operations`}>{operations}</div>}
        </div>
        {childList?.length > 0 && (
          <ul className={`${classPrefix}-head-menu__submenu ${classPrefix}-submenu`}>
            <Tabs
              value={currentChildListValues.includes(value.active) ? value.active : currentChildListValues[0]}
              onChange={value.onChange}
            >
              {childList.map(({ props: { children, ...restProps } }: any) => (
                <TabPanel key={props.value} {...restProps} label={children}></TabPanel>
              ))}
            </Tabs>
          </ul>
        )}
      </div>
    </MenuContext.Provider>
  );
};

export default HeadMenu;
