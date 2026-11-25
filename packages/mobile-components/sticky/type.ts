/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { ScrollContainer } from '../common';

export interface TdStickyProps {
  /**
   * 指定滚动的容器。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body
   * @default body
   */
  container?: ScrollContainer;
  /**
   * 是否禁用组件
   * @default false
   */
  disabled?: boolean;
  /**
   * 吸顶时与顶部的距离，单位`px`
   * @default 0
   */
  offsetTop?: string | number;
  /**
   * 吸顶时的 z-index
   * @default 99
   */
  zIndex?: number;
  /**
   * 滚动时触发，scrollTop: 距离顶部位置，isFixed: 是否吸顶
   */
  onScroll?: (context: { scrollTop: number; isFixed: boolean }) => void;
}
