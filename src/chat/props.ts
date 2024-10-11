import { PropType } from 'vue';
import { TdChatProps, TdChatItemProps, TdChatListProps, TdChatActionsProps, TdChatInputProps } from './type';

export default {
  /** 操作 */
  actions: {
    type: Array as PropType<TdChatItemProps['actions']>,
  },
  /** 作者 */
  name: {
    type: [String, Function] as PropType<TdChatItemProps['name']>,
  },
  /** 头像 */
  avatar: {
    type: [String, Object, Function] as PropType<TdChatItemProps['avatar']>,
  },
  /** 内容 */
  content: {
    type: [String] as PropType<TdChatItemProps['content']>,
    default: '',
  },
  /** 时间 */
  datetime: {
    type: [String, Function] as PropType<TdChatItemProps['datetime']>,
  },
  /** 角色 */
  role: {
    type: [String, Function] as PropType<TdChatItemProps['role']>,
    default: '',
    validator(val: string) {
      if (!val) return true;
      return ['assistant', 'user', 'error', 'model-change', 'system'].includes(val);
    },
  },
  /** 点赞选中 */
  isGood: {
    type: Boolean as PropType<TdChatActionsProps['isGood']>,
    default: false,
  },
  /** 差评选中 */
  isBad: {
    type: Boolean as PropType<TdChatActionsProps['isBad']>,
    default: false,
  },
  /** 对齐 */
  layout: {
    type: [String] as PropType<TdChatProps['layout']>,
    default: 'both',
    validator(val: string) {
      if (!val) return true;
      return ['single', 'both'].includes(val);
    },
  },
  isStreamLoad: {
    type: Boolean as PropType<TdChatProps['isStreamLoad']>,
    default: false,
  },
  /** 清空历史按钮，值为 true 显示默认操作按钮，值为 false 不显示任何内容，值类型为 Function 表示自定义 */
  clearHistory: {
    type: [Boolean] as PropType<TdChatProps['clearHistory']>,
    default: true as TdChatProps['clearHistory'],
  },
  /** 倒序渲染,默认倒序渲染 */
  reverse: {
    type: Boolean as PropType<TdChatProps['reverse']>,
    default: true,
  },
  /** 流式消息加载中 */
  textLoading: {
    type: [Boolean, Function] as PropType<TdChatItemProps['textLoading']>,
    default: false,
  },
  /** 数据 */
  data: {
    type: Array as PropType<TdChatListProps['data']>,
  },
  variant: {
    type: String as PropType<TdChatItemProps['variant']>,
    default: 'text',
    validator(val: string) {
      if (!val) return true;
      return ['text', 'base', 'outline'].includes(val);
    },
  },
  movable: {
    type: Boolean as PropType<TdChatItemProps['movable']>,
    default: false,
  },
  /* 动画加载 skeleton：骨架屏 gradient：渐变加载动画一个点 dot：三个点 */
  animation: {
    type: String as PropType<TdChatItemProps['animation']>,
    default: 'none',
    validator(val: string) {
      if (!val) return true;
      return ['gradient', 'flashed', 'none'].includes(val);
    },
  },
  itemIndex: {
    type: Number as PropType<TdChatItemProps['itemIndex']>,
  },
  /** 点击时触发 */
  onClear: Function as PropType<TdChatProps['onClear']>,
  operationBtn: {
    type: Array as PropType<operationBtnType[]>,
    default: ['replay', 'copy', 'good', 'bad'],
  },
  onOperation: Function as PropType<TdChatActionsProps['onOperation']>,
  disabled: Boolean as PropType<TdChatActionsProps['disabled']>,
  onSend: Function as PropType<TdChatInputProps['onSend']>,
  onStop: Function as PropType<TdChatInputProps['onStop']>,
  onChange: Function as PropType<TdChatInputProps['onChange']>,
  onScroll: Function as PropType<TdChatListProps['onScroll']>,
};
export type operationBtnType = 'replay' | 'copy' | 'good' | 'bad';
