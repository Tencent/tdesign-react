import React from 'react';
import { Button, PopConfirm } from '@tencent/tdesign-react';

export default function PlacementExample() {
  const $content = '请确认您要进行此操作';
  return (
    <div className="tdesign-demo-block-row">
      <PopConfirm content={$content} placement="left">
        <Button theme="primary">Left</Button>
      </PopConfirm>

      <PopConfirm content={$content} placement="top">
        <Button>Top</Button>
      </PopConfirm>

      <PopConfirm content={$content} placement="bottom">
        <Button>Bottom</Button>
      </PopConfirm>
    </div>
  );
}
