import React, { useCallback, useEffect, useRef, useState } from 'react';
import noop from 'lodash-es/noop';
import {
  SSEChunkData,
  AIMessageContent,
  TdChatMessageConfigItem,
  ChatRequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  ChatBot,
  type TdChatbotApi,
} from '@tdesign-react/aigc';
import { AIChatEditor, createAIChatEditor } from '@tencent/exeditor3-ai-chat-editor';
import { BasicTheme } from '@tencent/exeditor3-theme-basic';

const classStyles = `
<style>
.richText {
  width: 100%;
  max-height: var(--td-chat-input-textarea-max-height);
  overflow-y: auto;
}
.richText .ExEditor-basic {
  --exeditor-selected-outline: none;

  width: 100%;
  padding: 0;
  background: transparent;
  font-size: var(--td-chat-input-font-size);
}
.richText .ExEditor-basic p {
  margin-top: 4px;
  margin-bottom: 4px
}
</style>
`;

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'assistant',
    content: [
      {
        type: 'text',
        status: 'complete',
        data: '欢迎使用TDesign Chatbot智能助手',
      },
    ],
  },
];

export default function ChatBotReact() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const editorRootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<AIChatEditor>();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<boolean>(false);

  // 添加示例代码所需样式
  useEffect(() => {
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const clearInputValue = () => {
    setInputValue('');
    editorRef.current?.setHTML('');
  };

  const updateLoading = (v: boolean) => {
    loadingRef.current = v;
    setLoading(v);
  };

  const getEditorText = (): string => {
    let text = '';
    editorRef.current?.getState().doc?.descendants((node, _pos, parent) => {
      if (node.isText) {
        text += node.text;
      } else if (node.isBlock && parent) {
        // 块级元素后添加换行
        text += '\n';
      }
    });
    return text.trim();
  };

  const handleChange = useCallback(() => {
    const text = editorRef.current?.doc.textContent.trim();
    console.log('onChange', text);
    setInputValue(text || '');
  }, []);

  // 消息属性配置
  const messageProps = (msg: ChatMessagesData): TdChatMessageConfigItem => {
    const { role, content } = msg;
    // 假设只有单条thinking
    const thinking = content.find((item) => item.type === 'thinking');
    if (role === 'user') {
      return {
        variant: 'base',
        placement: 'right',
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      };
    }
    if (role === 'assistant') {
      return {
        placement: 'left',
        actions: ['replay', 'copy', 'good', 'bad'],
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
          replay: ({ message, active }) => {
            console.log('自定义重新回复', message, active);
            chatRef?.current?.regenerate();
          },
          searchItem: ({ content, event }) => {
            event.preventDefault();
            console.log('点击搜索条目', content);
          },
        },
        // 内置的消息渲染配置
        chatContentProps: {
          thinking: {
            maxHeight: 100, // 思考框最大高度，超过会自动滚动
            layout: 'block', // 思考内容样式，border|block
            collapsed: thinking?.status === 'complete', // 是否折叠，这里设置内容输出完成后折叠
          },
        },
      };
    }
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
    stream: true,
    // 流式对话结束（aborted为true时，表示用户主动结束对话，params为请求参数）
    onComplete: (aborted: boolean, params: RequestInit) => {
      console.log('onComplete', aborted, params);
      updateLoading(false);
    },
    // 流式对话过程中出错业务自定义行为
    onError: (err: Error | Response) => {
      console.error('Chatservice Error:', err);
      updateLoading(false);
    },
    // 流式对话过程中用户主动结束对话业务自定义行为
    onAbort: noop,
    // 自定义流式数据结构解析
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        case 'search':
          // 搜索
          return {
            type: 'search',
            data: {
              title: rest.title || `搜索到${rest?.docs.length}条内容`,
              references: rest?.content,
            },
          };
        // 思考
        case 'think':
          return {
            type: 'thinking',
            status: (status) => (/耗时/.test(rest?.title) ? 'complete' : status),
            data: {
              title: rest.title || '深度思考中',
              text: rest.content || '',
            },
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
      const { prompt } = innerParams;
      clearInputValue();
      updateLoading(true);
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'tdesign-chat',
          prompt,
          think: true,
          search: true,
        }),
      };
    },
  };

  // 发送处理
  const handleSend = useCallback(() => {
    chatRef.current?.sendUserMessage({
      prompt: getEditorText(),
    });
  }, []);

  // 停止处理
  const handleStop = useCallback(() => {
    chatRef.current?.abortChat();
  }, []);

  const handleEnter = useCallback(() => {
    loadingRef.current ? handleStop() : handleSend();
  }, [handleSend, handleStop]);

  useEffect(() => {
    if (editorRootRef.current) {
      const editor = createAIChatEditor({
        root: editorRootRef.current,
        initialContent: `
            <p>（这个示例展示了一个 AI 对话场景的 ExEditor 输入框，基于 https://git.woa.com/RMFactory/community-plugins/ai-chat-editor ）</p>
            <p>我是一名<span data-ai-input-type="slot" data-placeholder="身份">创作号博主</span>，请帮我以<span data-ai-input-type="slot" data-placeholder="主题"></span>为主题，写一篇视频脚本
            <p>请你仔细思考，高质量地完成该任务</p>
            `.trim(),
        theme: new BasicTheme(),
        plugins: [],
        placeholder: '请输入内容',
        enter: {
          onEnter: handleEnter,
          modKey: 'shift',
        },
        select: {
          renderOptions: noop,
        },
      });
      editor.on('idlechange', handleChange);

      editorRef.current = editor;
    }
  }, [handleChange, handleEnter]);

  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        revers={true}
        ref={chatRef}
        defaultMessages={mockData}
        messageProps={messageProps}
        senderProps={{
          value: inputValue,
          loading,
        }}
        chatServiceConfig={chatServiceConfig}
      >
        <div slot="sender-textarea" ref={editorRootRef} className="richText"></div>
      </ChatBot>
    </div>
  );
}
