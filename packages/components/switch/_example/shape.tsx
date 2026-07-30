import React from 'react';
import { Space, Switch } from 'tdesign-react';

export default function SwitchShape() {
  return (
    <Space direction="vertical" size="large">
      <Space align="center">
        <span style={{ width: 160 }}>circle（默认胶囊形态）</span>
        <Switch shape="circle" defaultValue label={['开', '关']} />
      </Space>
      <Space align="center">
        <span style={{ width: 160 }}>round（圆角矩形形态）</span>
        <Switch shape="round" defaultValue label={['开', '关']} />
      </Space>
      <Space align="center">
        <span style={{ width: 160 }}>line（线性形态）</span>
        <Switch shape="line" defaultValue />
      </Space>
    </Space>
  );
}
