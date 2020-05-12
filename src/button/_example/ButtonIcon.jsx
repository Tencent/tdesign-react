import React from 'react';
import { Button } from '@tdesign/react/button';

export default function ButtonExample() {
  return (
    <>
      <Button icon="demo">line</Button>
      <Button theme="primary" icon="demo">
        primary
      </Button>
      <Button icon="demo" />
      <Button theme="primary" icon="demo" />
    </>
  );
}
