import React from 'react';
import { Space, Link } from 'tdesign-react';

export default function LinkExample() {
  return (
    <Space>
      <Link theme="default">跳转链接</Link>
      <Link theme="primary">跳转链接</Link>
      <Link theme="danger">跳转链接</Link>
      <Link theme="warning">跳转链接</Link>
      <Link theme="success">跳转链接</Link>
    </Space>
  );
}
