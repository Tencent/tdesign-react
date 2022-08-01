import React from 'react';
import { Space, Rate } from 'tdesign-react';

export default function BasicRate() {
  return (
    <Space direction="vertical">
      <h3>16px</h3>
      <Rate size={16} defaultValue={5} />

      <h3>24px</h3>
      <Rate defaultValue={5} />
    </Space>
  );
}
