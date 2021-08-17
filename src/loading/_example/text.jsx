import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function TextExample() {
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={true} text="静态文字加载中..." indicator={false}></Loading>
    </div>
  );
}
