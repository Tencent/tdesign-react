import React, { useState } from 'react';
import { Image, Avatar, Space, Button } from 'tdesign-react';
import { PhotoIcon, LinkUnlinkIcon, RefreshIcon, LoadingIcon } from 'tdesign-icons-react';

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
    <Space size={220}>
      <div>
        <h3 style={{marginBottom: 15}}>加载中的图片</h3>
        <Space>
          <Space direction="vertical">
            默认占位
            <Image
              src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
              key={loadingCount}
              style={{width: 100, height: 100}}
            />
            <Button variant="outline" icon={<RefreshIcon />} onClick={handleReload}>
              重演 loading
            </Button>
          </Space>
          <Space direction="vertical">
            自定义占位
            <Image
              key={loadingCount}
              src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
              style={{width: 100, height: 100}}
              loading={<LoadingIcon />}
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
              style={{width: 100, height: 100}}
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
              style={{width: 100, height: 100}}
              placeholder={<Avatar icon={<PhotoIcon />} />}
              error={<Avatar icon={<LinkUnlinkIcon />} />}
            />
          </Space>
        </Space>
      </div>
    </Space>
  );
}
