import React, { useState } from 'react';
import { Loading, Button } from 'tdesign-mobile-react';

export default function PureTextLoading() {
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  return (
    <div className="loading-demo--text ">
      <div className="loading-demo">
        <Loading indicator={false} text="加载中..." />
      </div>
      <div className="loading-demo">
        <Loading loading={loading} theme="spinner">
          <div className="text">加载失败</div>
        </Loading>
        <Button className="text" size="small" variant="text" theme="primary" disabled={loading} onClick={handleLoading}>
          刷新
        </Button>
      </div>
    </div>
  );
}
