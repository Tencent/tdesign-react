/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode } from '../common';

export interface TdResultProps {
  /**
   * 描述文字
   */
  description?: TNode;
  /**
   * 图片地址
   */
  image?: TNode;
  /**
   * 内置主题
   * @default default
   */
  theme?: 'default' | 'success' | 'warning' | 'error';
  /**
   * 标题
   * @default ''
   */
  title?: TNode;
}
