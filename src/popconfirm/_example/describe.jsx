import React from 'react';
import { Button, Popconfirm, Space } from 'tdesign-react';

export default function ContentExample() {
  const content = (
    <>
      <p style={{ fontWeight: 500, fontSize: 14 }}>带描述的气泡确认框文字按钮</p>
      <p style={{ marginTop: 10, fontSize: 12 }}>带描述的气泡确认框在主要说明之外增加了操作相关的详细描述</p>
    </>
  );
  return (
    <Space>
      <Popconfirm theme={'default'} content={content}>
        <Button theme="primary">自定义浮层内容</Button>
      </Popconfirm>
      <Popconfirm theme={'warning'} content={content}>
        <Button theme="warning">自定义浮层内容</Button>
      </Popconfirm>
    </Space>
  );
}
