import React, { useState } from 'react';
import { Tabs, Button } from '@tencent/tdesign-react';

const { TabPanel } = Tabs;

export default function PositionTabs() {
  const [position, setPosition] = useState('top');
  return (
    <>
      <div className="tdegsin-demo-tabs">
        <Button variant="outline" onClick={() => setPosition('top')}>
          top
        </Button>
        <Button variant="outline" onClick={() => setPosition('bottom')}>
          bottom
        </Button>
        <Button variant="outline" onClick={() => setPosition('left')}>
          left
        </Button>
        <Button variant="outline" onClick={() => setPosition('right')}>
          right
        </Button>
        <Tabs placement={position} defaultValue={'1'} theme={'normal'} disabled={false}>
          <TabPanel value={'1'} label="选项卡1">
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'2'} label={<div>选项卡2</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'3'} label="选项卡3">
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'4'} label="选项卡4">
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'5'} label={<div>选项卡5</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'6'} label={<div>选项卡6</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel value={'7'} label={<div>选项卡7</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
