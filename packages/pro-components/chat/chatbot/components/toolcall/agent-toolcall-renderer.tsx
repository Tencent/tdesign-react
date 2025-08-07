import React from 'react';
import type { ToolCallContent } from '../../core/type';
import { renderToolCallAgent } from './toolcall-agent-adapter';

interface AgentToolCallRendererProps {
  content: ToolCallContent;
}

/**
 * 智能体 ToolCall 渲染器
 * 优先使用注册的智能体组件，回退到默认渲染
 */
export const AgentToolCallRenderer: React.FC<AgentToolCallRendererProps> = ({ content }) => {
  // 尝试使用智能体渲染器
  const agentComponent = renderToolCallAgent(content);

  if (agentComponent) {
    return <div className="agent-toolcall-container">{agentComponent}</div>;
  }

  // 回退到默认的 ToolCall 渲染逻辑
  const { data: toolCall } = content;

  return (
    <div className="default-toolcall-container">
      <div className="toolcall-header">
        <span className="toolcall-name">{toolCall.toolCallName}</span>
        <span className={`toolcall-status ${getStatusClass(toolCall)}`}>{getStatusText(toolCall)}</span>
      </div>

      {toolCall.args && (
        <div className="toolcall-args">
          <strong>参数:</strong>
          <pre>{toolCall.args}</pre>
        </div>
      )}

      {toolCall.result && (
        <div className="toolcall-result">
          <strong>结果:</strong>
          <pre>{toolCall.result}</pre>
        </div>
      )}

      {toolCall.chunk && !toolCall.result && (
        <div className="toolcall-chunk">
          <strong>处理中:</strong>
          <pre>{toolCall.chunk}</pre>
        </div>
      )}
    </div>
  );
};

/**
 * 获取状态样式类
 */
function getStatusClass(toolCall: any): string {
  if (toolCall.result) return 'complete';
  if (toolCall.args && !toolCall.result) return 'executing';
  if (toolCall.chunk) return 'in-progress';
  return 'idle';
}

/**
 * 获取状态文本
 */
function getStatusText(toolCall: any): string {
  if (toolCall.result) return '已完成';
  if (toolCall.args && !toolCall.result) return '执行中';
  if (toolCall.chunk) return '处理中';
  return '待机';
}

export default AgentToolCallRenderer;
