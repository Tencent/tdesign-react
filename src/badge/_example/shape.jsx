import React from 'react';
import { Badge, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge shape={'circle'} count={2}>
        <Button> circle</Button>
      </Badge>
      <Badge shape={'round'} count={99}>
        <Button>round</Button>
      </Badge>
    </>
  );
}
