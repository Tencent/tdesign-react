import React, { useRef } from 'react';
import classNames from 'classnames';
import type { TdTabPanelProps } from './type';
import { StyledProps } from '../common';
import { useTabClass } from './useTabClass';
import { tabPanelDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

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
      style={{ ...style, display: !isActive ? 'none' : undefined }}
    >
      {props.children || props.panel}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
