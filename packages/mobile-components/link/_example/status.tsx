import React from 'react';
import { Link } from 'tdesign-mobile-react';
import { JumpIcon } from 'tdesign-icons-react';

export default function Status() {
  return (
    <>
      <div className="demo-content">
        <Link theme="primary" suffixIcon={<JumpIcon />} disabled>
          跳转链接
        </Link>
        <Link suffixIcon={<JumpIcon />} disabled>
          跳转链接
        </Link>
        <Link theme="danger" suffixIcon={<JumpIcon />} disabled>
          跳转链接
        </Link>
      </div>
      <div className="demo-content">
        <Link theme="success" suffixIcon={<JumpIcon />} disabled>
          跳转链接
        </Link>
        <Link theme="warning" suffixIcon={<JumpIcon />} disabled>
          跳转链接
        </Link>
      </div>
    </>
  );
}
