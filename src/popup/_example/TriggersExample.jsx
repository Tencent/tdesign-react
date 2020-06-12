import React from 'react';
import { Button, Popup } from '@tdesign/react';

export default function Triggers() {
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
      <Popup trigger="hover" content={$content}>
        <Button>Hover me</Button>
      </Popup>
      <Popup trigger="focus" content={$content}>
        <Button style={{ marginLeft: 8 }}>Focus me</Button>
      </Popup>
      <Popup trigger="click" content={$content}>
        <Button style={{ marginLeft: 8 }}>Click me</Button>
      </Popup>
      <Popup trigger="contextMenu" content={$content}>
        <Button style={{ marginLeft: 8 }}>Right Click me</Button>
      </Popup>
    </>
  );
}
