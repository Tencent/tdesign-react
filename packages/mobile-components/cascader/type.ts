/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { OverlayProps } from '../overlay';
import type { TNode, TElement, TreeOptionData, TreeKeysType } from '../common';

export interface TdCascaderProps<CascaderOption extends TreeOptionData = TreeOptionData> {
  /**
   * 父子节点选中状态不再关联，可各自选中或取消
   * @default false
   */
  checkStrictly?: boolean;
  /**
   * 关闭按钮
   * @default true
   */
  closeBtn?: TNode;
  /**
   *  自定义过滤函数。返回 true 表示匹配，未设置时使用内置匹配规则：对路径中所有 label 拼接后做大小写不敏感的 includes 匹配
   */
  filter?: CascaderFilterFunction;
  /**
   * 搜索框占位符描述文本
   * @default ''
   */
  filterPlaceholder?: string;
  /**
   * 是否可搜索，开启后顶部会展示一个搜索框
   * @default false
   */
  filterable?: boolean;
  /**
   * 头部
   */
  header?: TElement;
  /**
   * 用来定义 value / label / children / disabled 在 `options` 中对应的字段别名
   */
  keys?: CascaderKeysType;
  /**
   * 加载子树数据的方法（仅当节点 children 为 true 时生效）
   */
  load?: (node: CascaderOption) => Promise<Array<CascaderOption>>;
  /**
   * 是否完成异步加载
   * @default false
   */
  loadCompleted?: boolean;
  /**
   * 中间内容
   */
  middleContent?: TElement;
  /**
   * 可选项数据源
   * @default []
   */
  options?: Array<CascaderOption>;
  /**
   * 遮罩层的属性，透传至 overlay
   * @default {}
   */
  overlayProps?: OverlayProps;
  /**
   * 未选中时的提示文案。组件内置默认值为：'选择选项'
   * @default ''
   */
  placeholder?: string;
  /**
   * 每级展示的次标题
   * @default []
   */
  subTitles?: Array<string>;
  /**
   * 展示风格
   * @default step
   */
  theme?: 'step' | 'tab';
  /**
   * 标题
   */
  title?: TNode;
  /**
   * 选项值
   */
  value?: string | number;
  /**
   * 选项值，非受控属性
   */
  defaultValue?: string | number;
  /**
   * 是否展示
   * @default false
   */
  visible?: boolean;
  /**
   * 值发生变更时触发
   */
  onChange?: (value: string | number, selectedOptions: CascaderOption[]) => void;
  /**
   * 关闭时触发
   */
  onClose?: (trigger: CascaderTriggerSource) => void;
  /**
   * 选择后触发
   */
  onPick?: (context: { value: string | number; label: string; index: number; level: number }) => void;
}

export type CascaderFilterFunction<CascaderOption extends TreeOptionData = TreeOptionData> = (
  keyword: string,
  option: CascaderOption,
  path: CascaderOption[],
) => boolean;

export type CascaderKeysType = TreeKeysType;

export type CascaderTriggerSource = 'overlay' | 'close-btn' | 'finish';
