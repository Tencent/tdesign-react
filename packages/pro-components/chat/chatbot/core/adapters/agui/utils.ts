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
