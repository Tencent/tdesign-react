import React from 'react';
import { Button } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-row" style={{ justifyContent: 'center' }}>
    <div className="tdesign-demo-block-column" style={{ minWidth: '320px', maxWidth: '640px' }}>
        <Button block variant="base">
          填充按钮
        </Button>
        <Button block variant="outline">
          描边按钮
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
