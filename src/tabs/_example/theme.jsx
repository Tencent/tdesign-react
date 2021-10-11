import React, { useState } from 'react';
import { Tabs, Button } from '@tencent/tdesign-react';

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
        <TabPanel value={'1'} label={'1'}>
          <div style={{ margin: 20 }}>这是一个Tabs</div>
        </TabPanel>
        <TabPanel value={'2'} label={<div>2</div>}>
          <div style={{ margin: 20 }}>这是一个Tabs</div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
