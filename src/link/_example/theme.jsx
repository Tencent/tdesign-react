import React from 'react';
import { Space } from 'tdesign-react';
import Link from '../Link';

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
