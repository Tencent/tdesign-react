import React from 'react';
import { Button } from '@tdesign/react/button';
import { Popup } from '@tdesign/react/popup';

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
