import React from 'react';
import { Space } from 'tdesign-react';

import { AIMessage, ChatMessage } from '@tdesign-react/aigc';

const aiMessages: AIMessage = {
  id: '33333',
  role: 'assistant',
  status: 'complete',
  content: [
    {
      type: 'thinking',
      status: 'complete',
      data: {
        title: '已完成思考（耗时3秒）',
        text: '好的，我现在需要回答用户关于对比近3年当代偶像爱情剧并总结创作经验的问题\n查询网络信息中...\n根据网络搜索结果，成功案例包括《春色寄情人》《要久久爱》《你也有今天》等，但缺乏具体播放数据，需要结合行业报告总结共同特征。2022-2024年偶像爱情剧的创作经验主要集中在题材创新、现实元素融入、快节奏叙事等方面。结合行业报告和成功案例，总结出以下创作经验。',
      },
    },
    {
      type: 'markdown',
      data: '**数据支撑：** 据《传媒内参2024报告》，2024年偶像爱情剧完播率`提升12%`，其中“职业创新”类`占比达65%`，豆瓣评分7+作品数量同比`增加40%`。',
    },
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
      <ChatMessage
        id={aiMessages.id}
        role={aiMessages.role}
        content={aiMessages.content}
        status={aiMessages.status}
        animation="gradient"
        chatContentProps={{
          thinking: { maxHeight: 100, collapsed: true },
        }}
        handleActions={onActions}
      ></ChatMessage>
    </Space>
  );
}
