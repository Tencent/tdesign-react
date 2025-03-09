import React from 'react';
import { Badge, Button } from 'tdesign-react';

export default function BadgeExample() {
  return (
    <>
      <h3 style={{ marginBottom: 16 }}>1.默认大小</h3>
      <Badge count={2}>
        <Button>按钮</Button>
      </Badge>
      <Badge count={99}>
        <Button>按钮</Button>
      </Badge>
      <Badge count={999}>
        <Button>按钮</Button>
      </Badge>
      <h3 style={{ marginBottom: 16, marginTop: 32 }}>2.小</h3>
      <Badge count={2} size="small">
        <Button>按钮</Button>
      </Badge>
      <Badge count={99} size="small">
        <Button>按钮</Button>
      </Badge>
      <Badge count={999} size="small">
        <Button>按钮</Button>
      </Badge>
    </>
  );
}
