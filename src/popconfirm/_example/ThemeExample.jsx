import React from 'react';
import { Button } from '@tencent/tdesign-react';
import PopConfirm from '../PopConfirm';

export default function ThemeExample() {
  const $content = '请确认您要进行此操作';
  return (
    <>
      <PopConfirm content={$content}>
        <Button style={{ marginLeft: 8 }}>默认</Button>
      </PopConfirm>
      <PopConfirm content={$content} theme="info">
        <Button theme="primary" style={{ marginLeft: 8 }}>
          提示
        </Button>
      </PopConfirm>
      <PopConfirm content={$content} theme="warning">
        <Button theme="warning" style={{ marginLeft: 8 }}>
          警告
        </Button>
      </PopConfirm>
      <PopConfirm content={$content} theme="error">
        <Button style={{ marginLeft: 8 }}>错误</Button>
      </PopConfirm>
    </>
  );
}
