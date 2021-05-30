import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <div className="tdesign-demo-block">
        <Button variant="base">主要按钮</Button>
        <Button variant="outline">次要按钮</Button>
        <Button variant="dashed">虚框按钮</Button>
        <Button variant="text">文字按钮</Button>
      </div>
      <div className="tdesign-demo-block">
        <Button theme="primary" variant="base">
          主要按钮
        </Button>
        <Button theme="primary" variant="outline">
          次要按钮
        </Button>
        <Button theme="primary" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="primary" variant="text">
          文字按钮
        </Button>
      </div>
      <div className="tdesign-demo-block">
        <Button theme="danger" variant="base">
          主要按钮
        </Button>
        <Button theme="danger" variant="outline">
          次要按钮
        </Button>
        <Button theme="danger" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="danger" variant="text">
          文字按钮
        </Button>
      </div>
    </>
  );
}
