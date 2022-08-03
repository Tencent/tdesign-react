import React, {useState} from 'react';
import { Image, Space, Button } from 'tdesign-react';
import { RefreshIcon } from 'tdesign-icons-react';

export default function LazyListImage() {
  const [loadCount, setLoadCount] = useState(0);
  const handleReload = () => {
    setLoadCount(loadCount + 1);
  }

  return (
    <Space direction="vertical" key={loadCount}>
      <Space breakLine style={{height: 240, overflowY: 'scroll'}}>
        {
          Array.from({length: 24}).map((_, index) => (
            <Image
              key={index}
              src="http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg"
              style={{width: 183, height: 160}}
              lazy={index > 5}
            />
          ))
        }
      </Space>
      <Button variant="outline" icon={<RefreshIcon />} onClick={handleReload}>
        重演 lazy load
      </Button>
    </Space>
  );
}
