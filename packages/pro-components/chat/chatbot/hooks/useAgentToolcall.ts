import { useEffect, useRef } from 'react';
import type { AgentToolcallConfig } from '../components/toolcall/types';
import { agentToolcallRegistry } from '../components/toolcall/registry';

/**
 * 统一的、智能的 Agent Toolcall 适配器 Hook
 * 用于注册 Agent Toolcall 配置到全局注册表
 */
export function useAgentToolcall<TArgs extends object = any, TResult = any, TResponse = any>(
  config: AgentToolcallConfig<TArgs, TResult, TResponse>,
) {
  const configRef = useRef(config);

  useEffect(() => {
    // 注册 Agent Toolcall
    agentToolcallRegistry.register(config);

    // 清理函数：组件卸载时取消注册
    return () => {
      agentToolcallRegistry.unregister(config.name);
    };
  }, [config.name]);

  // 更新配置引用
  useEffect(() => {
    configRef.current = config;
    agentToolcallRegistry.register(config);
  }, [config]);

  return configRef.current;
}
