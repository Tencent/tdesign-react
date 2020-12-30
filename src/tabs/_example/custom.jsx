import React, { useState } from 'react';
import { Tabs, TabPanel } from '@tencent/tdesign-react';

export default function AddTabs() {
  const [panels, setPanels] = useState([
    {
      name: 1,
      label: 1,
    },
  ]);
  return (
    <>
      <div
        style={{
          maxWidth: '400px',
        }}
      >
        <Tabs
          tabPosition={'top'}
          size={'middle'}
          disabled={false}
          theme={'card'}
          defaultActiveName={'2'}
          addable={true}
          onAdd={() => {
            setPanels((panels) => {
              panels.push({
                name: panels.length + 1,
                label: panels.length + 1,
              });
              return [...panels];
            });
          }}
        >
          {panels.map(({ name, label }) => (
            <TabPanel key={name} name={name} label={label}>
              <div style={{ margin: 20 }}>{label}</div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </>
  );
}
