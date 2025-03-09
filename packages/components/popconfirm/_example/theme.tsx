import React from 'react';
import { Button, Popconfirm, Space } from 'tdesign-react';

export default function ThemeExample() {
  const $content = '请确认您要进行此操作';
  return (
    <Space>
      <Popconfirm content={$content}>
        <Button variant="outline">默认</Button>
      </Popconfirm>
      <Popconfirm content={$content} theme="default">
        <Button theme="primary">提示</Button>
      </Popconfirm>
      <Popconfirm content={$content} theme="warning">
        <Button theme="danger">警告</Button>
      </Popconfirm>
      <Popconfirm content={$content} theme="danger">
        <Button theme="danger">错误</Button>
      </Popconfirm>
    </Space>
  );
}
