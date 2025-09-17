import React from 'react';
import { ChatSuggestionContent } from '@tdesign-react/chat';

export default function SuggestionSample() {
  return (
    <ChatSuggestionContent
      content={[
        {
          title: '《六姊妹》中有哪些观众喜欢的剧情点？',
          prompt: '《六姊妹》中有哪些观众喜欢的剧情点？',
        },
        {
          title: '两部剧在演员表现上有什么不同？',
          prompt: '两部剧在演员表现上有什么不同？',
        },
        {
          title: '《六姊妹》有哪些负面的评价？',
          prompt: '《六姊妹》有哪些负面的评价？',
        },
      ]}
      handlePromptClick={({ content }) => {
        console.log('点击', content);
      }}
    />
  );
}
