import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function IconTextExample() {
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={true} text="加载中"></Loading>
    </div>
  );
}
