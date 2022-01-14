import React, { useState } from 'react';
import { Tabs } from 'tdesign-react';

const { TabPanel } = Tabs;

export default function AddTabs() {
  const [panels, setPanels] = useState([
    {
      value: 1,
      label: '选项卡1',
    },
    {
      value: 2,
      label: '选项卡2',
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
          value: panels[panels.length - 1].value + 1,
          label: `选项卡${panels.length + 1}`,
        });
        setPanels(newPanels);
      }}
    >
      {panels.map(({ value, label }, index) => (
        <TabPanel
          key={value}
          value={value}
          label={label}
          removable={panels.length > 1}
          onRemove={() => {
            setPanels((panels) => {
              panels.splice(index, 1);
              return panels;
            });
          }}
        >
          <div className="tabs-content" style={{ margin: 20 }}>
            {label}内容区
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
}
