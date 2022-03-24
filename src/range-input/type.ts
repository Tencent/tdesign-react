/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { InputProps, InputValue, InputFormatType } from '../input';
import { TNode } from '../common';
import { MouseEvent, FormEvent } from 'react';

export interface TdRangeInputProps {
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
   * 左侧文本
   */
  label?: string | TNode<{ position: RangeInputPosition }> | Array<string | TNode>;
  /**
   * 占位符，示例：'请输入' 或者 ['开始日期', '结束日期']
   */
  placeholder?: string | Array<string>;
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
   * 输入框状态
   */
  status?: 'success' | 'warning' | 'error';
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
   * 范围输入框值发生变化时触发
   */
  onChange?: (
    value: RangeInputValue,
    context?: { e?: FormEvent<HTMLDivElement> | MouseEvent<HTMLElement | SVGElement>; position?: RangeInputPosition },
  ) => void;
}

export type RangeInputPosition = 'first' | 'second';

export type RangeInputValue = Array<InputValue>;
