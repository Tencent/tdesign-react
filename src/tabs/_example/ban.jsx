import React from 'react';
import { Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function ThemeTabs() {
  return (
    <Tabs placement={'top'} defaultValue={'2'} size={'medium'} disabled={false}>
      <TabPanel value={'1'} label={'选项卡1'} disabled>
        <div style={{ margin: 20 }}>选项卡1内容区</div>
      </TabPanel>
      <TabPanel value={'2'} label={'选项卡2'}>
        <div style={{ margin: 20 }}>选项卡2内容区</div>
      </TabPanel>
    </Tabs>
  );
}
