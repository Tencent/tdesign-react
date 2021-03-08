import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function wrapLoading() {
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={true}>
        <div>this is loading component</div>
      </Loading>
    </div>
  );
}
