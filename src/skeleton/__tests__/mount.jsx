import React from 'react';
import { render } from '@test/utils';

export function getSkeletonDefaultMount(Skeleton, props, events) {
  return render(
    <Skeleton {...props} {...events}>
      <div className='main-content'>
        <p>
          骨架屏组件，是指当网络较慢时，在页面真实数据加载之前，给用户展示出页面的大致结构。
        </p>
      </div>
    </Skeleton>
  );
}
