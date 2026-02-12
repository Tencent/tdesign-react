import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AGUIEventType, ToolCall } from 'tdesign-web-components/lib/chat-engine';
import { isNonInteractiveConfig, type ToolcallComponentProps } from './types';
import { agentToolcallRegistry, TOOLCALL_REGISTERED_EVENT, TOOLCALL_EVENT_DETAIL_KEY } from './registry';
import { ComponentErrorBoundary, useRegistrationListener } from '../shared';
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

    // 使用公共 Hook 监听动态注册
    const { MemoizedComponent } = useRegistrationListener<ToolcallComponentProps>({
      componentKey: toolCall.toolCallName,
      eventName: TOOLCALL_REGISTERED_EVENT,
      eventDetailKey: TOOLCALL_EVENT_DETAIL_KEY,
      getRenderFunction: agentToolcallRegistry.getRenderFunction,
    });

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } else if (
        toolCall.eventType === AGUIEventType.TOOL_CALL_END ||
        toolCall.eventType === AGUIEventType.TOOL_CALL_RESULT
      ) {
        // 工具调用已结束（无 result 的情况，如 show_progress）
        setActionState({ status: 'complete' });
      } else {
        // 等待用户交互或工具执行中
        setActionState({ status: 'executing' });
      }
    }, [config, args, toolCall.result, toolCall.eventType]);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscribeKeyExtractor, args, actionState]);

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

    if (!MemoizedComponent) {
      return null;
    }

    return (
      <ComponentErrorBoundary componentName={toolCall.toolCallName} logPrefix="ToolCallRenderer">
        <MemoizedComponent {...componentProps} />
      </ComponentErrorBoundary>
    );
  },
  (prevProps, nextProps) =>
    prevProps.toolCall.toolCallId === nextProps.toolCall.toolCallId &&
    prevProps.toolCall.toolCallName === nextProps.toolCall.toolCallName &&
    prevProps.toolCall.args === nextProps.toolCall.args &&
    prevProps.toolCall.result === nextProps.toolCall.result &&
    prevProps.toolCall.eventType === nextProps.toolCall.eventType &&
    prevProps.onRespond === nextProps.onRespond,
);

// 定义增强后的 Props 类型
type WithAgentStateProps<P> = P & { agentState?: Record<string, any> };

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

    return <Component {...props} agentState={agentState} />;
  };

  WrappedComponent.displayName = `withAgentState(${Component.displayName || Component.name || 'Component'})`;
  return React.memo(WrappedComponent);
};
