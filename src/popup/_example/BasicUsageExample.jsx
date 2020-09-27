import React from 'react';
import { Button, Popup } from '@tencent/tdesign-react';

export default function BasicUsage() {
  const $content = (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: 8,
        borderRadius: 4,
        fontSize: 12,
      }}
    >
      这是一个弹出框
    </div>
  );

  return (
    <Popup trigger="hover" content={$content}>
      <Button>Hover me</Button>
    </Popup>
  );
}
