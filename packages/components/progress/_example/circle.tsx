import React, { useState, useEffect } from 'react';
import { Progress, Space } from 'tdesign-react';

export default function CircleProgress() {
  const [percent, setPercent] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => setPercent((v) => (v % 100) + 10), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Space direction="vertical">
      <div>默认</div>
      {/* 重要：strokeWidth 大小不能超过 size 的一半，否则无法渲染出环形 */}
      <Space size="large" style={{ margin: '20px 0 10px' }}>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>默认样式</div>
          <Progress theme="circle" percentage={percent} />
        </Space>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>不显示数字</div>
          <Progress theme="circle" label={false} percentage={percent} />
        </Space>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>自定义内容</div>
          <Progress theme="circle" label={<div>{percent}day</div>} percentage={percent} />
        </Space>
      </Space>

      <Space size="large" style={{ margin: '20px 0 10px' }}>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>进度状态完成</div>
          <Progress theme="circle" percentage={100} status="success" />
        </Space>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>进度状态发生重大错误</div>
          <Progress theme="circle" percentage={75} status="error" />
        </Space>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>进度状态被中断</div>
          <Progress theme="circle" percentage={50} status="warning" />
        </Space>
      </Space>

      <div>默认不同尺寸</div>
      <Space size="large" style={{ margin: '20px 0 10px' }}>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>小尺寸</div>
          <Progress theme="circle" percentage={30} size="small" />
        </Space>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160 }}>
          <div style={{ marginBottom: 10 }}>默认尺寸</div>
          <Progress theme="circle" percentage={30} size="medium" />
        </Space>
        <Space align="center" direction="vertical" size="small" style={{ margin: 15, minWidth: 160, marginLeft: 60 }}>
          <div style={{ marginBottom: 10 }}>大尺寸</div>
          <Progress theme="circle" percentage={75} size="large" />
        </Space>
      </Space>
    </Space>
  );
}
