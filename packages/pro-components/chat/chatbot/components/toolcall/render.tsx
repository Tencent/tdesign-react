import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { ToolCall } from '../../core/type';
import { isNonInteractiveConfig, type ToolcallComponentProps } from './types';
import { agentToolcallRegistry } from './registry';
import { AgentStateContext, useAgentStateDataByKey } from '../../hooks/useAgentState';

interface ToolCallRendererProps {
  toolCall: ToolCall;
  onRespond?: (toolCall: ToolCall, response: any) => void;
}

export const ToolCallRenderer = React.memo<ToolCallRendererProps>(
  ({ toolCall, onRespond }) => {
    const [actionState, setActionState] = useState<{
      status: ToolcallComponentProps['status'];
      result?: any;
      error?: Error;
    }>({
      status: 'idle',
    });

    // 缓存配置获取
    const config = useMemo(() => {
      const cfg = agentToolcallRegistry.get(toolCall.toolCallName);
      return cfg;
    }, [toolCall.toolCallName]);

    // 添加注册状态监听
    const [isRegistered, setIsRegistered] = useState(
      () => !!agentToolcallRegistry.getRenderFunction(toolCall.toolCallName),
    );

    // 缓存参数解析
    const args = useMemo(() => {
      try {
        return toolCall.args ? JSON.parse(toolCall.args) : {};
      } catch (error) {
        console.error('解析工具调用参数失败:', error);
        return {};
      }
    }, [toolCall.args]);

    const handleRespond = useCallback(
      (response: any) => {
        if (onRespond) {
          onRespond(toolCall, response);
          setActionState((prev) => ({
            ...prev,
            status: 'complete',
            result: response,
          }));
        }
      },
      [toolCall.toolCallId, onRespond],
    );

    // 执行 handler（如果存在）- 必须在条件判断之前调用
    useEffect(() => {
      if (!config) return;

      if (isNonInteractiveConfig(config)) {
        // 非交互式：执行 handler
        const executeHandler = async () => {
          try {
            setActionState({ status: 'executing' });

            // 解析后端返回的结果作为 handler 的第二个参数
            let backendResult;
            if (toolCall.result) {
              try {
                backendResult = JSON.parse(toolCall.result);
              } catch (error) {
                console.warn('解析后端结果失败，使用原始字符串:', error);
                backendResult = toolCall.result;
              }
            }

            // 调用 handler，传入 args 和 backendResult
            const result = await config.handler(args, backendResult);
            setActionState({
              status: 'complete',
              result,
            });
          } catch (error) {
            setActionState({
              status: 'error',
              error: error as Error,
            });
          }
        };

        executeHandler();
      } else if (toolCall.result) {
        // 交互式：已有结果，显示完成状态
        try {
          const result = JSON.parse(toolCall.result);
          setActionState({
            status: 'complete',
            result,
          });
        } catch (error) {
          setActionState({
            status: 'error',
            error: error as Error,
          });
        }
      } else {
        // 等待用户交互
        setActionState({ status: 'executing' });
      }
    }, [config, args, toolCall.result]);

    // 从配置中获取 subscribeKey 提取函数
    const subscribeKeyExtractor = useMemo(() => config?.subscribeKey, [config]);

    // 使用配置的提取函数来获取 targetStateKey
    const targetStateKey = useMemo(() => {
      if (!subscribeKeyExtractor) return undefined;

      // 构造完整的 props 对象传给提取函数
      const fullProps = {
        status: actionState.status,
        args,
        result: actionState.result,
        error: actionState.error,
        respond: handleRespond,
      };

      return subscribeKeyExtractor(fullProps);
    }, [subscribeKeyExtractor, args, actionState]);

    // 监听组件注册事件, 无论何时注册，都能正确触发重新渲染
    useEffect(() => {
      if (!isRegistered) {
        const handleRegistered = (event: CustomEvent) => {
          if (event.detail?.name === toolCall.toolCallName) {
            setIsRegistered(true);
          }
        };

        // 添加事件监听
        window.addEventListener('toolcall-registered', handleRegistered as EventListener);

        return () => {
          window.removeEventListener('toolcall-registered', handleRegistered as EventListener);
        };
      }
    }, [toolCall.toolCallName, isRegistered]);

    // 使用精确订阅
    const agentState = useAgentStateDataByKey(targetStateKey);

    // 缓存组件 props
    const componentProps = useMemo<ToolcallComponentProps>(
      () => ({
        status: actionState.status,
        args,
        result: actionState.result,
        error: actionState.error,
        respond: handleRespond,
        agentState,
      }),
      [actionState.status, args, actionState.result, actionState.error, handleRespond, agentState],
    );

    // 使用registry的缓存渲染函数
    const MemoizedComponent = useMemo(
      () => agentToolcallRegistry.getRenderFunction(toolCall.toolCallName),
      [toolCall.toolCallName, isRegistered],
    );

    if (!MemoizedComponent) {
      return null;
    }

    return <MemoizedComponent {...componentProps} />;
  },
  (prevProps, nextProps) =>
    prevProps.toolCall.toolCallId === nextProps.toolCall.toolCallId &&
    prevProps.toolCall.toolCallName === nextProps.toolCall.toolCallName &&
    prevProps.toolCall.args === nextProps.toolCall.args &&
    prevProps.toolCall.result === nextProps.toolCall.result &&
    prevProps.onRespond === nextProps.onRespond,
);
// 用于调试，可以在控制台查看每次渲染的参数
// (prevProps, nextProps) => {
//   const toolCallIdSame = prevProps.toolCall.toolCallId === nextProps.toolCall.toolCallId;
//   const toolCallNameSame = prevProps.toolCall.toolCallName === nextProps.toolCall.toolCallName;
//   const argsSame = prevProps.toolCall.args === nextProps.toolCall.args;
//   const resultSame = prevProps.toolCall.result === nextProps.toolCall.result;
//   const onRespondSame = prevProps.onRespond === nextProps.onRespond;

//   console.log(`ToolCallRenderer memo 详细检查 [${prevProps.toolCall.toolCallName}]:`, {
//     toolCallIdSame,
//     toolCallNameSame,
//     argsSame,
//     resultSame,
//     onRespondSame,
//     prevToolCallId: prevProps.toolCall.toolCallId,
//     nextToolCallId: nextProps.toolCall.toolCallId,
//     prevOnRespond: prevProps.onRespond,
//     nextOnRespond: nextProps.onRespond,
//   });

//   const shouldSkip = toolCallIdSame && toolCallNameSame && argsSame && resultSame && onRespondSame;

//   console.log(`ToolCallRenderer memo 检查 [${prevProps.toolCall.toolCallName}]:`, shouldSkip ? '跳过渲染' : '需要重新渲染');
//   return shouldSkip
//   },
// );

// 定义增强后的 Props 类型
type WithAgentStateProps<P> = P & { agentState?: Record<string, any> };

// 创建一个高阶组件来包装需要状态的工具组件
// export const withAgentStateToolcall = <P extends object>(
//   Component: React.ComponentType<WithAgentStateProps<P>>,
// ): React.ComponentType<P> => {
//   const WrappedComponent: React.FC<P> = (props: P) => {
//     // 尝试获取 Context 状态
//     let contextState: UseStateActionReturn['state'] | null = null;
//     try {
//       const context = useAgentStateContext();
//       console.log('====context', context);
//       contextState = context.state;
//     } catch {
//       // 如果没有 Context，则忽略
//     }

//     // 构造增强后的 props
//     const enhancedProps: WithAgentStateProps<P> = {
//       ...props,
//       ...(contextState && { agentState: contextState }),
//     };

//     return <Component {...enhancedProps} />;
//   };

//   // 设置 displayName 便于调试
//   WrappedComponent.displayName = `withAgentState(${Component.displayName || Component.name || 'Component'})`;

//   return React.memo(WrappedComponent);
// };

export const withAgentStateToolcall1 = <P extends object>(
  Component: React.ComponentType<WithAgentStateProps<P>>,
): React.ComponentType<P> => {
  const WrappedComponent: React.FC<P> = (props: P) => (
    <AgentStateContext.Consumer>
      {(context) => {
        if (!context) {
          console.warn('AgentStateContext not found, component will render without state');
          return <Component {...props} />;
        }

        return <Component {...props} agentState={context.stateMap} />;
      }}
    </AgentStateContext.Consumer>
  );

  WrappedComponent.displayName = `withAgentState(${Component.displayName || Component.name || 'Component'})`;
  return React.memo(WrappedComponent);
};

export const withAgentStateToolcall = <P extends object>(
  Component: React.ComponentType<WithAgentStateProps<P>>,
  subscribeKeyExtractor?: (props: P) => string | undefined,
): React.ComponentType<P> => {
  const WrappedComponent: React.FC<P> = (props: P) => {
    // 计算需要订阅的 stateKey
    const targetStateKey = useMemo(() => (subscribeKeyExtractor ? subscribeKeyExtractor(props) : undefined), [props]);

    const agentState = useAgentStateDataByKey(targetStateKey);
    console.log('====WrappedComponent', agentState, targetStateKey);

    return <Component {...props} agentState={agentState} />;
  };

  WrappedComponent.displayName = `withAgentState(${Component.displayName || Component.name || 'Component'})`;
  return React.memo(WrappedComponent);
};

// interface SubscribeStrategy<TArgs = any> {
//   // 自定义状态选择器
//   stateSelector?: (stateMap: Record<string, any>, args: TArgs) => any;
//   // 依赖项，用于优化重新计算
//   deps?: (args: TArgs) => any[];
// }

// export const withAgentStateToolcall = <P extends object>(
//   Component: React.ComponentType<WithAgentStateProps<P>>,
//   subscribeStrategy?: SubscribeStrategy
// ): React.ComponentType<P> => {
//   const WrappedComponent: React.FC<P> = (props: P) => {
//     const { stateMap } = useAgentStateContext();

//     // 使用自定义选择器
//     const selectedState = useMemo(() => {
//       if (!subscribeStrategy?.stateSelector) {
//         return stateMap;
//       }
//       return subscribeStrategy.stateSelector(stateMap, (props as any).args);
//     }, [
//       stateMap,
//       (props as any).args,
//       ...(subscribeStrategy?.deps?.((props as any).args) || [])
//     ]);

//     return <Component {...props} agentState={selectedState} />;
//   };

//   WrappedComponent.displayName = `withAgentState(${Component.displayName || Component.name || 'Component'})`;
//   return React.memo(WrappedComponent);
// };
