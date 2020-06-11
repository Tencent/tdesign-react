import React from 'react';
import { Button, Popup } from '@tdesign/react';

export default function Placements() {
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
    <>
      <Popup placement="left" content={$content}>
        <Button>Left</Button>
      </Popup>
      <Popup placement="top" content={$content}>
        <Button style={{ marginLeft: 8 }}>Top</Button>
      </Popup>
      <Popup placement="bottom" content={$content}>
        <Button style={{ marginLeft: 8 }}>Bottom</Button>
      </Popup>
      <Popup placement="right" content={$content}>
        <Button style={{ marginLeft: 8 }}>Right</Button>
      </Popup>
    </>
  );
}
