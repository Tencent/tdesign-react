/** React 特有全局类型 */

import { ReactElement, ReactNode, CSSProperties, FormEvent } from 'react';

// TElement 表示 API 只接受传入组件
export type TElement = ReactElement | (() => ReactElement);
// 1. TNode = ReactNode; 2. TNode<T> = (props: T) => ReactNode
export type TNode<T = undefined> = T extends undefined ? ReactNode : (props: T) => ReactNode;

export type AttachNodeReturnValue = HTMLElement | Element | Document;
export type AttachNode = CSSSelector | ((triggerNode?: HTMLElement) => AttachNodeReturnValue);

// 与滚动相关的容器类型，因为 document 上没有 scroll 相关属性, 因此排除 document
export type ScrollContainerElement = Window | HTMLElement;
export type ScrollContainer = (() => ScrollContainerElement) | CSSSelector;

export type FormResetEvent = FormEvent<HTMLFormElement>;
export type FormSubmitEvent = FormEvent<HTMLFormElement>;

// 组件 TS 类型，暂定 any，可能调整为 () => JSX.Element
export type ComponentType = any;

export type Styles = CSSProperties;

export interface StyledProps {
  className?: string;
  style?: CSSProperties;
}
/** 通用全局类型 */

export type OptionData = {
  label?: string;
  value?: string | number;
} & { [key: string]: any };

export type TreeOptionData = {
  children?: Array<TreeOptionData>;
} & OptionData;

export type SizeEnum = 'small' | 'medium' | 'large';

export type HorizontalAlignEnum = 'left' | 'center' | 'right';

export type VerticalAlignEnum = 'top' | 'middle' | 'bottom';

export type ClassName = { [className: string]: any } | ClassName[] | string;

export type CSSSelector = string;

export interface KeysType {
  value?: string;
  label?: string;
}

export interface HTMLElementAttributes {
  [css: string]: string;
}
