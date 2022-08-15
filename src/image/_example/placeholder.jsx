import React, { useState } from 'react';
import { Image, Space, Button } from 'tdesign-react';
import { RefreshIcon, QrcodeIcon } from 'tdesign-icons-react';

export default function PlaceholderImage() {
  const [loadingCount, setLoadingCount] = useState(0);
  const handleReload = () => {
    setLoadingCount(loadingCount + 1);
  }

  const [errorCount, setErrorCount] = useState(0);
  const handleReplayError = () => {
    setErrorCount(errorCount + 1);
  }

  return (
    <Space size={24} direction="vertical">
      <div>
        <h3 style={{marginBottom: 15}}>加载中的图片</h3>
        <Space>
          <Space direction="vertical">
            默认占位
            <Image
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              key={loadingCount}
              style={{width: 284, height: 160}}
            />
            <Button variant="outline" icon={<RefreshIcon />} onClick={handleReload}>
              重演 loading
            </Button>
          </Space>
          <Space direction="vertical">
            自定义占位
            <Image
              key={loadingCount}
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              style={{width: 284, height: 160}}
              loading={<QrcodeIcon size={24} />}
            />
          </Space>
        </Space>
      </div>
      <div>
        <h3 style={{marginBottom: 15}}>加载失败的图片</h3>
        <Space>
          <Space direction="vertical">
            默认错误
            <Image
              src=""
              key={errorCount}
              style={{width: 284, height: 160}}
            />
            <Button variant="outline" icon={<RefreshIcon />} onClick={handleReplayError}>
              重演 error
            </Button>
          </Space>
          <Space direction="vertical">
            自定义错误
            <Image
              src=""
              key={errorCount}
              style={{width: 284, height: 160}}
              error={<QrcodeIcon size={24} />}
            />
          </Space>
        </Space>
      </div>
    </Space>
  );
}
