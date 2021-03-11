import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function BaseLoadingExample() {
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={true}></Loading>
    </div>
  );
}
