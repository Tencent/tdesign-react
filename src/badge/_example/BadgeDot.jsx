import React from 'react';
import { Badge, UserIcon, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <Badge dot count={2} offset={[-1, -1]}>
        <Button size="large"> </Button>
      </Badge>
      <Badge dot count={99} offset={[-1, -1]}>
        解锁新徽章
      </Badge>
      <Badge dot count={100} offset={[-1, -1]}>
        <UserIcon size={24} />
      </Badge>
    </>
  );
}
