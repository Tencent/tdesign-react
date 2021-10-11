import React from 'react';
import { Button } from '@tencent/tdesign-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button theme="primary">填充按钮</Button>
        <Button variant="outline" theme="primary">描边按钮</Button>
        <Button variant="dashed" theme="primary">虚框按钮</Button>
        <Button variant="text" theme="primary">文字按钮</Button>
      </div>
      <div className="tdesign-demo-block-row">
        <Button theme="danger">填充按钮</Button>
        <Button variant="outline" theme="danger">描边按钮</Button>
        <Button variant="dashed" theme="danger">虚框按钮</Button>
        <Button variant="text" theme="danger">文字按钮</Button>
      </div>
    </div>
  );
}
