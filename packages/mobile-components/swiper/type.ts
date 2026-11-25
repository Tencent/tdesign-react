/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode } from '../common';

export interface TdSwiperProps {
  /**
   * 轮播切换动画效果类型
   * @default slide
   */
  animation?: 'slide';
  /**
   * 是否自动播放
   * @default true
   */
  autoplay?: boolean;
  /**
   * 当前轮播在哪一项（下标）
   * @default 0
   */
  current?: number;
  /**
   * 当前轮播在哪一项（下标），非受控属性
   * @default 0
   */
  defaultCurrent?: number;
  /**
   * 轮播滑动方向，包括横向滑动和纵向滑动两个方向
   * @default horizontal
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 滑动动画时长
   * @default 300
   */
  duration?: number;
  /**
   * 当使用垂直方向滚动时的高度
   */
  height?: string | number;
  /**
   * 轮播间隔时间
   * @default 5000
   */
  interval?: number;
  /**
   * 是否循环播放
   * @default true
   */
  loop?: boolean;
  /**
   * 导航器全部配置
   * @default true
   */
  navigation?: SwiperNavigation | TNode | Boolean;
  /**
   * 后边距，可用于露出后一项的一小部分。默认单位 `px`
   * @default 0
   */
  nextMargin?: string | number;
  /**
   * 前边距，可用于露出前一项的一小部分。默认单位 `px`
   * @default 0
   */
  previousMargin?: string | number;
  /**
   * 样式类型：默认样式、卡片样式
   * @default default
   */
  type?: 'default' | 'card';
  /**
   * 轮播切换时触发
   */
  onChange?: (current: number, context: { source: SwiperChangeSource }) => void;
  /**
   * 点击轮播项时触发
   */
  onClick?: (index: number) => void;
}

export interface SwiperNavigation {
  /**
   * 小于这个数字不会显示导航器
   */
  minShowNum?: number;
  /**
   * 页码信息展示位置
   * @default bottom
   */
  paginationPosition?: 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right' | 'left' | 'right';
  /**
   * 导航器位置，位于主体的内侧或是外侧
   * @default inside
   */
  placement?: 'inside' | 'outside';
  /**
   * 是否显示两侧的控制按钮
   * @default false
   */
  showControls?: boolean;
  /**
   * 导航器类型，点状(dots)、点条状(dots-bar)、分式(fraction)等
   * @default ''
   */
  type?: SwiperNavigationType;
}

export type SwiperChangeSource = 'autoplay' | 'touch' | 'nav';

export type SwiperNavigationType = 'dots' | 'dots-bar' | 'fraction';
