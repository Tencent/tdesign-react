import React, { useRef } from 'react';
import classNames from 'classnames';
import type { TabValue, TdTabPanelProps } from './type';
import { StyledProps } from '../common';
import { useTabClass } from './useTabClass';
import { tabPanelDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {
  children?: React.ReactNode;
  isActive?: TabValue;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { tdTabPanelClassPrefix } = useTabClass();
  const { className, lazy, isActive, destroyOnHide } = useDefaultProps<TabPanelProps>(props, tabPanelDefaultProps);
  const lazyRenderRef = useRef(lazy);

  if (lazy && isActive && lazyRenderRef.current) {
    lazyRenderRef.current = false;
  }

  if ((!isActive && destroyOnHide) || lazyRenderRef.current) {
    return null;
  }

  return (
    <div className={classNames(tdTabPanelClassPrefix, className)} style={{ display: !isActive ? 'none' : undefined }}>
      {props.children || props.panel}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
