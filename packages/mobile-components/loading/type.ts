/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode, AttachNode } from '../common';

export interface TdLoadingProps {
  /**
   * 挂载元素，默认挂载到组件本身所在的位置。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body
   * @default ''
   */
  attach?: AttachNode;
  /**
   * 子元素，同 content
   */
  children?: TNode;
  /**
   * 子元素
   */
  content?: TNode;
  /**
   * 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒
   * @default 0
   */
  delay?: number;
  /**
   * 加载动画执行完成一次的时间，单位：毫秒
   * @default 800
   */
  duration?: number;
  /**
   * 是否显示为全屏加载
   * @default false
   */
  fullscreen?: boolean;
  /**
   * 加载指示符，值为 true 显示默认指示符，值为 false 则不显示，也可以自定义指示符
   * @default true
   */
  indicator?: TNode;
  /**
   * 是否继承父元素颜色
   * @default false
   */
  inheritColor?: boolean;
  /**
   * 对齐方式
   * @default horizontal
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * 是否处于加载状态
   * @default true
   */
  loading?: boolean;
  /**
   * 是否暂停动画
   * @default false
   */
  pause?: boolean;
  /**
   * 防止滚动穿透，全屏加载模式有效
   * @default true
   */
  preventScrollThrough?: boolean;
  /**
   * 加载动画是否反向
   */
  reverse?: boolean;
  /**
   * 尺寸，示例：20px
   * @default '20px'
   */
  size?: string;
  /**
   * 加载提示文案
   */
  text?: TNode;
  /**
   * 加载组件类型
   * @default circular
   */
  theme?: 'circular' | 'spinner' | 'dots';
}

export interface LoadingInstance {
  hide: () => void;
}

export type LoadingMethod = (options: boolean | TdLoadingProps) => LoadingInstance;
