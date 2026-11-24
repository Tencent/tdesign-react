/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode, KeysType } from '../common';
import type { ChangeEvent } from 'react';

export interface TdCheckboxProps {
  /**
   * 是否为块级元素
   * @default true
   */
  block?: boolean;
  /**
   * 是否开启无边框模式
   */
  borderless?: boolean;
  /**
   * 用于标识是否为「全选选项」。单独使用无效，需在 CheckboxGroup 中使用
   * @default false
   */
  checkAll?: boolean;
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
   * 多选框内容，同 label
   */
  children?: TNode;
  /**
   * 多选框内容
   */
  content?: TNode;
  /**
   * 是否禁用组件内容（content）触发选中
   */
  contentDisabled?: boolean;
  /**
   * 是否禁用组件。如果父组件存在 CheckboxGroup，默认值由 CheckboxGroup.disabled 控制。优先级：Checkbox.disabled > CheckboxGroup.disabled > Form.disabled
   */
  disabled?: boolean;
  /**
   * 自定义选中图标和非选中图标。使用 Array 时表示：[选中态图标，非选中态图标]。使用 String 时，值为 circle 表示填充圆形图标、值为 line 表示描边型图标、值为 rectangle 表示填充矩形图标
   * @default 'circle'
   */
  icon?: CheckboxIconType;
  /**
   * 是否为半选
   * @default false
   */
  indeterminate?: boolean;
  /**
   * 主文案
   */
  label?: TNode;
  /**
   * 内容最大行数限制
   * @default 5
   */
  maxContentRow?: number;
  /**
   * 主文案最大行数限制
   * @default 3
   */
  maxLabelRow?: number;
  /**
   * HTML 元素原生属性
   * @default ''
   */
  name?: string;
  /**
   * 多选框和内容相对位置
   * @default left
   */
  placement?: 'left' | 'right';
  /**
   * 只读状态
   */
  readonly?: boolean;
  /**
   * 多选框的值
   */
  value?: string | number | boolean;
  /**
   * 值变化时触发
   */
  onChange?: (checked: boolean, context: { e: ChangeEvent<HTMLInputElement> }) => void;
}

export interface TdCheckboxGroupProps<T = CheckboxGroupValue> {
  /**
   * 是否开启无边框模式。优先级低于 Checkbox.borderless
   * @default false
   */
  borderless?: boolean;
  /**
   * 复选框按钮排列方式
   * @default vertical
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * 是否禁用组件。优先级：Form.disabled < CheckboxGroup.disabled < Checkbox.disabled
   */
  disabled?: boolean;
  /**
   * 用来定义 value / label / disabled 在 `options` 中对应的字段别名
   */
  keys?: KeysType;
  /**
   * 支持最多选中的数量
   */
  max?: number;
  /**
   * 统一设置内部复选框 HTML 属性
   * @default ''
   */
  name?: string;
  /**
   * 以配置形式设置子元素。示例1：`['北京', '上海']` ，示例2: `[{ label: '全选', checkAll: true }, { label: '上海', value: 'shanghai' }]`。checkAll 值为 true 表示当前选项为「全选选项」
   */
  options?: Array<CheckboxOption>;
  /**
   * 只读状态
   */
  readonly?: boolean;
  /**
   * 选中值
   * @default []
   */
  value?: T;
  /**
   * 选中值，非受控属性
   * @default []
   */
  defaultValue?: T;
  /**
   * 值变化时触发。`context.current` 表示当前变化的数据项，如果是全选则为空；`context.type` 表示引起选中数据变化的是选中或是取消选中，`context.option` 表示当前变化的数据项
   */
  onChange?: (value: T, context: CheckboxGroupChangeContext) => void;
}

export type CheckboxIconType = 'circle' | 'line' | 'rectangle' | boolean | Array<TNode | String>;

export type CheckboxOption = string | number | CheckboxOptionObj;

export interface CheckboxOptionObj extends TdCheckboxProps {
  text?: string;
}

export type CheckboxGroupValue = Array<string | number | boolean>;

export interface CheckboxGroupChangeContext {
  e: Event;
  current: string | number;
  option: CheckboxOption | TdCheckboxProps;
  type: 'check' | 'uncheck';
}
