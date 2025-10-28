import React from 'react';
import { Space, Divider } from 'tdesign-react';

import { AIMessage, ChatMessage, UserMessage } from '@tdesign-react/chat';

const userMessage1: UserMessage = {
  id: '11111',
  role: 'user',
  status: 'complete',
  content: [
    {
      type: 'text',
      data: '分析以下内容，总结一篇广告策划方案',
    },
    {
      type: 'attachment',
      data: [
        {
          fileType: 'doc',
          name: 'demo.docx',
          url: 'https://tdesign.gtimg.com/site/demo.docx',
          size: 12312,
        },
        {
          fileType: 'pdf',
          name: 'demo2.pdf',
          url: 'https://tdesign.gtimg.com/site/demo.pdf',
          size: 34333,
        },
      ],
    },
  ],
};
const userMessage2: UserMessage = {
  id: '22222',
  role: 'user',
  status: 'complete',
  content: [
    {
      type: 'text',
      data: '这个图里的帅哥是谁？',
    },
    {
      type: 'attachment',
      data: [
        {
          fileType: 'image',
          name: 'avatar.jpg',
          size: 234234,
          url: 'https://tdesign.gtimg.com/site/avatar.jpg',
        },
      ],
    },
  ],
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
      **文本格式内容**，**Markdown格式内容**、**思考过程**、**搜索结果**、**建议问题**、**附件列表**、**图片**
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>文本格式</Divider>
      <ChatMessage
        role="user"
        content={[
          {
            type: 'text',
            data: '牛顿第一定律是否适用于所有参考系',
          },
        ]}
      ></ChatMessage>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>Markdown格式</Divider>
      <ChatMessage
        role="assistant"
        content={[
          {
            type: 'markdown',
            data: '牛顿第一定律并不适用于所有参考系，它只适用于**惯性参考系**。在`质点不受外力作用`时，能够判断出质点静止或作匀速直线运动的参考系一定是惯性参考系，因此只有在惯性参考系中牛顿第一定律才适用。',
          },
        ]}
      ></ChatMessage>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>思考过程</Divider>
      <ChatMessage
        role={'assistant'}
        chatContentProps={{
          thinking: { maxHeight: 100, collapsed: false },
        }}
        content={[
          {
            type: 'thinking',
            status: 'complete',
            data: {
              title: '已完成思考（耗时3秒）',
              text: '好的，我现在需要回答用户关于对比近3年当代偶像爱情剧并总结创作经验的问题结合行业报告和成功案例，总结出以下创作经验。',
            },
          },
        ]}
      ></ChatMessage>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>搜索结果</Divider>
      <ChatMessage
        variant="text"
        role={'assistant'}
        content={[
          {
            type: 'search',
            data: {
              title: '搜索到2篇相关内容',
              references: [
                {
                  title: '惯性参考系定义',
                  url: '',
                },
                {
                  title: '牛顿第一定律定义',
                  url: '',
                },
              ],
            },
          },
        ]}
      ></ChatMessage>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>建议问题</Divider>
      <ChatMessage
        role={'assistant'}
        chatContentProps={{
          thinking: { maxHeight: 100, collapsed: false },
        }}
        content={[
          {
            type: 'suggestion',
            data: [
              {
                title: '近3年偶像爱情剧的市场反馈如何',
                prompt: '近3年偶像爱情剧的市场反馈如何',
              },
              {
                title: '偶像爱情剧的观众群体分析',
                prompt: '偶像爱情剧的观众群体分析',
              },
              {
                title: '偶像爱情剧的创作趋势是什么',
                prompt: '偶像爱情剧的创作趋势是什么',
              },
            ],
          },
        ]}
      ></ChatMessage>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>附件内容</Divider>
      <ChatMessage
        role={'user'}
        chatContentProps={{
          thinking: { maxHeight: 100, collapsed: false },
        }}
        content={[
          {
            type: 'text',
            data: '分析以下内容，总结一篇广告策划方案',
          },
          {
            type: 'attachment',
            data: [
              {
                fileType: 'doc',
                name: 'demo.docx',
                url: 'https://tdesign.gtimg.com/site/demo.docx',
                size: 12312,
              },
              {
                fileType: 'pdf',
                name: 'demo2.pdf',
                url: 'https://tdesign.gtimg.com/site/demo.pdf',
                size: 34333,
              },
            ],
          },
        ]}
      ></ChatMessage>
    </Space>
  );
}
