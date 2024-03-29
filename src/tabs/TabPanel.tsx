import React from 'react';
import classNames from 'classnames';
import { TdTabPanelProps } from './type';
import { StyledProps } from '../common';
import { useTabClass } from './useTabClass';
import { tabPanelDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {
  children?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { tdTabPanelClassPrefix } = useTabClass();
  const { className, style } = useDefaultProps<TabPanelProps>(props, tabPanelDefaultProps);
  return (
    <div className={classNames(tdTabPanelClassPrefix, className)} style={style}>
      {props.children || props.panel}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
