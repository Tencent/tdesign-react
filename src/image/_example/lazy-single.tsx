import React, {useState} from 'react';
import { Image, Space, Button, Loading } from 'tdesign-react';
import { RefreshIcon } from 'tdesign-icons-react';

export default function LazySingleImage() {
  const [loadCount, setLoadCount] = useState(0);
  const handleReload = () => {
    setLoadCount(loadCount + 1);
  }

  const loading = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      background: 'rgba(255,255,255,.4)',
      backdropFilter: 'blur(10px)'
    }}>
      <Loading
        delay={0}
        fullscreen={false}
        indicator
        inheritColor={false}
        loading
        preventScrollThrough
        showOverlay
        size="small"
      />
    </div>
  )

  return (
    <Space direction="vertical">
      <Image
        src="https://tdesign.gtimg.com/demo/demo-image-1.png"
        style={{width: 284, height: 160}}
        lazy
        placeholder={<img width="100%" height="100%" src="https://tdesign.gtimg.com/demo/demo-image-5.png" />}
        loading={loading}
        key={loadCount}
      />
      <Button variant="outline" icon={<RefreshIcon />} onClick={handleReload}>
        重演 lazy load
      </Button>
    </Space>
  );
}
