import React from 'react';
import { Badge, Button } from '@tencent/tdesign-react';
import { UserIcon } from '@tencent/tdesign-icons-react';

export default function BadgeExample() {
  return (
    <>
      <Badge dot count={2}>
        <Button size="large"> </Button>
      </Badge>
      <Badge dot count={99}>
        解锁新徽章
      </Badge>
      <Badge dot count={100}>
        <UserIcon size={24} />
      </Badge>
    </>
  );
}
