/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TNode, SizeEnum } from '../common';
import { ChangeEvent } from 'react';

export interface TdRadioProps {
  /**
   * 是否允许取消选中
   * @default false
   */
  allowUncheck?: boolean;
  /**
   * 是否选中
   * @default false
   */
  checked?: boolean;
  /**
   * 是否选中，非受控属性
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * 单选内容，同 label
   */
  children?: TNode;
  /**
   * 是否为禁用态
   */
  disabled?: boolean;
  /**
   * 主文案
   */
  label?: TNode;
  /**
   * HTML 元素原生属性
   * @default ''
   */
  name?: string;
  /**
   * 单选按钮的值
   * @default false
   */
  value?: RadioValue;
  /**
   * 选中状态变化时触发
   */
  onChange?: (checked: boolean, context: { e: ChangeEvent<HTMLDivElement> }) => void;
}

export interface TdRadioGroupProps {
  /**
   * 是否禁用全部子单选框
   */
  disabled?: boolean;
  /**
   * HTML 元素原生属性
   * @default ''
   */
  name?: string;
  /**
   * 单选组件按钮形式。RadioOption 数据类型为 string 或 number 时，表示 label 和 value 值相同
   */
  options?: Array<RadioOption>;
  /**
   * 组件尺寸
   * @default medium
   */
  size?: SizeEnum;
  /**
   * 选中的值
   * @default false
   */
  value?: RadioValue;
  /**
   * 选中的值，非受控属性
   * @default false
   */
  defaultValue?: RadioValue;
  /**
   * 单选组件按钮形式
   * @default outline
   */
  variant?: 'outline' | 'primary-filled' | 'default-filled';
  /**
   * 选中值发生变化时触发
   */
  onChange?: (value: RadioValue, context: { e: ChangeEvent<HTMLInputElement> }) => void;
}

export type RadioValue = string | number | boolean;

export type RadioOption = string | number | RadioOptionObj;

export interface RadioOptionObj {
  label?: string | TNode;
  value?: string | number;
  disabled?: boolean;
}
