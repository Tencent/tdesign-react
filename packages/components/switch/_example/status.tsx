import React from 'react';
import { Switch, Space } from '@tdesign/components';

export default function SwitchBasic() {
  return (
    <Space>
      <Switch size="large" defaultValue />
      <Switch size="large" defaultValue loading />
      <Switch size="large" disabled />
    </Space>
  );
}
