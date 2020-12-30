import React, { useState } from 'react';
import { Tabs, TabPanel, Button } from '@tencent/tdesign-react';

export default function PositionTabs() {
  const [position, setPosition] = useState('top');
  return (
    <>
      <div>
        <Button onClick={() => setPosition('top')}>top</Button>
        <Button onClick={() => setPosition('bottom')}>bottom</Button>
        <Button onClick={() => setPosition('left')}>left</Button>
        <Button onClick={() => setPosition('right')}>right</Button>
        <Tabs tabPosition={position} size={'middle'} theme={'default'} disabled={false} addable>
          <TabPanel name={'1'} label={'1'} forceRender={true}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'2'} label={<div>2</div>}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'3'} label={3}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'4'} label={4}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'5'} label={<div>5</div>}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'6'} label={<div>6</div>}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
          <TabPanel name={'7'} label={<div>7</div>}>
            <div style={{ margin: 20 }}>这是一个Tabs</div>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
