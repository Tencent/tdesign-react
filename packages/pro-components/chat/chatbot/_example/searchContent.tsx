import React from 'react';
import { ChatSearchContent } from '@tdesign-react/chat';

export default function SearchContentSample() {
  return (
    <ChatSearchContent
      status="complete"
      content={{
        title: '搜索到10篇相关内容',
        references: [
          {
            title: '10本高口碑悬疑推理小说,情节高能刺激,看得让人汗毛直立!',
            url: '',
          },
          {
            title: '悬疑小说下载:免费畅读最新悬疑大作!',
            url: '',
          },
        ],
      }}
      expandable={true}
      handleSearchItemClick={({ content, event }) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('点击', content);
      }}
    />
  );
}
