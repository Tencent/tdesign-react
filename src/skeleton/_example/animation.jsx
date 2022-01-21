import React from 'react';
import { Skeleton } from 'tdesign-react';

const style = {
  't-skeleton-demo-card': {
    margin: '16px',
    border: '1px solid #eee',
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #eee',
  },
  content: {
    padding: '16px',
  },
};

const animations = [
  { label: '渐变加载动画', value: 'gradient' },
  { label: '闪烁加载动画', value: 'flashed' },
];

export default function AnimationSkeleton() {
  return (
    <div className="t-skeleton-demo">
      {animations.map((animation, index) => (
        <div style={style['t-skeleton-demo-card']} key={`animation-${index}`}>
          <div style={style.header}>{animation.label}</div>
          <div style={style.content}>
            <Skeleton animation={animation.value}></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
}
