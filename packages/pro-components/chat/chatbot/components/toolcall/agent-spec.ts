/**
 * 智能体组件的标准 Props 接口
 */
export interface AgentComponentProps<TArgs extends object = any, TResult = any, TResponse = any> {
  /** 组件的当前渲染状态 */
  status: 'idle' | 'inProgress' | 'executing' | 'complete' | 'error';
  /** Agent 调用时传入的初始参数 */
  args: TArgs;
  /** 当 status 为 'complete' 时，包含 Action 的最终执行结果 */
  result?: TResult;
  /** 当 status 为 'error' 时，包含错误信息 */
  error?: Error;
  /**
   * 【交互核心】一个回调函数，用于将用户的交互结果返回给宿主环境。
   * 仅在交互式场景下由宿主提供。
   */
  respond?: (response: TResponse) => void;
}

/**
 * 智能体参数定义
 */
export interface AgentParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  enum?: string[];
  properties?: AgentParameter[];
}

/**
 * 智能体动作配置
 *
 * 使用场景：
 * 1. 只有 component：后端完全受控的前端渲染组件
 * 2. handler + component：非交互式，handler 作为数据后处理器
 * 3. component + respond：交互式，respond 在组件内部通过 props 提供
 */
export interface AgentActionConfig<TArgs extends object = any, TResult = any, TResponse = any> {
  name: string;
  description: string;
  parameters: AgentParameter[];
  /** 渲染组件 */
  component: React.FC<AgentComponentProps<TArgs, TResult, TResponse>>;
  /** 可选的数据后处理器，接收 (args, backendResult) 参数 */
  handler?: (args: TArgs, backendResult?: any) => Promise<TResult>;
}

/**
 * 动作执行状态
 */
export type ActionStatus = 'idle' | 'inProgress' | 'executing' | 'complete' | 'error';

/**
 * 动作执行上下文
 */
export interface ActionContext {
  messageId: string;
  actionId: string;
  timestamp: number;
}
