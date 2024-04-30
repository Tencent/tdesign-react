import React from 'react';
import { Space, Link } from 'tdesign-react';

export default function LinkExample() {
  return (
    <Space direction="vertical">
      <Space>
        <Link theme="default" hover="underline">
          跳转链接
        </Link>
        <Link theme="primary" hover="underline">
          跳转链接
        </Link>
        <Link theme="danger" hover="underline">
          跳转链接
        </Link>
        <Link theme="warning" hover="underline">
          跳转链接
        </Link>
        <Link theme="success" hover="underline">
          跳转链接
        </Link>
      </Space>
      <Space>
        <Link theme="default" hover="color">
          跳转链接
        </Link>
        <Link theme="primary" hover="color">
          跳转链接
        </Link>
        <Link theme="danger" hover="color">
          跳转链接
        </Link>
        <Link theme="warning" hover="color">
          跳转链接
        </Link>
        <Link theme="success" hover="color">
          跳转链接
        </Link>
      </Space>
      <Space>
        <Link theme="default" hover="color" underline>
          跳转链接
        </Link>
        <Link theme="primary" hover="color" underline>
          跳转链接
        </Link>
        <Link theme="danger" hover="color" underline>
          跳转链接
        </Link>
        <Link theme="warning" hover="color" underline>
          跳转链接
        </Link>
        <Link theme="success" hover="color" underline>
          跳转链接
        </Link>
      </Space>
    </Space>
  );
}
