/**
 * 状态订阅相关类型定义
 */

export interface StateActionOptions {
  /**
   * 初始状态
   */
  initialState?: any;
  /**
   * 指定要订阅的状态key，如果不指定则订阅当前活跃的状态key
   * 不同Agent可以根据业务需求使用不同的key策略
   */
  stateKey?: string;
}

export interface UseStateActionReturn<T = any> {
  /**
   * 当前状态
   */
  state: T;
  /**
   * 当前状态key
   */
  stateKey: string | null;
  /**
   * 状态是否正在更新中
   */
  updating: boolean;
  /**
   * 完整的状态Map（stateKey -> state），供调试使用
   */
  stateMap: Map<string, T>;
}

export interface StateManager {
  /**
   * 获取当前活跃的状态key
   */
  getCurrentStateKey: () => string | null;
  /**
   * 获取当前状态（基于当前状态key）
   */
  getCurrentState: () => any;
  /**
   * 获取指定状态key的状态
   */
  getState: (stateKey: string) => any;
  /**
   * 订阅指定状态key的状态变化
   */
  subscribe: (stateKey: string, callback: (state: any) => void) => () => void;
  /**
   * 订阅当前状态（自动使用当前状态key）
   */
  subscribeToCurrentState: (callback: (state: any, stateKey: string | null) => void) => () => void;
  /**
   * 处理AG-UI状态事件
   */
  handleStateEvent: (event: { type: string; snapshot?: any; delta?: any[]; stateKey?: string }) => void;
  /**
   * 清理所有状态和订阅
   */
  clear: () => void;
}
