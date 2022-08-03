import React, {useState} from 'react';
import { Image, Space, Button } from 'tdesign-react';
import { RefreshIcon } from 'tdesign-icons-react';

export default function LazySingleImage() {
  const [loadCount, setLoadCount] = useState(0);
  const handleReload = () => {
    setLoadCount(loadCount + 1);
  }

  return (
    <Space direction="vertical">
      <Image
        src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
        style={{width: 240, height: 160}}
        lazy
        key={loadCount}
      />
      <Button variant="outline" icon={<RefreshIcon />} onClick={handleReload}>
        重演 lazy load
      </Button>
    </Space>
  );
}
