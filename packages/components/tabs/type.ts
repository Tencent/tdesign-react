/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TNode } from '../common';
import { MouseEvent } from 'react';

export interface TdTabsProps<T extends TabValue = TabValue> {
  /**
   * 选项卡右侧的操作区域
   */
  action?: TNode;
  /**
   * 选项卡是否可增加
   * @default false
   */
  addable?: boolean;
  /**
   * 是否禁用选项卡
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否开启拖拽调整顺序
   * @default false
   */
  dragSort?: boolean;
  /**
   * 选项卡列表
   */
  list?: Array<TdTabPanelProps<T>>;
  /**
   * 选项卡位置
   * @default top
   */
  placement?: 'left' | 'top' | 'bottom' | 'right';
  /**
   * Tab较多的时候，选中滑块滚动最终停留的位置
   * @default auto
   */
  scrollPosition?: 'auto' | 'start' | 'center' | 'end';
  /**
   * 组件尺寸
   * @default medium
   */
  size?: 'medium' | 'large';
  /**
   * 选项卡风格，包含 默认风格 和 卡片风格两种
   * @default normal
   */
  theme?: 'normal' | 'card';
  /**
   * 激活的选项卡值
   */
  value?: T;
  /**
   * 激活的选项卡值，非受控属性
   */
  defaultValue?: T;
  /**
   * 添加选项卡时触发
   */
  onAdd?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 激活的选项卡发生变化时触发
   */
  onChange?: (value: T) => void;
  /**
   * 拖拽排序时触发
   */
  onDragSort?: (context: TabsDragSortContext<T>) => void;
  /**
   * 删除选项卡时触发
   */
  onRemove?: (options: { value: T; index: number; e: MouseEvent<HTMLSpanElement> }) => void;
}

export interface TdTabPanelProps<T extends TabValue = TabValue> {
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
   * 选项卡组件开启允许拖动排序时，当前选项卡是否允许拖动
   * @default true
   */
  draggable?: boolean;
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
   * 当前选项卡是否允许移除
   * @default false
   */
  removable?: boolean;
  /**
   * 选项卡的值，唯一标识
   */
  value?: T;
  /**
   * 点击删除按钮时触发
   */
  onRemove?: (options: { value: T; e: MouseEvent<HTMLSpanElement> }) => void;
}

export type TabValue = string | number;

export interface TabsDragSortContext<T extends TabValue = TabValue> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
}
