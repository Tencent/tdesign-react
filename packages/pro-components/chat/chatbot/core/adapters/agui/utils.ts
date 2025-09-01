/**
 * AGUI适配器工具函数
 * 包含与类无关的纯函数，用于处理AGUI协议相关逻辑
 */

/**
 * 合并字符串内容，处理JSON和普通字符串
 * @param existing 现有内容
 * @param delta 增量内容
 * @returns 合并后的内容
 */
export function mergeStringContent(existing: string | undefined, delta: string): string {
  if (!existing) return delta;

  // 尝试解析为JSON，如果是有效的JSON则合并
  try {
    const existingObj = JSON.parse(existing);
    const deltaObj = JSON.parse(delta);

    // 如果是对象，进行深度合并
    if (typeof existingObj === 'object' && typeof deltaObj === 'object') {
      return JSON.stringify({ ...existingObj, ...deltaObj });
    }

    // 如果是数组，进行数组合并
    if (Array.isArray(existingObj) && Array.isArray(deltaObj)) {
      return JSON.stringify([...existingObj, ...deltaObj]);
    }

    // 其他情况，直接替换
    return delta;
  } catch (error) {
    // 不是有效的JSON，按普通字符串处理
    return existing + delta;
  }
}

/**
 * 从delta事件中提取stateKey
 * @param event delta事件对象
 * @returns stateKey或null
 */
export function extractStateKeyFromDelta(event: { type: string; delta?: any[] }): string | null {
  if (event.type === 'STATE_DELTA' && event.delta && event.delta.length > 0) {
    // 从第一个delta操作的路径中提取stateKey
    const firstDelta = event.delta[0];
    if (firstDelta && firstDelta.path) {
      const pathParts = firstDelta.path.split('/');
      return pathParts.length > 1 ? pathParts[1] : null;
    }
  }
  return null;
}

/**
 * 处理消息快照
 * @param messages 消息数组
 * @returns 处理后的消息内容数组
 */
export function handleMessagesSnapshot(messages: any[]): any[] {
  // 只取assistant消息
  if (!messages) return [];
  return messages.flatMap((msg: any) => {
    if (msg.role === 'assistant' && Array.isArray(msg.content)) {
      return msg.content.map((content: any) => ({
        type: content.type || 'markdown',
        data: content.data,
        status: 'complete',
      }));
    }
    return [];
  });
}

/**
 * 处理自定义事件
 * @param event 自定义事件对象
 * @returns 处理结果或undefined
 */
export function handleCustomEvent(event: any): any {
  if (event.name === 'suggestion') {
    return {
      type: 'suggestion',
      data: event.value || [],
      status: 'complete',
    };
  }
  return undefined;
}

/**
 * 深度合并函数
 * 递归合并对象，避免浅合并导致的状态丢失
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function deepMerge(target: any, source: any): any {
  if (source === null || source === undefined) {
    return target;
  }

  if (typeof source !== 'object') {
    return source;
  }

  if (Array.isArray(source)) {
    // 对于数组，直接替换（因为AGUI的状态通常是完整的数组）
    return [...source];
  }

  if (typeof target !== 'object' || target === null) {
    return { ...source };
  }

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // 递归合并嵌套对象
        result[key] = deepMerge(result[key], source[key]);
      } else {
        // 直接赋值（包括数组、基本类型等）
        result[key] = source[key];
      }
    }
  }

  return result;
}

/**
 * 解析SSE数据
 * @param data SSE数据，可能是字符串或已解析的对象
 * @returns 解析后的事件对象或null
 */
export function parseSSEData(data: any): any {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Failed to parse SSE data:', error);
      return null;
    }
  }
  return data;
}

/**
 * 验证事件对象
 * @param event 事件对象
 * @returns 是否为有效事件
 */
export function isValidEvent(event: any): boolean {
  return event && typeof event === 'object' && event.type;
}

/**
 * 生成连接ID
 * @param prefix 前缀
 * @returns 连接ID
 */
export function generateConnectionId(prefix = 'sse'): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化日志消息
 * @param level 日志级别
 * @param message 消息内容
 * @param context 上下文信息
 * @returns 格式化后的日志消息
 */
export function formatLogMessage(level: string, message: string, context?: any): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${JSON.stringify(context)}]` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

/**
 * 创建基础的 AIMessageContent 对象
 * @param type 内容类型
 * @param data 内容数据
 * @param status 状态
 * @param strategy 策略
 * @param ext 扩展属性
 * @returns AIMessageContent 对象
 */
export function createAIMessageContent(
  type: string,
  data: any,
  status: 'pending' | 'streaming' | 'complete' | 'error' = 'complete',
  strategy: 'append' | 'merge' = 'append',
  ext?: any,
): any {
  const content: any = {
    type,
    data,
    status,
    strategy,
  };

  if (ext) {
    content.ext = ext;
  }

  return content;
}

/**
 * 创建 reasoning 类型的 AIMessageContent
 * @param data reasoning 数据
 * @param status 状态
 * @param strategy 策略
 * @param collapsed 是否折叠
 * @returns reasoning 类型的 AIMessageContent
 */
export function createReasoningContent(
  data: any[],
  status: 'streaming' | 'complete' = 'streaming',
  strategy: 'append' | 'merge' = 'append',
  collapsed = false,
): any {
  return createAIMessageContent('reasoning', data, status, strategy, { collapsed });
}

/**
 * 创建 thinking 类型的 AIMessageContent
 * @param data thinking 数据
 * @param status 状态
 * @param strategy 策略
 * @param collapsed 是否折叠
 * @returns thinking 类型的 AIMessageContent
 */
export function createThinkingContent(
  data: any,
  status: 'streaming' | 'complete' = 'streaming',
  strategy: 'append' | 'merge' = 'append',
  collapsed = false,
): any {
  return createAIMessageContent('thinking', data, status, strategy, { collapsed });
}

/**
 * 创建 toolcall 类型的 AIMessageContent
 * @param toolCall 工具调用数据
 * @param status 状态
 * @param strategy 策略
 * @returns toolcall 类型的 AIMessageContent
 */
export function createToolCallContent(
  toolCall: any,
  status: 'pending' | 'streaming' | 'complete' = 'pending',
  strategy: 'append' | 'merge' = 'append',
): any {
  return createAIMessageContent('toolcall', toolCall, status, strategy);
}

/**
 * 创建 markdown 类型的 AIMessageContent
 * @param data markdown 数据
 * @param status 状态
 * @param strategy 策略
 * @returns markdown 类型的 AIMessageContent
 */
export function createMarkdownContent(
  data: string,
  status: 'streaming' | 'complete' = 'complete',
  strategy: 'append' | 'merge' = 'append',
): any {
  return createAIMessageContent('markdown', data, status, strategy);
}

/**
 * 创建 suggestion 类型的 AIMessageContent
 * @param data suggestion 数据
 * @returns suggestion 类型的 AIMessageContent
 */
export function createSuggestionContent(data: any[]): any {
  return createAIMessageContent('suggestion', data, 'complete', 'append');
}

/**
 * 创建 text 类型的 AIMessageContent
 * @param data 文本数据
 * @param status 状态
 * @returns text 类型的 AIMessageContent
 */
export function createTextContent(data: string, status: 'streaming' | 'complete' | 'error' = 'complete'): any {
  return createAIMessageContent('text', data, status, 'append');
}

/**
 * 更新工具调用对象
 * @param existingToolCall 现有工具调用
 * @param updates 更新内容
 * @returns 更新后的工具调用
 */
export function updateToolCall(existingToolCall: any, updates: Partial<any>): any {
  return {
    ...existingToolCall,
    ...updates,
  };
}

/**
 * 处理 suggestion 工具调用的特殊逻辑
 * @param toolCall 工具调用对象
 * @returns suggestion 内容或 null
 */
export function handleSuggestionToolCall(toolCall: any): any | null {
  if (toolCall.toolCallName === 'suggestion') {
    try {
      const suggestionData = JSON.parse(toolCall.result || '{}') || [];
      return createSuggestionContent(suggestionData);
    } catch (error) {
      console.warn('Failed to parse suggestion result:', error);
      return null;
    }
  }
  return null;
}

/**
 * 更新 reasoning 上下文中的内容
 * @param reasoningData 当前 reasoning 数据
 * @param index 要更新的索引
 * @param newContent 新内容
 * @returns 更新后的 reasoning 数据
 */
export function updateReasoningData(reasoningData: any[], index: number, newContent: any): any[] {
  const updatedData = [...reasoningData];
  if (index >= 0 && index < updatedData.length) {
    updatedData[index] = newContent;
  }
  return updatedData;
}

/**
 * 向 reasoning 数据中添加新内容
 * @param reasoningData 当前 reasoning 数据
 * @param newContent 新内容
 * @returns 更新后的 reasoning 数据和新内容的索引
 */
export function addToReasoningData(reasoningData: any[], newContent: any): { data: any[]; index: number } {
  const updatedData = [...reasoningData, newContent];
  return {
    data: updatedData,
    index: updatedData.length - 1,
  };
}

/**
 * 解析 reasoningContent 字段
 * @param reasoningContent 原始 reasoningContent 数据
 * @returns 解析后的数据和类型信息
 */
export function parseReasoningContent(reasoningContent: any): {
  type: 'reasoning' | 'thinking';
  data: any;
} {
  let parsedContent;

  if (typeof reasoningContent === 'string') {
    try {
      parsedContent = JSON.parse(reasoningContent);
    } catch {
      // 解析失败时，作为简单文本处理
      return {
        type: 'thinking',
        data: { text: reasoningContent, title: '思考完成' },
      };
    }
  } else {
    parsedContent = reasoningContent;
  }

  // 判断解析后的数据类型
  if (Array.isArray(parsedContent)) {
    return {
      type: 'reasoning',
      data: parsedContent,
    };
  }
  return {
    type: 'thinking',
    data: parsedContent,
  };
}

/**
 * 转换 reasoning 消息数组为 AIMessageContent 数组
 * @param reasoningMessages reasoning 消息数组
 * @returns 转换后的 AIMessageContent 数组
 */
export function convertReasoningMessages(reasoningMessages: any[]): any[] {
  const reasoningData: any[] = [];
  const toolCallMap = new Map<string, any>();

  // 第一遍：收集工具调用结果
  reasoningMessages.forEach((msg) => {
    if (msg.role === 'tool') {
      toolCallMap.set(msg.toolCallId, {
        toolCallId: msg.toolCallId,
        result: msg.content,
      });
    }
  });

  // 第二遍：处理消息内容
  reasoningMessages.forEach((msg) => {
    if (msg.role === 'assistant') {
      // 处理嵌套的 reasoningContent（文本思考）
      if (msg.reasoningContent && typeof msg.reasoningContent === 'string') {
        reasoningData.push({
          type: 'text',
          data: msg.reasoningContent,
          status: 'complete',
        });
      }

      // 处理普通内容
      if (msg.content) {
        reasoningData.push({
          type: 'text', // 在 reasoning 内部，通常用 text 而不是 markdown
          data: msg.content,
          status: 'complete',
        });
      }

      // 处理工具调用
      if (msg.toolCalls && msg.toolCalls.length > 0) {
        msg.toolCalls.forEach((toolCall: any) => {
          const toolResult = toolCallMap.get(toolCall.id)?.result || '';
          reasoningData.push({
            type: 'toolcall',
            data: {
              toolCallId: toolCall.id,
              toolCallName: toolCall.function.name,
              args: toolCall.function.arguments,
              result: toolResult,
            },
            status: 'complete',
          });
        });
      }
    }
  });

  return reasoningData;
}

/**
 * 处理 reasoningContent 并创建对应的 AIMessageContent
 * @param reasoningContent 原始 reasoningContent 数据
 * @returns 创建的 AIMessageContent 或 null
 */
export function processReasoningContent(reasoningContent: any): any | null {
  if (!reasoningContent) return null;

  const { type, data } = parseReasoningContent(reasoningContent);

  if (type === 'reasoning') {
    const reasoningData = convertReasoningMessages(data);
    return {
      type: 'reasoning',
      data: reasoningData,
      status: 'complete',
      strategy: 'append',
      ext: { collapsed: true },
    };
  }
  return {
    type: 'thinking',
    status: 'complete',
    data,
  };
}

/**
 * 处理工具调用并创建对应的 AIMessageContent 数组
 * @param toolCalls 工具调用数组
 * @param toolCallMap 工具调用结果映射
 * @returns 创建的 AIMessageContent 数组
 */
export function processToolCalls(toolCalls: any[], toolCallMap: Map<string, any>): any[] {
  return toolCalls.map((toolCall) => {
    const toolResult = toolCallMap.get(toolCall.id)?.result || '';

    // 建议类型的toolcall特殊解析
    if (toolCall.function.name === 'suggestion') {
      return {
        type: 'suggestion' as const,
        data: parseSSEData(toolResult) || [],
      };
    }

    return {
      type: 'toolcall' as const,
      data: {
        toolCallId: toolCall.id,
        toolCallName: toolCall.function.name,
        args: toolCall.function.arguments,
        result: toolResult,
      },
    };
  });
}

/**
 * 构建工具调用结果映射
 * @param historyMessages 历史消息数组
 * @returns 工具调用结果映射
 */
export function buildToolCallMap(historyMessages: any[]): Map<string, any> {
  const toolCallMap = new Map<string, any>();

  historyMessages.forEach((msg) => {
    if (msg.role === 'tool') {
      toolCallMap.set(msg.toolCallId, {
        toolCallId: msg.toolCallId,
        result: msg.content,
      });
    }
  });

  return toolCallMap;
}
