import React, { useState } from 'react';
import { Tabs, Button } from '@tencent/tdesign-react';

const { TabPanel } = Tabs;

export default function SizeTabs() {
  const [size, setSize] = useState('medium');
  return (
    <>
      <div>
        <Button variant="outline" onClick={() => setSize('medium')}>
          middle
        </Button>
        <Button variant="outline" onClick={() => setSize('large')}>
          large
        </Button>
        <Tabs placement={'top'} size={size} theme="normal" disabled={false} defaultValue={'1'}>
          <TabPanel value={'1'} label={'选项卡一'}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'2'} label={'选项卡二'}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
        </Tabs>
        <Tabs placement={'top'} size={size} theme="card" disabled={false} defaultValue={'1'}>
          <TabPanel value={'1'} label={'选项卡一'}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'2'} label={'选项卡二'}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
