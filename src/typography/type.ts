import { TNode } from '../common';

export interface TdTypographyTextProps {
  /**
   * 添加代码样式
   */
  code?: boolean;
  /**
   * 是否可拷贝，为对象时可进行各种自定义
   */
  copyable?: boolean | Copyable;
  /**
   * 添加删除线样式
   */
  delete?: boolean;
  /**
   * 添加下划线样式
   */
  underline?: boolean;
  /**
   * 禁用文本
   */
  disabled?: boolean;
  /**
   * 文本状态
   * @default default
   */
  status?: 'secondary' | 'success' | 'warning' | 'error' | 'default';
  /**
   * 是否斜体
   */
  italic?: boolean;
  /**
   * 是否加粗
   */
  strong?: boolean;
  /**
   * 添加键盘样式
   */
  keyboard?: boolean;
  /**
   * 添加标记样式
   */
  mark?: boolean;
  /**
   * 子元素，同 content
   */
  children?: TNode;
  /**
   * 子元素
   */
  content?: TNode;
}

export interface TdTypographyTitleProps extends Omit<TdTypographyTextProps, 'ellipsis'> {
  /**
   * 标题等级，相当于 `h1`、`h2`、`h3`、`h4`、`h5`
   */
  level: number;
}

export type TdTypographyParagraphProps = Omit<TdTypographyTextProps, 'ellipsis'>

export type Ellipsis = {
  rows: number;
  expandable?: boolean;
  suffix?: string;
  symbol?: TNode;
  tooltip?: TNode;
  onExpand?: Function;
};

export type Copyable = {
  text: string;
  icon?: TNode[];
  tooltips?: TNode[];
  onCopy?: Function;
  format?: 'text/plain' | 'text/html';
};
