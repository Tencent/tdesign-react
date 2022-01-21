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

const themes = ['text', 'avatar', 'paragraph', 'avatar-text', 'tab', 'article'];

export default function ThemeSkeleton() {
  return (
    <div className="t-skeleton-demo">
      {themes.map((theme, index) => (
        <div style={style['t-skeleton-demo-card']} key={`animation-${index}`}>
          <div style={style.header}>{theme}</div>
          <div style={style.content}>
            <Skeleton theme={theme}></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );
}
