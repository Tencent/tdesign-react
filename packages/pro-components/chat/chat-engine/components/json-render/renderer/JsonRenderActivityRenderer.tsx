/**
 * json-render Activity 渲染器
 * 基于 TDesign ChatEngine 的 Activity 机制集成 json-render
 * 
 * 核心特性：
 * 1. 支持 ACTIVITY_SNAPSHOT 全量渲染
 * 2. 支持 ACTIVITY_DELTA 增量更新（Delta Merge 由数据层完成，此处接收完整 Schema）
 * 3. 使用 React.memo + react-fast-compare 优化渲染性能
 * 
 */

import React, { useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { JsonRenderElement } from './JsonUIRenderer';
import { DataProvider, ActionProvider, VisibilityProvider } from '../contexts';
import type { JsonRenderActivityProps, ComponentRegistry } from '../types';

export interface JsonRenderActivityRendererProps extends JsonRenderActivityProps {
  /** 组件注册表（必须） */
  registry: ComponentRegistry;
  /** 
   * Action 处理器映射表
   * 
   * 示例：
   * ```tsx
   * const actionHandlers = {
   *   submit: async (params) => { ... },
   *   reset: async (params) => { ... },
   *   cancel: async (params) => { ... },
   * };
   * ```
   */
  actionHandlers?: Record<string, (params: Record<string, unknown>) => void | Promise<void>>;
  /** 显示调试信息 */
  debug?: boolean;
}

/**
 * json-render Activity 渲染器组件
 */
const JsonRenderActivityRendererInner: React.FC<JsonRenderActivityRendererProps> = ({
  activityType,
  content,
  messageId,
  registry,
  actionHandlers = {},
}) => {
  // 直接在渲染阶段做校验
  const isValidSchema = content && content.root && content.elements && content.elements[content.root];

  // 数据处理：使用 useMemo 缓存，只在 content.data 变化时重新计算
  const renderData = useMemo(() => content?.data || {}, [content?.data]);

  // todo: Schema 无效时显示加载状态
  // if (!isValidSchema) {
  //   return (
  //     <div style={{ padding: '16px', color: 'var(--td-text-color-secondary)' }}>
  //       数据初始化中...
  //     </div>
  //   );
  // }
  return (
    <div data-activity-type={activityType} data-message-id={messageId}>
      <DataProvider initialData={renderData}>
        <VisibilityProvider>
          <ActionProvider handlers={actionHandlers}>
            <JsonRenderElement tree={content} registry={registry} />
          </ActionProvider>
        </VisibilityProvider>
      </DataProvider>
    </div>
  );
};

/**
 * 使用 React.memo 包装，配合 react-fast-compare 进行高效的深比较
 * 
 * 对比策略：
 * 1. registry 引用比较（通常是稳定的）
 * 2. actionHandlers 引用比较（建议使用 useMemo 稳定化）
 * 3. content 使用 react-fast-compare 深比较（比 JSON.stringify 快 3-5 倍）
 */
export const JsonRenderActivityRenderer = React.memo(
  JsonRenderActivityRendererInner,
  (prevProps, nextProps) => {
    // registry 变化必须重渲染
    if (prevProps.registry !== nextProps.registry) return false;
    
    // actionHandlers 变化必须重渲染
    if (prevProps.actionHandlers !== nextProps.actionHandlers) return false;

    // content 引用相同，跳过渲染
    if (prevProps.content === nextProps.content) return true;

    // 使用 react-fast-compare 进行高效深比较
    // 比 JSON.stringify 快 3-5 倍，且能正确处理循环引用
    return isEqual(prevProps.content, nextProps.content);
  },
);

/**
 * 默认导出
 */
export default JsonRenderActivityRenderer;
