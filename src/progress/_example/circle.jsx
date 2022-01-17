import React from 'react';
import Progress from '../Progress';

export default function LineProgress() {
  const style = { margin: '16px' };
  const boxstyle = { display: 'flex', textAlign: 'center', alignItems: 'center' };
  return (
    <>
      <h3 style={style}>默认</h3>
      <div style={boxstyle}>
        <div style={style}>
          <div style={style}>默认样式</div>
          <Progress theme={'circle'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div style={style}>不显示数字</div>
          <Progress theme={'circle'} label={false} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div style={style}>自定义内容</div>
          <Progress theme={'circle'} label={<div>75 day</div>} percentage={30}></Progress>
        </div>
      </div>
      <div style={boxstyle}>
        <div style={style}>
          <div style={style}>进度完成</div>
          <Progress theme={'circle'} status={'success'} percentage={100}></Progress>
        </div>
        <div style={style}>
          <div style={style}>进度发生错误</div>
          <Progress theme={'circle'} status={'error'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div style={style}>进度被中断</div>
          <Progress theme={'circle'} status={'warning'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div style={style}>自定义颜色</div>
          <Progress
            theme={'circle'}
            status={'error'}
            color={'#00f'}
            trackColor={'#0f0'}
            percentage={30}
          ></Progress>
        </div>
      </div>
      <h3 style={style}>不同尺寸</h3>
      <div style={boxstyle}>
        <div style={style}>
          <div>小尺寸</div>
          <Progress theme={'circle'} size={'small'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>默认尺寸</div>
          <Progress theme={'circle'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>大尺寸</div>
          <Progress theme={'circle'} size={'large'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>自定义尺寸</div>
          <Progress theme={'circle'} percentage={30} strokeWidth={50}></Progress>
        </div>
      </div>
    </>
  );
}
