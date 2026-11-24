import React from 'react';
import { Skeleton } from 'tdesign-mobile-react';

const themeList = [
  {
    title: '头像骨架屏',
    value: 'avatar',
    loading: true,
  },
  {
    title: '图片骨架屏',
    value: 'image',
    loading: true,
  },
  {
    title: '文本骨架屏',
    value: 'text',
    loading: true,
  },
  {
    title: '段落骨架屏',
    value: 'paragraph',
    loading: true,
  },
] as const;

export default function ThemeSkeleton() {
  return (
    <>
      {themeList.map((theme, index) => (
        <div key={index}>
          <div className="demo-section__desc">{theme.title}</div>
          <div className="demo-section__content">
            <Skeleton theme={theme.value}></Skeleton>
          </div>
        </div>
      ))}
    </>
  );
}
