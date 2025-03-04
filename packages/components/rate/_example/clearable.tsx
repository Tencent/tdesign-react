import React from 'react';
import { Rate, Space } from '@tdesign/components';

export default function BasicRate() {
  return (
    <Space direction="vertical">
      <h3>clearable: true</h3>
      <Rate defaultValue={3} clearable />
      <h3>clearable: false</h3>
      <Rate defaultValue={3} />
    </Space>
  );
}
