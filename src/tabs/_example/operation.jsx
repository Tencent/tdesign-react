import React, { useState } from 'react';
import { Tabs, TabPanel } from '@tencent/tdesign-react';

export default function CloseableTabs() {
  const [panels, setPanels] = useState([
    {
      value: 1,
      label: '选项卡1',
    },
  ]);
  return (
    <>
      <div>
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
              value: panels.length + 1,
              label: `选项卡${panels.length + 1}`,
            });
            setPanels(newPanels);
          }}
        >
          {panels.map(({ value, label }) => (
            <TabPanel removable key={value} value={value} label={label}>
              <div style={{ margin: 20 }}>{label}</div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </>
  );
}
