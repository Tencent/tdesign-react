import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function TextExample() {
  const indicator = () => <div>加载中...</div>;
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={true} indicator={indicator}></Loading>
    </div>
  );
}
