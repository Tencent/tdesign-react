import React, { useState, useEffect } from 'react';
import { Progress, Space } from 'tdesign-react';

export default function LineProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPercent((percent) => (percent % 100) + 10), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <h3>默认在线形外展示进度和状态</h3>
      <div>默认样式</div>
      <Progress percentage={percent}></Progress>

      <div>进度被中断</div>
      <Progress status={'warning'} percentage={percent}></Progress>

      <div>进度状态发生重大错误</div>
      <Progress status={'error'} percentage={percent}></Progress>

      <div>进度正常更新</div>
      <Progress status={'active'} percentage={percent}></Progress>

      <div>不显示数字</div>
      <Progress label={false} percentage={percent}></Progress>

      <div>自定义内容</div>
      <Progress label={<div>自定义文本</div>} percentage={percent}></Progress>

      <div>自定义颜色与高度</div>
      <Progress strokeWidth={30} color={'#00f'} trackColor={'#0f0'} percentage={percent}></Progress>

      <div>进度条渐变色</div>
      <Progress color={['#f00', '#0ff', '#f0f']} percentage={percent}></Progress>
      <Progress color={{ '0%': '#f00', '100%': '#0ff' }} trackColor={'#0f0'} percentage={percent}></Progress>
      <Progress
        strokeWidth={30}
        color={{ direction: 'to right', from: '#f00', to: '#0ff' }}
        percentage={percent}
      ></Progress>

      <h3>可以在线形内展示进度信息</h3>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>默认样式</div>
        <Progress theme="plump" percentage="30" />
        <div>进度0-10%时数字数字位置出现在目前进度的右边区域</div>
        <Progress theme="plump" percentage="5" />
      </Space>
    </Space>
  );
}
