import React from 'react';
import { Button } from '@tencent/tdesign-react';
import PopConfirm from '../PopConfirm';

export default function ContentExample() {
  const $content = (
    <>
      <strong>基础气泡确认框文案示意文字按钮</strong>
      <div>带描述的气泡确认框在主要说明文字之外增加了操作相关的详细描述</div>
    </>
  );
  return (
    <PopConfirm content={$content} confirmText="确认删除" cancelText="关闭">
      <Button theme="primary">操作</Button>
    </PopConfirm>
  );
}
