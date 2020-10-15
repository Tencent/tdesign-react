import React, { useState } from 'react';
import { Tabs, TabPanel, Button } from '@tencent/tdesign-react';

export default function ThemeTabs() {
  const [theme, setTheme] = useState('default');
  return (
    <>
      <div>
        <Button onClick={() => setTheme('default')}>default</Button>
        <Button onClick={() => setTheme('card')}>card</Button>
        <Tabs tabPosition={'top'} size={'middle'} theme={theme} disabled={false}>
          <TabPanel name={'1'} label={'1'}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'2'} label={<div>2</div>}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
