import React from 'react';
import { JumpIcon } from 'tdesign-icons-react';
import { Space } from 'tdesign-react';
import Link from '../Link';

export default function LinkExample() {
  return (
    <Space>
      <Link theme="default" disabled>
        查看链接
      </Link>
      <Link theme="primary" underline disabled>
        查看链接
      </Link>
      <Link theme="danger" hover="color" disabled>
        查看链接
      </Link>
      <Link theme="warning" hover="underline" disabled>
        查看链接
      </Link>
      <Link theme="success" disabled suffixIcon={<JumpIcon />}>
        查看链接
      </Link>
    </Space>
  );
}
