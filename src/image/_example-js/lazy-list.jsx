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
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              style={{width: 230, height: 120}}
              lazy
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
