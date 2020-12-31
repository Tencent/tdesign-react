import React from 'react';
import { Tabs, TabPanel } from '@tencent/tdesign-react';

export default function BasicTabs() {
  return (
    <>
      <div className="tdegsin-demo-tabs">
        <Tabs tabPosition={'top'} size={'middle'}>
          <TabPanel name={'a'} label={'a'}>
            <div className="tabs-content">a</div>
          </TabPanel>
          <TabPanel name={'b'} label={'b'}>
            <div className="tabs-content">b</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
