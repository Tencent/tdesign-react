import React from 'react';
import { Badge, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge content={2}>
        <Button>默认</Button>
      </Badge>
      <Badge content={2} offset={[10, 10]}>
        <Button>[10,10]</Button>
      </Badge>
      <Badge content={2} offset={[-10, 10]}>
        <Button>[-10,10]</Button>
      </Badge>
      <Badge content={2} offset={[-10, -10]}>
        <Button>[-10,-10]</Button>
      </Badge>
      <Badge content={2} offset={[10, -10]}>
        <Button>[10,-10]</Button>
      </Badge>
    </>
  );
}
