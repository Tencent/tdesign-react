import React from 'react';
import { Button, Space } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <Space size={24}>
      <Button tag="div">div</Button>
      <Button tag="a">a</Button>
      <Button href="#">a:href</Button>
    </Space>
  );
}
