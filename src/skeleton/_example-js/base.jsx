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
        <Skeleton loading={checked}>
          <div style={style['t-skeleton-demo-paragraph']}>
            <p>
              骨架屏组件，是指当网络较慢时，在页面真实数据加载之前，给用户展示出页面的大致结构。
              一方面让用户对页面有一定的心理预期，另一方面可以改善长期停留在空白屏给用户带来的枯燥和不适感。它可以为用户提供更好视觉效果和使用体验。
            </p>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
