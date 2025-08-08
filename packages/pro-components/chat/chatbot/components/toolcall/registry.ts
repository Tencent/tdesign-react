import type { AgentToolcallConfig, AgentToolcallRegistry } from './types';

/**
 * 全局 Agent Toolcall 注册表
 */
class AgentToolcallRegistryManager {
  private registry: AgentToolcallRegistry = {};

  /**
   * 注册一个 Agent Toolcall
   */
  register<TArgs extends object = any, TResult = any, TResponse = any>(config: AgentToolcallConfig<TArgs, TResult, TResponse>): void {
    this.registry[config.name] = config;
  }

  /**
   * 获取指定名称的 Agent Toolcall 配置
   */
  get(name: string): AgentToolcallConfig | undefined {
    return this.registry[name];
  }

  /**
   * 获取所有已注册的 Agent Toolcall
   */
  getAll(): AgentToolcallRegistry {
    return { ...this.registry };
  }

  /**
   * 取消注册指定的 Agent Toolcall
   */
  unregister(name: string): void {
    delete this.registry[name];
  }

  /**
   * 清空所有注册的 Agent Toolcall
   */
  clear(): void {
    this.registry = {};
  }
}

// 导出单例实例
export const agentToolcallRegistry = new AgentToolcallRegistryManager();
