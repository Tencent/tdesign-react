import React, { useRef } from 'react';
import classNames from 'classnames';
import type { TabValue, TdTabPanelProps } from './type';
import { StyledProps } from '../common';
import { useTabClass } from './useTabClass';
import { tabPanelDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {
  children?: React.ReactNode;
  activeValue?: TabValue;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { lazy, activeValue, value, destroyOnHide } = props;
  const { tdTabPanelClassPrefix } = useTabClass();
  const { className, style } = useDefaultProps<TabPanelProps>(props, tabPanelDefaultProps);
  const shouldRenderRef = useRef(!lazy);

  const isActive = value === activeValue;

  if (lazy && isActive && !shouldRenderRef.current) {
    shouldRenderRef.current = true;
  }

  if ((!isActive && destroyOnHide) || !shouldRenderRef.current) {
    return null;
  }

  return (
    <div className={classNames(tdTabPanelClassPrefix, className)} style={style}>
      {props.children || props.panel}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
