import React from 'react';
import Progress from '../Progress';

export default function LineProgress() {
  const style = { margin: '20px 0 10px' };
  return (
    <div>
      <div style={style}>默认尺寸</div>
      <Progress theme={'circle'} percentage={30}></Progress>
      <div style={style}>small</div>
      <Progress theme={'circle'} size={'small'} percentage={30}></Progress>
      <div style={style}>large</div>
      <Progress theme={'circle'} size={'large'} percentage={30}></Progress>
      <div style={style}>自定义尺寸</div>
      <Progress theme={'circle'} percentage={30} size={340} strokeWidth={50}></Progress>

      <div style={style}>success</div>
      <Progress theme={'circle'} status={'success'} percentage={100}></Progress>
      <div style={style}>warning</div>
      <Progress theme={'circle'} status={'warning'} percentage={30}></Progress>
      <div style={style}>error</div>
      <Progress theme={'circle'} status={'error'} percentage={30}></Progress>
      <div style={style}>不显示数字</div>
      <Progress theme={'circle'} label={false} percentage={30}></Progress>
      <div style={style}>自定义内容</div>
      <Progress theme={'circle'} label={<div>75 day</div>} percentage={30}></Progress>
      <div style={style}>自定义尺寸与颜色</div>
      <Progress
        theme={'circle'}
        status={'error'}
        size={340}
        strokeWidth={20}
        color={'#00f'}
        trackColor={'#0f0'}
        percentage={30}
      ></Progress>
    </div>
  );
}
