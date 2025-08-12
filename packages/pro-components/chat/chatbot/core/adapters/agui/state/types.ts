/**
 * 状态订阅相关类型定义
 */

export interface StateActionOptions {
  /**
   * 初始状态
   */
  initialState?: Record<string, any>;
}

export interface UseStateActionReturn {
  /**
   * 当前状态
   */
  state: Record<string, any>;
  /**
   * 当前状态key
   */
  stateKey: string | null;
  /**
   * 状态是否正在更新中
   */
  updating: boolean;
  /**
   * 设置状态Map，用于加载历史对话消息中的state数据
   */
  setStateMap: (stateMap: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
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
   * 获取所有状态keys
   */
  getAllStateKeys: () => string[];
  /**
   * 订阅状态变化
   * @param callback 状态变化回调函数
   * @param targetStateKey 可选：指定订阅特定的stateKey，不传则订阅当前活跃状态
   */
  subscribe: (callback: (state: any, stateKey: string) => void, targetStateKey?: string) => () => void;
  /**
   * 处理AG-UI状态事件，自动从事件中提取stateKey
   */
  handleStateEvent: (event: { type: string; snapshot?: any; delta?: any[] }) => void;
  /**
   * 清理所有状态和订阅
   */
  clear: () => void;
}
