/**
 * json-render 性能监控和优化工具（框架无关）
 */

import type { PerformanceMetrics, PerformanceThresholds } from '../adapters/json-render/types/core';

/**
 * 性能监控器
 * 框架无关，可在任何 JavaScript 环境中使用
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetricsCount = 100; // 最多保留 100 条记录

  /**
   * 开始性能测量
   */
  start(): (elementCount: number, deltaInfo?: { fromIndex: number; toIndex: number }) => PerformanceMetrics {
    const startTime = performance.now();
    
    return (
      elementCount: number,
    ): PerformanceMetrics => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      const metric: PerformanceMetrics = {
        renderTime,
        updateTime: 0, // 这里只测量渲染时间，更新时间由调用方设置
        memoryUsage: this.getMemoryUsage(),
        componentCount: elementCount,
        timestamp: Date.now(),
      };

      this.addMetric(metric);
      return metric;
    };
  }

  /**
   * 测量更新性能
   */
  measureUpdate<T>(fn: () => T): { result: T; metric: PerformanceMetrics } {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const updateTime = endTime - startTime;

    const metric: PerformanceMetrics = {
      renderTime: 0,
      updateTime,
      memoryUsage: this.getMemoryUsage(),
      componentCount: 0, // 更新操作不涉及组件数量
      timestamp: Date.now(),
    };

    this.addMetric(metric);
    return { result, metric };
  }

  /**
   * 获取内存使用情况（MB）
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      // @ts-ignore - performance.memory 在某些环境中可用
      return (performance.memory?.usedJSHeapSize || 0) / 1024 / 1024;
    }
    return 0;
  }

  /**
   * 添加性能指标
   */
  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // 限制记录数量
    if (this.metrics.length > this.maxMetricsCount) {
      this.metrics.shift();
    }
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * 获取平均渲染时间
   */
  getAverageRenderTime(): number {
    const renderMetrics = this.metrics.filter(m => m.renderTime > 0);
    if (renderMetrics.length === 0) return 0;

    const totalTime = renderMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    return totalTime / renderMetrics.length;
  }

  /**
   * 获取平均更新时间
   */
  getAverageUpdateTime(): number {
    const updateMetrics = this.metrics.filter(m => m.updateTime > 0);
    if (updateMetrics.length === 0) return 0;

    const totalTime = updateMetrics.reduce((sum, m) => sum + m.updateTime, 0);
    return totalTime / updateMetrics.length;
  }

  /**
   * 获取最近 N 次操作的平均时间
   */
  getRecentAverageTime(count: number = 10, type: 'render' | 'update' = 'render'): number {
    const recentMetrics = this.metrics.slice(-count);
    if (recentMetrics.length === 0) return 0;

    const timeField = type === 'render' ? 'renderTime' : 'updateTime';
    const validMetrics = recentMetrics.filter(m => m[timeField] > 0);
    if (validMetrics.length === 0) return 0;

    const totalTime = validMetrics.reduce((sum, m) => sum + m[timeField], 0);
    return totalTime / validMetrics.length;
  }

  /**
   * 获取性能统计摘要
   */
  getSummary() {
    const renderMetrics = this.metrics.filter(m => m.renderTime > 0);
    const updateMetrics = this.metrics.filter(m => m.updateTime > 0);

    return {
      totalOperations: this.metrics.length,
      renderOperations: renderMetrics.length,
      updateOperations: updateMetrics.length,
      avgRenderTime: this.getAverageRenderTime(),
      avgUpdateTime: this.getAverageUpdateTime(),
      recentAvgRenderTime: this.getRecentAverageTime(10, 'render'),
      recentAvgUpdateTime: this.getRecentAverageTime(10, 'update'),
      avgMemoryUsage: this.getAverageMemoryUsage(),
    };
  }

  /**
   * 获取平均内存使用
   */
  private getAverageMemoryUsage(): number {
    if (this.metrics.length === 0) return 0;
    const totalMemory = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0);
    return totalMemory / this.metrics.length;
  }

  /**
   * 重置所有指标
   */
  reset(): void {
    this.metrics = [];
  }

  /**
   * 打印性能摘要
   */
  printSummary(): void {
    const summary = this.getSummary();
    console.log('[json-render Performance Summary]', {
      '总操作次数': summary.totalOperations,
      '渲染操作': summary.renderOperations,
      '更新操作': summary.updateOperations,
      '平均渲染时间(ms)': summary.avgRenderTime.toFixed(2),
      '平均更新时间(ms)': summary.avgUpdateTime.toFixed(2),
      '最近10次渲染时间(ms)': summary.recentAvgRenderTime.toFixed(2),
      '最近10次更新时间(ms)': summary.recentAvgUpdateTime.toFixed(2),
      '平均内存使用(MB)': summary.avgMemoryUsage.toFixed(2),
    });
  }
}

/**
 * 全局性能监控实例
 */
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * 性能警告阈值（ms）
 */
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  renderTime: 50, // 渲染超过 50ms 发出警告
  updateTime: 16, // 更新超过 16ms 发出警告（1帧）
  memoryUsage: 100, // 内存使用超过 100MB 发出警告
};

/**
 * 检查性能并发出警告
 */
export function checkPerformance(metric: PerformanceMetrics, thresholds: PerformanceThresholds = PERFORMANCE_THRESHOLDS): void {
  if (metric.renderTime > thresholds.renderTime) {
    console.warn(
      `[json-render Performance Warning] 渲染耗时 ${metric.renderTime.toFixed(2)}ms，超过阈值 ${thresholds.renderTime}ms`,
      {
        componentCount: metric.componentCount,
        memoryUsage: metric.memoryUsage.toFixed(2) + 'MB',
      },
    );
  }

  if (metric.updateTime > thresholds.updateTime) {
    console.warn(
      `[json-render Performance Warning] 更新耗时 ${metric.updateTime.toFixed(2)}ms，超过阈值 ${thresholds.updateTime}ms`,
      {
        componentCount: metric.componentCount,
        memoryUsage: metric.memoryUsage.toFixed(2) + 'MB',
      },
    );
  }

  if (metric.memoryUsage > thresholds.memoryUsage) {
    console.warn(
      `[json-render Performance Warning] 内存使用 ${metric.memoryUsage.toFixed(2)}MB，超过阈值 ${thresholds.memoryUsage}MB`,
      {
        componentCount: metric.componentCount,
      },
    );
  }
}

export default {
  PerformanceMonitor,
  globalPerformanceMonitor,
  checkPerformance,
  PERFORMANCE_THRESHOLDS,
};