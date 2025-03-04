import React from 'react';
import { Button, Popup } from '@tdesign/components';

export default function Disabled() {
  return (
    <Popup trigger="hover" disabled showArrow content="这是一个弹出框">
      <Button>Hover me</Button>
    </Popup>
  );
}
