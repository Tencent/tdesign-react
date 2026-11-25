/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode, TElement } from '../common';
import type { MouseEvent, FocusEvent, FormEvent, CompositionEvent, TouchEvent } from 'react';

export interface TdInputProps {
  /**
   * 文本内容位置，居左/居中/居右
   * @default left
   */
  align?: 'left' | 'center' | 'right';
  /**
   * 超出 `maxlength` 或 `maxcharacter` 之后是否允许继续输入
   * @default false
   */
  allowInputOverMax?: boolean;
  /**
   * 是否开启自动填充功能，HTML5 原生属性，[点击查看详情](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)
   */
  autocomplete?: string;
  /**
   * 自动聚焦
   * @default false
   */
  autofocus?: boolean;
  /**
   * 是否开启无边框模式
   * @default false
   */
  borderless?: boolean;
  /**
   * 清空图标触发方式，仅在输入框有值时有效
   * @default always
   */
  clearTrigger?: 'always' | 'focus';
  /**
   * 是否可清空
   * @default false
   */
  clearable?: boolean;
  /**
   * 光标颜色
   * @default #0052d9
   */
  cursorColor?: string;
  /**
   * 是否禁用输入框
   */
  disabled?: boolean;
  /**
   * 用于控制回车键样式，此 API 仅在部分浏览器支持，HTML5 原生属性，[点击查看详情](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/enterkeyhint)
   */
  enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /**
   * 右侧额外内容
   */
  extra?: TElement;
  /**
   * 指定输入框展示值的格式
   */
  format?: InputFormatType;
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
   * 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度。`maxcharacter` 和 `maxlength` 二选一使用
   */
  maxcharacter?: number;
  /**
   * 用户最多可以输入的文本长度，一个中文等于一个计数长度。默认为空，不限制输入长度。`maxcharacter` 和 `maxlength` 二选一使用
   */
  maxlength?: string | number;
  /**
   * 名称
   * @default ''
   */
  name?: string;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 组件前置图标
   */
  prefixIcon?: TElement;
  /**
   * 只读状态
   */
  readonly?: boolean;
  /**
   * 是否开启拼写检查，HTML5 原生属性，[点击查看详情](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/spellcheck)
   * @default false
   */
  spellcheck?: boolean;
  /**
   * 输入框状态
   * @default default
   */
  status?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 后置图标前的后置内容
   */
  suffix?: TNode;
  /**
   * 组件后置图标
   */
  suffixIcon?: TElement;
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: TNode;
  /**
   * 输入框类型
   * @default text
   */
  type?: 'text' | 'number' | 'url' | 'tel' | 'password' | 'search' | 'submit' | 'hidden';
  /**
   * 输入框的值
   */
  value?: InputValue;
  /**
   * 输入框的值，非受控属性
   */
  defaultValue?: InputValue;
  /**
   * 失去焦点时触发
   */
  onBlur?: (value: InputValue, context: { e: FocusEvent<HTMLInputElement> }) => void;
  /**
   * 输入框值发生变化时触发。`trigger=initial` 表示传入的数据不符合预期，组件自动处理后触发 change 告知父组件。如：初始值长度超过 `maxlength` 限制
   */
  onChange?: (
    value: InputValue,
    context?: {
      e?: FormEvent<HTMLInputElement> | MouseEvent<any> | CompositionEvent<HTMLDivElement>;
      trigger: 'input' | 'initial' | 'clear' | 'blur';
    },
  ) => void;
  /**
   * 清空按钮点击时触发
   */
  onClear?: (context: { e: TouchEvent<HTMLDivElement> }) => void;
  /**
   * 获得焦点时触发
   */
  onFocus?: (value: InputValue, context: { e: FocusEvent<HTMLInputElement> }) => void;
  /**
   * 字数超出限制时触发
   */
  onValidate?: (context: { error?: 'exceed-maximum' | 'below-minimum' }) => void;
}

export type InputFormatType = (value: InputValue) => string;

export type InputValue = string | number;
