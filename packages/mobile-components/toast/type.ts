/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { OverlayProps } from '../overlay';
import type { TNode, TElement, Styles, AttachNode } from '../common';

export interface TdToastProps {
  /**
   * 图标排列方式
   * @default row
   */
  direction?: 'row' | 'column';
  /**
   * 弹窗显示毫秒数
   * @default 2000
   */
  duration?: number;
  /**
   * 自定义图标
   */
  icon?: TElement;
  /**
   * 弹窗显示文字
   */
  message?: TNode;
  /**
   * 遮罩层属性，透传至 Overlay
   */
  overlayProps?: OverlayProps;
  /**
   * 弹窗展示位置
   * @default middle
   */
  placement?: 'top' | 'middle' | 'bottom';
  /**
   * 防止滚动穿透，即不允许点击和滚动
   * @default false
   */
  preventScrollThrough?: boolean;
  /**
   * 是否显示遮罩层
   * @default false
   */
  showOverlay?: boolean;
  /**
   * 提示类型
   */
  theme?: 'loading' | 'success' | 'warning' | 'error';
  /**
   * 轻提示隐藏的时候触发
   */
  onClose?: () => void;
  /**
   * 轻提示销毁的时候触发
   */
  onDestroy?: () => void;
}

export interface ToastOptions extends TdToastProps {
  /**
   * 指定挂载节点。数据类型为 String 时，会被当作选择器处理，进行节点查询。示例：'body' 或 () => document.body
   * @default 'body'
   */
  attach?: AttachNode;
  /**
   * 弹框类名，示例：'t-class-toast-first t-class-toast-second'
   * @default ''
   */
  className?: string;
  /**
   * 弹框 style 属性，输入 [CSSStyleDeclaration.cssText](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText)
   */
  style?: Styles;
}
