import React from 'react';
import { Button, Tooltip } from 'tdesign-react';

export default function BasicUsage() {
  return (
    <Tooltip
      content="文字提示仅展示文本内容"
      overlayStyle={{ padding: 2 }}
      overlayInnerStyle={{ padding: 2 }}
      overlayClassName="tooltip-custom-overlay-class"
      overlayInnerClassName="tooltip-custom-overlay-inner-class"
    >
      <Button variant="outline">默认文字提示</Button>
    </Tooltip>
  );
}
