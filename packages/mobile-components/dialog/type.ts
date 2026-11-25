/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { ButtonProps } from '../button';
import { OverlayProps } from '../overlay';
import type { TNode, TElement, Styles } from '../common';
import type { MouseEvent } from 'react';

export interface TdDialogProps {
  /**
   * 操作栏
   */
  actions?: Array<ButtonProps>;
  /**
   * 多按钮排列方式
   * @default horizontal
   */
  buttonLayout?: 'horizontal' | 'vertical';
  /**
   * 取消按钮，可自定义。值为 null 则不显示取消按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制取消事件
   */
  cancelBtn?: ButtonProps | TNode | null;
  /**
   * 多按钮排列方式。可选项：true/false
   * @default false
   */
  closeBtn?: boolean;
  /**
   * 点击蒙层时是否触发关闭事件
   * @default false
   */
  closeOnOverlayClick?: boolean;
  /**
   * 确认按钮。值为 null 则不显示确认按钮。值类型为字符串，则表示自定义按钮文本，值类型为 Object 则表示透传 Button 组件属性。使用 TNode 自定义按钮时，需自行控制确认事件
   */
  confirmBtn?: ButtonProps | TNode | null;
  /**
   * 内容
   */
  content?: TNode;
  /**
   * 是否在关闭弹框的时候销毁子元素
   * @default false
   */
  destroyOnClose?: boolean;
  /**
   * 中间自定义内容
   */
  middle?: TElement;
  /**
   * 透传至 Overlay 组件
   * @default {}
   */
  overlayProps?: OverlayProps;
  /**
   * 防止滚动穿透
   * @default true
   */
  preventScrollThrough?: boolean;
  /**
   * 是否显示遮罩层
   * @default true
   */
  showOverlay?: boolean;
  /**
   * 标题
   */
  title?: TNode;
  /**
   * 顶部自定义内容
   */
  top?: TElement;
  /**
   * 控制对话框是否显示
   */
  visible?: boolean;
  /**
   * 对话框宽度，示例：320, '500px', '80%'
   */
  width?: string | number;
  /**
   * 对话框层级，Web 侧样式默认为 2500，移动端样式默认 1500，小程序样式默认为 11500
   */
  zIndex?: number;
  /**
   * 如果“取消”按钮存在，则点击“取消”按钮时触发，同时触发关闭事件
   */
  onCancel?: (context: { e: MouseEvent<HTMLButtonElement> }) => void;
  /**
   * 关闭事件，点击 取消按钮 或 点击蒙层 时触发
   */
  onClose?: (context: DialogCloseContext) => void;
  /**
   * 对话框消失动画效果结束后触发
   */
  onClosed?: () => void;
  /**
   * 如果“确认”按钮存在，则点击“确认”按钮时触发
   */
  onConfirm?: (context: { e: MouseEvent<HTMLButtonElement> }) => void;
  /**
   * 如果蒙层存在，点击蒙层时触发
   */
  onOverlayClick?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
}

export interface DialogOptions extends Omit<TdDialogProps, 'attach'> {
  /**
   * 弹框类名，示例：'t-class-dialog-first t-class-dialog-second'
   * @default ''
   */
  className?: string;
  /**
   * 弹框 style 属性，输入 [CSSStyleDeclaration.cssText](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText)
   */
  style?: Styles;
}

export interface DialogInstance {
  /**
   * 销毁弹框
   */
  destroy: () => void;
  /**
   * 隐藏弹框
   */
  hide: () => void;
  /**
   * 显示弹框
   */
  show: () => void;
  /**
   * 更新弹框内容
   */
  update: (props: DialogOptions) => void;
}

export type DialogEventSource = 'cancel' | 'overlay' | 'close-btn';

export interface DialogCloseContext {
  trigger: DialogEventSource;
  e: MouseEvent<HTMLElement>;
}

export type DialogMethod = (options?: DialogOptions) => DialogInstance;

export type DialogConfirmMethod = (options?: DialogOptions) => DialogInstance;

export type DialogAlertMethod = (options?: Omit<DialogOptions, 'cancelBtn'>) => DialogInstance;
