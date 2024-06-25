import React, { useState } from 'react';
import { Skeleton, Switch } from 'tdesign-react';

const style = {
  'mb-20': {
    marginBottom: '20px',
  },
  't-skeleton-demo-paragraph': {
    lineHeight: '25px',
  },
};

export default function BasicSkeleton() {
  const [checked, setChecked] = useState(true);

  const onChange = (value) => {
    console.log('value', value);
    setChecked(value);
  };

  return (
    <div>
      <div>
        <Switch style={style['mb-20']} value={checked} onChange={onChange}></Switch>
      </div>
      <div>
        <Skeleton loading={checked} delay={1500} animation="flashed">
          <div style={style['t-skeleton-demo-paragraph']}>
            <p>设置最短延迟响应时间，低于响应时间的操作不显示加载状态。</p>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
