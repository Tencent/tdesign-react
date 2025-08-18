import { useCallback, useRef, useEffect, useMemo } from 'react';
import type { AgentToolcallConfig } from '../components/toolcall/types';
import { agentToolcallRegistry } from '../components/toolcall/registry';

export interface UseAgentToolcallReturn {
  register: (config: AgentToolcallConfig | AgentToolcallConfig[]) => void;
  unregister: (names: string | string[]) => void;
  isRegistered: (name: string) => boolean;
  getRegistered: () => string[];
  config: any;
}

/**
 * 统一的、智能的 Agent Toolcall 适配器 Hook
 * 支持两种使用模式：
 * 1. 自动注册模式：传入配置，自动注册和清理
 * 2. 手动注册模式：不传配置或传入null，返回注册方法由业务控制
 */
export function useAgentToolcall<TArgs extends object = any, TResult = any, TResponse = any>(config?:
| AgentToolcallConfig<TArgs, TResult, TResponse>
| AgentToolcallConfig<TArgs, TResult, TResponse>[]
| null
| undefined): UseAgentToolcallReturn {
  const registeredNamesRef = useRef<Set<string>>(new Set());
  const autoRegisteredNamesRef = useRef<Set<string>>(new Set());
  const configRef = useRef(config);

  // 手动注册方法
  const register = useCallback((newConfig: AgentToolcallConfig | AgentToolcallConfig[]) => {
    if (!newConfig) {
      console.warn('[useAgentToolcall] 配置为空，跳过注册');
      return;
    }

    const configs = Array.isArray(newConfig) ? newConfig : [newConfig];

    configs.forEach((cfg) => {
      if (agentToolcallRegistry.get(cfg.name)) {
        console.warn(`[useAgentToolcall] 配置名称 "${cfg.name}" 已存在于注册表中，将被覆盖`);
      }

      console.log('====manual register', cfg.name);
      agentToolcallRegistry.register(cfg);
      registeredNamesRef.current.add(cfg.name);
    });
  }, []);

  // 手动取消注册方法
  const unregister = useCallback((names: string | string[]) => {
    const nameArray = Array.isArray(names) ? names : [names];

    nameArray.forEach((name) => {
      agentToolcallRegistry.unregister(name);
      registeredNamesRef.current.delete(name);
      autoRegisteredNamesRef.current.delete(name);
    });
  }, []);

  // 检查是否已注册
  const isRegistered = useCallback(
    (name: string) => registeredNamesRef.current.has(name) || autoRegisteredNamesRef.current.has(name),
    [],
  );

  // 获取所有已注册的配置名称
  const getRegistered = useCallback(
    () => Array.from(new Set([...registeredNamesRef.current, ...autoRegisteredNamesRef.current])),
    [],
  );

  // 自动注册逻辑（当传入配置时）
  useEffect(() => {
    if (!config) {
      return;
    }

    const configs = Array.isArray(config) ? config : [config];
    configs.forEach((cfg) => {
      if (agentToolcallRegistry.get(cfg.name)) {
        console.warn(`[useAgentToolcall] 配置名称 "${cfg.name}" 已存在于注册表中，将被覆盖`);
      }

      agentToolcallRegistry.register(cfg);
      autoRegisteredNamesRef.current.add(cfg.name);
    });

    // 清理函数：取消注册自动注册的配置
    return () => {
      configs.forEach((cfg) => {
        agentToolcallRegistry.unregister(cfg.name);
        autoRegisteredNamesRef.current.delete(cfg.name);
      });
    };
  }, [config]);

  // 更新配置引用
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  return {
    register,
    unregister,
    isRegistered,
    getRegistered,
    config: configRef.current,
  };
}
