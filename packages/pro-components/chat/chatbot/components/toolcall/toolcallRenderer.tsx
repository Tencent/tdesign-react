import React, { useState, useEffect, useCallback } from 'react';
import type { ToolCall } from '../../core/type';
import type { AgentToolcallConfig, ToolcallComponentProps } from './types';
import { agentToolcallRegistry } from './registry';

interface ToolCallRendererProps {
  toolCall: ToolCall;
  onRespond?: (toolCall: ToolCall, response: any) => void;
}

/**
 * ToolCall 渲染器组件
 * 根据注册的 AgentToolcallConfig 渲染对应的组件
 */
export const ToolCallRenderer = ({
  toolCall,
  onRespond,
}: ToolCallRendererProps): React.ReactElement<any, any> | null => {
  const [actionState, setActionState] = useState<{
    status: ToolcallComponentProps['status'];
    result?: any;
    error?: Error;
  }>({
    status: 'idle',
  });

  const config = agentToolcallRegistry.get(toolCall.toolCallName);

  // 解析参数 - 必须在条件判断之前调用
  const args = React.useMemo(() => {
    try {
      return toolCall.args ? JSON.parse(toolCall.args) : {};
    } catch (error) {
      console.error('解析工具调用参数失败:', error);
      return {};
    }
  }, [toolCall.args]);

  // 处理用户交互响应 - 必须在条件判断之前调用
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

    // 类型守卫函数
    const isNonInteractiveConfig = (cfg: AgentToolcallConfig): cfg is AgentToolcallConfig & { handler: Function } =>
      typeof (cfg as any).handler === 'function';

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

  // 如果没有找到对应的配置，不渲染任何内容
  if (!config) {
    return null;
  }

  // 构造组件 props
  const componentProps: ToolcallComponentProps = {
    status: actionState.status,
    args,
    result: actionState.result,
    error: actionState.error,
    respond: handleRespond,
  };

  // 渲染对应的组件
  return React.createElement(config.component, componentProps);
};
