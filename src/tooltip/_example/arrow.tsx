import React from 'react';
import { Button, Tooltip } from 'tdesign-react';

export default function BasicUsage() {
  return (
    <Tooltip content="文字提示仅展示文本内容">
      <Button variant="outline">默认文字提示</Button>
    </Tooltip>
  );
}
