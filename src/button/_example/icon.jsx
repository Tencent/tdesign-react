import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <Button icon="search">line</Button>
      <Button variant="outline" icon="search">
        primary
      </Button>
      <Button icon="search" />
    </>
  );
}
