import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button shape="square" variant="base">
          主按钮
        </Button>
        <Button shape="round" variant="base">
          主按钮
        </Button>
        <Button shape="circle" variant="base">
          i
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button shape="square" variant="outline">
          次要按钮
        </Button>
        <Button shape="round" variant="outline">
          次要按钮
        </Button>
        <Button shape="circle" variant="outline">
          i
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button shape="square" variant="dashed">
          虚框按钮
        </Button>
        <Button shape="round" variant="dashed">
          虚框按钮
        </Button>
        <Button shape="circle" variant="dashed">
          i
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button shape="square" variant="text">
          文字按钮
        </Button>
        <Button shape="round" variant="text">
          文字按钮
        </Button>
        <Button shape="circle" variant="text">
          i
        </Button>
      </div>
    </div>
  );
}
