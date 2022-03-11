import React from 'react';
import { Skeleton } from 'tdesign-react';

const themes = [
  { label: '文本', value: 'text' },
  { label: '头像', value: 'avatar' },
  { label: '段落', value: 'paragraph' },
  { label: '头像描述', value: 'avatar-text' },
  { label: '选项卡', value: 'tab' },
  { label: '文章', value: 'article' },
];

export default function ThemeSkeleton() {
  return (
    <div className="t-skeleton-demo">
      {themes.map((theme, index) => (
        <div className="t-skeleton-demo-card" key={`animation-${index}`}>
          <div className="header">{theme.label}</div>
          <div className="content">
            <Skeleton theme={theme.value}></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
}
