/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { InputProps } from '../input';
import { PopupProps } from '../popup';
import { SelectInputProps } from '../select-input';
import { TagInputProps } from '../tag-input';
import { TagProps } from '../tag';
import { SelectInputValueChangeContext } from '../select-input';
import { PopupVisibleChangeContext } from '../popup';
import { PlainObject, TNode, TElement, SizeEnum, InfinityScroll } from '../common';
import { MouseEvent, KeyboardEvent, FocusEvent } from 'react';

export interface TdSelectProps<T extends SelectOption = SelectOption> {
  /**
   * 宽度随内容自适应
   * @default false
   */
  autoWidth?: boolean;
  /**
   * 自动聚焦
   * @default false
   */
  autofocus?: boolean;
  /**
   * 无边框模式
   * @default false
   */
  borderless?: boolean;
  /**
   * 是否可以清空选项
   * @default false
   */
  clearable?: boolean;
  /**
   * 多选情况下，用于设置折叠项内容，默认为 `+N`。如果需要悬浮就显示其他内容，可以使用 collapsedItems 自定义。`value` 表示当前存在的所有标签，`collapsedSelectedItems` 表示折叠的标签，泛型 `T` 继承 `SelectOption`，表示选项数据；`count` 表示折叠的数量, `onClose` 表示移除标签
   */
  collapsedItems?: TNode<{
    value: T[];
    collapsedSelectedItems: T[];
    count: number;
    onClose: (context: { index: number; e?: MouseEvent }) => void;
  }>;
  /**
   * 是否允许用户创建新条目，需配合 filterable 使用
   * @default false
   */
  creatable?: boolean;
  /**
   * 是否禁用组件
   */
  disabled?: boolean;
  /**
   * 当下拉列表为空时显示的内容
   */
  empty?: TNode;
  /**
   * 自定义搜索规则，用于对现有数据进行搜索，判断是否过滤某一项数据。参数 `filterWords` 表示搜索词，`option`表示单个选项内容，返回值为 `true` 保留该选项，返回值为 `false` 则隐藏该选项。使用该方法时无需设置 `filterable`
   */
  filter?: (filterWords: string, option: T) => boolean | Promise<boolean>;
  /**
   * 是否可搜索，默认搜索规则不区分大小写，全文本任意位置匹配。如果默认搜索规则不符合业务需求，可以更为使用 `filter` 自定义过滤规则
   */
  filterable?: boolean;
  /**
   * 透传 Input 输入框组件的全部属性
   */
  inputProps?: InputProps;
  /**
   * 输入框的值
   */
  inputValue?: string;
  /**
   * 输入框的值，非受控属性
   */
  defaultInputValue?: string;
  /**
   * 用来定义 value / label / disabled 在 `options` 中对应的字段别名
   */
  keys?: SelectKeysType;
  /**
   * 左侧文本
   */
  label?: TNode;
  /**
   * 是否为加载状态
   * @default false
   */
  loading?: boolean;
  /**
   * 远程加载时显示的文字，支持自定义。如加上超链接
   */
  loadingText?: TNode;
  /**
   * 用于控制多选数量，值为 0 则不限制
   * @default 0
   */
  max?: number;
  /**
   * 最小折叠数量，用于多选情况下折叠选中项，超出该数值的选中项折叠。值为 0 则表示不折叠
   * @default 0
   */
  minCollapsedNum?: number;
  /**
   * 是否允许多选
   * @default false
   */
  multiple?: boolean;
  /**
   * 数据化配置选项内容
   */
  options?: Array<T>;
  /**
   * 下拉选项布局方式，有纵向排列和横向排列两种，默认纵向排列
   * @default vertical
   */
  optionsLayout?: 'vertical' | 'horizontal';
  /**
   * 面板内的底部内容
   */
  panelBottomContent?: TNode;
  /**
   * 面板内的顶部内容
   */
  panelTopContent?: TNode;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 透传给 popup 组件的全部属性
   */
  popupProps?: PopupProps;
  /**
   * 是否显示下拉框
   */
  popupVisible?: boolean;
  /**
   * 是否显示下拉框，非受控属性
   */
  defaultPopupVisible?: boolean;
  /**
   * 组件前置图标
   */
  prefixIcon?: TElement;
  /**
   * 只读状态，值为真会隐藏输入框，且无法打开下拉框
   * @default false
   */
  readonly?: boolean;
  /**
   * 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
   * @default false
   */
  reserveKeyword?: boolean;
  /**
   * 懒加载和虚拟滚动。为保证组件收益最大化，当数据量小于阈值 `scroll.threshold` 时，无论虚拟滚动的配置是否存在，组件内部都不会开启虚拟滚动，`scroll.threshold` 默认为 `100`
   */
  scroll?: InfinityScroll;
  /**
   * 透传 SelectInput 筛选器输入框组件的全部属性
   */
  selectInputProps?: SelectInputProps;
  /**
   * 是否显示右侧箭头，默认显示
   * @default true
   */
  showArrow?: boolean;
  /**
   * 组件尺寸
   * @default medium
   */
  size?: SizeEnum;
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
   * 透传 TagInput 标签输入框组件的全部属性
   */
  tagInputProps?: TagInputProps;
  /**
   * 透传 Tag 标签组件全部属性
   */
  tagProps?: TagProps;
  /**
   * 输入框下方提示文本，会根据不同的 `status` 呈现不同的样式
   */
  tips?: TNode;
  /**
   * 选中值
   */
  value?: SelectValue;
  /**
   * 选中值，非受控属性
   */
  defaultValue?: SelectValue;
  /**
   * 自定义选中项呈现的内容
   */
  valueDisplay?: string | TNode<{ value: SelectValue; onClose: (index: number) => void; displayValue?: SelectValue }>;
  /**
   * 用于控制选中值的类型。假设数据选项为：`[{ label: '姓名', value: 'name' }]`，value 表示值仅返回数据选项中的 value， object 表示值返回全部数据。
   * @default value
   */
  valueType?: 'value' | 'object';
  /**
   * 输入框失去焦点时触发
   */
  onBlur?: (context: { value: SelectValue; e: FocusEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> }) => void;
  /**
   * 选中值变化时触发。`context.trigger` 表示触发变化的来源；`context.selectedOptions` 表示选中值的完整对象，数组长度一定和 `value` 相同；`context.option` 表示当前操作的选项，不一定存在
   */
  onChange?: (
    value: SelectValue,
    context: {
      option?: T;
      selectedOptions: T[];
      trigger: SelectValueChangeTrigger;
      e?: MouseEvent<SVGElement | HTMLDivElement | HTMLLIElement> | KeyboardEvent<HTMLInputElement>;
    },
  ) => void;
  /**
   * 点击清除按钮时触发
   */
  onClear?: (context: { e: MouseEvent<HTMLDivElement> }) => void;
  /**
   * 当选择新创建的条目时触发
   */
  onCreate?: (value: string | number) => void;
  /**
   * 回车键按下时触发。`inputValue` 表示输入框的值，`value` 表示选中值
   */
  onEnter?: (context: { inputValue: string; e: KeyboardEvent<HTMLDivElement>; value: SelectValue }) => void;
  /**
   * 输入框获得焦点时触发
   */
  onFocus?: (context: { value: SelectValue; e: FocusEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement> }) => void;
  /**
   * 输入框值发生变化时触发，`context.trigger` 表示触发输入框值变化的来源：文本输入触发、清除按钮触发、失去焦点等
   */
  onInputChange?: (value: string, context?: SelectInputValueChangeContext) => void;
  /**
   * 下拉框显示或隐藏时触发
   */
  onPopupVisibleChange?: (visible: boolean, context: PopupVisibleChangeContext) => void;
  /**
   * 多选模式下，选中数据被移除时触发
   */
  onRemove?: (options: SelectRemoveContext<T>) => void;
  /**
   * 输入值变化时，触发搜索事件。主要用于远程搜索新数据
   */
  onSearch?: (filterWords: string, context: { e: KeyboardEvent<HTMLDivElement> }) => void;
}

export interface TdOptionProps {
  /**
   * 当前选项是否为全选，全选可以在顶部，也可以在底部。点击当前选项会选中禁用态除外的全部选项，即使是分组选择器也会选中全部选项
   * @default false
   */
  checkAll?: boolean;
  /**
   * 用于定义复杂的选项内容，同 content
   */
  children?: TNode;
  /**
   * 用于定义复杂的选项内容
   */
  content?: TNode;
  /**
   * 是否禁用该选项
   * @default false
   */
  disabled?: boolean;
  /**
   * 选项名称
   * @default ''
   */
  label?: string;
  /**
   * 选项标题，在选项过长时hover选项展示
   * @default ''
   */
  title?: string;
  /**
   * 选项值
   */
  value?: string | number;
}

export interface TdOptionGroupProps {
  /**
   * 是否显示分隔线
   * @default true
   */
  divider?: boolean;
  /**
   * 分组别名
   * @default ''
   */
  label?: string;
}

export interface SelectKeysType {
  value?: string;
  label?: string;
  disabled?: string;
}

export type SelectValue<T extends SelectOption = SelectOption> = string | number | boolean | T | Array<SelectValue<T>>;

export type SelectValueChangeTrigger = 'clear' | 'tag-remove' | 'backspace' | 'check' | 'uncheck' | 'default';

export interface SelectRemoveContext<T> {
  value: SelectValue;
  data: T;
  e: MouseEvent<HTMLDivElement | HTMLLIElement> | KeyboardEvent<HTMLDivElement>;
}

export type SelectOption = TdOptionProps | SelectOptionGroup | PlainObject;

export interface SelectOptionGroup extends TdOptionGroupProps {
  group: string;
  children: Array<TdOptionProps>;
}
