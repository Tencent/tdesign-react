import React from 'react';
import { Space } from 'tdesign-react';
import Link from '../Link';

export default function LinkExample() {
  return (
    <>
      <Space>
        <Link theme="default" size="small">
          查看链接
        </Link>
        <Link hover="underline">查看链接</Link>
      </Space>
    </>
  );
}
