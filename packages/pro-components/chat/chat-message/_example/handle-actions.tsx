import React, { useState } from 'react';
import { Space, MessagePlugin } from 'tdesign-react';
import { ChatMessage, AIMessage } from '@tdesign-react/chat';

const message: AIMessage = {
  id: '123123',
  role: 'assistant',
  status: 'complete',
  content: [
    {
      type: 'markdown',
      data: '牛顿第一定律并不适用于所有参考系，它只适用于惯性参考系。在质点不受外力作用时，能够判断出质点静止或作匀速直线运动的参考系一定是惯性参考系，因此只有在惯性参考系中牛顿第一定律才适用。',
    },
    {
      type: 'search',
      data: {
        title: '搜索到 3 条相关内容',
        references: [
          {
            title: '惯性参考系 - 百度百科',
            url: 'https://baike.baidu.com/item/惯性参考系',
            content: '惯性参考系是指牛顿运动定律在其中成立的参考系...',
            site: '百度百科',
          },
          {
            title: '牛顿第一定律的适用范围',
            url: 'https://example.com/newton-first-law',
            content: '牛顿第一定律只在惯性参考系中成立...',
            site: '物理学习网',
          },
        ],
      },
    },
    {
      type: 'suggestion',
      data: [
        {
          title: '什么是惯性参考系',
          prompt: '什么是惯性参考系？',
        },
        {
          title: '牛顿第二定律是什么',
          prompt: '牛顿第二定律是什么？',
        },
        {
          title: '非惯性参考系的例子',
          prompt: '非惯性参考系有哪些例子？',
        },
      ],
    },
  ],
};

/**
 * handleActions 使用示例
 * 
 * handleActions 用于处理消息内容中的交互操作，采用对象方式配置。
 * 支持的操作：suggestion（建议问题点击）、searchItem（搜索结果点击）
 */
export default function HandleActionsExample() {

  // 配置消息内容操作回调
  const handleActions = {
    // 点击建议问题时触发
    suggestion: (data?: any) => {
      console.log('点击建议问题', data);
      const { title } = data?.content || {};
      MessagePlugin.info(`选择了问题：${title}`);
    },
    // 点击搜索结果条目时触发
    searchItem: (data?: any) => {
      console.log('点击搜索结果', data);
      const { title } = data?.content || {};
      MessagePlugin.info(`点击了搜索结果：${title}`);
      // 可以在这里打开链接或执行其他操作
      // window.open(url, '_blank');
    },
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* 消息展示 */}
      <ChatMessage
        variant="text"
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        name="TDesign AI"
        role={message.role}
        content={message.content}
        status={message.status}
        handleActions={handleActions}
      />
    </Space>
  );
}
