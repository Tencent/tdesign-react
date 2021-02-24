import React from 'react';
import { Button } from '@tencent/tdesign-react';
import PopConfirm from '../PopConfirm';

export default function ThemeExample() {
  const $content = '请确认您要进行此操作';
  return (
    <>
      <PopConfirm content={$content}>
        <Button>默认</Button>
      </PopConfirm>
      <PopConfirm content={$content} theme="info">
        <Button theme="primary">提示</Button>
      </PopConfirm>
      <PopConfirm content={$content} theme="warning">
        <Button theme="warning">警告</Button>
      </PopConfirm>
      <PopConfirm content={$content} theme="error">
        <Button>错误</Button>
      </PopConfirm>
    </>
  );
}
