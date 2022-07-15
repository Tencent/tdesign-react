import React, { useState } from 'react';
import { Switch, Space } from 'tdesign-react';

export default function SwitchBasic() {
  const [checked, setChecked] = useState(true);

  const onChange = (value) => {
    console.log('value', value);
    setChecked(value);
  };

  return (
    <Space>
      <Switch size="large" />
      <Switch size="large" value={checked} onChange={onChange} />
    </Space>
  );
}
