/**
 * json-render 核心类型定义（框架无关）
 */

import type { UITree, UIElement } from '@json-render/core';

/**
 * json-render Activity 内容格式
 * 用于 ACTIVITY_SNAPSHOT 和 ACTIVITY_DELTA 事件
 */
export interface JsonRenderSchema extends UITree {
  // json-render 标准 UITree 结构
  root: string;
  elements: Record<string, UIElement>;
  // 可选的数据模型
  data?: Record<string, unknown>;
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
 * 性能监控阈值配置
 */
export interface PerformanceThresholds {
  /** 渲染时间阈值（毫秒） */
  renderTime: number;
  /** 更新时间阈值（毫秒） */
  updateTime: number;
  /** 内存使用阈值（MB） */
  memoryUsage: number;
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  /** 渲染时间（毫秒） */
  renderTime: number;
  /** 更新时间（毫秒） */
  updateTime: number;
  /** 内存使用（MB） */
  memoryUsage: number;
  /** 组件数量 */
  componentCount: number;
  /** 时间戳 */
  timestamp: number;
}