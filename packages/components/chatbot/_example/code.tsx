import React, { useRef } from 'react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIMessageContent,
  RequestParams,
  ChatServiceConfig,
} from 'tdesign-react';
import { Card, ChatBot, ChatMessagesData, DialogPlugin, type TdChatbotApi, Space } from 'tdesign-react';
import Login from './components/login';

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign Chatbot智能代码助手，请输入你的问题',
      },
    ],
  },
];

const PreviewCard = ({ header, desc, loading, code }) => {
  // 预览效果弹窗
  const previewHandler = () => {
    const myDialog = DialogPlugin({
      header: '代码生成预览',
      body: <Login />,
      onConfirm: () => {
        myDialog.hide();
      },
      onClose: () => {
        myDialog.hide();
      },
    });
  };

  // 复制生成的代码
  const copyHandler = async () => {
    try {
      const codeBlocks = Array.from(code.matchAll(/```(?:jsx|javascript)?\n([\s\S]*?)```/g)).map((match) =>
        match[1].trim(),
      );
      // 拼接多个代码块（如有）
      const combinedCode = codeBlocks.join('\n\n// 分割代码块\n\n');

      // 使用剪贴板
      await navigator.clipboard.writeText(combinedCode);
      console.log('代码已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <>
      <Card
        bordered
        hoverShadow
        shadow
        size="medium"
        theme="normal"
        title={header}
        loading={loading}
        style={{ margin: '14px 0' }}
        actions={
          <Space>
            <a href={null} onClick={copyHandler} style={{ cursor: 'pointer' }}>
              复制代码
            </a>
            <a href={null} onClick={previewHandler} style={{ cursor: 'pointer' }}>
              预览
            </a>
          </Space>
        }
      >
        {desc}
      </Card>
    </>
  );
};

export default function chatSample() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [mockMessage, setMockMessage] = React.useState<ChatMessagesData[]>(mockData);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    assistant: {
      actions: ['replay', 'good', 'bad'],
      handleActions: {
        // 处理消息操作回调
        replay: ({ message, active }) => {
          console.log('自定义重新回复', message, active);
          chatRef?.current?.regenerate();
        },
      },
      // 内置的消息渲染配置
      chatContentProps: {
        markdown: {
          options: {
            html: true,
            breaks: true,
            typographer: true,
          },
          pluginConfig: [
            // 按需加载，开启插件
            {
              preset: 'code', // 代码块
              enabled: true,
            },
            {
              preset: 'katex', // 公式
              enabled: true,
            },
          ],
        },
      },
    },
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: 'http://localhost:3000/sse/normal',
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
        // 正文
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
            // 根据后端返回的paragraph字段来决定是否需要另起一段展示markdown
            strategy: rest?.paragraph === 'next' ? 'append' : 'merge',
          };
        // 自定义：代码运行结果预览
        case 'preview':
          return {
            type: 'preview',
            status: () => (/完成/.test(rest?.content?.cnName) ? 'complete' : 'streaming'),
            data: rest?.content,
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: RequestParams) => {
      const { prompt } = innerParams;
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'tdesign-chat',
          prompt,
          code: true,
        }),
      };
    },
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        ref={chatRef}
        defaultMessages={mockData}
        messageProps={messageProps}
        onMessageChange={(e) => {
          setMockMessage(e.detail);
        }}
        senderProps={{
          defaultValue: '使用tdesign组件库实现一个登录表单的例子',
          placeholder: '有问题，尽管问～ Enter 发送，Shift+Enter 换行',
        }}
        chatServiceConfig={chatServiceConfig}
      >
        {/* 自定义消息体渲染-植入插槽 */}
        {mockMessage
          ?.map((msg) =>
            msg.content.map((item, index) => {
              switch (item.type) {
                // 示例：代码运行结果预览
                case 'preview':
                  return (
                    <div slot={`${msg.id}-${item.type}-${index}`} key={`${item.data.id}`}>
                      <PreviewCard
                        header={item.data.enName}
                        desc={item.data.cnName}
                        loading={item.status !== 'complete'}
                        code={msg.content[0].data}
                      />
                    </div>
                  );
              }
              return null;
            }),
          )
          .flat()}
      </ChatBot>
    </div>
  );
}
