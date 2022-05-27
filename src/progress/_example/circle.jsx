import React, { useState, useEffect } from 'react';
import { Progress } from 'tdesign-react';

export default function LineProgress() {
  // const boxstyle = { display: 'flex', textAlign: 'center', alignItems: 'center' };
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPercent((percent) => (percent % 100) + 10), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tdesign-demo-block-column-large" style={{ textAlign: 'center' }}>
      <div className="tdesign-demo-block-row">
        <div className="tdesign-demo-block-column">
          <div>默认样式</div>
          <Progress theme={'circle'} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>不显示数字</div>
          <Progress theme={'circle'} label={false} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>自定义内容</div>
          <Progress theme={'circle'} label={<div>75 day</div>} percentage={percent}></Progress>
        </div>
      </div>

      <div className="tdesign-demo-block-row">
        <div className="tdesign-demo-block-column">
          <div>进度完成</div>
          <Progress theme={'circle'} status={'success'} percentage={100}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>进度发生错误</div>
          <Progress theme={'circle'} status={'error'} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>进度被中断</div>
          <Progress theme={'circle'} status={'warning'} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>自定义颜色</div>
          <Progress
            theme={'circle'}
            status={'error'}
            color={'#00f'}
            trackColor={'#0f0'}
            percentage={percent}
          ></Progress>
        </div>
      </div>

      <div className="tdesign-demo-block-row">
        <div className="tdesign-demo-block-column">
          <div>小尺寸</div>
          <Progress theme={'circle'} size={'small'} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>默认尺寸</div>
          <Progress theme={'circle'} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>大尺寸</div>
          <Progress theme={'circle'} size={'large'} percentage={percent}></Progress>
        </div>
        <div className="tdesign-demo-block-column">
          <div>自定义尺寸</div>
          <Progress theme={'circle'} percentage={percent} strokeWidth={50}></Progress>
        </div>
      </div>
    </div>
  );
}
