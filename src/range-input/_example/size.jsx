import React from 'react';
import { RangeInput, Space } from 'tdesign-react';

export default function BaseExample() {
  return (
    <Space direction="vertical">
      <RangeInput size="small" />
      <RangeInput />
      <RangeInput size="large" />
    </Space>
  );
}
