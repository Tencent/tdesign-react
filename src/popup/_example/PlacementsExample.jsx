import React from 'react';
import { Button, Popup } from '@tencent/tdesign-react';

export default function Placements() {
  return (
    <>
      <Popup placement="left" showArrow content="这是一个弹出框">
        <Button>Left</Button>
      </Popup>
      <Popup placement="top" showArrow content="这是一个弹出框">
        <Button>Top</Button>
      </Popup>
      <Popup placement="bottom" showArrow content="这是一个弹出框">
        <Button>Bottom</Button>
      </Popup>
      <Popup placement="right" showArrow content="这是一个弹出框">
        <Button>Right</Button>
      </Popup>
    </>
  );
}
