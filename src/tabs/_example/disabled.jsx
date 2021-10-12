import React from 'react';
import { Tabs } from '@tencent/tdesign-react';

const { TabPanel } = Tabs;

export default function ThemeTabs() {
  return (
    <Tabs placement={'top'} defaultValue={'2'} size={'medium'} disabled={false}>
      <TabPanel value={'1'} label={'选项卡一'} disabled>
        <div style={{ margin: 20 }}>这是一个Tabs</div>
      </TabPanel>
      <TabPanel value={'2'} label={'选项卡二'}>
        <div style={{ margin: 20 }}>这是一个Tabs</div>
      </TabPanel>
    </Tabs>
  );
}
