/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TElement, KeysType } from '../common';
import type { MouseEvent } from 'react';

export interface TdPickerProps {
  /**
   * 取消按钮文字
   * @default true
   */
  cancelBtn?: boolean | string;
  /**
   * 配置每一列的选项
   * @default []
   */
  columns: PickerColumn | Array<PickerColumn> | ((item: Array<PickerValue>) => Array<PickerColumn>);
  /**
   * 确定按钮文字
   * @default true
   */
  confirmBtn?: boolean | string;
  /**
   * 底部内容
   */
  footer?: TElement;
  /**
   * 自定义头部内容
   */
  header?: TElement;
  /**
   * 用来定义 value / label / disabled 在 `columns ` 中对应的字段别名
   */
  keys?: KeysType;
  /**
   * 自定义选项内容。参数为 `option: PickerColumnItem, index: number`
   */
  option?: (option: PickerColumnItem, index: number) => string | Record<string, string | boolean>;
  /**
   * 自定义label
   */
  renderLabel?: (item: PickerColumnItem, index: number) => string;
  /**
   * ⚠️ 即将废弃，请使用 `wheelConfig.inertiaDuration` 代替。快速滑动时惯性滚动的时长，单位 ms，为 0 时表示取消惯性滚动
   * @default 300
   */
  swipeDuration?: string | number;
  /**
   * 标题
   * @default ''
   */
  title?: string;
  /**
   * 选中值
   */
  value?: Array<PickerValue>;
  /**
   * 选中值，非受控属性
   */
  defaultValue?: Array<PickerValue>;
  /**
   * 【实验】滚轮滑动相关配置，用于自定义滚轮的动画和交互行为。`inertiaDuration` 表示惯性滚动的持续时长；`bounceDuration` 表示边界归位动画时长；`transitionDuration` 表示切换选项时的过渡动画时长； `inertiaTimeThreshold` 表示惯性触发的时间阈值； `inertiaDistanceThreshold` 表示惯性触发的距离阈值； `boundOffset` 表示边界偏移量；`clickDistanceThreshold` 表示点击操作的距离阈值；`clickTimeThreshold` 表示点击操作的时间阈值
   */
  wheelConfig?: PickerWheelConfig;
  /**
   * 点击取消按钮时触发
   * @default ''
   */
  onCancel?: (context: { e: MouseEvent<HTMLButtonElement> }) => void;
  /**
   * 选中变化时候触发
   * @default ''
   */
  onChange?: (
    value: Array<PickerValue>,
    context: { columns: Array<PickerContext>; e: MouseEvent<HTMLDivElement> },
  ) => void;
  /**
   * 点击确认按钮时触发
   * @default ''
   */
  onConfirm?: (
    value: Array<PickerValue>,
    context: { index: number[]; e: MouseEvent<HTMLDivElement>; label: string[] },
  ) => void;
  /**
   * 任何一列选中都会触发，不同的列参数不同。`context.column` 表示第几列变化，`context.index` 表示变化那一列的选中项下标
   * @default ''
   */
  onPick?: (value: Array<PickerValue>, context: PickerContext) => void;
}

export type PickerColumn = PickerColumnItem[];

export interface PickerColumnItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export type PickerValue = string | number;

export interface PickerWheelConfig {
  inertiaDuration?: number;
  bounceDuration?: number;
  transitionDuration?: number;
  inertiaTimeThreshold?: number;
  inertiaDistanceThreshold?: number;
  boundOffset?: number;
  clickDistanceThreshold?: number;
  clickTimeThreshold?: number;
}

export interface PickerContext {
  column: number;
  index: number;
}
