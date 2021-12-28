import React, { useState } from 'react';
import { Tabs, Button } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function PositionTabs() {
  const [position, setPosition] = useState('top');
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
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
      </div>
      <Tabs placement={position} defaultValue={'1'} theme={'normal'} disabled={false}>
        <TabPanel value={'1'} label="选项卡1">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡1内容区
          </div>
        </TabPanel>
        <TabPanel value={'2'} label="选项卡2">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡2内容区
          </div>
        </TabPanel>
        <TabPanel value={'3'} label="选项卡3">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡3内容区
          </div>
        </TabPanel>
        <TabPanel value={'4'} label="选项卡4">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡4内容区
          </div>
        </TabPanel>
        <TabPanel value={'5'} label="选项卡5">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡5内容区
          </div>
        </TabPanel>
        <TabPanel value={'6'} label="选项卡6">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡6内容区
          </div>
        </TabPanel>
        <TabPanel value={'7'} label="选项卡7">
          <div className="tabs-content" style={{ margin: 20 }}>
            选项卡7内容区
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
