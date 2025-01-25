/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TNode } from '../common';
import { MouseEvent, WheelEvent } from 'react';

export interface TdListProps {
  /**
   * 自定义加载中。值为空不显示加载中，值为 'loading' 显示加载中状态，值为 'load-more' 显示加载更多状态。值类型为函数，则表示自定义加载状态呈现内容
   */
  asyncLoading?: TNode;
  /**
   * 底部
   */
  footer?: TNode;
  /**
   * 头部
   */
  header?: TNode;
  /**
   * 排列方式（待设计稿输出）
   * @default horizontal
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * 尺寸
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 是否展示分割线
   * @default false
   */
  split?: boolean;
  /**
   * 是否展示斑马纹
   * @default false
   */
  stripe?: boolean;
  /**
   * 点击加载更多时触发
   */
  onLoadMore?: (options: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 列表滚动时触发，scrollTop 表示顶部滚动距离，scrollBottom 表示底部滚动距离
   */
  onScroll?: (options: { e: Event | WheelEvent<HTMLDivElement>; scrollTop: number; scrollBottom: number }) => void;
}

export interface TdListItemProps {
  /**
   * 操作栏
   */
  action?: TNode;
  /**
   * 内容，同 content
   */
  children?: TNode;
  /**
   * 内容
   */
  content?: TNode;
}

export interface TdListItemMetaProps {
  /**
   * 列表项内容
   */
  description?: TNode;
  /**
   * 列表项图片
   */
  image?: TNode;
  /**
   * 列表项标题
   */
  title?: TNode;
}
