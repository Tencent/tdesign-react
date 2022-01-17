import React from 'react';
import Progress from '../Progress';

export default function LineProgress() {
  const style = { margin: '20px 0 10px' };
  return (
    <div>
      <h3>默认在线形外展示进度和状态</h3>
      <div style={style}>默认样式</div>
      <Progress percentage={30}></Progress>
      <div style={style}>100%</div>
      <Progress percentage={100}></Progress>
      <div style={style}>进度完成</div>
      <Progress status={'success'} percentage={100}></Progress>
      <div style={style}>进度被中断</div>
      <Progress status={'warning'} percentage={30}></Progress>
      <div style={style}>进度状态发生重大错误</div>
      <Progress status={'error'} percentage={30}></Progress>
      <div style={style}>进度正常更新</div>
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
      <h3 style={style}>可以在线形内展示进度信息</h3>
      <div style={style}>
        <div style={style}>默认样式</div>
        <Progress theme="plump" percentage="30" />
        <div style={style}>进度0-10%时数字数字位置出现在目前进度的右边区域</div>
        <Progress theme="plump" percentage="5" />
      </div>
    </div>
  );
}
