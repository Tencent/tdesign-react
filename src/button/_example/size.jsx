import React from 'react';
import { Button } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button size="small" variant="base">
          主按钮
        </Button>
        <Button size="small" variant="outline">
          次要按钮
        </Button>
        <Button size="small" variant="dashed">
          虚框按钮
        </Button>
        <Button size="small" variant="text">
          文字按钮
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button size="medium" variant="base">
          主按钮
        </Button>
        <Button size="medium" variant="outline">
          次要按钮
        </Button>
        <Button size="medium" variant="dashed">
          虚框按钮
        </Button>
        <Button size="medium" variant="text">
          文字按钮
        </Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button size="large" variant="base">
          主按钮
        </Button>
        <Button size="large" variant="outline">
          次要按钮
        </Button>
        <Button size="large" variant="dashed">
          虚框按钮
        </Button>
        <Button size="large" variant="text">
          文字按钮
        </Button>
      </div>
    </div>
  );
}
