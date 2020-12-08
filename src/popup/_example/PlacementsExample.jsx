import React from 'react';
import { Button, Popup } from '@tencent/tdesign-react';

export default function Placements() {
  return (
    <>
      <Popup placement="left" content="这是一个弹出框">
        <Button>Left</Button>
      </Popup>
      <Popup placement="top" content="这是一个弹出框">
        <Button style={{ marginLeft: 8 }}>Top</Button>
      </Popup>
      <Popup placement="bottom" content="这是一个弹出框">
        <Button style={{ marginLeft: 8 }}>Bottom</Button>
      </Popup>
      <Popup placement="right" content="这是一个弹出框">
        <Button style={{ marginLeft: 8 }}>Right</Button>
      </Popup>
    </>
  );
}
