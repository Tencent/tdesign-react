/**
 * OpenClaw 历史消息转换器
 *
 * 将 OpenClaw `sessions.history` RPC 返回的消息格式转换为 ChatEngine 的 ChatMessagesData 格式。
 *
 * OpenClaw 历史消息格式（来自实际 Gateway 返回）：
 *
 * 1. user 消息:
 * {
 *   role: 'user',
 *   content: [{ type: 'text', text: '...' }],
 *   timestamp: number,
 *   senderLabel: string,
 * }
 *
 * 2. assistant 消息:
 * {
 *   role: 'assistant',
 *   content: [
 *     { type: 'text', text: '...' },                                       // 文本内容
 *     { type: 'toolCall', id: '...', name: '...', arguments: {...} },      // 工具调用
 *   ],
 *   api: string, provider: string, model: string,
 *   stopReason: 'stop' | 'toolUse' | 'aborted',
 *   timestamp: number,
 *   errorMessage?: string,
 *   openclawAbort?: { aborted: boolean, origin: string, runId: string },
 * }
 *
 * 3. toolResult 消息:
 * {
 *   role: 'toolResult',
 *   toolCallId: string,
 *   toolName: string,
 *   content: [{ type: 'text', text: '...' }],
 *   isError: boolean,
 *   timestamp: number,
 * }
 */
import type {
  ChatMessagesData,
  AIMessageContent,
  TextContent,
  UserMessage,
  AIMessage,
} from '../../type';
import { createToolCallContent } from '../shared';
import { generateUUID } from './utils';

// ==================== OpenClaw 历史消息类型 ====================

/**
 * OpenClaw 历史消息内容项
 */
export interface OpenClawHistoryContentItem {
  type: string;
  text?: string;
  // toolCall 类型
  id?: string;
  name?: string;
  arguments?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * OpenClaw 历史消息
 */
export interface OpenClawHistoryMessage {
  role: 'user' | 'assistant' | 'toolResult' | 'system';
  content?: OpenClawHistoryContentItem[] | string;
  timestamp?: number;
  senderLabel?: string;
  // assistant 专有
  api?: string;
  provider?: string;
  model?: string;
  stopReason?: string;
  errorMessage?: string;
  openclawAbort?: {
    aborted: boolean;
    origin: string;
    runId: string;
  };
  // toolResult 专有
  toolCallId?: string;
  toolName?: string;
  isError?: boolean;
}

/**
 * OpenClaw sessions.history 响应
 */
export interface OpenClawHistoryResponse {
  sessionKey: string;
  sessionId: string;
  messages: OpenClawHistoryMessage[];
  thinkingLevel?: string;
}

// ==================== 转换器 ====================

/**
 * 将 OpenClaw 历史消息数组转换为 ChatEngine 的 ChatMessagesData 数组
 *
 * 转换策略：
 * 1. user → UserMessage（直接映射文本内容）
 * 2. assistant → AIMessage（文本内容 + toolCall 转为 toolcall content）
 * 3. toolResult → 合并到前一个 assistant 消息的对应 toolcall 中作为 result
 * 4. 跳过空内容和被中止的消息
 * 5. 连续的 assistant 消息（stopReason: 'toolUse' 后跟 toolResult 再跟 assistant）
 *    会被合并为一条完整的 AIMessage
 *
 * @param messages OpenClaw 格式的历史消息数组
 * @param options 转换选项
 * @returns ChatEngine 格式的消息数组
 */
export function convertOpenClawHistory(
  messages: OpenClawHistoryMessage[],
  options?: ConvertHistoryOptions,
): ChatMessagesData[] {
  const result: ChatMessagesData[] = [];
  const toolResultMap = new Map<string, { content: string; isError: boolean }>();

  // 第一遍：收集所有 toolResult，建立 toolCallId → result 映射
  for (const msg of messages) {
    if (msg.role === 'toolResult' && msg.toolCallId) {
      const text = extractTextFromContent(msg.content);
      toolResultMap.set(msg.toolCallId, {
        content: text,
        isError: msg.isError ?? false,
      });
    }
  }

  // 第二遍：转换消息
  // 用于追踪当前可合并的 assistant 消息
  let pendingAIMessage: AIMessage | null = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    switch (msg.role) {
      case 'user': {
        // 先 flush 之前的 pending AI 消息
        if (pendingAIMessage) {
          result.push(pendingAIMessage);
          pendingAIMessage = null;
        }
        const userMsg = convertUserMessage(msg);
        if (userMsg) {
          result.push(userMsg);
        }
        break;
      }

      case 'assistant': {
        // 跳过被中止且无内容的消息
        if (isAbortedEmpty(msg)) {
          break;
        }

        const aiContents = convertAssistantContent(msg, toolResultMap, options);

        if (aiContents.length === 0) {
          break;
        }

        if (pendingAIMessage) {
          // 合并到前一个 pending AI 消息中（多轮 tool loop 场景）
          pendingAIMessage.content = [...(pendingAIMessage.content || []), ...aiContents];
          // 更新 status
          if (msg.stopReason === 'stop') {
            pendingAIMessage.status = 'complete';
          }
        } else {
          pendingAIMessage = {
            id: generateUUID(),
            role: 'assistant',
            content: aiContents,
            status: msg.stopReason === 'stop' ? 'complete' : 'complete',
            datetime: msg.timestamp ? new Date(msg.timestamp).toISOString() : undefined,
            ext: {
              model: msg.model,
              provider: msg.provider,
            },
          };
        }

        // 如果 stopReason 是 'stop'，flush 这个 AI 消息
        // 如果是 'toolUse'，保持 pending 等待后续 toolResult + assistant 合并
        if (msg.stopReason === 'stop' || msg.stopReason === 'aborted') {
          if (pendingAIMessage) {
            result.push(pendingAIMessage);
            pendingAIMessage = null;
          }
        }
        break;
      }

      case 'toolResult': {
        // toolResult 已经在第一遍收集到 toolResultMap 中
        // 它们会在 convertAssistantContent 时自动关联到对应的 toolCall
        // 这里不需要额外处理
        break;
      }

      case 'system': {
        // flush pending
        if (pendingAIMessage) {
          result.push(pendingAIMessage);
          pendingAIMessage = null;
        }
        const text = extractTextFromContent(msg.content);
        if (text) {
          result.push({
            id: generateUUID(),
            role: 'system',
            content: [{ type: 'text', data: text, status: 'complete' }],
            datetime: msg.timestamp ? new Date(msg.timestamp).toISOString() : undefined,
          });
        }
        break;
      }

      default:
        break;
    }
  }

  // flush 最后一个 pending AI 消息
  if (pendingAIMessage) {
    result.push(pendingAIMessage);
  }

  return result;
}

/**
 * 从 OpenClaw sessions.history 响应体中提取并转换消息
 * 这是一个便捷方法，直接接受 RPC 响应的 payload
 */
export function convertOpenClawHistoryResponse(
  response: OpenClawHistoryResponse,
  options?: ConvertHistoryOptions,
): ChatMessagesData[] {
  return convertOpenClawHistory(response.messages || [], options);
}

// ==================== 转换选项 ====================

export interface ConvertHistoryOptions {
  /**
   * 是否将 toolCall 的详细参数和结果展示在 toolcall 组件中
   * 默认 true
   */
  showToolCallDetails?: boolean;

  /**
   * 是否跳过被中止的消息
   * 默认 true
   */
  skipAborted?: boolean;

  /**
   * 自定义 toolCall 渲染名映射
   * 例如 { 'read': 'file_reader', 'exec': 'command_runner' }
   */
  toolCallNameMap?: Record<string, string>;
}

// ==================== 内部转换方法 ====================

/**
 * 转换 user 消息
 */
function convertUserMessage(msg: OpenClawHistoryMessage): UserMessage | null {
  const text = extractTextFromContent(msg.content);
  if (!text) return null;

  return {
    id: generateUUID(),
    role: 'user',
    content: [{ type: 'text', data: text }],
    datetime: msg.timestamp ? new Date(msg.timestamp).toISOString() : undefined,
  };
}

/**
 * 转换 assistant 消息的 content 数组为 AIMessageContent 数组
 */
function convertAssistantContent(
  msg: OpenClawHistoryMessage,
  toolResultMap: Map<string, { content: string; isError: boolean }>,
  options?: ConvertHistoryOptions,
): AIMessageContent[] {
  const contents: AIMessageContent[] = [];
  const contentArr = normalizeContent(msg.content);

  for (const item of contentArr) {
    switch (item.type) {
      case 'text': {
        if (item.text) {
          contents.push({
            type: 'text',
            data: item.text,
            status: 'complete',
          } as TextContent);
        }
        break;
      }

      case 'toolCall': {
        // 将 OpenClaw 历史中的 toolCall 转换为 ChatEngine 的 toolcall content
        const toolCallId = (item.id || '') as string;
        const toolCallName = getToolCallName(item.name as string, options);
        const rawArgs = item.arguments;
        const argsStr = rawArgs ? (typeof rawArgs === 'string' ? rawArgs : JSON.stringify(rawArgs)) : '';

        // 查找对应的 toolResult
        const toolResult = toolResultMap.get(toolCallId);
        const resultStr = toolResult?.content || '';

        const toolCall = {
          toolCallId,
          toolCallName,
          eventType: toolResult ? 'TOOL_CALL_RESULT' : 'TOOL_CALL_START',
          parentMessageId: '',
          args: argsStr,
          result: resultStr,
        };

        const status = toolResult ? 'complete' : 'complete';
        contents.push(createToolCallContent(toolCall, status, 'append'));
        break;
      }

      default:
        // 其他未知类型，尝试作为文本处理
        if (item.text) {
          contents.push({
            type: 'text',
            data: item.text,
            status: 'complete',
          } as TextContent);
        }
        break;
    }
  }

  return contents;
}

/**
 * 从 content 中提取文本
 */
function extractTextFromContent(content: OpenClawHistoryMessage['content']): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .filter((c) => c?.type === 'text' && c?.text)
    .map((c) => c.text!)
    .join('');
}

/**
 * 标准化 content 为数组
 */
function normalizeContent(content: OpenClawHistoryMessage['content']): OpenClawHistoryContentItem[] {
  if (!content) return [];
  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }
  if (Array.isArray(content)) return content;
  return [];
}

/**
 * 获取映射后的工具名
 */
function getToolCallName(name: string, options?: ConvertHistoryOptions): string {
  if (options?.toolCallNameMap && name in options.toolCallNameMap) {
    return options.toolCallNameMap[name];
  }
  return name || 'unknown';
}

/**
 * 判断消息是否为被中止的空消息
 */
function isAbortedEmpty(msg: OpenClawHistoryMessage): boolean {
  if (msg.stopReason === 'aborted' || msg.openclawAbort?.aborted) {
    const contentArr = normalizeContent(msg.content);
    // 如果内容为空或只有空文本
    if (contentArr.length === 0) return true;
    const hasContent = contentArr.some((c) => {
      if (c.type === 'text' && c.text) return true;
      if (c.type === 'toolCall') return true;
      return false;
    });
    return !hasContent;
  }
  return false;
}
