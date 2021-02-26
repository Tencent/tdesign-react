import React from 'react';
import { Button, Tooltip } from '@tencent/tdesign-react';

export default function BasicUsage() {
  return (
    <Tooltip trigger="hover" showArrow content="这是一个弹出框">
      <Button>Hover me</Button>
    </Tooltip>
  );
}
