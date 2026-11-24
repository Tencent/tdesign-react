/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode } from '../common';
import type { MouseEvent } from 'react';

export interface TdOverlayProps {
  /**
   * 遮罩层的背景色
   * @default ''
   */
  backgroundColor?: string;
  /**
   * 遮罩内容
   */
  children?: TNode;
  /**
   * 背景色过渡时间，单位毫秒
   * @default 300
   */
  duration?: number;
  /**
   * 防止滚动穿透，即不允许点击和滚动
   * @default true
   */
  preventScrollThrough?: boolean;
  /**
   * 是否展示
   * @default false
   */
  visible?: boolean;
  /**
   * 遮罩的层级，默认为 1000
   */
  zIndex?: number;
  /**
   * 遮罩层的点击事件
   */
  onClick?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 遮罩执行消失动画效果前触发
   */
  onClose?: () => void;
  /**
   * 遮罩消失动画效果结束后触发
   */
  onClosed?: () => void;
  /**
   * 遮罩执行弹出动画效果前触发
   */
  onOpen?: () => void;
  /**
   * 遮罩弹出动画效果结束后触发
   */
  onOpened?: () => void;
}
