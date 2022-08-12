import React from 'react';
import { JumpIcon, LinkIcon } from 'tdesign-icons-react';
import { Space, Link } from 'tdesign-react';

export default function LinkExample() {
  return (
    <Space>
      <Link theme="default" prefixIcon={<LinkIcon />}>
        跳转链接
      </Link>
      <Link theme="primary" underline href="https://tdesign.tencent.com/" target="_self" prefixIcon={<LinkIcon />}>
        跳转链接
      </Link>
      <Link theme="danger" underline href="https://tdesign.tencent.com/" target="_self" prefixIcon={<JumpIcon />}>
        跳转链接
      </Link>
      <Link
        theme="warning"
        underline
        href="https://tdesign.tencent.com/"
        target="_self"
        prefixIcon={<JumpIcon />}
        disabled
      >
        跳转链接
      </Link>
    </Space>
  );
}
