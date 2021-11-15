import React, { useState } from 'react';
import { Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function AddTabs() {
  const [panels, setPanels] = useState([
    {
      value: 1,
      label: '选项卡1',
    },
  ]);
  return (
    <Tabs
      placement={'top'}
      size={'medium'}
      disabled={false}
      theme={'card'}
      defaultValue={1}
      addable
      onAdd={() => {
        const newPanels = panels.concat({
          value: panels.length + 1,
          label: `选项卡${panels.length + 1}`,
        });
        setPanels(newPanels);
      }}
    >
      {panels.map(({ value, label }) => (
        <TabPanel key={value} value={value} label={label}>
          <div className="tabs-content" style={{ margin: 20 }}>{label}</div>
        </TabPanel>
      ))}
    </Tabs>
  );
}
