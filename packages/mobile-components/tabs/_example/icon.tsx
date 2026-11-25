import React from 'react';
import { AppIcon } from 'tdesign-icons-react';
import { TabPanel, Tabs } from 'tdesign-mobile-react';

export default () => (
  <div>
    <Tabs defaultValue={'first'}>
      <TabPanel value={'first'} label={'选项'} icon={<AppIcon />}></TabPanel>
      <TabPanel value={'second'} label={'选项'} icon={<AppIcon />}></TabPanel>
      <TabPanel
        value={'third'}
        label={
          <div className="label-content">
            <AppIcon size="large" />
            <span>选项</span>
          </div>
        }
      ></TabPanel>
    </Tabs>
  </div>
);
