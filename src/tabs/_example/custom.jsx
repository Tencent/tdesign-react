import React, { useState } from 'react';
import { Tabs, TabPanel } from '@tencent/tdesign-react';

export default function AddTabs() {
  const [panels, setPanels] = useState([
    {
      value: 0,
      label: '选项卡1',
    },
  ]);
  return (
    <>
      <div className="tdegsin-demo-tabs">
        <Tabs
          placement={'top'}
          size={'medium'}
          disabled={false}
          theme={'card'}
          defaultValue={0}
          addable
          onAdd={() => {
            const newPanels = panels.concat({
              value: panels.length + 1,
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
              <div className="tabs-content">{label}</div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </>
  );
}
