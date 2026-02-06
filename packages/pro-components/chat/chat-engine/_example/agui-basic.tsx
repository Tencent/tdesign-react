import React, { useState, useEffect, useRef } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type TdChatSenderParams,
  type ChatRequestParams,
} from '@tdesign-react/chat';
import { useChat, AGUIAdapter } from '@tdesign-react/chat';
import { MessagePlugin } from 'tdesign-react';

/**
 * AG-UI 协议基础示例
 *
 * 学习目标：
 * - 开启 AG-UI 协议支持（protocol: 'agui'）
 * - 理解 AG-UI 协议的自动解析机制
 * - 处理文本消息事件（TEXT_MESSAGE_*）
 * - 初始化加载历史消息方法 AGUIAdapter.convertHistoryMessages
 */
export default function AguiBasicExample() {
  const [inputValue, setInputValue] = useState('AG-UI协议的作用是什么');
  const listRef = useRef<any>(null);

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-simple',
      // 开启 AG-UI 协议解析支持
      protocol: 'agui',
      stream: true,
      // 自定义请求参数
      onRequest: (params: ChatRequestParams) => ({
        body: JSON.stringify({
          uid: 'agui-demo',
          prompt: params.prompt,
        }),
      }),
      // 生命周期回调
      onStart: (chunk) => {
        console.log('AG-UI 流式传输开始:', chunk);
      },
      onComplete: (aborted, params, event) => {
        console.log('AG-UI 流式传输完成:', { aborted, event });
      },
      onError: (err) => {
        console.error('AG-UI 错误:', err);
      },
    },
  });

  // 初始化加载历史消息
  useEffect(() => {
    const loadHistoryMessages = async () => {
      try {
        const response = await fetch(`https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/api/conversation/history?type=simple`);
        const result = await response.json();
        if (result.success && result.data) {
          const messages = AGUIAdapter.convertHistoryMessages([
    {
        "id": "34560ac6-b64a-4bcf-90a3-621dea69acce",
        "role": "user",
        "content": [
            {
                "type": "text",
                "data": "你好"
            },
            {
                "type": "attachment",
                "data": [
                    {
                        "fileType": "image",
                        "name": "20260205090555_40916970.png",
                        "url": "http://tlab-test-1258344699.cos-internal.ap-guangzhou.tencentcos.cn/ai-chat/env-agent-langgraph/statics/images/20260205090555_40916970.png"
                    }
                ]
            }
        ]
    },
    {
        "id": "b3e5fa37-83ff-493e-91d9-0aba93b1ac98",
        "role": "assistant",
        "content": "你好！看起来你正在查看或编辑某个配置文件（可能是 package.json 或类似依赖列表），其中包含多个前端库及其版本号，还有一条报错信息：\n\n```\nDuplicate \"previewTitle\" attribute in JSX element\n```\n\n这通常是在使用 React/JSX 时，某个元素重复定义了 `previewTitle` 属性导致的语法错误。\n\n如果你需要：\n- **理解这个错误的原因和修复方法** → 我可以帮你分析（路由到 `knowledge`）\n- **排查具体哪段代码出问题** → 需要更多上下文（可路由到 `diagnosis`）\n- **直接修改配置或生成修复代码** → 明确说“帮我修复”或“生成修正后的代码”（路由到 `craft`）\n\n请告诉我你想做什么？😊"
    }
]);
          chatEngine.setMessages(messages);
          listRef.current?.scrollList({ to: 'bottom' });
        }
      } catch (error) {
        console.error('加载历史消息出错:', error);
        MessagePlugin.error('加载历史消息出错');
      }
    };

    loadHistoryMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            placement={message.role === 'user' ? 'right' : 'left'}
            variant={message.role === 'user' ? 'base' : 'text'}
          />
        ))}
      </ChatList>

      <ChatSender
        value={inputValue}
        placeholder="请输入内容，体验 AG-UI 协议"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={() => chatEngine.abortChat()}
      />
    </div>
  );
}
