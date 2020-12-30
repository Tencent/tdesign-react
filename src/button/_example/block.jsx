import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <Button block>line</Button>
      <Button block theme="primary">
        primary
      </Button>
      <Button block theme="dashed">
        dashed
      </Button>
      <Button block theme="warning">
        warning
      </Button>
      <Button block theme="warning-line">
        warning-line
      </Button>
      <Button block theme="link">
        link
      </Button>
      <Button block theme="ghost">
        ghost
      </Button>
      <Button block theme="ghost-line">
        ghost-line
      </Button>
    </>
  );
}
