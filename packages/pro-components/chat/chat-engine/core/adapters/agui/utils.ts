/* eslint-disable default-param-last */
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
 * 处理一组 AG-UI 标准格式的消息，转换为前端内部的 AIMessageContent[] 格式
 *
 * 这是 convertHistoryMessages 和 handleMessagesSnapshot 的共享核心逻辑。
 * 处理顺序（保持原始顺序）：
 * 1. assistant 的 reasoningContent（思考过程）
 * 2. assistant 的 content（文本回复）
 * 3. assistant 的 toolCalls（工具调用，关联 tool 消息的结果）
 * 4. activity 消息（活动/状态展示）
 *
 * @param messages 一组 AG-UI 标准格式的消息（assistant、tool、activity 等）
 * @param toolCallMap 工具调用结果映射（通过 buildToolCallMap 构建）
 * @returns 转换后的 AIMessageContent 数组
 */
export function processMessageGroup(messages: any[], toolCallMap: Map<string, any>): any[] {
  const allContent: any[] = [];

  messages.forEach((msg: any) => {
    if (msg.role === 'assistant') {
      // 处理 reasoningContent（支持 reasoning 和 thinking 两种类型）
      if (msg.reasoningContent) {
        const reasoningContentResult = processReasoningContent(msg.reasoningContent);
        if (reasoningContentResult) {
          allContent.push(reasoningContentResult);
        }
      }

      // 处理普通文本内容
      if (msg.content) {
        allContent.push({
          type: 'markdown',
          data: msg.content,
        });
      }

      // 处理工具调用内容
      if (msg.toolCalls && msg.toolCalls.length > 0) {
        const toolCallContents = processToolCalls(msg.toolCalls, toolCallMap);
        allContent.push(...toolCallContents);
      }
    } else if (msg.role === 'activity') {
      // 检查是否是存储为 Activity 的 CUSTOM 事件
      if (msg.activityType === 'CUSTOM') {
        const customContent: any = {
          type: 'custom',
          data: {
            name: msg.content?.name || '',
            value: msg.content?.value,
          },
          status: 'complete',
        };
        allContent.push(customContent);
      } else {
        // 普通 Activity 处理
        allContent.push({
          type: `activity-${msg.activityType}`,
          data: {
            activityType: msg.activityType,
            content: msg.content,
          },
          status: 'complete',
        });
      }
    }
  });

  return allContent;
}

/**
 * 处理消息快照
 *
 * 支持两种场景：
 * 1. 正常流中收到 MESSAGES_SNAPSHOT（如初始化同步）
 * 2. 断点恢复场景：后端推送已产生内容的快照，前端一次性恢复
 *
 * MESSAGES_SNAPSHOT 的 messages 遵循 AG-UI 协议标准格式（AGUIMessage[]），
 * 和历史消息接口返回的格式一致。直接复用 processMessageGroup 进行转换。
 *
 * @param messages 消息数组（来自 MESSAGES_SNAPSHOT 事件的 messages 字段，AG-UI 标准格式）
 * @returns 处理后的消息内容数组，带 _isSnapshot 标记用于区分快照 vs 增量
 */
export function handleMessagesSnapshot(messages: any[]): any[] {
  if (!messages || messages.length === 0) return [];

  const toolCallMap = buildToolCallMap(messages);
  const result = processMessageGroup(messages, toolCallMap);

  // 标记为快照结果，让上层使用 replaceContent 语义
  if (result.length > 0) {
    (result as any)._isSnapshot = true;
  }

  return result;
}

/**
 * 处理自定义事件
 * 直接将 CUSTOM 事件转换为通用格式，由业务层自行处理
 * @param event 自定义事件对象
 * @returns 处理结果
 */
export function handleCustomEvent(event: any): any {
  if (event.name === 'suggestion') {
    return {
      type: 'suggestion',
      data: event.value || [],
      status: 'complete',
    };
  }
  return {
    type: 'custom',
    data: {
      name: event.name,
      value: event.value,
    },
    status: 'complete',
  };
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
 * @param strategy 策略（可选）
 * @returns toolcall 类型的 AIMessageContent
 *
 * type 格式: toolcall-${toolCallName}-${toolCallId}
 * - toolCallName: 用于查找对应的渲染组件
 * - toolCallId: 用于区分同名工具的不同调用实例，支持并行工具调用
 */
export function createToolCallContent(
  toolCall: any,
  status: 'pending' | 'streaming' | 'complete' = 'pending',
  strategy?: 'append' | 'merge',
): any {
  // 根据 toolCallName 和 toolCallId 生成唯一的 type
  // 这样同名工具的不同调用实例会有不同的 type，支持并行工具调用场景
  const type = `toolcall-${toolCall.toolCallName}-${toolCall.toolCallId}`;

  // 如果没有指定 strategy，默认使用 'append'
  const finalStrategy = strategy || 'append';

  return createAIMessageContent(type, toolCall, status, finalStrategy);
}

/**
 * 创建 activity 类型的 AIMessageContent
 * @param activityType 活动类型
 * @param content 活动内容
 * @param status 状态
 * @param strategy 策略
 * @param deltaInfo 增量信息（可选，用于 A2UI 等场景的增量处理）
 * @returns activity 类型的 AIMessageContent
 *
 * type 格式: activity-${activityType}
 * - activityType: 用于查找对应的渲染组件和区分不同类型的 Activity
 * - 支持并行多个不同类型的 Activity
 */
export function createActivityContent(
  activityType: string,
  content: Record<string, any>,
  status: 'streaming' | 'complete' = 'complete',
  strategy: 'append' | 'merge' = 'append',
  deltaInfo?: { fromIndex: number; toIndex: number },
): any {
  // 使用 activity-${activityType} 格式，支持并行不同类型的 Activity
  const type = `activity-${activityType}`;

  const ext = deltaInfo ? { deltaInfo } : undefined;

  return createAIMessageContent(
    type,
    {
      activityType,
      content,
    },
    status,
    strategy,
    ext,
  );
}

/**
 * 创建 markdown 类型的 AIMessageContent
 * @param data markdown 数据
 * @param status 状态
 * @param strategy 策略
 * @param role 消息角色（可选，默认 assistant），通过 ext.role 传递给业务层
 * @returns markdown 类型的 AIMessageContent
 */
export function createMarkdownContent(
  data: string,
  status: 'streaming' | 'complete' = 'complete',
  strategy: 'append' | 'merge' = 'append',
  role?: 'assistant' | 'system',
): any {
  const notAssistant = role && role !== 'assistant';
  // TODO: 这里对于textchunk中设置了role的情况delta没做合并（暂时type=`${role}-text`业务自行处理)
  const content = createAIMessageContent(notAssistant ? `${role}-text` : 'markdown', data, status, strategy);
  if (notAssistant) {
    content.ext = { ...content.ext, role };
  }
  return content;
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
          const toolCallData = {
            toolCallId: toolCall.id,
            toolCallName: toolCall.function.name,
            args: toolCall.function.arguments,
            result: toolResult,
          };
          reasoningData.push({
            // 使用 toolCallName-toolCallId 格式，与 createToolCallContent 保持一致
            type: `toolcall-${toolCall.function.name}-${toolCall.id}`,
            data: toolCallData,
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

    const toolCallData = {
      toolCallId: toolCall.id,
      toolCallName: toolCall.function.name,
      args: toolCall.function.arguments,
      result: toolResult,
    };

    return {
      // 使用 toolCallName-toolCallId 格式，支持并行工具调用
      type: `toolcall-${toolCall.function.name}-${toolCall.id}` as const,
      data: toolCallData,
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
