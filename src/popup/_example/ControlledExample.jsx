import React, { useState } from 'react';
import { Button, Popup } from '@tdesign/react';

export default function Controlled() {
  const [visible, setVisible] = useState(false);
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
      <Button onClick={() => setVisible(false)}>隐藏</Button>
    </div>
  );

  return (
    <>
      <Popup trigger="manual" visible={visible} content={$content}>
        <Button onClick={() => setVisible(true)}>点击</Button>
      </Popup>
    </>
  );
}
