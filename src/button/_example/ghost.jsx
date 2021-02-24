import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <div style={{ background: '#ddd', padding: 24 }}>
        <div className="tdesign-demo-block">
          <Button variant="base" ghost>
            幽灵按钮
          </Button>
          <Button variant="outline" ghost>
            幽灵按钮
          </Button>
          <Button variant="dashed" ghost>
            幽灵按钮
          </Button>
          <Button variant="text" ghost>
            幽灵按钮
          </Button>
        </div>
        <div className="tdesign-demo-block">
          <Button variant="base" theme="primary" ghost>
            幽灵按钮
          </Button>
          <Button variant="outline" theme="primary" ghost>
            幽灵按钮
          </Button>
          <Button variant="dashed" theme="primary" ghost>
            幽灵按钮
          </Button>
          <Button variant="text" theme="primary" ghost>
            幽灵按钮
          </Button>
        </div>
        <div className="tdesign-demo-block">
          <Button variant="base" theme="danger" ghost>
            幽灵按钮
          </Button>
          <Button variant="outline" theme="danger" ghost>
            幽灵按钮
          </Button>
          <Button variant="dashed" theme="danger" ghost>
            幽灵按钮
          </Button>
          <Button variant="text" theme="danger" ghost>
            幽灵按钮
          </Button>
        </div>
      </div>
    </>
  );
}
