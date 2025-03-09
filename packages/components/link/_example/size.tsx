import React from 'react';
import { JumpIcon } from 'tdesign-icons-react';
import { Space, Link } from 'tdesign-react';

export default function LinkExample() {
  return (
    <Space direction="vertical">
      <Space>
        <Link theme="default" size="small">
          跳转链接
        </Link>
        <Link theme="primary" size="small">
          跳转链接
        </Link>
        <Link theme="danger" size="small">
          跳转链接
        </Link>
        <Link theme="warning" size="small" disabled>
          跳转链接
        </Link>
        <Link theme="success" size="small" suffixIcon={<JumpIcon />}>
          跳转链接
        </Link>
      </Space>
      <Space>
        <Link theme="default" size="medium">
          跳转链接
        </Link>
        <Link theme="primary" size="medium">
          跳转链接
        </Link>
        <Link theme="danger" size="medium">
          跳转链接
        </Link>
        <Link theme="warning" size="medium" disabled>
          跳转链接
        </Link>
        <Link theme="success" size="medium" suffixIcon={<JumpIcon />}>
          跳转链接
        </Link>
      </Space>
      <Space>
        <Link theme="default" size="large">
          跳转链接
        </Link>
        <Link theme="primary" size="large">
          跳转链接
        </Link>
        <Link theme="danger" size="large">
          跳转链接
        </Link>
        <Link theme="warning" size="large" disabled>
          跳转链接
        </Link>
        <Link theme="success" size="large" suffixIcon={<JumpIcon />}>
          跳转链接
        </Link>
      </Space>
    </Space>
  );
}
