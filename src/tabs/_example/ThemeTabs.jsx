import React, { useState } from 'react';
import { Tabs, Button } from '@tdesign/react';
import TabPanel from '../TabPanel';

export default function ThemeTabs() {
  const [theme, setTheme] = useState('default');
  return (
    <>
      <div>
        <Button onClick={() => setTheme('default')}>default</Button>
        <Button onClick={() => setTheme('card')}>card</Button>
        <Tabs
          tabPosition={'top'}
          size={'middle'}
          theme={theme}
          disabled={false}
        >
          <TabPanel name={'1'} label={'1'}>
            <div>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'2'} label={<div>2</div>}>
            这是一个Tabs
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
