import React from 'react';
import { JumpIcon } from 'tdesign-icons-react';
import { Space, Link } from 'tdesign-react';

export default function LinkExample() {
  const clickLink = () => {
    console.log('不触发');
  };

  return (
    <Space>
      <Link theme="default" disabled onClick={clickLink}>
        查看链接
      </Link>
      <Link theme="primary" underline disabled onClick={clickLink}>
        查看链接
      </Link>
      <Link theme="danger" hover="color" disabled onClick={clickLink}>
        查看链接
      </Link>
      <Link theme="warning" hover="underline" disabled onClick={clickLink}>
        查看链接
      </Link>
      <Link theme="success" disabled suffixIcon={<JumpIcon />} onClick={clickLink}>
        查看链接
      </Link>
    </Space>
  );
}
