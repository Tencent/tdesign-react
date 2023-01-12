import React, { useEffect, useState } from 'react';
import { Loading, Button, Space } from 'tdesign-react';

export default function LoadingDelay() {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  const loadingData = (time) => {
    setLoading(true);
    setData('');
    const timer = setTimeout(() => {
      setLoading(false);
      setData('数据加载完成，短时间的数据加载并未出现 loading');
      clearTimeout(timer);
    }, time || 100);
  };

  useEffect(() => {
    loadingData();
  }, []);

  return (
    <Space direction="vertical">
      <div>
        <Loading delay={500} size="small" loading={loading}></Loading>
        {data ? <div>{`loading 作为独立元素：${data}`}</div> : null}
      </div>

      <div>
        <Loading loading={loading} delay={500} size="small" showOverlay>
          <div>{data ? `loading 作为包裹元素：${data}` : ''}</div>
        </Loading>
      </div>

      <div className="tdesign-demo-block-row">
        <Button onClick={loadingData} size="small">
          快速重新加载数据（无loading）
        </Button>
        <Button onClick={() => loadingData(1000)} size="small">
          慢速重新加载数据
        </Button>
      </div>
    </Space>
  );
}
