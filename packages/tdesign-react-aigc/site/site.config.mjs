export const docs = [
  {
    title: '开始',
    titleEn: 'Start',
    type: 'doc',
    children: [
      {
        title: '快速开始',
        titleEn: 'Getting Started',
        name: 'getting-started',
        path: '/react-aigc/getting-started',
        component: () => import('./docs/getting-started.md'),
      },
      {
        title: '什么是流式输出',
        titleEn: 'Getting Started',
        name: 'getting-started',
        path: '/react-aigc/sse',
        component: () => import('./docs/sse.md'),
      },
    ],
  },
  {
    title: '全局配置',
    titleEn: 'Global Config',
    type: 'doc',
    children: [
      {
        title: '自定义主题',
        titleEn: 'Theme Customization',
        name: 'custom-theme',
        path: '/react-aigc/custom-theme',
        component: () => import('@tdesign/common/theme.md'),
        componentEn: () => import('@tdesign/common/theme.en-US.md'),
      },
      {
        title: '深色模式',
        titleEn: 'Dark Mode',
        name: 'dark-mode',
        path: '/react-aigc/dark-mode',
        component: () => import('@tdesign/common/dark-mode.md'),
        componentEn: () => import('@tdesign/common/dark-mode.en-US.md'),
      },
    ],
  },
  {
    title: '智能对话',
    titleEn: 'ChatBot',
    type: 'component',
    children: [
      {
        title: 'Chatbot 智能对话',
        titleEn: 'Chatbot',
        name: 'chatbot',
        path: '/react-aigc/components/chatbot',
        component: () => import('@tdesign/pro-components-chat/chatbot/chatbot.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chatbot/chatbot.en-US.md'),
      },
      {
        title: 'ChatSender 对话输入',
        titleEn: 'ChatSender',
        name: 'chat-sender',
        path: '/react-aigc/components/chat-sender',
        component: () => import('@tdesign/pro-components-chat/chat-sender/chat-sender.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-sender/chat-sender.en-US.md'),
      },
      {
        title: 'ChatMessage 对话消息体',
        titleEn: 'ChatMessage',
        name: 'chat-message',
        path: '/react-aigc/components/chat-message',
        component: () => import('@tdesign/pro-components-chat/chat-message/chat-message.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-message/chat-message.en-US.md'),
      },
      {
        title: 'ChatActionBar 对话操作栏',
        titleEn: 'ChatActionBar',
        name: 'chat-actionbar',
        path: '/react-aigc/components/chat-actionbar',
        component: () => import('@tdesign/pro-components-chat/chat-actionbar/chat-actionbar.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-actionbar/chat-actionbar.en-US.md'),
      },
      {
        title: 'ChatMarkdown 消息内容',
        titleEn: 'ChatMarkdown',
        name: 'chat-markdown',
        path: '/react-aigc/components/chat-markdown',
        component: () => import('@tdesign/pro-components-chat/chat-markdown/chat-markdown.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-markdown/chat-markdown.en-US.md'),
      },
      {
        title: 'ChatThinking 思考过程',
        titleEn: 'ChatThinking',
        name: 'chat-thinking',
        path: '/react-aigc/components/chat-thinking',
        component: () => import('@tdesign/pro-components-chat/chat-thinking/chat-thinking.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-thinking/chat-thinking.en-US.md'),
      },

      {
        title: 'ChatLoading 对话加载',
        titleEn: 'ChatLoading',
        name: 'chat-loading',
        path: '/react-aigc/components/chat-loading',
        component: () => import('@tdesign/pro-components-chat/chat-loading/chat-loading.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-loading/chat-loading.en-US.md'),
      },
      {
        title: 'FileCard 文件缩略卡片',
        titleEn: 'FileCard',
        name: 'filecard',
        path: '/react-aigc/components/chat-filecard',
        component: () => import('@tdesign/pro-components-chat/chat-filecard/chat-filecard.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-filecard/chat-filecard.en-US.md'),
      },
      {
        title: 'ChatAttachments 附件列表',
        titleEn: 'ChatAttachments',
        name: 'chat-attachment',
        path: '/react-aigc/components/chat-attachments',
        component: () => import('@tdesign/pro-components-chat/chat-attachments/chat-attachments.md'),
        componentEn: () => import('@tdesign/pro-components-chat/chat-attachments/chat-attachments.en-US.md'),
      },
    ],
  },
];

const enDocs = docs.map((doc) => ({
  ...doc,
  title: doc.titleEn,
  children: doc?.children?.map((child) => ({
    title: child.titleEn,
    name: `${child.name}-en`,
    path: `${child.path}-en`,
    meta: { lang: 'en' },
    component: child.componentEn || child.component,
  })),
}));

export default { docs, enDocs };
