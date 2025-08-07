import React from 'react';
import type { ToolCallContent, ToolCall } from '../../core/type';
import type { AgentComponentProps, AgentActionConfig } from './agent-spec';

/**
 * 简化的 ToolCall 智能体适配器
 * 参考 CopilotKit 的 useCopilotAction 设计
 */

/**
 * 响应处理器类型
 */
type ResponseHandler<TResponse = any, TResult = any> = (
  response: TResponse,
) => TResult | Promise<TResult> | void | Promise<void>;

/**
 * 交互式组件状态管理
 */
interface InteractiveState {
  status: AgentComponentProps['status'];
  result?: any;
  error?: Error;
}

/**
 * 异步处理包装器（参考 CopilotKit 的 RenderAndWaitForResponse）
 */
interface AsyncHandlerWrapper {
  promise: Promise<any>;
  resolve: (result: any) => void;
  reject: (error: any) => void;
  toolCallName: string;
  toolCallId?: string;
}

/**
 * ToolCall 状态映射到 Agent 状态
 */
function mapToolCallStatusToAgentStatus(toolCall: ToolCall): AgentComponentProps['status'] {
  if (toolCall.result) {
    return 'complete';
  }
  if (toolCall.args && !toolCall.result) {
    return 'executing';
  }
  if (toolCall.chunk) {
    return 'inProgress';
  }
  return 'idle';
}

/**
 * 从 ToolCall 中解析参数
 */
function parseToolCallArgs(toolCall: ToolCall): any {
  if (!toolCall.args) return {};

  try {
    return JSON.parse(toolCall.args);
  } catch (error) {
    console.warn('Failed to parse ToolCall args:', error);
    return {};
  }
}

/**
 * 从 ToolCall 中解析结果
 */
function parseToolCallResult(toolCall: ToolCall): any {
  console.log('parseToolCallResult called with:', {
    toolCallName: toolCall.toolCallName,
    result: toolCall.result,
    toolCallId: toolCall.toolCallId,
    hasResult: !!toolCall.result,
    resultLength: toolCall.result ? toolCall.result.length : 0,
  });

  if (!toolCall.result) {
    console.log('No result found, returning undefined');
    return undefined;
  }

  try {
    const parsed = JSON.parse(toolCall.result);
    console.log('Successfully parsed result:', parsed);
    return parsed;
  } catch (error) {
    console.log('Failed to parse result, returning raw result:', toolCall.result);
    return toolCall.result;
  }
}

/**
 * ToolCall 智能体动作注册表
 */
class ToolCallAgentRegistry {
  private actions: Map<string, AgentActionConfig> = new Map();

  private handlerResults: Map<string, any> = new Map();

  private responseHandlers: Map<string, ResponseHandler> = new Map();

  private interactiveStates: Map<string, InteractiveState> = new Map();

  private stateUpdateCallbacks: Map<string, Set<() => void>> = new Map();

  private asyncHandlers: Map<string, AsyncHandlerWrapper> = new Map();

  /**
   * 注册 ToolCall 动作
   */
  register(config: AgentActionConfig): void {
    this.actions.set(config.name, config);
    console.log(`Registered action: ${config.name}`, {
      hasHandler: !!config.handler,
    });
  }

  /**
   * 注销 ToolCall 动作
   */
  unregister(actionName: string): void {
    this.actions.delete(actionName);
    this.handlerResults.delete(actionName);
    this.responseHandlers.delete(actionName);
    this.interactiveStates.delete(actionName);
    this.stateUpdateCallbacks.delete(actionName);
    this.asyncHandlers.delete(actionName);
  }

  /**
   * 获取动作配置
   */
  getAction(actionName: string): AgentActionConfig | undefined {
    return this.actions.get(actionName);
  }

  /**
   * 注册响应处理器（用于交互式场景）
   */
  registerResponseHandler<TResponse = any, TResult = any>(
    actionName: string,
    handler: ResponseHandler<TResponse, TResult>,
  ): void {
    this.responseHandlers.set(actionName, handler);
    console.log(`Registered response handler for: ${actionName}`);
  }

  /**
   * 获取响应处理器
   */
  getResponseHandler(actionName: string): ResponseHandler | undefined {
    return this.responseHandlers.get(actionName);
  }

  /**
   * 设置交互式组件状态
   */
  setInteractiveState(actionName: string, state: Partial<InteractiveState>): void {
    const currentState = this.interactiveStates.get(actionName) || {
      status: 'idle',
    };

    const newState = { ...currentState, ...state };
    this.interactiveStates.set(actionName, newState);

    // 触发状态更新回调
    const callbacks = this.stateUpdateCallbacks.get(actionName);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }

    console.log(`Updated interactive state for ${actionName}:`, newState);
  }

  /**
   * 获取交互式组件状态
   */
  getInteractiveState(actionName: string): InteractiveState | undefined {
    return this.interactiveStates.get(actionName);
  }

  /**
   * 订阅状态更新
   */
  subscribeToStateUpdates(actionName: string, callback: () => void): () => void {
    if (!this.stateUpdateCallbacks.has(actionName)) {
      this.stateUpdateCallbacks.set(actionName, new Set());
    }

    this.stateUpdateCallbacks.get(actionName)!.add(callback);

    // 返回取消订阅函数
    return () => {
      this.stateUpdateCallbacks.get(actionName)?.delete(callback);
    };
  }

  /**
   * 创建 respond 函数（参考 CopilotKit 的 resolve 机制）
   */
  createRespondFunction<TResponse = any>(toolCallName: string): (response: TResponse) => void {
    return (response: TResponse) => {
      console.log(`Action ${toolCallName} received user response:`, response);

      // 更新状态为处理中
      this.setInteractiveState(toolCallName, {
        status: 'inProgress',
      });

      // 调用注册的响应处理器
      const handler = this.getResponseHandler(toolCallName);
      if (handler) {
        try {
          const result = handler(response);

          // 检查是否返回 Promise
          const isPromise =
            result != null && typeof result === 'object' && 'then' in result && typeof result.then === 'function';

          if (isPromise) {
            // Promise 处理
            (result as Promise<any>)
              .then((finalResult) => {
                this.setInteractiveState(toolCallName, {
                  status: 'complete',
                  result: finalResult || response,
                });
              })
              .catch((error) => {
                this.setInteractiveState(toolCallName, {
                  status: 'error',
                  error: error instanceof Error ? error : new Error(String(error)),
                });
              });
          } else {
            // 同步处理完成（包括 void 返回值）
            this.setInteractiveState(toolCallName, {
              status: 'complete',
              result: result || response,
            });
          }
        } catch (error) {
          this.setInteractiveState(toolCallName, {
            status: 'error',
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      } else {
        // 没有处理器，直接标记为完成
        console.warn(`No response handler registered for ${toolCallName}`);
        this.setInteractiveState(toolCallName, {
          status: 'complete',
          result: response,
        });
      }
    };
  }

  /**
   * 执行数据后处理（参考 CopilotKit 的 Promise 机制）
   */
  async executeDataPostProcessing(actionName: string, args: any, backendResult?: any): Promise<any> {
    const action = this.getAction(actionName);
    if (!action || !action.handler) {
      return backendResult;
    }

    // 检查缓存 - 使用 toolCallId 确保唯一性
    const cacheKey = `${actionName}-${JSON.stringify(args)}-${JSON.stringify(backendResult)}`;
    console.log('Cache key:', cacheKey);
    if (this.handlerResults.has(cacheKey)) {
      console.log('Using cached result for:', actionName);
      return this.handlerResults.get(cacheKey);
    }

    try {
      console.log(`Executing data post-processing for ${actionName}`, {
        args,
        backendResult,
        backendResultType: typeof backendResult,
        backendResultKeys: backendResult ? Object.keys(backendResult) : 'undefined',
        hasDailyPlans: backendResult?.dailyPlans ? 'yes' : 'no',
      });

      // 智能处理：如果 backendResult 为空但 args 有值，可能是前端函数调用
      // 如果 backendResult 有值，可能是数据后处理
      const result = await action.handler(args, backendResult);

      // 缓存结果
      this.handlerResults.set(cacheKey, result);

      console.log(`Data post-processing completed for ${actionName}:`, result);
      return result;
    } catch (error) {
      console.error(`Data post-processing failed for ${actionName}:`, error);
      return backendResult; // 失败时返回原始后端数据
    }
  }

  /**
   * 创建异步处理器（参考 CopilotKit 的 Promise 创建机制）
   */
  createAsyncHandler(toolCallName: string, toolCallId?: string): AsyncHandlerWrapper {
    let resolve: (result: any) => void;
    let reject: (error: any) => void;

    const promise = new Promise<any>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });

    const wrapper: AsyncHandlerWrapper = {
      promise,
      resolve: resolve!,
      reject: reject!,
      toolCallName,
      toolCallId,
    };

    this.asyncHandlers.set(toolCallName, wrapper);
    return wrapper;
  }

  /**
   * 获取异步处理器
   */
  getAsyncHandler(toolCallName: string): AsyncHandlerWrapper | undefined {
    return this.asyncHandlers.get(toolCallName);
  }

  /**
   * 清理缓存
   */
  clearCache(actionName?: string): void {
    if (actionName) {
      for (const key of this.handlerResults.keys()) {
        if (key.startsWith(`${actionName}-`)) {
          this.handlerResults.delete(key);
        }
      }
    } else {
      this.handlerResults.clear();
    }
  }
}

// 全局注册表实例
const globalRegistry = new ToolCallAgentRegistry();

/**
 * 智能体动作注册 Hook（参考 CopilotKit 的 useCopilotAction）
 */
export function useToolCallAgentAction<TArgs extends object = any, TResult = any, TResponse = any>(
  config: AgentActionConfig<TArgs, TResult, TResponse>,
  responseHandler?: ResponseHandler<TResponse, TResult>,
): void {
  React.useEffect(() => {
    // 注册到本地注册表
    globalRegistry.register(config);

    // 如果提供了响应处理器，注册它
    if (responseHandler) {
      globalRegistry.registerResponseHandler(config.name, responseHandler);
    }

    return () => {
      globalRegistry.unregister(config.name);
    };
  }, [config, responseHandler]);
}

/**
 * 交互式组件状态 Hook
 */
export function useInteractiveState(toolCallName: string): InteractiveState | undefined {
  const [state, setState] = React.useState<InteractiveState | undefined>(() =>
    globalRegistry.getInteractiveState(toolCallName),
  );

  React.useEffect(() => {
    // 订阅状态更新
    const unsubscribe = globalRegistry.subscribeToStateUpdates(toolCallName, () => {
      setState(globalRegistry.getInteractiveState(toolCallName));
    });

    return unsubscribe;
  }, [toolCallName]);

  return state;
}

/**
 * 渲染 ToolCall 智能体组件
 */
export function renderToolCallAgent(toolCallContent: ToolCallContent): React.ReactElement | null {
  const { data: toolCall } = toolCallContent;
  const action = globalRegistry.getAction(toolCall.toolCallName);

  if (!action) {
    console.warn(`No action registered for ToolCall: ${toolCall.toolCallName}`);
    return null;
  }

  const parsedArgs = parseToolCallArgs(toolCall);
  const backendResult = parseToolCallResult(toolCall);
  const { component } = action;

  let finalResult: any;
  let finalStatus: AgentComponentProps['status'];
  let error: Error | undefined;

  // 检查是否为交互式场景（没有后端结果且没有 handler）
  const isInteractive = !action.handler && !backendResult;

  if (isInteractive) {
    // 交互式场景：使用内部状态管理
    const interactiveState = globalRegistry.getInteractiveState(toolCall.toolCallName);
    if (interactiveState) {
      finalStatus = interactiveState.status;
      finalResult = interactiveState.result;
      error = interactiveState.error;
    } else {
      // 初始化交互式状态
      finalStatus = 'executing'; // 等待用户交互
      finalResult = undefined;
      globalRegistry.setInteractiveState(toolCall.toolCallName, {
        status: 'executing',
      });
    }
  } else {
    // 处理错误状态
    if (toolCall.result?.startsWith?.('error:')) {
      error = new Error(toolCall.result.slice(6));
      finalStatus = 'error';
      finalResult = undefined;
    } else {
      finalStatus = mapToolCallStatusToAgentStatus(toolCall);
    }

    // 如果有 handler，需要异步处理
    if (action.handler) {
      // 使用 toolCallId 作为唯一标识符
      const handlerKey = `${toolCall.toolCallName}-${toolCall.toolCallId}`;
      let asyncHandler = globalRegistry.getAsyncHandler(handlerKey);

      if (!asyncHandler) {
        // 检查是否有结果数据
        if (!backendResult && !parsedArgs) {
          // 返回等待状态的组件
          const props: AgentComponentProps<any, any, any> = {
            status: 'executing',
            args: parsedArgs,
            result: backendResult,
            error,
            respond: globalRegistry.createRespondFunction(toolCall.toolCallName),
          };
          return React.createElement(component, props);
        }

        asyncHandler = globalRegistry.createAsyncHandler(handlerKey, toolCall.toolCallId);

        // 启动异步处理
        globalRegistry.executeDataPostProcessing(toolCall.toolCallName, parsedArgs, backendResult).then(
          (result) => {
            asyncHandler!.resolve(result);
          },
          (error) => {
            asyncHandler!.reject(error);
          },
        );
      }

      // 构造 AgentComponentProps，result 为 Promise
      const props: AgentComponentProps<any, any, any> = {
        status: finalStatus,
        args: parsedArgs,
        result: asyncHandler.promise, // 直接传递 Promise
        error,
        respond: globalRegistry.createRespondFunction(toolCall.toolCallName),
      };

      return React.createElement(component, props);
    }
    // 直接使用后端数据
    finalResult = backendResult;
    console.log(`Rendered action without handler: ${toolCall.toolCallName}`);
  }

  // 构造 AgentComponentProps
  const props: AgentComponentProps<any, any, any> = {
    status: finalStatus,
    args: parsedArgs,
    result: finalResult,
    error,
    respond: globalRegistry.createRespondFunction(toolCall.toolCallName),
  };

  console.log(`Final props for ${toolCall.toolCallName}:`, props);

  return React.createElement(component, props);
}

/**
 * 获取全局注册表（用于高级用法）
 */
export function getToolCallAgentRegistry(): ToolCallAgentRegistry {
  return globalRegistry;
}

export { ToolCallAgentRegistry };
