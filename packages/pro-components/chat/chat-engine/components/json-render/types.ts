/**
 * json-render 集成相关类型定义
 */

import { type ComponentType, type ReactNode } from "react";
import type {
  UIElement,
  UITree,
  Action,
} from "@json-render/core";
import { type JsonRenderSchema } from '../../core';

/**
 * Props passed to component renderers
 */
export interface ComponentRenderProps<P = Record<string, unknown>> {
  /** The element being rendered */
  element: UIElement<string, P>;
  /** Rendered children */
  children?: ReactNode;
  /** Execute an action */
  onAction?: (action: Action) => void;
  /** Whether the parent is loading */
  loading?: boolean;
}

/**
 * Component renderer type
 */
export type ComponentRenderer<P = Record<string, unknown>> = ComponentType<
  ComponentRenderProps<P>
>;

/**
 * Registry of component renderers
 */
export type ComponentRegistry = Record<string, ComponentRenderer<any>>;

/**
 * Props for the Renderer component
 */
export interface RendererProps {
  /** The UI tree to render */
  tree: UITree | null;
  /** Component registry */
  registry: ComponentRegistry;
  /** Whether the tree is currently loading/streaming */
  loading?: boolean;
  /** Fallback component for unknown types */
  fallback?: ComponentRenderer;
}


/**
 * json-render Activity 内容格式
 * 用于 ACTIVITY_SNAPSHOT 和 ACTIVITY_DELTA 事件
 */
// export interface JsonRenderSchema extends UITree {
//   // json-render 标准 UITree 结构
//   root: string;
//   elements: Record<string, UIElement>;
//   // 可选的数据模型
//   data?: Record<string, unknown>;
// }

/**
 * 组件目录（Catalog）定义
 * 映射组件类型到 React 组件实现
 * 使用 @json-render/react 的 ComponentRegistry 类型
 */
export type ComponentCatalog = ComponentRegistry;

/**
 * 渲染上下文配置
 */
export interface JsonRenderContext {
  /** 渲染模式：direct（直接模式） | adapter（适配模式） */
  mode: 'direct' | 'adapter';
  /** 组件目录 */
  catalog: ComponentCatalog;
  /** 可选：自定义数据 */
  customData?: Record<string, unknown>;
}

/**
 * 增量更新信息
 * 从 event-mapper 的 deltaInfo 传递过来
 */
export interface DeltaInfo {
  /** 新增元素的起始索引 */
  fromIndex: number;
  /** 新增元素的结束索引 */
  toIndex: number;
}

/**
 * json-render Activity 渲染器 Props
 */
export interface JsonRenderActivityProps {
  /** Activity 类型 */
  activityType: string;
  /** json-render Schema 内容 */
  content: JsonRenderSchema;
  /** 关联的消息 ID */
  messageId: string;
  /** 扩展属性（包含 deltaInfo） */
  ext?: {
    deltaInfo?: DeltaInfo;
    [key: string]: any;
  };
}
