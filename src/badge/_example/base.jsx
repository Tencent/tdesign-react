import React from 'react';
import { Badge, UserIcon, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge dot content={2}>
        <Button size="large"> </Button>
      </Badge>
      <Badge dot content={99}>
        解锁新徽章
      </Badge>
      <Badge dot content={100}>
        <UserIcon size={24} />
      </Badge>
    </>
  );
}
