import React from 'react';
import type { ActivityConfig, ActivityRegistry, ActivityComponentProps } from './types';

/**
 * Activity 注册表管理器
 * 参考 AgentToolcallRegistryManager 的设计，但简化了复杂的状态管理
 */
class ActivityRegistryManager {
  private registry: ActivityRegistry = {};

  // 组件渲染函数缓存，避免重复创建 React 组件
  private renderFunctionCache = new Map<
    string,
    React.MemoExoticComponent<React.ComponentType<ActivityComponentProps>>
  >();

  /**
   * 注册一个 Activity 配置
   */
  register<TContent = any>(config: ActivityConfig<TContent>): void {
    const existingConfig = this.registry[config.activityType];

    // 如果组件发生变化，清除旧的缓存
    if (existingConfig && existingConfig.component !== config.component) {
      this.renderFunctionCache.delete(config.activityType);
    }

    this.registry[config.activityType] = config;

    // 触发注册事件，支持动态注册
    window.dispatchEvent(
      new CustomEvent('activity-registered', {
        detail: { activityType: config.activityType },
      }),
    );
  }

  /**
   * 获取指定类型的 Activity 配置
   */
  get(activityType: string): ActivityConfig | undefined {
    return this.registry[activityType];
  }

  /**
   * 获取或创建缓存的组件渲染函数
   */
  getRenderFunction(activityType: string): React.MemoExoticComponent<React.ComponentType<ActivityComponentProps>> | null {
    const config = this.registry[activityType];
    if (!config) return null;

    // 检查缓存
    let memoizedComponent = this.renderFunctionCache.get(activityType);

    if (!memoizedComponent) {
      // 创建 memo 化的组件
      memoizedComponent = React.memo((props: ActivityComponentProps) => 
        React.createElement(config.component, props)
      );

      // 缓存组件
      this.renderFunctionCache.set(activityType, memoizedComponent);
    }

    return memoizedComponent;
  }

  /**
   * 获取所有已注册的 Activity 配置
   */
  getAll(): ActivityRegistry {
    return { ...this.registry };
  }

  /**
   * 取消注册指定的 Activity
   */
  unregister(activityType: string): void {
    delete this.registry[activityType];
    this.renderFunctionCache.delete(activityType);
  }

  /**
   * 清空所有注册的 Activity
   */
  clear(): void {
    this.registry = {};
    this.renderFunctionCache.clear();
  }

  /**
   * 检查指定类型是否已注册
   */
  has(activityType: string): boolean {
    return activityType in this.registry;
  }

  /**
   * 获取所有已注册的 Activity 类型
   */
  getRegisteredTypes(): string[] {
    return Object.keys(this.registry);
  }
}

// 导出单例实例
export const activityRegistry = new ActivityRegistryManager();