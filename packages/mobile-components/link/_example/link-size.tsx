import React from 'react';
import { Link } from 'tdesign-mobile-react';
import { JumpIcon } from 'tdesign-icons-react';

export default function Size() {
  return (
    <div className="demo-content">
      <Link theme="primary" size="small" suffixIcon={<JumpIcon />}>
        S跳转链接
      </Link>
      <Link theme="primary" size="medium" suffixIcon={<JumpIcon />}>
        M跳转链接
      </Link>
      <Link theme="primary" size="large" suffixIcon={<JumpIcon />}>
        L跳转链接
      </Link>
    </div>
  );
}
