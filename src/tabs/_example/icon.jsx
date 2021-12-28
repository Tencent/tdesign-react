import React, { useState } from 'react';
import { Tabs, Button } from 'tdesign-react';
import { DiscountIcon, ToolsIcon, TipsIcon } from 'tdesign-icons-react';

const { TabPanel } = Tabs;

export default function IconTabs() {
  const [isCard, setIsCard] = useState(false);
  const desc = `切换到${isCard ? '常规型' : '卡片型'}`;
  const theme = isCard ? 'card' : 'normal';
  const toggle = () => {
    setIsCard(!isCard);
  };
  return (
    <div className="tdesign-demo-tabs">
      <Button variant="outline" style={{ marginBottom: 10 }} onClick={toggle}>
        {desc}
      </Button>
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
    </div>
  );
}
