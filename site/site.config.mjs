export default {
  docs: [
    {
      title: '开始',
      name: 'start',
      type: 'doc', // 组件文档
      children: [
        {
          title: '快速开始',
          name: 'expain',
          path: '/react/getting-started',
          component: () => import('@docs/getting-started.md'),
        },
        {
          title: '最佳实践',
          name: 'quick-start',
          path: '/react/quick-start',
          component: () => import('@/site/docs/starter.md'),
        },
        {
          title: '更新日志',
          name: 'changelog',
          path: '/react/changelog',
          component: () => import('@/CHANGELOG.md'),
        },
        {
          title: '组件概览',
          name: 'overview',
          path: '/react/overview',
          component: () => import('@common/docs/web/overview.md'),
        },
      ],
    },
    {
      title: '全局配置',
      name: 'config',
      type: 'doc', // 组件文档
      children: [
        {
          title: '全局特性配置',
          name: 'config',
          path: '/react/config',
          component: () => import('tdesign-react/config-provider/config-provider.md'),
        },
        {
          title: '自定义主题',
          name: 'custom-theme',
          path: '/react/custom-theme',
          component: () => import('@common/theme.md'),
        },
        {
          title: '暗黑模式',
          name: 'dark-mode',
          path: '/react/dark-mode',
          component: () => import('@common/dark-mode.md'),
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
          component: () => import('tdesign-react/button/button.md'),
        },
        {
          title: 'Icon 图标',
          name: 'icon',
          path: '/react/components/icon',
          component: () => import('tdesign-react/icon/icon.md'),
        },
        {
          title: 'Link 链接',
          name: 'link',
          path: '/react/components/link',
          component: () => import('tdesign-react/link/link.md'),
        },
      ],
    },
    {
      title: '布局',
      name: 'layouts',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Divider 分割线',
          name: 'divider',
          path: '/react/components/divider',
          component: () => import('tdesign-react/divider/divider.md'),
        },
        {
          title: 'Grid 栅格',
          name: 'grid',
          path: '/react/components/grid',
          component: () => import('tdesign-react/grid/grid.md'),
        },
        {
          title: 'Layout 布局',
          name: 'layout',
          path: '/react/components/layout',
          component: () => import('tdesign-react/layout/layout.md'),
        },
        {
          title: 'Space 间距',
          name: 'space',
          path: '/react/components/space',
          component: () => import('tdesign-react/space/space.md'),
        },
      ],
    },
    {
      title: '导航',
      name: 'navigation',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Affix 固钉',
          name: 'affix',
          path: '/react/components/affix',
          component: () => import('tdesign-react/affix/affix.md'),
        },
        {
          title: 'Anchor 锚点',
          name: 'anchor',
          path: '/react/components/anchor',
          component: () => import('tdesign-react/anchor/anchor.md'),
        },
        {
          title: 'Breadcrumb 面包屑',
          name: 'breadcrumb',
          path: '/react/components/breadcrumb',
          component: () => import('tdesign-react/breadcrumb/breadcrumb.md'),
        },
        {
          title: 'Dropdown 下拉菜单',
          name: 'dropdown',
          path: '/react/components/dropdown',
          component: () => import('tdesign-react/dropdown/dropdown.md'),
        },
        {
          title: 'Menu 导航',
          name: 'menu',
          path: '/react/components/menu',
          component: () => import('tdesign-react/menu/menu.md'),
        },
        {
          title: 'Pagination 分页',
          name: 'pagination',
          path: '/react/components/pagination',
          component: () => import('tdesign-react/pagination/pagination.md'),
        },
        {
          title: 'Steps 步骤条',
          name: 'steps',
          path: '/react/components/steps',
          component: () => import('tdesign-react/steps/steps.md'),
        },
        {
          title: 'Tabs 选项卡',
          name: 'tabs',
          path: '/react/components/tabs',
          component: () => import('tdesign-react/tabs/tabs.md'),
        },
      ],
    },
    {
      title: '输入',
      name: 'Forms',
      type: 'component', // 组件文档
      children: [
        {
          title: 'AutoComplete 自动完成',
          name: 'auto-complete',
          meta: {},
          path: '/react/components/auto-complete',
          component: () => import('tdesign-react/auto-complete/auto-complete.md'),
        },
        {
          title: 'Cascader 级联组件',
          name: 'cascader',
          meta: {},
          path: '/react/components/cascader',
          component: () => import('tdesign-react/cascader/cascader.md'),
        },
        {
          title: 'Checkbox 多选框',
          name: 'checkbox',
          path: '/react/components/checkbox',
          component: () => import('tdesign-react/checkbox/checkbox.md'),
        },
        {
          title: 'ColorPicker 颜色选择器',
          name: 'color-picker',
          path: '/react/components/color-picker',
          component: () => import('tdesign-react/color-picker/color-picker.md'),
        },
        {
          title: 'DatePicker 日期选择器',
          name: 'date-picker',
          path: '/react/components/date-picker',
          component: () => import('tdesign-react/date-picker/date-picker.md'),
        },
        {
          title: 'Form 表单',
          name: 'form',
          path: '/react/components/form',
          component: () => import('tdesign-react/form/form.md'),
        },
        {
          title: 'Input 输入框',
          name: 'input',
          path: '/react/components/input',
          component: () => import('tdesign-react/input/input.md'),
        },
        {
          title: 'InputAdornment 输入装饰器',
          name: 'input-adornment',
          path: '/react/components/input-adornment',
          component: () => import('tdesign-react/input-adornment/input-adornment.md'),
        },
        {
          title: 'InputNumber 数字输入框',
          name: 'input-number',
          path: '/react/components/input-number',
          component: () => import('tdesign-react/input-number/input-number.md'),
        },
        {
          title: 'Radio 单选框',
          name: 'radio',
          path: '/react/components/radio',
          component: () => import('tdesign-react/radio/radio.md'),
        },
        {
          title: 'RangeInput 范围输入框',
          name: 'range-input',
          path: '/react/components/range-input',
          component: () => import('tdesign-react/range-input/range-input.md'),
        },
        {
          title: 'Select 选择器',
          name: 'select',
          path: '/react/components/select',
          component: () => import('tdesign-react/select/select.md'),
        },
        {
          title: 'SelectInput 筛选器输入框',
          name: 'select-input',
          path: '/react/components/select-input',
          component: () => import('tdesign-react/select-input/select-input.md'),
        },
        {
          title: 'Slider 滑动输入条',
          name: 'slider',
          path: '/react/components/slider',
          component: () => import('tdesign-react/slider/slider.md'),
        },
        {
          title: 'Switch 开关',
          name: 'switch',
          path: '/react/components/switch',
          component: () => import('tdesign-react/switch/switch.md'),
        },
        {
          title: 'TagInput 标签输入框',
          name: 'tag-input',
          path: '/react/components/tag-input',
          component: () => import('tdesign-react/tag-input/tag-input.md'),
        },
        {
          title: 'Textarea 多行文本框',
          name: 'textarea',
          path: '/react/components/textarea',
          component: () => import('tdesign-react/textarea/textarea.md'),
        },
        {
          title: 'TreeSelect 树选择',
          name: 'tree-select',
          path: '/react/components/tree-select',
          component: () => import('tdesign-react/tree-select/tree-select.md'),
        },
        {
          title: 'Transfer 穿梭框',
          name: 'transfer',
          path: '/react/components/transfer',
          component: () => import('tdesign-react/transfer/transfer.md'),
        },
        {
          title: 'TimePicker 时间选择器',
          name: 'time-picker',
          path: '/react/components/time-picker',
          component: () => import('tdesign-react/time-picker/time-picker.md'),
        },
        {
          title: 'Upload 上传',
          name: 'upload',
          path: '/react/components/upload',
          component: () => import('tdesign-react/upload/upload.md'),
        },
      ],
    },
    {
      title: '数据展示',
      name: 'Data',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Avatar 头像',
          name: 'avatar',
          docType: 'data',
          path: '/react/components/avatar',
          component: () => import('tdesign-react/avatar/avatar.md'),
        },
        {
          title: 'Badge 徽标数',
          name: 'badge',
          path: '/react/components/badge',
          component: () => import('tdesign-react/badge/badge.md'),
        },
        {
          title: 'Calendar 日历',
          name: 'calendar',
          path: '/react/components/calendar',
          component: () => import('tdesign-react/calendar/calendar.md'),
        },
        {
          title: 'Card 卡片',
          name: 'card',
          path: '/react/components/card',
          component: () => import('tdesign-react/card/card.md'),
        },
        {
          title: 'Collapse 折叠面板',
          name: 'collapse',
          path: '/react/components/collapse',
          component: () => import('tdesign-react/collapse/collapse.md'),
        },
        {
          title: 'Comment 评论',
          name: 'comment',
          path: '/react/components/comment',
          component: () => import('tdesign-react/comment/comment.md'),
        },
        {
          title: 'Image 图片',
          name: 'image',
          path: '/react/components/image',
          component: () => import('tdesign-react/image/image.md'),
        },
        {
          title: 'ImageViewer 图片预览',
          name: 'image-viewer',
          path: '/react/components/image-viewer',
          component: () => import('tdesign-react/image-viewer/image-viewer.md'),
        },
        {
          title: 'List 列表',
          name: 'list',
          path: '/react/components/list',
          component: () => import('tdesign-react/list/list.md'),
        },
        {
          title: 'Loading 加载',
          name: 'loading',
          path: '/react/components/loading',
          component: () => import('tdesign-react/loading/loading.md'),
        },
        {
          title: 'Progress 进度条',
          name: 'progress',
          path: '/react/components/progress',
          component: () => import('tdesign-react/progress/progress.md'),
        },
        {
          title: 'Rate 评分',
          name: 'rate',
          path: '/react/components/rate',
          component: () => import('tdesign-react/rate/rate.md'),
        },
        {
          title: 'Swiper 轮播框',
          name: 'swiper',
          path: '/react/components/swiper',
          component: () => import('tdesign-react/swiper/swiper.md'),
        },
        {
          title: 'Skeleton 骨架屏',
          name: 'skeleton',
          path: '/react/components/skeleton',
          component: () => import('tdesign-react/skeleton/skeleton.md'),
        },
        {
          title: 'Table 表格',
          name: 'table',
          path: '/react/components/table',
          component: () => import('tdesign-react/table/table.md'),
        },
        {
          title: 'Tag 标签',
          name: 'tag',
          path: '/react/components/tag',
          component: () => import('tdesign-react/tag/tag.md'),
        },
        {
          title: 'Timeline 时间轴',
          name: 'timeline',
          path: '/react/components/timeline',
          component: () => import('tdesign-react/timeline/timeline.md'),
        },
        {
          title: 'Tooltip 文字提示',
          name: 'tooltip',
          path: '/react/components/tooltip',
          component: () => import('tdesign-react/tooltip/tooltip.md'),
        },
        {
          title: 'Tree 树',
          name: 'tree',
          path: '/react/components/tree',
          component: () => import('tdesign-react/tree/tree.md'),
        },
        {
          title: 'Watermark 水印',
          name: 'watermark',
          path: '/react/components/watermark',
          component: () => import('tdesign-react/watermark/watermark.md'),
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
          component: () => import('tdesign-react/alert/alert.md'),
        },
        {
          title: 'Dialog 对话框',
          name: 'dialog',
          path: '/react/components/dialog',
          component: () => import('tdesign-react/dialog/dialog.md'),
        },
        {
          title: 'Drawer 抽屉',
          name: 'drawer',
          path: '/react/components/drawer',
          component: () => import('tdesign-react/drawer/drawer.md'),
        },
        {
          title: 'Guide 引导',
          name: 'guide',
          path: '/react/components/guide',
          component: () => import('tdesign-react/guide/guide.md'),
        },
        {
          title: 'Message 全局提醒',
          name: 'message',
          path: '/react/components/message',
          component: () => import('tdesign-react/message/message.md'),
        },
        {
          title: 'Notification 消息通知',
          name: 'notification',
          path: '/react/components/notification',
          component: () => import('tdesign-react/notification/notification.md'),
        },
        {
          title: 'Popconfirm 气泡确认框',
          name: 'popconfirm',
          path: '/react/components/popconfirm',
          component: () => import('tdesign-react/popconfirm/popconfirm.md'),
        },
        {
          title: 'Popup 弹出层',
          name: 'popup',
          path: '/react/components/popup',
          component: () => import('tdesign-react/popup/popup.md'),
        },
      ],
    },
  ],
};
