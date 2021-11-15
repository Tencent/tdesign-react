import React, { useState } from 'react';
import { Tabs, Button } from 'tdesign-react';
import { DiscountIcon } from 'tdesign-icons-react';

const { TabPanel } = Tabs;

export default function IconTabs() {
  const [isCard, setIsCard] = useState(false);
  const desc = `切换到${isCard ? '常规型' : '卡片型'}`;
  const theme = isCard ? 'card' : 'normal';
  const toggle = () => {
    setIsCard(!isCard);
  };
  const label = (
    <div>
      <DiscountIcon />
      选项卡
    </div>
  );
  return (
    <div className="tdesign-demo-tabs">
      <Button variant="outline" onClick={toggle}>
        {desc}
      </Button>
      <Tabs placement={'top'} defaultValue={'a'} theme={theme}>
        <TabPanel value="a" label={label}>
          <div className="tabs-content" style={{ margin: 20 }}>选项卡1</div>
        </TabPanel>
        <TabPanel value="b" label={label}>
          <div className="tabs-content" style={{ margin: 20 }}>选项卡2</div>
        </TabPanel>
        <TabPanel value="c" label={label}>
          <div className="tabs-content" style={{ margin: 20 }}>选项卡3</div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
