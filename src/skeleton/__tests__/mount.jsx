import React from 'react';
import { render } from '@test/utils';

const getContent = (Skeleton, props, events) => <Skeleton {...props} {...events}>
<div className='main-content'>
  <p>
    骨架屏组件，是指当网络较慢时，在页面真实数据加载之前，给用户展示出页面的大致结构。
  </p>
</div>
</Skeleton>;

export function getSkeletonDefaultMount(...args) {
  return render(getContent(...args));
}

export function getSkeletonInfo(...args) {
  return {
    mountedContent: render(getContent(...args)),
    getContent
  };
}
