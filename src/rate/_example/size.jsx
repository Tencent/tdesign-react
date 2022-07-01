import React from 'react';
import { Rate, Space } from 'tdesign-react';

export default function BasicRate() {
  return (
    <Space direction="vertical" style={{ textAlign: 'center' }}>
      <Rate size={16} defaultValue={5} />
      <Rate defaultValue={5} />
      <Rate size={24} defaultValue={5} />
    </Space>
  );
}
