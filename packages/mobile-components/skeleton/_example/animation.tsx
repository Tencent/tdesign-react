import React from 'react';
import { Skeleton } from 'tdesign-mobile-react';

const animations = [
  {
    title: '渐变加载效果',
    value: 'gradient',
    loading: true,
  },
  {
    title: '闪烁加载效果',
    value: 'flashed',
    loading: true,
  },
] as const;

export default function AnimationSkeleton() {
  return (
    <div>
      {animations.map((animation, index) => (
        <div key={index}>
          <div className="demo-section__desc">{animation.title}</div>
          <div className="demo-section__content">
            <Skeleton theme="paragraph" animation={animation.value} loading={animation.loading} />
          </div>
        </div>
      ))}
    </div>
  );
}
