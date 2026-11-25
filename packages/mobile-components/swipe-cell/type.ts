/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode, Styles } from '../common';

export interface TdSwipeCellProps {
  /**
   * 操作项以外的内容
   */
  content?: TNode;
  /**
   * 是否禁用滑动
   */
  disabled?: boolean;
  /**
   * 左侧滑动操作项。所有行为同 `right`
   */
  left?: Array<SwipeActionItem> | TNode;
  /**
   * 操作项是否呈现为打开态，值为数组时表示分别控制左右滑动的展开和收起状态
   * @default false
   */
  opened?: boolean | Array<boolean>;
  /**
   * 右侧滑动操作项。有两种定义方式，一种是使用数组，二种是使用插槽。`right.text` 表示操作文本，`right.className` 表示操作项类名，`right.style` 表示操作项样式，`right.onClick` 表示点击操作项后执行的回调函数。示例：`[{ text: '删除', style: 'background-color: red', onClick: () => {} }]`
   */
  right?: Array<SwipeActionItem> | TNode;
  /**
   * 菜单展开或者收回后将菜单的状态传递给父组件，值为数组时表示分别控制左右滑动的展开和收起状态
   */
  onChange?: (value: string) => void;
  /**
   * 操作项点击时触发（插槽写法组件不触发，业务侧自定义内容和事件）
   */
  onClick?: (action: SwipeActionItem, source: SwipeSource) => void;
  /**
   * 滑动结束事件
   */
  onDragend?: () => void;
  /**
   * 滑动开始事件
   */
  onDragstart?: () => void;
}

/** 组件实例方法 */
export interface SwipeCellInstanceFunctions {
  /**
   * 显示二次确认内容的函数。参数: `sure` 表示二次确认的具体内容，同 content; `onClick` 表示点击二次确认内容时执行的回调
   */
  showSure?: (sure: string | TNode, onClick?: SwipeActionItem['onClick']) => void;
}

export interface SwipeActionItem {
  text: string;
  className?: string;
  style?: Styles;
  sure?: string | TNode;
  onClick?: () => void;
  [key: string]: any;
}

export type SwipeSource = 'left' | 'right';
