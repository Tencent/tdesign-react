import React from 'react';
import Progress from '../Progress';

export default function LineProgress() {
  const style = { margin: '20px 0 10px' };
  return (
    <div>
      <div style={style}>默认样式</div>
      <Progress percentage={30}></Progress>
      <div style={style}>100%</div>
      <Progress percentage={100}></Progress>
      <div style={style}>success</div>
      <Progress status={'success'} percentage={30}></Progress>
      <div style={style}>warning</div>
      <Progress status={'warning'} percentage={30}></Progress>
      <div style={style}>error</div>
      <Progress status={'error'} percentage={30}></Progress>
      <div style={style}>active</div>
      <Progress status={'active'} percentage={30}></Progress>
      <div style={style}>不显示数字</div>
      <Progress label={false} percentage={30}></Progress>
      <div style={style}>自定义内容</div>
      <Progress label={<div>75 day</div>} percentage={30}></Progress>
      <div style={style}>自定义颜色与高度</div>
      <Progress strokeWidth={30} color={'#00f'} trackColor={'#0f0'} percentage={30}></Progress>
      <div style={style}>进度条渐变色</div>
      <Progress color={['#f00', '#0ff', '#f0f']} percentage={30}></Progress>
      <Progress color={{ '0%': '#f00', '100%': '#0ff' }} trackColor={'#0f0'} percentage={30}></Progress>
      <Progress strokeWidth={30} color={{ direction: 'to right', from: '#f00', to: '#0ff' }} percentage={30}></Progress>
    </div>
  );
}
