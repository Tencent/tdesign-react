/**
 * json-render 性能监控和优化工具
 */

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  /** 渲染类型 */
  type: 'snapshot' | 'delta';
  /** 渲染开始时间 */
  startTime: number;
  /** 渲染结束时间 */
  endTime: number;
  /** 渲染耗时（ms） */
  duration: number;
  /** Schema 元素数量 */
  elementCount: number;
  /** 增量信息（仅 delta 类型） */
  deltaInfo?: {
    fromIndex: number;
    toIndex: number;
    newElementsCount: number;
  };
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetricsCount = 100; // 最多保留 100 条记录

  /**
   * 开始性能测量
   */
  start(): () => PerformanceMetrics {
    const startTime = performance.now();
    
    return (
      type: 'snapshot' | 'delta',
      elementCount: number,
      deltaInfo?: { fromIndex: number; toIndex: number },
    ): PerformanceMetrics => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const metric: PerformanceMetrics = {
        type,
        startTime,
        endTime,
        duration,
        elementCount,
        deltaInfo: deltaInfo
          ? {
              fromIndex: deltaInfo.fromIndex,
              toIndex: deltaInfo.toIndex,
              newElementsCount: deltaInfo.toIndex - deltaInfo.fromIndex,
            }
          : undefined,
      };

      this.addMetric(metric);
      return metric;
    };
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
  getAverageDuration(type?: 'snapshot' | 'delta'): number {
    const filteredMetrics = type
      ? this.metrics.filter((m) => m.type === type)
      : this.metrics;

    if (filteredMetrics.length === 0) return 0;

    const totalDuration = filteredMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / filteredMetrics.length;
  }

  /**
   * 获取最近 N 次渲染的平均时间
   */
  getRecentAverageDuration(count: number = 10): number {
    const recentMetrics = this.metrics.slice(-count);
    if (recentMetrics.length === 0) return 0;

    const totalDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / recentMetrics.length;
  }

  /**
   * 获取性能统计摘要
   */
  getSummary() {
    return {
      totalRenders: this.metrics.length,
      snapshotRenders: this.metrics.filter((m) => m.type === 'snapshot').length,
      deltaRenders: this.metrics.filter((m) => m.type === 'delta').length,
      avgSnapshotDuration: this.getAverageDuration('snapshot'),
      avgDeltaDuration: this.getAverageDuration('delta'),
      recentAvgDuration: this.getRecentAverageDuration(),
    };
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
      '总渲染次数': summary.totalRenders,
      '快照渲染': summary.snapshotRenders,
      '增量渲染': summary.deltaRenders,
      '快照平均耗时(ms)': summary.avgSnapshotDuration.toFixed(2),
      '增量平均耗时(ms)': summary.avgDeltaDuration.toFixed(2),
      '最近10次平均耗时(ms)': summary.recentAvgDuration.toFixed(2),
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
export const PERFORMANCE_THRESHOLDS = {
  snapshot: 50, // 快照渲染超过 50ms 发出警告
  delta: 16, // 增量渲染超过 16ms 发出警告（1帧）
};

/**
 * 检查性能并发出警告
 */
export function checkPerformance(metric: PerformanceMetrics): void {
  const threshold = PERFORMANCE_THRESHOLDS[metric.type];
  
  if (metric.duration > threshold) {
    console.warn(
      `[json-render Performance Warning] ${metric.type} 渲染耗时 ${metric.duration.toFixed(2)}ms，超过阈值 ${threshold}ms`,
      {
        elementCount: metric.elementCount,
        deltaInfo: metric.deltaInfo,
      },
    );
  }
}

export default {
  PerformanceMonitor,
  globalPerformanceMonitor,
  checkPerformance,
};
