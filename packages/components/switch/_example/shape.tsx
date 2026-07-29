import React from 'react';
import { Space, Switch } from 'tdesign-react';

export default function SwitchShape() {
  return (
    <Space>
      <Switch shape="circle" defaultValue />
      <Switch shape="round" defaultValue />
      <Switch shape="line" defaultValue />
    </Space>
  );
}
