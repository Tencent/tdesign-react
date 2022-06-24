import React, { useState } from 'react';
import { Loading, Button, Space } from 'tdesign-react';

export default function WrapLoading() {
  const [loading, setLoading] = useState(true);

  return (
    <Space direction="vertical">
      <div style={{ width: 170 }}>
        <Loading size="small" loading={loading} showOverlay>
          <div>this is loading component</div>
          <div>this is loading component</div>
          <div>this is loading component</div>
          <div>this is loading component</div>
          <div>this is loading component</div>
        </Loading>
      </div>
      <Space>
        <Button size="small" onClick={() => setLoading(true)}>
          加载中
        </Button>
        <Button size="small" onClick={() => setLoading(false)}>
          加载完成
        </Button>
      </Space>
    </Space>
  );
}
