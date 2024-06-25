import React from 'react';
import { Button, Popconfirm } from 'tdesign-react';

export default function BasicUsageExample() {
  const $content = '请确认您要进行此操作';

  return (
    <Popconfirm content={$content} placement="right">
      <Button theme="primary">浮层在右边</Button>
    </Popconfirm>
  );
}
