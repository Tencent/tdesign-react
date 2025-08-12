import React, { useRef, useState } from 'react';
import type { TdAttachmentItem, ChatRequestParams, TdChatMessageConfig, TdChatbotApi } from '@tdesign-react/aigc';
import { ChatBot } from '@tdesign-react/aigc';
import { SSEChunkData, AIMessageContent, ChatMessagesData, ChatServiceConfig } from '../index';

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign文案写作助手，可以先上传你需要参考的文件，输入你要撰写的主题~',
      },
    ],
  },
];

export default function chatSample() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [files, setFiles] = useState<TdAttachmentItem[]>([]);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    assistant: {
      placement: 'left',
      actions: ['copy', 'good', 'bad'],
      handleActions: {
        // 处理消息操作回调
        good: async ({ message, active }) => {
          // 点赞
          console.log('点赞', message, active);
        },
        bad: async ({ message, active }) => {
          // 点踩
          console.log('点踩', message, active);
        },
      },
    },
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
    stream: true,
    // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
    onComplete: (aborted: boolean, params: RequestInit) => {
      console.log('onComplete', aborted, params);
    },
    // 流式对话过程中出错业务自定义行为
    onError: (err: Error | Response) => {
      console.error('Chatservice Error:', err);
    },
    // 流式对话过程中用户主动结束对话业务自定义行为
    onAbort: async () => {},
    // 自定义流式数据结构解析
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        // 图片列表预览（自定义渲染）
        case 'image':
          return {
            type: 'imageview',
            status: 'complete',
            data: JSON.parse(rest.content),
          };
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: ChatRequestParams) => {
      const { prompt, attachments } = innerParams;
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'tdesign-chat',
          prompt,
          files: attachments,
          docs: true,
        }),
      };
    },
  };

  // 文件上传
  const onFileSelect = (e: CustomEvent<TdAttachmentItem[]>) => {
    // 添加新文件并模拟上传进度
    const newFile = {
      ...e.detail[0],
      name: e.detail[0].name,
      status: 'progress' as any,
      description: '上传中',
    };

    setFiles((prev) => [newFile, ...prev]);

    setTimeout(() => {
      setFiles((prevState) =>
        prevState.map((file) =>
          file.name === newFile.name
            ? {
                ...file,
                url: 'https://tdesign.gtimg.com/site/demo.docx', // mock返回的文件地址
                status: 'success',
                description: '上传成功',
              }
            : file,
        ),
      );
    }, 1000);
  };

  // 移除文件回调
  const onFileRemove = (e: CustomEvent<TdAttachmentItem[]>) => {
    setFiles(e.detail);
  };

  const onSend = () => {
    setFiles([]); // 清除掉附件区域
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        defaultMessages={mockData}
        messageProps={messageProps}
        senderProps={{
          defaultValue: '根据所提供的材料总结一篇文章，推荐春天户外郊游打卡目的地，需要符合小红书平台写作风格',
          placeholder: '输入你要撰写的主题，支持上传附件',
          actions: ['attachment', 'send'],
          uploadProps: {
            multiple: true,
          },
          attachmentsProps: {
            items: files,
            overflow: 'scrollX',
          },
          onFileSelect,
          onFileRemove,
        }}
        onChatAfterSend={onSend}
        chatServiceConfig={chatServiceConfig}
      ></ChatBot>
    </div>
  );
}
