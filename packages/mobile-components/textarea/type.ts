/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode } from '../common';
import type { FocusEvent, FormEvent, CompositionEvent } from 'react';

export interface TdTextareaProps {
  /**
   * 超出 `maxlength` 或 `maxcharacter` 之后是否还允许输入
   * @default false
   */
  allowInputOverMax?: boolean;
  /**
   * 自动聚焦，拉起键盘
   * @default false
   */
  autofocus?: boolean;
  /**
   * 高度自动撑开。 autosize = true 表示组件高度自动撑开，同时，依旧允许手动拖高度。如果设置了 autosize.maxRows 或者 autosize.minRows 则不允许手动调整高度
   * @default false
   */
  autosize?: boolean | { minRows?: number; maxRows?: number };
  /**
   * 是否显示外边框
   * @default false
   */
  bordered?: boolean;
  /**
   * 光标颜色
   * @default #0052d9
   */
  cursorColor?: string;
  /**
   * 是否禁用文本框
   */
  disabled?: boolean;
  /**
   * 显示文本计数器，如 0/140。当 `maxlength < 0 && maxcharacter < 0` 成立时， indicator无效
   * @default false
   */
  indicator?: boolean;
  /**
   * 左侧文本
   */
  label?: TNode;
  /**
   * 标题输入框布局方式
   * @default horizontal
   */
  layout?: 'vertical' | 'horizontal';
  /**
   * 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度
   */
  maxcharacter?: number;
  /**
   * 用户最多可以输入的字符个数
   */
  maxlength?: string | number;
  /**
   * 名称，HTML 元素原生属性
   * @default ''
   */
  name?: string;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 只读状态
   */
  readonly?: boolean;
  /**
   * 文本框值
   */
  value?: TextareaValue;
  /**
   * 文本框值，非受控属性
   */
  defaultValue?: TextareaValue;
  /**
   * 失去焦点时触发
   */
  onBlur?: (value: TextareaValue, context: { e: FocusEvent<HTMLTextAreaElement> }) => void;
  /**
   * 输入内容变化时触发
   */
  onChange?: (value: TextareaValue, context?: { e?: FormEvent<HTMLTextAreaElement> }) => void;
  /**
   * 中文输入结束时触发
   */
  onCompositionend?: (value: string, context: { e: CompositionEvent<HTMLDivElement> }) => void;
  /**
   * 中文输入开始时触发
   */
  onCompositionstart?: (value: string, context: { e: CompositionEvent<HTMLDivElement> }) => void;
  /**
   * 获得焦点时触发
   */
  onFocus?: (value: TextareaValue, context: { e: FocusEvent<HTMLTextAreaElement> }) => void;
}

export type TextareaValue = string | number;
