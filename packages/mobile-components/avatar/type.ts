/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import { BadgeProps } from '../badge';
import { ImageProps } from '../image';
import type { TNode, TElement, ShapeEnum } from '../common';
import type { MouseEvent } from 'react';

export interface TdAvatarProps {
  /**
   * 头像替换文本，仅当图片加载失败时有效
   * @default ''
   */
  alt?: string;
  /**
   * 头像右上角提示信息，继承 Badge 组件的全部特性。如：小红点，或者数字
   */
  badgeProps?: BadgeProps;
  /**
   * 子元素内容，同 content
   */
  children?: TNode;
  /**
   * 加载失败时隐藏图片
   * @default false
   */
  hideOnLoadFailed?: boolean;
  /**
   * 图标
   */
  icon?: TElement;
  /**
   * 图片地址
   * @default ''
   */
  image?: string;
  /**
   * 透传至 Image 组件
   */
  imageProps?: ImageProps;
  /**
   * 形状。优先级高于 AvatarGroup.shape 。Avatar 单独存在时，默认值为 circle。如果父组件 AvatarGroup 存在，默认值便由 AvatarGroup.shape 决定
   */
  shape?: ShapeEnum;
  /**
   * 尺寸，示例值：small/medium/large/24px/38px 等。优先级高于 AvatarGroup.size 。Avatar 单独存在时，默认值为 medium。如果父组件 AvatarGroup 存在，默认值便由 AvatarGroup.size 决定
   * @default ''
   */
  size?: string;
  /**
   * 图片加载失败时触发
   */
  onError?: (context: { e: Event }) => void;
}

export interface TdAvatarGroupProps {
  /**
   * 图片之间的层叠关系，可选值：左侧图片在上和右侧图片在上
   * @default 'right-up'
   */
  cascading?: CascadingValue;
  /**
   * 头像数量超出时，会出现一个头像折叠元素。该元素内容可自定义。默认为 `+N`。示例：`+5`，`...`, `更多`
   */
  collapseAvatar?: TNode;
  /**
   * 能够同时显示的最多头像数量
   */
  max?: number;
  /**
   * 形状。优先级低于 Avatar.shape
   */
  shape?: ShapeEnum;
  /**
   * 尺寸，示例值：small/medium/large/24px/38px 等。优先级低于 Avatar.size
   * @default ''
   */
  size?: string;
  /**
   * 点击头像折叠元素触发
   */
  onCollapsedItemClick?: (context: { e: MouseEvent<HTMLSpanElement> }) => void;
}

export type CascadingValue = 'left-up' | 'right-up';
