import React from 'react';
import { Button, Popup } from 'tdesign-react';

export default function Destroy() {
  return (
    <Popup trigger="hover" destroyOnClose showArrow content="这是一个弹出框">
      <Button>Hover me</Button>
    </Popup>
  );
}
