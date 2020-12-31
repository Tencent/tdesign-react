import React, { useState } from 'react';
import { Tabs, TabPanel, Button } from '@tencent/tdesign-react';

export default function PositionTabs() {
  const [position, setPosition] = useState('top');
  return (
    <>
      <div className="tdegsin-demo-tabs">
        <Button onClick={() => setPosition('top')}>top</Button>
        <Button onClick={() => setPosition('bottom')}>bottom</Button>
        <Button onClick={() => setPosition('left')}>left</Button>
        <Button onClick={() => setPosition('right')}>right</Button>
        <Tabs tabPosition={position} size={'middle'} theme={'default'} disabled={false} addable>
          <TabPanel name={'1'} label="选项卡1" forceRender={true}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'2'} label={<div>选项卡2</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'3'} label="选项卡3">
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'4'} label="选项卡4">
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'5'} label={<div>选项卡5</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'6'} label={<div>选项卡6</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'7'} label={<div>选项卡7</div>}>
            <div className="tabs-content">这是一个Tabs</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
