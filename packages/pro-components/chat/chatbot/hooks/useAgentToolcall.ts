import { useEffect, useRef } from 'react';
import type { AgentToolcallConfig } from '../components/toolcall/types';
import { agentToolcallRegistry } from '../components/toolcall/registry';

/**
 * 统一的、智能的 Agent Toolcall 适配器 Hook
 * 用于注册 Agent Toolcall 配置到全局注册表
 * 支持单个配置、配置数组，以及异步获取的配置（null/undefined 时不注册）
 */
export function useAgentToolcall<TArgs extends object = any, TResult = any, TResponse = any>(
  config:
    | AgentToolcallConfig<TArgs, TResult, TResponse>
    | AgentToolcallConfig<TArgs, TResult, TResponse>[]
    | null
    | undefined,
) {
  const configRef = useRef(config);

  useEffect(() => {
    // 如果 config 为空，跳过注册
    if (!config) {
      return;
    }

    // 标准化配置为数组格式
    const configs = Array.isArray(config) ? config : [config];

    // 注册所有配置
    configs.forEach((cfg) => {
      // 检测是否与已注册的配置重名
      if (agentToolcallRegistry.get(cfg.name)) {
        console.warn(`[useAgentToolcall] 配置名称 "${cfg.name}" 已存在于注册表中，将被覆盖`);
      }
      agentToolcallRegistry.register(cfg);
    });

    // 清理函数：组件卸载时取消注册所有配置
    return () => {
      configs.forEach((cfg) => {
        agentToolcallRegistry.unregister(cfg.name);
      });
    };
  }, [config]); // 直接监听整个 config 对象

  // 更新配置引用
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  return configRef.current;
}
