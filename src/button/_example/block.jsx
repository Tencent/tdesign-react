import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '40%',
          marginRight: 32,
        }}
      >
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
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '40%',
        }}
      >
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
      </div>
    </div>
  );
}
