import React from 'react';
import { Badge, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge count={2}>
        <Button size="large"> </Button>
      </Badge>
      <Badge count={99}>
        <Button size="large"> </Button>
      </Badge>
      <Badge count={100}>
        <Button size="large"> </Button>
      </Badge>
    </>
  );
}
