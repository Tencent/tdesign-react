import React from 'react';
import { TabPanelProps } from './TabProps';

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { active, forceRender } = props;
  if (forceRender) {
    return (
      <div
        className={'t-tab-panel'}
        style={{
          display: active ? 'block' : 'none',
        }}
      >
        {props.children}
      </div>
    );
  }
  return active && <div className={'t-tab-panel'}>{props.children}</div>;
};

TabPanel.displayName = 'TabPanel';

export default TabPanel;
