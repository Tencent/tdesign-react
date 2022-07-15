import React from 'react';
import { Jumper, Space } from 'tdesign-react';

export default function DemoJumper() {
  return (
    <Space direction="vertical" style={{ textAlign: 'center'}}>
      <Jumper size="small" />
      <Jumper />
      <Jumper size="large" />
    </Space>
  )
}
