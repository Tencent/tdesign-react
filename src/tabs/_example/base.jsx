import React from 'react';
import { Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;

const Comp = () => {
  React.useEffect(() => {
    console.log("CCCCC")
  }, [])
  return (<div className="tabs-content" style={{ margin: 20 }}>
  选项卡2内容区
</div>)
}

export default function BasicTabs() {
  return (
    <Tabs placement={'top'} size={'medium'} defaultValue={'1'}>
      <TabPanel value="1" label="选项卡1">
        <div className="tabs-content" style={{ margin: 20 }}>
          选项卡1内容区
        </div>
      </TabPanel>
      <TabPanel value="2" label="选项卡2" destroyOnHide={false}>
        <Comp />
      </TabPanel>
      <TabPanel value="3" label="选项卡3">
        <div className="tabs-content" style={{ margin: 20 }}>
          选项卡3内容区
        </div>
      </TabPanel>
    </Tabs>
  );
}
