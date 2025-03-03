import React, { useState } from 'react';
import { Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;
let index = 2;

export default function CloseableTabs() {
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
      onRemove={({ value }) => {
        const newPanels = panels.filter((panel) => panel.value !== value);
        setPanels(newPanels);
      }}
      onAdd={() => {
        const newPanels = panels.concat({
          value: index,
          label: `选项卡${index}`,
        });
        index += 1;
        setPanels(newPanels);
      }}
    >
      {panels.map(({ value, label }) => (
        <TabPanel removable={panels.length > 1} key={value} value={value} label={label}>
          <div style={{ margin: 20 }}>{label}</div>
        </TabPanel>
      ))}
    </Tabs>
  );
}
