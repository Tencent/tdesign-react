import React from 'react';
import { Tabs, TabPanel } from '@tencent/tdesign-react';

export default function BasicTabs() {
  return (
    <>
      <div
        style={{
          maxWidth: '400px',
        }}
      >
        <Tabs tabPosition={'top'} size={'middle'}>
          <TabPanel name={'a'} label={'a'}>
            <div style={{ margin: 20 }}>a</div>
          </TabPanel>
          <TabPanel name={'b'} label={'b'}>
            <div style={{ margin: 20 }}>b</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
