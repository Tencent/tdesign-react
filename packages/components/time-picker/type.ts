/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { InputProps } from '../input';
import { PopupProps } from '../popup';
import { SelectInputBlurContext } from '../select-input';
import { RangeInputProps } from '../range-input';
import { TNode } from '../common';
import { MouseEvent, FocusEvent, FormEvent } from 'react';

export interface TdTimePickerProps {
  /**
   * 是否允许直接输入时间
   * @default false
   */
  allowInput?: boolean;
  /**
   * 无边框模式
   * @default false
   */
  borderless?: boolean;
  /**
   * 是否允许清除选中值
   * @default false
   */
  clearable?: boolean;
  /**
   * 禁用时间项的配置函数
   */
  disableTime?: (
    h: number,
    m: number,
    s: number,
    ms: number,
  ) => Partial<{ hour: Array<number>; minute: Array<number>; second: Array<number>; millisecond: Array<number> }>;
  /**
   * 是否禁用组件
   */
  disabled?: boolean;
  /**
   * 用于格式化时间，[详细文档](https://day.js.org/docs/en/display/format)
   * @default HH:mm:ss
   */
  format?: string;
  /**
   * 是否隐藏禁用状态的时间项
   * @default true
   */
  hideDisabledTime?: boolean;
  /**
   * 透传给输入框（Input）组件的参数
   */
  inputProps?: InputProps;
  /**
   * 左侧文本
   */
  label?: TNode;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 透传给 popup 组件的参数
   */
  popupProps?: PopupProps;
  /**
   * 预设快捷时间选择，示例：`{ '前一小时': '11:00:00' }`
   */
  presets?: PresetTime;
  /**
   * 尺寸
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 输入框状态
   * @default default
   */
  status?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 时间间隔步数，数组排列 [小时, 分钟, 秒]，示例：[2, 1, 1] 或者 ['2', '1', '1']
   * @default [1, 1, 1]
   */
  steps?: Array<string | number>;
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: TNode;
  /**
   * 选中值
   * @default ''
   */
  value?: TimePickerValue;
  /**
   * 选中值，非受控属性
   * @default ''
   */
  defaultValue?: TimePickerValue;
  /**
   * 当输入框失去焦点时触发，value 表示组件当前有效值
   */
  onBlur?: (context: { value: TimePickerValue } & SelectInputBlurContext) => void;
  /**
   * 选中值发生变化时触发
   */
  onChange?: (value: TimePickerValue) => void;
  /**
   * 清空按钮点击时触发
   */
  onClear?: (context: { e: MouseEvent<SVGElement> }) => void;
  /**
   * 面板关闭时触发
   */
  onClose?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 输入框获得焦点时触发，value 表示组件当前有效值
   */
  onFocus?: (context: { value: TimePickerValue; e: FocusEvent<HTMLDivElement> }) => void;
  /**
   * 当输入框内容发生变化时触发，参数 value 表示组件当前有效值
   */
  onInput?: (context: { value: TimePickerValue; e: FormEvent<HTMLInputElement> }) => void;
  /**
   * 面板打开时触发
   */
  onOpen?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 面板选中值后触发
   */
  onPick?: (value: TimePickerValue, context: { e: MouseEvent<HTMLDivElement> }) => void;
}

export interface TdTimeRangePickerProps {
  /**
   * 是否允许直接输入时间
   * @default false
   */
  allowInput?: boolean;
  /**
   * 是否自动调换左右区间的顺序，默认为 true；若需要支持跨天的场景，可以设置为 false
   * @default true
   */
  autoSwap?: boolean;
  /**
   * 无边框模式
   * @default false
   */
  borderless?: boolean;
  /**
   * 是否允许清除选中值
   * @default false
   */
  clearable?: boolean;
  /**
   * 禁用时间项
   */
  disableTime?: (
    h: number,
    m: number,
    s: number,
    ms: number,
    context: { partial: TimeRangePickerPartial },
  ) => Partial<{ hour: Array<number>; minute: Array<number>; second: Array<number> }>;
  /**
   * 是否禁用组件，值为数组表示可分别控制开始日期和结束日期是否禁用
   */
  disabled?: boolean;
  /**
   * 用于格式化时间，[详细文档](https://day.js.org/docs/en/display/format)
   * @default HH:mm:ss
   */
  format?: string;
  /**
   * 是否隐藏禁用状态的时间项
   * @default true
   */
  hideDisabledTime?: boolean;
  /**
   * 左侧文本
   */
  label?: TNode;
  /**
   * 占位符，值为数组表示可分别为开始日期和结束日期设置占位符
   */
  placeholder?: string | Array<string>;
  /**
   * 透传给 popup 组件的参数
   */
  popupProps?: PopupProps;
  /**
   * 预设快捷时间范围选择，示例：{ '下午': ['13:00:00', '18:00:00'] }
   */
  presets?: PresetTimeRange;
  /**
   * 透传给范围输入框 RangeInput 组件的参数
   */
  rangeInputProps?: RangeInputProps;
  /**
   * 尺寸
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 输入框状态
   * @default default
   */
  status?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 时间间隔步数，数组排列 [小时, 分钟, 秒]，示例：[2, 1, 1] 或者 ['2', '1', '1']
   * @default [1, 1, 1]
   */
  steps?: Array<string | number>;
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: TNode;
  /**
   * 选中值
   */
  value?: TimeRangeValue;
  /**
   * 选中值，非受控属性
   */
  defaultValue?: TimeRangeValue;
  /**
   * 当输入框失去焦点时触发
   */
  onBlur?: (context: {
    value: TimeRangeValue;
    e?: FocusEvent<HTMLDivElement>;
    position?: TimeRangePickerPartial;
  }) => void;
  /**
   * 选中值发生变化时触发
   */
  onChange?: (value: TimeRangeValue) => void;
  /**
   * 范围输入框获得焦点时触发
   */
  onFocus?: (context?: {
    value: TimeRangeValue;
    e?: FocusEvent<HTMLInputElement>;
    position?: TimeRangePickerPartial;
  }) => void;
  /**
   * 当输入框内容发生变化时触发，参数 input 表示输入内容，value 表示组件当前有效值
   */
  onInput?: (context: {
    value: TimeRangeValue;
    e?: FormEvent<HTMLInputElement>;
    position?: TimeRangePickerPartial;
  }) => void;
  /**
   * 面板选中值后触发
   */
  onPick?: (
    value: TimeRangeValue,
    context: { e: MouseEvent<HTMLDivElement>; position?: TimeRangePickerPartial },
  ) => void;
}

export interface PresetTime {
  [presetName: string]: TimePickerValue | (() => TimePickerValue);
}

export type TimePickerValue = string;

export type TimeRangePickerPartial = 'start' | 'end';

export interface PresetTimeRange {
  [presetRageName: string]: TimeRangeValue | (() => TimeRangeValue);
}

export type TimeRangeValue = Array<string>;
