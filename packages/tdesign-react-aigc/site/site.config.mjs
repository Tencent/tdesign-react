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
    title: 'AIGC',
    titleEn: 'aigc',
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
