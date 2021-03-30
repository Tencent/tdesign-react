import React from 'react';
import Progress from '../Progress';

export default function LineProgress() {
  const style = { margin: '16px' };
  return (
    <>
      <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center' }}>
        <div style={style}>
          <div>success</div>
          <Progress theme={'circle'} status={'success'} percentage={100}></Progress>
        </div>
        <div style={style}>
          <div>warning</div>
          <Progress theme={'circle'} status={'warning'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>error</div>
          <Progress theme={'circle'} status={'error'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>不显示数字</div>
          <Progress theme={'circle'} label={false} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>自定义内容</div>
          <Progress theme={'circle'} label={<div>75 day</div>} percentage={30}></Progress>
        </div>

        <div style={style}>
          <div>自定义尺寸与颜色</div>
          <Progress
            theme={'circle'}
            status={'error'}
            strokeWidth={20}
            color={'#00f'}
            trackColor={'#0f0'}
            percentage={30}
          ></Progress>
        </div>
      </div>

      <div style={{ display: 'flex', textAlign: 'center' }}>
        <div style={style}>
          <div>small</div>
          <Progress theme={'circle'} size={'small'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>默认尺寸</div>
          <Progress theme={'circle'} percentage={30}></Progress>
        </div>
        <div style={style}>
          <div>large</div>
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
