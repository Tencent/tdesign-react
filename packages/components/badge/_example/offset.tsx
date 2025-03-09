import React from 'react';
import { Badge, Button } from 'tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge count={2}>
        <Button>默认</Button>
      </Badge>
      <Badge count={2} offset={[10, 10]}>
        <Button>[10,10]</Button>
      </Badge>
      <Badge count={2} offset={[-10, 10]}>
        <Button>[-10,10]</Button>
      </Badge>
      <Badge count={2} offset={[-10, -10]}>
        <Button>[-10,-10]</Button>
      </Badge>
      <Badge count={2} offset={[10, -10]}>
        <Button>[10,-10]</Button>
      </Badge>
    </>
  );
}
