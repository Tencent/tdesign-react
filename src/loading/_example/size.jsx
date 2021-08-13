import React from 'react';
import { Loading } from '@tencent/tdesign-react';

export default function LoadingSize() {
  const styles = { position: 'relative', width: '200px', marginBottom: 10 };

  return (
    <div>
      <div style={styles}>
        <Loading text="加载中...（小）" loading size="small"></Loading>
      </div>
      <div style={styles}>
        <Loading text="加载中...（中）" loading size="medium"></Loading>
      </div>
      <div style={styles}>
        <Loading text="加载中...（大）" loading size="large"></Loading>
      </div>
    </div>
  );
}
