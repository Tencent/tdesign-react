import React, { useState } from 'react';
import { Tabs, Radio, Space } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function PositionTabs() {
  const [position, setPosition] = useState('top');
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group variant="default-filled" defaultValue="top" onChange={setPosition}>
        <Radio.Button value="top">top</Radio.Button>
        <Radio.Button value="right">right</Radio.Button>
        <Radio.Button value="bottom">bottom</Radio.Button>
        <Radio.Button value="left">left</Radio.Button>
      </Radio.Group>
      <Tabs placement={position} defaultValue={'1'} theme={'normal'} disabled={false}>
        <TabPanel value={'1'} label="选项卡1">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡1内容区
          </div>
        </TabPanel>
        <TabPanel value={'2'} label="选项卡2">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡2内容区
          </div>
        </TabPanel>
        <TabPanel value={'3'} label="选项卡3">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡3内容区
          </div>
        </TabPanel>
      </Tabs>
    </Space>
  );
}
