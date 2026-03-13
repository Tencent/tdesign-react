import React, { useState, useEffect } from 'react';
import { Progress, Space } from 'tdesign-react';

export default function LineProgress() {
  const [percent, setPercent] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => setPercent((v) => (v % 100) + 10), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <h3>动态更新示例</h3>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>进度正常更新</div>
        <Progress percentage={percent} />

        <div>不显示数字</div>
        <Progress theme="line" label={false} percentage={percent} />

        <div>自定义内容</div>
        <Progress theme="line" label={<div>自定义文本</div>} percentage={percent} />
      </Space>

      <h3>默认在线形外展示进度和状态</h3>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>默认样式</div>
        <Progress theme="line" percentage={30} />

        <div>100%</div>
        <Progress theme="line" percentage={100} />

        <div>进度状态完成</div>
        <Progress theme="line" status="success" percentage={60} />

        <div>进度状态发生重大错误</div>
        <Progress theme="line" status="error" percentage={60} />

        <div>进度状态被中断</div>
        <Progress theme="line" status="warning" percentage={60} />

        <div>渐变色</div>
        <Progress theme="line" color={{ from: '#0052D9', to: '#00A870' }} percentage={60} status="active" />
      </Space>

      <h3>可以在线形内展示进度信息</h3>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>默认样式</div>
        <Progress theme="plump" percentage={30} />

        <div>进度条内部宽度不足以展示其内容时，该内容会自动显示在进度条右侧</div>
        <Progress theme="plump" label={<div>当前进度为：{percent}%</div>} percentage={percent} />
      </Space>
    </Space>
  );
}
