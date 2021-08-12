import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <>
      <div style={{ background: '#242424', padding: 24 }}>
        <div className="tdesign-demo-block">
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
          <Button variant="outline" theme="success" ghost>
            幽灵按钮
          </Button>
          <Button variant="dashed" theme="success" ghost>
            幽灵按钮
          </Button>
          <Button variant="text" theme="success" ghost>
            幽灵按钮
          </Button>
        </div>
        <div className="tdesign-demo-block">
          <Button variant="outline" theme="warning" ghost>
            幽灵按钮
          </Button>
          <Button variant="dashed" theme="warning" ghost>
            幽灵按钮
          </Button>
          <Button variant="text" theme="warning" ghost>
            幽灵按钮
          </Button>
        </div>
        <div className="tdesign-demo-block">
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
