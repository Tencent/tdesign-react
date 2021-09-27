import React from 'react';
import { Button, PopConfirm } from '@tencent/tdesign-react';

export default function ContentExample() {
  const content = (
    <>
      <p style={{ fontWeight: 500, fontSize: 14 }}>带描述的气泡确认框文字按钮</p>
      <p style={{ marginTop: 10, fontSize: 12, color: 'rgba(0,0,0,.6)' }}>带描述的气泡确认框在主要说明之外增加了操作相关的详细描述</p>
    </>
  );
  return (
    <>
      <PopConfirm theme={'default'} content={content}>
        <Button theme="primary">自定义content</Button>
      </PopConfirm>
      <PopConfirm theme={'warning'} content={content}>
        <Button theme="danger" variant="outline">自定义content</Button>
      </PopConfirm>
    </>
  );
}
