/**
 * 状态订阅相关类型定义
 */

export interface StateSubscriptionOptions {
  /**
   * 初始状态
   */
  initialState?: any;
  /**
   * 指定要订阅的runId，如果不指定则订阅当前活跃的runId
   */
  runId?: string;
}

export interface UseStateSubscriptionReturn<T = any> {
  /**
   * 当前状态
   */
  state: T;
  /**
   * 当前runId
   */
  runId: string | null;
  /**
   * 状态是否正在更新中
   */
  updating: boolean;
  /**
   * 完整的状态Map（runId -> state），供调试使用
   */
  stateMap: Map<string, T>;
}

export interface StateManager {
  /**
   * 获取当前运行的runId
   */
  getCurrentRunId: () => string | null;
  /**
   * 获取当前状态（基于当前runId）
   */
  getCurrentState: () => any;
  /**
   * 获取指定runId的状态
   */
  getState: (runId: string) => any;
  /**
  /**
   * 订阅指定runId的状态变化
   */
  subscribe: (runId: string, callback: (state: any) => void) => () => void;
  /**
   * 订阅当前状态（自动使用currentRunId）
   */
  subscribeToCurrentState: (callback: (state: any, runId: string | null) => void) => () => void;
  /**
   * 处理AG-UI状态事件
   */
  handleStateEvent: (event: { type: string; snapshot?: any; delta?: any[]; runId?: string }) => void;
  /**
   * 清理所有状态和订阅
   */
  clear: () => void;
}
