import React from 'react';
import { Tabs, TabPanel } from 'tdesign-mobile-react';

export default () => (
  <div>
    <Tabs defaultValue={0}>
      <TabPanel value={0} label="选中"></TabPanel>
      <TabPanel value={1} label="默认"></TabPanel>
      <TabPanel value={2} disabled={true} label="禁用"></TabPanel>
    </Tabs>
  </div>
);
