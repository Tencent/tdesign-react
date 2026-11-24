/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { BadgeProps } from '../badge';
import type { TNode, TElement } from '../common';

export interface TdSideBarProps {
  /**
   * 侧边导航内容
   */
  children?: TNode;
  /**
   * 选项值
   */
  value?: string | number;
  /**
   * 选项值，非受控属性
   */
  defaultValue?: string | number;
  /**
   * 选项值发生变化时触发
   */
  onChange?: (value: number | string) => void;
  /**
   * 点击选项时触发
   */
  onClick?: (value: number | string, label: string) => void;
}

export interface TdSideBarItemProps {
  /**
   * 透传至 Badge 组件
   */
  badgeProps?: BadgeProps;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 图标
   */
  icon?: TElement;
  /**
   * 展示的标签
   * @default ''
   */
  label?: string;
  /**
   * 当前选项的值
   */
  value?: string | number;
}
