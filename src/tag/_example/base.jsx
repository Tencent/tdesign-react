import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function ThemeTagExample() {
  return (
    <>
      <div>
        <Tag theme="default">默认</Tag>
        <a href="https://www.tencent.com/zh-cn" target="_blank" rel="noreferrer">
          <Tag>超链接</Tag>
        </a>
      </div>
    </>
  );
}
