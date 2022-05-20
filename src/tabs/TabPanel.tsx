import React from 'react';
import classNames from 'classnames';
import { TdTabPanelProps } from './type';
import { StyledProps } from '../common';
import { useTabClass } from './useTabClass';
import { tabPanelDefaultProps } from './defaultProps';

export interface TabPanelProps extends TdTabPanelProps, StyledProps {
  children?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { tdTabPanelClassPrefix } = useTabClass();

  const { className, style } = props;

  return (
    <div className={classNames(tdTabPanelClassPrefix, className)} style={style}>
      {props.children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';
TabPanel.defaultProps = tabPanelDefaultProps;

export default TabPanel;
