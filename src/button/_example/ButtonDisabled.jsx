import React from 'react';
import { Button } from '@tdesign/react';

export default function ButtonExample() {
  return (
    <>
      <Button disabled>line</Button>
      <Button disabled theme="primary">
        primary
      </Button>
      <Button disabled theme="dashed">
        dashed
      </Button>
      <Button disabled theme="warning">
        warning
      </Button>
      <Button disabled theme="warning-line">
        warning-line
      </Button>
      <Button disabled theme="link">
        link
      </Button>
      <div
        style={{ background: '#ddd', padding: '0 8px 8px 8px', marginTop: 8 }}
      >
        <Button disabled theme="ghost">
          ghost
        </Button>
        <Button disabled theme="ghost-line">
          ghost-line
        </Button>
      </div>
    </>
  );
}
