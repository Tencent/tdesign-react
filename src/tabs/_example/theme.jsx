import React, { useState } from 'react';
import { Tabs, Button } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function ThemeTabs() {
  const [theme, setTheme] = useState('normal');
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button onClick={() => setTheme('normal')}>default</Button>
        <Button onClick={() => setTheme('card')}>card</Button>
      </div>
      <Tabs placement={'top'} size={'medium'} theme={theme} disabled={false}>
        <TabPanel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </TabPanel>
        <TabPanel value={'2'} label={'选项卡2'}>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
