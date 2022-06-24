import React, { useState, useEffect } from 'react';
import { Progress, Space } from 'tdesign-react';

const commonStyle = {
  textAlign: 'center',
};

export default function LineProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPercent((percent) => (percent % 100) + 10), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Space direction="vertical" size="large">
      <Space style={commonStyle}>
        <Space direction="vertical">
          <div>默认样式</div>
          <Progress theme={'circle'} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>不显示数字</div>
          <Progress theme={'circle'} label={false} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>自定义内容</div>
          <Progress theme={'circle'} label={<div>75 day</div>} percentage={percent}></Progress>
        </Space>
      </Space>

      <Space style={commonStyle}>
        <Space direction="vertical">
          <div>进度完成</div>
          <Progress theme={'circle'} status={'success'} percentage={100}></Progress>
        </Space>
        <Space direction="vertical">
          <div>进度发生错误</div>
          <Progress theme={'circle'} status={'error'} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>进度被中断</div>
          <Progress theme={'circle'} status={'warning'} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>自定义颜色</div>
          <Progress
            theme={'circle'}
            status={'error'}
            color={'#00f'}
            trackColor={'#0f0'}
            percentage={percent}
          ></Progress>
        </Space>
      </Space>

      <Space align="center" style={commonStyle}>
        <Space direction="vertical">
          <div>小尺寸</div>
          <Progress theme={'circle'} size={'small'} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>默认尺寸</div>
          <Progress theme={'circle'} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>大尺寸</div>
          <Progress theme={'circle'} size={'large'} percentage={percent}></Progress>
        </Space>
        <Space direction="vertical">
          <div>自定义尺寸</div>
          <Progress theme={'circle'} percentage={percent} strokeWidth={50}></Progress>
        </Space>
      </Space>
    </Space>
  );
}
