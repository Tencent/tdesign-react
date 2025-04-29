import React from 'react';
import { AIMessage, ChatMessage, Divider, Space, SystemMessage, UserMessage } from 'tdesign-react';

const messages = {
  thinking: {
    id: '11111',
    role: 'assistant',
    status: 'streaming',
    content: [
      {
        type: 'thinking',
        data: {
          title: '深度思考中...',
          text: '好的，我现在需要回答用户关于近三年当代偶像爱情剧创作中需要规避的因素的问题。首先，我需要确定用户的问题类型，使用answer_framework_search查询对应的回答框架',
        },
      },
    ],
  } as AIMessage,
  search: {
    id: '22222',
    role: 'assistant',
    content: [
      {
        type: 'search',
        data: {
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
        },
      },
    ],
  } as AIMessage,
  suggestion: {
    id: '33333',
    role: 'assistant',
    content: [
      {
        type: 'suggestion',
        data: [
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
        ],
      },
    ],
  } as AIMessage,
  markdown: {
    id: '4444',
    role: 'assistant',
    content: [
      {
        type: 'markdown',
        data: '**牛顿第一定律** 并不适用于所有参考系，它只适用于 `惯性参考系`',
      },
    ],
  } as AIMessage,
};

export default function ChatMessageExample() {
  const onActions = {
    suggestion: ({ content }) => {
      console.log('suggestionItem', content);
    },
    searchItem: ({ content, event }) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('searchItem', content);
    },
  };
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Divider>渲染思考内容</Divider>
      <ChatMessage
        message={messages.thinking}
        animation="gradient"
        chatContentProps={{ thinking: { maxHeight: 100, collapsed: true } }}
      ></ChatMessage>
      <Divider>渲染搜索内容</Divider>
      <ChatMessage
        message={messages.search}
        chatContentProps={{ search: { expandable: true } }}
        handleActions={onActions}
      ></ChatMessage>
      <Divider>渲染建议问题</Divider>
      <ChatMessage message={messages.suggestion} handleActions={onActions}></ChatMessage>
      <Divider>渲染Markdown内容</Divider>
      <ChatMessage message={messages.markdown}></ChatMessage>
    </Space>
  );
}
