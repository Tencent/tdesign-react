import React from 'react';
import { Switch, Space } from 'tdesign-react';

export default function SwitchBasic() {
  return (
    <Space>
      <Switch size="large" defaultValue />
      <Switch />
      <Switch size="small" />
    </Space>
  );
}
