import React, { useRef } from 'react';
import type {
  SSEChunkData,
  TdChatMessageConfig,
  AIMessageContent,
  RequestParams,
  ChatMessagesData,
  ChatServiceConfig,
  TdChatCustomRenderConfig,
  BaseContent,
} from '@tencent/tdesign-chatbot';
import { ChatBot } from 'tdesign-react';

// 扩展自定义消息体类型
declare module '@tencent/tdesign-chatbot' {
  interface AIContentTypeOverrides {
    weather: BaseContent<
      'weather',
      {
        temp: number;
        city: string;
        conditions: string;
      }
    >;
  }
}

// 默认初始化消息
const mockData: ChatMessagesData[] = [
  {
    id: '123',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '南极的自动提款机叫什么名字？',
      },
    ],
  },
  {
    id: '223',
    role: 'assistant',
    status: 'complete',
    content: [
      {
        type: 'search',
        status: 'complete',
        data: {
          title: '共找到10个相关内容',
          references: [
            {
              title: '10本高口碑悬疑推理小说,情节高能刺激,看得让人汗毛直立!',
              url: 'http://mp.weixin.qq.com/s?src=11&timestamp=1742897036&ver=5890&signature=USoIrxrKY*KWNmBLZTGo-**yUaxdhqowiMPr0wsVhH*dOUB3GUjYcBVG86Dyg7-TkQVrr0efPvrqSa1GJFjUQgQMtZFX5wxjbf8TcWkoUxOrTA7NsjfNQQoVY5CckmJj&new=1',
              type: 'mp',
            },
            {
              title: '悬疑小说下载:免费畅读最新悬疑大作!',
              url: 'http://mp.weixin.qq.com/s?src=11&timestamp=1742897036&ver=5890&signature=UCc6xbIGsYEyfytL2IC6b3vXlaBcbEJCi98ZVK38vdoFEEulJ3J-95bNkE8Fiv5-pJ5iH75DfJAz6kGX2TSscSisBNW1u6nCPbP-Ue4HxCAfjU8DpUwaOXkFz3*T71rU&new=1',
              type: 'mp',
            },
          ],
        },
      },
      {
        type: 'thinking',
        status: 'complete',
        data: {
          title: '思考完成（耗时3s）',
          text: 'mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？mock分析语境，首先，Omi是一个基于Web Components的前端框架，和Vue的用法可能不太一样。Vue里的v-html指令用于将字符串作为HTML渲染，防止XSS攻击的话需要信任内容。Omi有没有类似的功能呢？',
        },
      },
      // {
      //   type: 'weather',
      //   id: 'w1',
      //   data: {
      //     temp: 1,
      //     city: '北京',
      //     conditions: '多云',
      //   },
      // },
      {
        type: 'text',
        data: '它叫 [McMurdo Station ATM](#promptId=atm)，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
      },
      {
        type: 'suggestion',
        status: 'complete',
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
  },
  {
    id: '789',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '分析下以下内容，总结一篇广告策划方案',
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
  },
  {
    id: '34234',
    status: 'error',
    role: 'assistant',
    content: [
      {
        type: 'text',
        data: '出错了',
      },
    ],
  },
  {
    id: '7389',
    role: 'user',
    status: 'complete',
    content: [
      {
        type: 'text',
        data: '这张图里的帅哥是谁',
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
  },
  {
    id: '3242',
    role: 'assistant',
    status: 'complete',
    comment: 'good',
    content: [
      {
        type: 'markdown',
        data: '**tdesign** 团队的 *核心开发者*  `uyarnchen` 是也。',
      },
    ],
  },
];

// 自定义渲染-注册插槽规则
const customRenderConfig: TdChatCustomRenderConfig = {
  weather: (content) => ({
    slotName: `${content.type}-${content.id}`,
  }),
};

export default function chatSample() {
  const chatRef = useRef<HTMLElement & typeof ChatBot>(null);
  const [mockMessage, setMockMessage] = React.useState<ChatMessagesData[]>(mockData);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
      customRenderConfig,
    },
    assistant: {
      placement: 'left',
      onActions: {
        good: async ({ message, active }) => {
          // 点赞
        },
        bad: async ({ message, active }) => {
          // 点踩
        },
        searchItem: ({ content, event }) => {
          event.preventDefault();
          console.log('======searchItem', content);
        },
        suggestion: ({ content }) => {
          console.log('======prompt', content);
          // 点建议问题
          // chatRef?.current?.addPrompt(content.prompt);
        },
      },
      chatContentProps: {
        search: {
          expandable: true,
        },
        thinking: {
          maxHeight: 100,
        },
      },
      customRenderConfig,
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
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      switch (type) {
        case 'search':
          // 搜索
          return {
            type: 'search',
            data: {
              title: rest.title || `搜索到${rest?.docs.length}条内容`,
              references: rest?.docs,
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
        // 自定义-天气
        case 'weather':
          return {
            ...chunk.data,
            data: { ...JSON.parse(chunk.data.content) },
          };
        // 报错
        case 'error':
          return {
            type: 'text',
            status: 'error',
            data: rest?.content || '系统繁忙',
          };
        default:
          return {
            type: 'text',
            data: chunk?.event === 'complete' ? '' : JSON.stringify(chunk.data),
          };
      }
    },
    // 自定义请求参数
    onRequest: (innerParams: RequestParams) => {
      const { prompt } = innerParams;
      return {
        headers: {
          'Content-Type': 'text/event-stream',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'ewrwerwer',
          prompt,
        }),
      };
    },
  };

  // useEffect(() => {
  //   if (!chatRef?.current) {
  //     return;
  //   }
  //   const chat = chatRef.current;
  //   const update = (e: CustomEvent) => {
  //     setMockMessage(e.detail);
  //   }
  //   chat.addEventListener('message_change', update);
  //   return () => {
  //     chat.removeEventListener('message_change', update)
  //   }
  // }, []);

  return (
    <ChatBot
      ref={chatRef}
      style={{ height: '400px' }}
      messages={mockData}
      messageProps={messageProps}
      chatServiceConfig={chatServiceConfig}
    >
      {/* 🌟 自定义输入框左侧区域slot，可以增加模型选项 */}
      <div slot="input-footer-left" />
    </ChatBot>
  );
}
