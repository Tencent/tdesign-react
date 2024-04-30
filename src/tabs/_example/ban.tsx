import React, { useState } from 'react';
import { Tabs, Radio, Space } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function ThemeTabs() {
  const [theme, setTheme] = useState('normal');

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Radio.Group variant="default-filled" defaultValue="normal" onChange={setTheme}>
        <Radio.Button value="normal">常规型</Radio.Button>
        <Radio.Button value="card">卡片型</Radio.Button>
      </Radio.Group>
      <Tabs placement={'top'} defaultValue={'1'} theme={theme} size={'medium'} disabled={false}>
        <TabPanel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </TabPanel>
        <TabPanel value={'2'} label={'选项卡2'} disabled>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </TabPanel>
        <TabPanel value={'3'} label={'选项卡3'}>
          <div style={{ margin: 20 }}>选项卡3内容区</div>
        </TabPanel>
      </Tabs>
    </Space>
  );
}
