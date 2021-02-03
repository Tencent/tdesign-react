import React, { useState } from 'react';
import { Tabs, TabPanel, DiscountIcon, Button } from '@tencent/tdesign-react';

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
    <>
      <div className="tdegsin-demo-tabs">
        <Button variant="outline" onClick={toggle}>
          {desc}
        </Button>
        <Tabs tabPosition={'top'} size={'middle'} theme={theme}>
          <TabPanel name="a" label={label}>
            <div className="tabs-content">选项卡1</div>
          </TabPanel>
          <TabPanel name="b" label={label}>
            <div className="tabs-content">选项卡2</div>
          </TabPanel>
          <TabPanel name="c" label={label}>
            <div className="tabs-content">选项卡3</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
