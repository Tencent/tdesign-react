import React from 'react';
import { LoadingPlugin, Button } from 'tdesign-mobile-react';

export default function PluginLoading() {
  // 函数式：局部加载
  const showAttach = () => {
    const loadingInstance = LoadingPlugin({
      attach: () => document.querySelector('#loading-service-demo'), // 等于 attach: '#loading-service-demo'
      size: '20px',
    });
    const timer = setTimeout(() => {
      loadingInstance.hide();
      clearTimeout(timer);
    }, 1000);
  };

  // 函数式：全屏加载，防止滚动穿透
  const showFullScreen = () => {
    const loadingInstance = LoadingPlugin(true);
    const timer = setTimeout(() => {
      loadingInstance.hide();
      clearTimeout(timer);
    }, 1000);
  };

  return (
    <div className="loading-demo">
      <div id="loading-service-demo" className="loading-service-demo">
        Loading 挂载容器
      </div>
      <div className="space">
        <Button className="t-loading__btn" size="small" onClick={showAttach}>
          函数方式加载（局部）
        </Button>
        <Button size="small" onClick={showFullScreen}>
          函数方式加载（全屏）
        </Button>
      </div>
    </div>
  );
}
