import React from 'react';
import classNames from 'classnames';
import { TdTabPanelProps } from '../_type/components/tabs';
import { useTabClass } from './useTabClass';

export interface TabPanelProps extends TdTabPanelProps {}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { tdTabPanelClassPrefix } = useTabClass();

  return <div className={classNames(tdTabPanelClassPrefix)}>{props.children}</div>;
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
