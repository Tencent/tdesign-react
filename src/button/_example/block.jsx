import React from 'react';
import { Button } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
          margin: 'auto',
        }}
      >
        <Button block variant="base">
          主按钮
        </Button>
        <Button block variant="outline">
          次要按钮
        </Button>
        <Button block variant="dashed">
          虚框按钮
        </Button>
        <Button block variant="text">
          文字按钮
        </Button>
      </div>
    </div>
  );
}
