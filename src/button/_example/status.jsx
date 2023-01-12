import React from 'react';
import { Button, Space } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <Space>
      <Button disabled>填充按钮</Button>
      <Button loading>加载中</Button>
    </Space>
  );
}
