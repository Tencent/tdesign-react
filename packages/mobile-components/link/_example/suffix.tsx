import React from 'react';
import { JumpIcon } from 'tdesign-icons-react';
import { Link } from 'tdesign-mobile-react';

export default function Suffix() {
  return (
    <div className="demo-content">
      <Link theme="primary" suffixIcon={<JumpIcon />}>
        跳转链接
      </Link>
      <Link suffixIcon={<JumpIcon />}>跳转链接</Link>
    </div>
  );
}
