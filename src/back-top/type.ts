/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { TNode } from '../common';

export interface TdBackTopProps {
  /**
   * 是否绝对定位固定到屏幕右下方
   * @default true
   */
  fixed?: boolean;
  /**
   * 图标
   * @default 'backtop'
   */
  icon?: TNode;
  /**
   * 定位滚动到指定对象
   * @default () => window
   */
  target?: () => HTMLElement;
  /**
   * 文案
   * @default ''
   */
  text?: string;
  /**
   * 预设的样式类型
   * @default round
   */
  theme?: 'default' | 'primary' | 'dark';

  /**
   *  组件的形状
   */
  shape?: 'square' | 'circle';

  /**
   * 组件的大小
   */
  size?: 'small' | 'medium';
}
