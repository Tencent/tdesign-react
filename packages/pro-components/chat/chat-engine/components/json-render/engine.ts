/**
 * json-render 引擎封装
 * 提供高性能的增量渲染能力
 */

import type { UIElement } from '@json-render/core';
import type { ComponentRegistry } from './renderer';
import type { JsonRenderSchema, DeltaInfo } from './types';

/**
 * json-render 引擎管理器
 * 负责 Schema 缓存、增量更新和性能优化
 */
export class JsonRenderEngine {
  private currentSchema: JsonRenderSchema | null = null;
  private registry: ComponentRegistry;

  constructor(registry: ComponentRegistry) {
    this.registry = registry;
  }

  /**
   * 全量渲染
   * 用于 ACTIVITY_SNAPSHOT 事件
   */
  setSchema(schema: JsonRenderSchema): void {
    this.currentSchema = schema;
  }

  /**
   * 获取当前 Schema
   */
  getSchema(): JsonRenderSchema | null {
    return this.currentSchema;
  }

  /**
   * 增量更新
   * 用于 ACTIVITY_DELTA 事件
   * 
   * @param newSchema 应用 JSON Patch 后的完整 Schema
   * @param deltaInfo 增量信息（可选，用于进一步优化）
   */
  patchSchema(newSchema: JsonRenderSchema, deltaInfo?: DeltaInfo): void {
    if (!this.currentSchema) {
      // 如果没有初始 Schema，直接设置
      this.currentSchema = newSchema;
      return;
    }

    // 更新 Schema（json-render 的 Renderer 会自动处理 diff）
    this.currentSchema = newSchema;

    // 如果有 deltaInfo，可以在这里做进一步优化
    if (deltaInfo) {
      console.debug('[json-render] 增量更新范围:', deltaInfo);
      // 未来可以基于 deltaInfo 实现更细粒度的优化
    }
  }

  /**
   * 重置引擎状态
   */
  reset(): void {
    this.currentSchema = null;
  }

  /**
   * 获取组件注册表
   */
  getRegistry(): ComponentRegistry {
    return this.registry;
  }

  /**
   * 更新组件注册表
   */
  updateRegistry(registry: ComponentRegistry): void {
    this.registry = { ...this.registry, ...registry };
  }

  /**
   * 验证 Schema 是否有效
   */
  validateSchema(schema: JsonRenderSchema): boolean {
    if (!schema || !schema.root || !schema.elements) {
      console.error('[json-render] Schema 验证失败：缺少 root 或 elements');
      return false;
    }

    const rootElement = schema.elements[schema.root];
    if (!rootElement) {
      console.error('[json-render] Schema 验证失败：root 元素不存在');
      return false;
    }

    return true;
  }

  /**
   * 提取增量元素（基于 deltaInfo）
   * 用于性能优化场景
   */
  extractDeltaElements(schema: JsonRenderSchema, deltaInfo: DeltaInfo): Record<string, UIElement> {
    const elementKeys = Object.keys(schema.elements);
    const deltaKeys = elementKeys.slice(deltaInfo.fromIndex, deltaInfo.toIndex);
    
    const deltaElements: Record<string, UIElement> = {};
    deltaKeys.forEach((key) => {
      deltaElements[key] = schema.elements[key];
    });
    
    return deltaElements;
  }
}

/**
 * 创建 json-render 引擎实例
 */
export function createJsonRenderEngine(registry: ComponentRegistry): JsonRenderEngine {
  return new JsonRenderEngine(registry);
}
