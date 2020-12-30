import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <Button>line</Button>
      <Button theme="primary">primary</Button>
      <Button theme="dashed">dashed</Button>
      <Button theme="warning">warning</Button>
      <Button theme="warning-line">warning-line</Button>
      <Button theme="link">link</Button>
      <Button theme="ghost">ghost</Button>
      <Button theme="ghost-line">ghost-line</Button>
    </>
  );
}
