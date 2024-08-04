/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { InputProps } from '../input';
import { PopupProps } from '../popup';
import { SelectInputProps } from '../select-input';
import { TextareaProps } from '../textarea';
import { TNode, TElement } from '../common';
import { MouseEvent, KeyboardEvent, FocusEvent, FormEvent } from 'react';

export interface TdSearchProps {
  /**
   * 联想词列表，如果不存在或长度为 0 则不显示联想框。支持自定义联想词为任意内容。如果 `group` 值为 `true` 则表示当前项为分组标题
   */
  autocompleteOptions?: Array<AutocompleteOption>;
  /**
   * 是否默认聚焦
   * @default false
   */
  autofocus?: boolean;
  /**
   * 搜索框宽度自适应
   * @default false
   */
  autoWidth?: boolean;
  /**
   * 无边框模式
   * @default true
   */
  borderless?: boolean;
  /**
   * 是否可清空
   * @default true
   */
  clearable?: boolean;
  /**
   * 禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * 自定义过滤方法，用于对现有数据进行搜索过滤，判断是否过滤某一项数据。其中参数 `keyword` 指当前的搜索词，参数 `option` 指每一项联想词，函数返回 true 则显示当前联想词，函数返回 `false` 则隐藏当前联想词
   */
  filter?: (keyword: string, option: any) => boolean | Promise<boolean>;
  /**
   * 透传 Input 组件全部属性
   */
  inputProps?: InputProps;
  /**
   * 搜索框内部左侧内容，位于 `prefixIcon` 左侧
   * @default ''
   */
  label?: TNode;
  /**
   * 批量搜索模式，也叫多行搜索，输入框表现为类似 `textarea`，允许输入多行搜索内容
   * @default false
   */
  multiline?: boolean;
  /**
   * 占位符
   * @default ''
   */
  placeholder?: string;
  /**
   * 透传 Popup 组件全部属性
   */
  popupProps?: PopupProps;
  /**
   * 前置图标
   */
  prefixIcon?: TElement;
  /**
   * 只读状态
   * @default false
   */
  readonly?: boolean;
  /**
   * 基于 SelectInput 组件开发，透传组件全部属性
   */
  selectInputProps?: SelectInputProps;
  /**
   * 搜索框内部右侧内容，位于 `suffixIcon` 右侧
   * @default ''
   */
  suffix?: TNode;
  /**
   * 后置图标，默认为搜索图标。值为 `null` 时则不显示
   */
  suffixIcon?: TElement;
  /**
   * 透传 Textarea 组件全部属性
   */
  textareaProps?: TextareaProps;
  /**
   * 值，搜索关键词
   * @default ''
   */
  value?: string;
  /**
   * 值，搜索关键词，非受控属性
   * @default ''
   */
  defaultValue?: string;
  /**
   * 失去焦点时触发
   * @default ''
   */
  onBlur?: (context: { value: string; e: FocusEvent<HTMLDivElement> }) => void;
  /**
   * 搜索关键词发生变化时触发，可能场景有：搜索框内容发生变化、点击联想词
   * @default ''
   */
  onChange?: (
    value: string,
    context: { trigger: 'input-change' | 'option-click'; e?: FormEvent<HTMLDivElement> | MouseEvent<HTMLDivElement> },
  ) => void;
  /**
   * 点击清除时触发
   * @default ''
   */
  onClear?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 回车键按下时触发
   */
  onEnter?: (context: { value: string; e: KeyboardEvent<HTMLInputElement> }) => void;
  /**
   * 获得焦点时触发
   * @default ''
   */
  onFocus?: (context: { value: string; e: FocusEvent<HTMLDivElement> }) => void;
  /**
   * 搜索触发，包含：Enter 键、联想关键词点击、清空按钮点击、搜索框后置内容点击（含后置图标）、搜索框前置内容点击（含前置图标）等
   * @default ''
   */
  onSearch?: (context?: {
    value: string;
    trigger: 'enter' | 'option-click' | 'clear' | 'suffix-click' | 'prefix-click';
    e?: FormEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>;
  }) => void;
}

export type AutocompleteOption = string | { label: string | TNode; group?: boolean };
