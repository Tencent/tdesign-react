/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { InputProps, InputValue, InputFormatType } from '../input';
import { TNode, TElement } from '../common';
import { MouseEvent, FocusEvent, FormEvent } from 'react';

export interface TdRangeInputProps {
  /**
   * 是否可清空
   * @default false
   */
  clearable?: boolean;
  /**
   * 是否禁用范围输入框
   * @default false
   */
  disabled?: boolean;
  /**
   * 指定输入框展示值的格式
   */
  format?: InputFormatType | Array<InputFormatType>;
  /**
   * 透传 Input 输入框组件全部属性，数组第一项表示第一个输入框属性，第二项表示第二个输入框属性。示例：`[{ label: 'A', name: 'A-name' }, { label: 'B',  name: 'B-name' }]`
   */
  inputProps?: InputProps | Array<InputProps>;
  /**
   * 左侧内容
   */
  label?: TNode;
  /**
   * 占位符，示例：'请输入' 或者 ['开始日期', '结束日期']
   */
  placeholder?: string | Array<string>;
  /**
   * 组件前置图标
   */
  prefixIcon?: TElement;
  /**
   * 只读状态
   * @default false
   */
  readonly?: boolean;
  /**
   * 范围分隔符
   * @default '-'
   */
  separator?: TNode;
  /**
   * 输入框内容为空时，悬浮状态是否显示清空按钮，默认不显示
   * @default false
   */
  showClearIconOnEmpty?: boolean;
  /**
   * 输入框状态
   */
  status?: 'success' | 'warning' | 'error';
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
   * 范围输入框的值
   */
  value?: RangeInputValue;
  /**
   * 范围输入框的值，非受控属性
   */
  defaultValue?: RangeInputValue;
  /**
   * 范围输入框失去焦点时触发
   */
  onBlur?: (
    value: RangeInputValue,
    context?: { e?: FocusEvent<HTMLInputElement>; position?: RangeInputPosition },
  ) => void;
  /**
   * 范围输入框值发生变化时触发
   */
  onChange?: (
    value: RangeInputValue,
    context?: { e?: FormEvent<HTMLInputElement>; position?: RangeInputPosition },
  ) => void;
  /**
   * 清空按钮点击时触发
   */
  onClear?: (context: { e: MouseEvent<SVGElement> }) => void;
  /**
   * 范围输入框获得焦点时触发
   */
  onFocus?: (
    value: RangeInputValue,
    context?: { e?: FocusEvent<HTMLInputElement>; position?: RangeInputPosition },
  ) => void;
}

export type RangeInputValue = Array<InputValue>;

export type RangeInputPosition = 'first' | 'second';
