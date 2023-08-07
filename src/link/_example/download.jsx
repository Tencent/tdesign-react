import React from 'react';
import { Space, Link } from 'tdesign-react';

export default function LinkExample() {
  return (
    <Space>
      <Link theme="primary" download href="/starter/assets/vue.ee956b80.svg">
        跳转链接
      </Link>
      <Link theme="primary" download="test/download-file.png" href="/starter/assets/vue.ee956b80.svg">
        跳转链接
      </Link>
    </Space>
  );
}
