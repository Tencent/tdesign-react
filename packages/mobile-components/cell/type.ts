/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode, TElement } from '../common';
import type { MouseEvent } from 'react';

export interface TdCellProps {
  /**
   * 右侧内容的对齐方式，默认居中对齐
   * @default middle
   */
  align?: 'top' | 'middle' | 'bottom';
  /**
   * 是否显示右侧箭头
   * @default false
   */
  arrow?: boolean;
  /**
   * 是否显示下边框
   * @default true
   */
  bordered?: boolean;
  /**
   * 下方内容描述
   */
  description?: TNode;
  /**
   * 是否开启点击反馈
   */
  hover?: boolean;
  /**
   * 主图
   */
  image?: TNode;
  /**
   * 左侧图标，出现在单元格标题的左侧
   */
  leftIcon?: TElement;
  /**
   * 和标题同行的说明文字
   */
  note?: TNode;
  /**
   * 是否显示表单必填星号
   * @default false
   */
  required?: boolean;
  /**
   * 最右侧图标
   */
  rightIcon?: TElement;
  /**
   * 标题
   */
  title?: TNode;
  /**
   * 右侧内容
   */
  onClick?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
}

export interface TdCellGroupProps {
  /**
   * 是否显示组边框
   * @default false
   */
  bordered?: boolean;
  /**
   * 单元格组风格
   * @default default
   */
  theme?: 'default' | 'card';
  /**
   * 单元格组标题
   * @default ''
   */
  title?: string;
}
