import React, { useRef } from 'react';
import classNames from 'classnames';

import useDefaultProps from '../hooks/useDefaultProps';
import { tabPanelDefaultProps } from './defaultProps';
import { useTabClass } from './useTabClass';

import type { StyledProps } from '../common';
import type { TdTabPanelProps } from './type';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {
  children?: React.ReactNode;
  isActive?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { className, lazy, isActive, destroyOnHide, style } = useDefaultProps<TabPanelProps>(
    props,
    tabPanelDefaultProps,
  );
  const { tdTabPanelClassPrefix } = useTabClass();
  const lazyRenderRef = useRef(lazy);

  if (lazy && isActive && lazyRenderRef.current) {
    lazyRenderRef.current = false;
  }

  if ((!isActive && destroyOnHide) || lazyRenderRef.current) {
    return null;
  }

  return (
    <div
      className={classNames(tdTabPanelClassPrefix, className)}
      style={{ display: !isActive ? 'none' : undefined, ...style }}
    >
      {props.children || props.panel}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
