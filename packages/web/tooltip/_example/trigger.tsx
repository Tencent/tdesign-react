import React from 'react';
import { Button, Tooltip, Input, Space } from 'tdesign-react';

export default function Cumstomize() {
  return (
    <Space>
      <Tooltip content="文字提示仅展示文本内容">
        <Button variant="outline">悬浮时触发（默认）</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" trigger="focus">
        <Input placeholder="获得焦点时触发" />
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" trigger="click">
        <Button variant="outline">点击时触发</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" trigger="context-menu">
        <Button variant="outline">右击时触发</Button>
      </Tooltip>
    </Space>
  );
}
