import React from 'react';
import { RangeInput, Space } from 'tdesign-react';

export default function BaseExample() {
  return (
    <Space direction="vertical">
      <RangeInput status="success" />
      <RangeInput status="warning" />
      <RangeInput status="error" />
    </Space>
  );
}
