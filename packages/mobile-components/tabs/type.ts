/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { StickyProps } from '../sticky';
import type { TNode, TElement } from '../common';

export interface TdTabsProps {
  /**
   * 动画效果设置。其中 duration 表示动画时长
   */
  animation?: TabAnimation;
  /**
   * 激活下划线的模式
   * @default fixed
   */
  bottomLineMode?: 'fixed' | 'auto' | 'full';
  /**
   * 选项卡列表
   */
  list?: Array<TdTabPanelProps>;
  /**
   * 是否展示底部激活线条
   * @default true
   */
  showBottomLine?: boolean;
  /**
   * 组件尺寸
   * @default medium
   */
  size?: 'medium' | 'large';
  /**
   * 选项卡头部空间是否均分
   * @default true
   */
  spaceEvenly?: boolean;
  /**
   * 是否展示分割线
   * @default true
   */
  split?: boolean;
  /**
   * 是否开启粘性布局
   * @default false
   */
  sticky?: boolean;
  /**
   * 透传至 Sticky 组件
   */
  stickyProps?: StickyProps;
  /**
   * 是否可以滑动切换
   * @default true
   */
  swipeable?: boolean;
  /**
   * 标签的样式
   * @default line
   */
  theme?: 'line' | 'tag' | 'card';
  /**
   * 激活的选项卡值
   */
  value?: TabValue;
  /**
   * 激活的选项卡值，非受控属性
   */
  defaultValue?: TabValue;
  /**
   * 激活的选项卡发生变化时触发
   */
  onChange?: (value: TabValue, label: string) => void;
  /**
   * 点击选项卡时触发
   */
  onClick?: (value: TabValue, label: string) => void;
  /**
   * 页面滚动时触发
   */
  onScroll?: (scrollTop: number, isFixed: boolean) => void;
}

export interface TdTabPanelProps {
  /**
   * 透传至 Badge 组件
   */
  badgeProps?: object;
  /**
   * 选项卡内容隐藏时是否销毁
   * @default true
   */
  destroyOnHide?: boolean;
  /**
   * 是否禁用当前选项卡
   * @default false
   */
  disabled?: boolean;
  /**
   * 图标
   */
  icon?: TElement;
  /**
   * 选项卡名称，可自定义选项卡导航内容
   */
  label?: TNode;
  /**
   * 是否启用选项卡懒加载
   * @default false
   */
  lazy?: boolean;
  /**
   * 用于自定义选项卡面板内容
   */
  panel?: TNode;
  /**
   * 选项卡的值，唯一标识
   */
  value?: TabValue;
}

export type TabAnimation = { duration: number } & Record<string, any>;

export type TabValue = string | number;
