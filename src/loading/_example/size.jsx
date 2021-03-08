import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function LoadingSize() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ position: 'relative', width: '100px' }}>
        小 <Loading loading={true} size="small"></Loading>
      </div>
      <div style={{ position: 'relative', width: '100px' }}>
        中 <Loading loading={true} size="middle"></Loading>
      </div>
      <div style={{ position: 'relative', width: '100px' }}>
        大 <Loading loading={true} size="large"></Loading>
      </div>
    </div>
  );
}
