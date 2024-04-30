import React from 'react';
import { Button, Tooltip } from 'tdesign-react';

export default function BasicUsage() {
  return (
    <Tooltip content="文字提示仅展示文本内容" showArrow={false}>
      <Button variant="outline">不带箭头等文字提示</Button>
    </Tooltip>
  );
}
