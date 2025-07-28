 
import type { ToolCall, AIMessageContent } from '../type';
import { isToolCallContent } from '../utils';

/**
 * ToolCall处理器
 * 专门处理工具调用相关的逻辑
 */
export class ToolCallProcessor {
  private toolCallMap: Record<string, ToolCall> = {};

  /**
   * 处理工具调用内容
   * @param result 消息结果
   * @returns 去重后的工具调用数组
   */
  processToolCalls(result: AIMessageContent | AIMessageContent[] | null): ToolCall[] {
    let toolCalls: ToolCall[] = [];

    // 从内容块中提取工具调用
    if (Array.isArray(result)) {
      const toolCallContent = result.find(content => isToolCallContent(content));
      if (toolCallContent && toolCallContent.data) {
        toolCalls = [...toolCalls, ...toolCallContent.data];
      }
    } else if (result && isToolCallContent(result) && result.data) {
      toolCalls = [...toolCalls, ...result.data];
    }

    // 合并现有的工具调用
    const existingCalls = Object.values(this.toolCallMap);
    toolCalls = [...existingCalls, ...toolCalls];

    // 去重并更新内部映射
    return this.deduplicateToolCalls(toolCalls);
  }

  /**
   * 添加工具调用到内部映射
   */
  addToolCall(toolCall: ToolCall): void {
    this.toolCallMap[toolCall.id] = toolCall;
  }

  /**
   * 获取指定工具调用
   */
  getToolCall(toolCallId: string): ToolCall | undefined {
    return this.toolCallMap[toolCallId];
  }

  /**
   * 获取所有工具调用
   */
  getAllToolCalls(): ToolCall[] {
    return Object.values(this.toolCallMap);
  }

  /**
   * 清除指定工具调用
   */
  clearToolCall(toolCallId: string): void {
    delete this.toolCallMap[toolCallId];
  }

  /**
   * 清除所有工具调用
   */
  clearAllToolCalls(): void {
    this.toolCallMap = {};
  }

  /**
   * 去重工具调用，以id为key
   */
  private deduplicateToolCalls(toolCalls: ToolCall[]): ToolCall[] {
    const callMap = new Map<string, ToolCall>();
    toolCalls.forEach(call => {
      callMap.set(call.id, call);
      // 同时更新内部映射
      this.toolCallMap[call.id] = call;
    });
    return Array.from(callMap.values());
  }
}