import React, { useState } from 'react';
import { Tabs, Radio, Space } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function AddTabs() {
  const [theme, setTheme] = useState('normal');
  const [scrollPosition, setScrollPosition] = useState('auto');
  const panels = Array.from({ length: 20 }).map((item, index) => ({
    value: index + 1,
    label: `选项卡${index + 1}`,
  }));
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Radio.Group variant="default-filled" defaultValue="normal" onChange={setTheme}>
        <Radio.Button value="normal">常规型</Radio.Button>
        <Radio.Button value="card">卡片型</Radio.Button>
      </Radio.Group>
      <Radio.Group variant="default-filled" defaultValue="auto" onChange={setScrollPosition}>
        <Radio.Button value="auto">Auto</Radio.Button>
        <Radio.Button value="start">Start</Radio.Button>
        <Radio.Button value="center">Center</Radio.Button>
        <Radio.Button value="end">End</Radio.Button>
      </Radio.Group>

      <Tabs
        placement={'top'}
        size={'medium'}
        disabled={false}
        theme={theme}
        scrollPosition={scrollPosition}
        defaultValue={1}
      >
        {panels.map(({ value, label }) => (
          <TabPanel key={value} value={value} label={label}>
            <div className="tabs-content" style={{ margin: 20 }}>
              {label}内容区
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </Space>
  );
}
