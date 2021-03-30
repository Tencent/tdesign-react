import React from 'react';
import { Badge, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge content={2}>
        <Button size="large"> </Button>
      </Badge>
      <Badge content={99}>
        <Button size="large"> </Button>
      </Badge>
      <Badge content={100}>
        <Button size="large"> </Button>
      </Badge>
    </>
  );
}
