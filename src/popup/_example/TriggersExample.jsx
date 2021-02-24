import React from 'react';
import { Button, Popup } from '@tencent/tdesign-react';

export default function Triggers() {
  return (
    <>
      <Popup trigger="hover" showArrow content="这是一个弹出框">
        <Button>Hover me</Button>
      </Popup>
      <Popup trigger="focus" showArrow content="这是一个弹出框">
        <Button>Focus me</Button>
      </Popup>
      <Popup trigger="click" showArrow content="这是一个弹出框">
        <Button>Click me</Button>
      </Popup>
      <Popup trigger="contextMenu" showArrow content="这是一个弹出框">
        <Button>Right Click me</Button>
      </Popup>
    </>
  );
}
