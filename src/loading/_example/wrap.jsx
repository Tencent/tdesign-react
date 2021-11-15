import React, { useState } from 'react';
import { Loading, Button } from 'tdesign-react';

export default function WrapLoading() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <div style={{ width: 170 }}>
        <Loading size="small" loading={loading} showOverlay>
          <div>this is loading component</div>
          <div>this is loading component</div>
          <div>this is loading component</div>
          <div>this is loading component</div>
          <div>this is loading component</div>
        </Loading>
      </div>
      <div style={{ marginTop: 20 }}>
        <Button style={{ marginRight: 10 }} size="small" onClick={() => setLoading(true)}>
          加载中
        </Button>
        <Button size="small" onClick={() => setLoading(false)}>
          加载完成
        </Button>
      </div>
    </div>
  );
}
