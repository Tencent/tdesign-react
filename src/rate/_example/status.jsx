import React from 'react';
import { Space } from 'tdesign-react';
import Rate from '../Rate';

export default function BasicRate() {
  return (
    <Space direction="vertical" style={{ textAlign: 'center' }}>
      <Rate />
      <Rate defaultValue={5} />
      <Rate allowHalf={true} defaultValue={4.5} />
    </Space>
  );
}
