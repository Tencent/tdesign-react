import React from 'react';
import { Button } from 'tdesign-mobile-react';

export default function () {
  return (
    <>
      {/* 正确 */}
      <div>
        <Button theme="primary">主要按钮</Button>
        <Button variant="outline">主要按钮</Button>
      </div>

      {/* 错误 */}
      <div>
        <Button theme="primary">主要按钮</Button>
        <Button theme="primary">主要按钮</Button>
      </div>
    </>
  );
}
