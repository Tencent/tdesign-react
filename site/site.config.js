export default {
  docs: [
    {
      title: '开始',
      name: 'start',
      type: 'doc', // 组件文档
      children: [
        {
          title: '说明',
          name: 'install',
          path: '/react/components/install',
          component: () => import('@docs/install.md'),
        },
        {
          title: '更新日志',
          name: 'changelog',
          path: '/react/components/changelog',
          component: () => import('@/CHANGELOG.md'),
        },
      ],
    },
    {
      title: '基础',
      name: 'base',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Button 按钮',
          name: 'button',
          path: '/react/components/button',
          component: () => import('@tencent/tdesign-react/button/README.md'),
        },
        {
          title: 'Divider 分割线',
          name: 'divider',
          path: '/react/components/divider',
          component: () => import('@tencent/tdesign-react/divider/README.md'),
        },
        {
          title: 'Icon 图标',
          name: 'icon',
          path: '/react/components/icon',
          component: () => import('@tencent/tdesign-react/icon/README.md'),
        },
      ],
    },
    {
      title: '布局',
      name: 'layouts',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Grid 姗格',
          name: 'grid',
          path: '/react/components/grid',
          component: () => import('@tencent/tdesign-react/grid/README.md'),
        },
        {
          title: 'Layout 布局',
          name: 'layout',
          path: '/react/components/layout',
          component: () => import('@tencent/tdesign-react/layout/README.md'),
        },
      ],
    },
    {
      title: '导航',
      name: 'navigation',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Anchor 锚点',
          name: 'anchor',
          path: '/react/components/anchor',
          component: () => import('@tencent/tdesign-react/anchor/README.md'),
        },
        {
          title: 'Menu 导航',
          name: 'menu',
          path: '/react/components/menu',
          component: () => import('@tencent/tdesign-react/menu/README.md'),
        },
        {
          title: 'Pagination 分页',
          name: 'pagination',
          path: '/react/components/pagination',
          component: () => import('@tencent/tdesign-react/pagination/README.md'),
        },
        {
          title: 'Steps 步骤条',
          name: 'steps',
          path: '/react/components/steps',
          component: () => import('@tencent/tdesign-react/steps/README.md'),
        },
        {
          title: 'Tabs 选项卡',
          name: 'tabs',
          path: '/react/components/tabs',
          component: () => import('@tencent/tdesign-react/tabs/README.md'),
        },
      ],
    },
    {
      title: '表单',
      name: 'Forms',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Checkbox 多选框',
          name: 'checkbox',
          path: '/react/components/checkbox',
          component: () => import('@tencent/tdesign-react/checkbox/README.md'),
        },
        {
          title: 'Form 表单',
          name: 'form',
          path: '/react/components/form',
          component: () => import('@tencent/tdesign-react/form/README.md'),
        },
        {
          title: 'Input 输入框',
          name: 'input',
          path: '/react/components/input',
          component: () => import('@tencent/tdesign-react/input/README.md'),
        },
        {
          title: 'InputNumber 数字输入',
          name: 'input-number',
          path: '/react/components/input-number',
          component: () => import('@tencent/tdesign-react/input-number/README.md'),
        },
        {
          title: 'Radio 单选框',
          name: 'radio',
          path: '/react/components/radio',
          component: () => import('@tencent/tdesign-react/radio/README.md'),
        },
        {
          title: 'Select 选择器',
          name: 'select',
          path: '/react/components/select',
          component: () => import('@tencent/tdesign-react/select/README.md'),
        },
        {
          title: 'Swtch 开关',
          name: 'switch',
          path: '/react/components/switch',
          component: () => import('@tencent/tdesign-react/switch/README.md'),
        },
      ],
    },
    {
      title: '数据展示',
      name: 'Data',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Badge 徽标数',
          name: 'badge',
          path: '/react/components/badge',
          component: () => import('@tencent/tdesign-react/badge/README.md'),
        },
        {
          title: 'Calendar 日历',
          name: 'calendar',
          path: '/react/components/calendar',
          component: () => import('@tencent/tdesign-react/calendar/README.md'),
        },
        {
          title: 'List 列表',
          name: 'list',
          path: '/react/components/list',
          component: () => import('@tencent/tdesign-react/list/README.md'),
        },
        {
          title: 'Progress 进度条',
          name: 'progress',
          path: '/react/components/progress',
          component: () => import('@tencent/tdesign-react/progress/README.md'),
        },
        {
          title: 'Table 表格',
          name: 'table',
          path: '/react/components/table',
          component: () => import('@tencent/tdesign-react/table/README.md'),
        },
        {
          title: 'Tag 标签',
          name: 'tag',
          path: '/react/components/tag',
          component: () => import('@tencent/tdesign-react/tag/README.md'),
        },
        {
          title: 'Tooltip 文字提示',
          name: 'tooltip',
          path: '/react/components/tooltip',
          component: () => import('@tencent/tdesign-react/tooltip/README.md'),
        },
      ],
    },
    {
      title: '消息提醒',
      name: 'Notifications',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Alert 警告提醒',
          name: 'alert',
          path: '/react/components/alert',
          component: () => import('@tencent/tdesign-react/alert/README.md'),
        },
        {
          title: 'Dialog 对话框',
          name: 'dialog',
          path: '/react/components/dialog',
          component: () => import('@tencent/tdesign-react/dialog/README.md'),
        },
        {
          title: 'Drawer 模态抽屉',
          name: 'drawer',
          path: '/react/components/drawer',
          component: () => import('@tencent/tdesign-react/drawer/README.md'),
        },
        {
          title: 'Loading 加载',
          name: 'loading',
          path: '/react/components/loading',
          component: () => import('@tencent/tdesign-react/loading/README.md'),
        },
        {
          title: 'Message 全局提醒',
          name: 'message',
          path: '/react/components/message',
          component: () => import('@tencent/tdesign-react/message/README.md'),
        },
        {
          title: 'Notification 消息通知',
          name: 'notification',
          path: '/react/components/notification',
          component: () => import('@tencent/tdesign-react/notification/README.md'),
        },
        {
          title: 'Popconfirm 气泡确认框',
          name: 'popconfirm',
          path: '/react/components/popconfirm',
          component: () => import('@tencent/tdesign-react/popconfirm/README.md'),
        },
        {
          title: 'Popup 弹出层',
          name: 'popup',
          path: '/react/components/popup',
          component: () => import('@tencent/tdesign-react/popup/README.md'),
        },
      ],
    },
  ],
};
