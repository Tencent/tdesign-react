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
          <TabPanel name={'123'} label={'12323122321112'}>
            <div>
              123<div>234</div>
            </div>
          </TabPanel>
          <TabPanel name={'456'} label={<div>123</div>}>
            <div>456</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
