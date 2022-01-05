import React, { useState } from 'react';
import { Tabs, Button } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function SizeTabs() {
  const [size, setSize] = useState('medium');
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button variant="outline" onClick={() => setSize('medium')}>
          medium
        </Button>
        <Button variant="outline" onClick={() => setSize('large')}>
          large
        </Button>
      </div>
      <Tabs placement={'top'} size={size} theme="normal" disabled={false} defaultValue={'1'}>
        <TabPanel value={'1'} label={'选项卡1'}>
          <div style={{ margin: 20 }}>选项卡1内容区</div>
        </TabPanel>
        <TabPanel value={'2'} label={'选项卡2'}>
          <div style={{ margin: 20 }}>选项卡2内容区</div>
        </TabPanel>
      </Tabs>
      <Tabs placement={'top'} size={size} theme="card" disabled={false} defaultValue={'1'}>
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
