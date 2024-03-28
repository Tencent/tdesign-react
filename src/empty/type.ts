/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { ImageProps } from '../image';
import { TNode, TElement, Styles } from '../common';

export interface TdEmptyProps {
  /**
   * 操作区域
   */
  action?: TElement;
  /**
   * 描述文字
   */
  description?: TNode;
  /**
   * 组件图片，可以完全自定义内容。值类型为字符串时，表示图片地址；值类型为对象时，则表示透传全部属性到图片组件，示例：`<Empty image={{ src: '', shape: 'round' }} />`
   */
  image?: ImageProps | TNode;
  /**
   * 透传图片样式表
   */
  imageStyle?: Styles;
  /**
   * 错误标题
   */
  title?: TNode;
  /**
   * 组件类型，如：空数据/成功/失败/网络错误/建设中
   * @default empty
   */
  type?: 'empty' | 'success' | 'fail' | 'network-error' | 'maintenance';
  /**
   * 同 action
   */
  children?: TNode;
}
