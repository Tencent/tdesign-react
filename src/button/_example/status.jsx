import React from 'react';
import { Button } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <div className="tdesign-demo-block-row">
      <Button disabled>填充按钮</Button>
      <Button loading>加载中</Button>
    </div>
  );
}
