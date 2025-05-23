import React from 'react';
import { loading, Button } from 'tdesign-react';

export default function Service() {
  const handleFullscreen = () => {
    const loadInstance = loading(true);

    setTimeout(() => loadInstance.hide(), 1000);
  };

  const handleAttach = () => {
    const loadInstance = loading({ attach: () => document.querySelector('#loading-service') });

    setTimeout(() => loadInstance.hide(), 1000);
  };

  return (
    <>
      <div
        id="loading-service"
        style={{ width: '100%', height: '60px', textAlign: 'center', lineHeight: '60px', position: 'relative' }}
      >
        我是service的容器
      </div>

      <div>
        <Button onClick={handleFullscreen} style={{ marginRight: 20 }}>
          服务加载方式（全屏）
        </Button>
        <Button onClick={handleAttach}>服务加载方式（局部）</Button>
      </div>
    </>
  );
}
