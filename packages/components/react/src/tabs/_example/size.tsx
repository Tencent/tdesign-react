import React from 'react';
import { Tabs, Space } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function SizeTabs() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Tabs placement={'top'} size="medium" theme="normal" disabled={false} defaultValue={'1'}>
        <TabPanel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </TabPanel>
        <TabPanel value={'2'} label={'选项卡2'}>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </TabPanel>
      </Tabs>
      <Tabs placement={'top'} size="large" theme="normal" disabled={false} defaultValue={'1'}>
        <TabPanel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </TabPanel>
        <TabPanel value={'2'} label={'选项卡2'}>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </TabPanel>
      </Tabs>
    </Space>
  );
}
