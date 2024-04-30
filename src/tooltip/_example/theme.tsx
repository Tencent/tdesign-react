import React from 'react';
import { Button, Tooltip, Space } from 'tdesign-react';

export default function Cumstomize() {
  return (
    <Space>
      <Tooltip content="文字提示仅展示文本内容">
        <Button theme="default">default</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="primary">
        <Button theme="primary">primary</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="success">
        <Button theme="success">success</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="danger">
        <Button theme="danger">danger</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="warning">
        <Button theme="warning">warning</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="light">
        <Button variant="outline">light</Button>
      </Tooltip>
    </Space>
  );
}
