import React from 'react';
import { Badge, Button } from '@tencent/tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <h3 style={{ marginBottom: 16 }}>1.默认大小</h3>
      <Badge content={2}>
        <Button>按钮</Button>
      </Badge>
      <Badge content={99}>
        <Button>按钮</Button>
      </Badge>
      <Badge content={999}>
        <Button>按钮</Button>
      </Badge>
      <h3 style={{ marginBottom: 16, marginTop: 16 }}>2.小</h3>
      <Badge content={2} size="small">
        <Button>按钮</Button>
      </Badge>
      <Badge content={99} size="small">
        <Button>按钮</Button>
      </Badge>
      <Badge content={999} size="small">
        <Button>按钮</Button>
      </Badge>
    </>
  );
}
