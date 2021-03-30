import React from 'react';
import { Tabs, TabPanel } from '@tencent/tdesign-react';

export default function BasicTabs() {
  return (
    <>
      <div className="tdegsin-demo-tabs">
        <Tabs tabPosition={'top'} size={'middle'}>
          <TabPanel name="a" label="选项卡1">
            <div className="tabs-content">选项卡1</div>
          </TabPanel>
          <TabPanel name="b" label="选项卡2">
            <div className="tabs-content">选项卡2</div>
          </TabPanel>
          <TabPanel name="c" label="选项卡3">
            <div className="tabs-content">选项卡3</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
