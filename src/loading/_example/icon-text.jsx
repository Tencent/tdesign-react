import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function IconTextExample() {
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={true} text="拼命加载中..." size="small"></Loading>
    </div>
  );
}
