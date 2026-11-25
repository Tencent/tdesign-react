/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { ButtonProps } from '../button';
import type { TElement } from '../common';
import type { MouseEvent, TouchEvent } from 'react';

export interface TdFabProps {
  /**
   * 透传至 Button 组件
   */
  buttonProps?: ButtonProps;
  /**
   * 是否可拖拽。`true` / `'all'`可拖动<br>`'vertical'`可垂直拖动<br>`'horizontal'`可水平拖动<br>`false`禁止拖动
   * @default false
   */
  draggable?: boolean | FabDirectionEnum;
  /**
   * 图标
   */
  icon?: TElement;
  /**
   * 是否吸附，仅在拖拽场景下生效。`true` 启用左右吸附，`left` 仅吸附到左边，`right` 仅吸附到右边，`false` 不吸附
   */
  magnet?: boolean | MagnetEnum;
  /**
   * 文本内容
   * @default ''
   */
  text?: string;
  /**
   * 设置水平方向边界限制，示例：[16, 16] 或 ['16px', 16]
   */
  xBounds?: Array<string | number>;
  /**
   * 设置垂直方向边界限制，示例：[48, 48] 或 ['96px', 80]
   */
  yBounds?: Array<string | number>;
  /**
   * 悬浮按钮点击事件
   */
  onClick?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 结束拖拽时触发
   */
  onDragEnd?: (context: { e: TouchEvent<HTMLDivElement> }) => void;
  /**
   * 开始拖拽时触发
   */
  onDragStart?: (context: { e: TouchEvent<HTMLDivElement> }) => void;
}

export type FabDirectionEnum = 'all' | 'vertical' | 'horizontal';

export type MagnetEnum = 'left' | 'right';
