import React from 'react';
import { Space, Rate } from 'tdesign-react';

export default function BasicRate() {
  return (
    <Space direction="vertical" style={{ textAlign: 'center' }}>
      <h3>未评分状态</h3>
      <Rate />

      <h3>满分状态</h3>
      <Rate defaultValue={5} />

      <h3>半星状态</h3>
      <Rate allowHalf defaultValue={4.5} />
    </Space>
  );
}
