import React from 'react';
import { Space, Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function BasicTabs() {
  const tabList = [
    { label: '选项卡一', value: 1, panel: <p style={{ padding: 25 }}>这是选项卡一的内容，使用 Tabs 渲染</p> },
    { label: '选项卡二', value: 2, panel: <p style={{ padding: 25 }}>这是选项卡二的内容，使用 Tabs 渲染</p> },
    { label: '选项卡三', value: 3, panel: <p style={{ padding: 25 }}>这是选项卡三的内容，使用 Tabs 渲染</p> },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Tabs placement={'top'} size={'medium'} defaultValue={1}>
        <TabPanel value={1} label="选项卡1">
          <p style={{ padding: 25 }}>选项卡1的内容，使用 TabPanel 渲染</p>
        </TabPanel>
        <TabPanel value={2} label="选项卡2">
          <p style={{ padding: 25 }}>选项卡2的内容，使用 TabPanel 渲染</p>
        </TabPanel>
        <TabPanel value={3} label="选项卡3">
          <p style={{ padding: 25 }}>选项卡3的内容，使用 TabPanel 渲染</p>
        </TabPanel>
      </Tabs>

      <Tabs defaultValue={1} list={tabList} />
    </Space>
  );
}
