import React, { useState } from 'react';
import { Tabs, Radio, Space } from 'tdesign-react';
import { DiscountIcon, ToolsIcon, TipsIcon } from 'tdesign-icons-react';

const { TabPanel } = Tabs;

export default function IconTabs() {
  const [theme, setTheme] = useState(false);

  const handleChange = (value) => {
    setTheme(value);
  };
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Radio.Group variant="default-filled" defaultValue="normal" onChange={handleChange}>
        <Radio.Button value="normal">常规</Radio.Button>
        <Radio.Button value="card">卡片</Radio.Button>
      </Radio.Group>
      <Tabs placement={'top'} defaultValue={'a'} theme={theme}>
        <TabPanel
          value="a"
          label={
            <>
              <DiscountIcon />
              选项卡1
            </>
          }
        >
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡1内容区
          </div>
        </TabPanel>
        <TabPanel
          value="b"
          label={
            <>
              <ToolsIcon />
              选项卡2
            </>
          }
        >
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡2内容区
          </div>
        </TabPanel>
        <TabPanel
          value="c"
          label={
            <>
              <TipsIcon />
              选项卡3
            </>
          }
        >
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡3内容区
          </div>
        </TabPanel>
      </Tabs>
    </Space>
  );
}
