import React from 'react';
import { Space, Switch } from 'tdesign-react';

export default function SwitchBasic() {
  return (
    <Space>
      <Switch size="large" defaultValue />
      <Switch size="large" defaultValue loading />
      <Switch size="large" disabled />
    </Space>
  );
}
