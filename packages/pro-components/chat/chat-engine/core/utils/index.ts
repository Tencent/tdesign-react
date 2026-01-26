import { applyPatch } from 'fast-json-patch';

import type {
  ActivityContent,
  AIMessageContent,
  AttachmentContent,
  ChatMessagesData,
  ImageContent,
  MarkdownContent,
  SearchContent,
  SuggestionContent,
  TextContent,
  ThinkingContent,
  ToolCallContent,
  UserMessageContent,
} from '../type';

/**
 * 应用JSON Patch操作到状态对象
 * 使用fast-json-patch库实现RFC6902规范的JSON Patch操作
 * @param state 原始状态对象
 * @param delta 包含patch操作的数组
 * @returns 更新后的新状态对象
 */
export function applyJsonPatch(state: any, delta: any[]): any {
  try {
    // 使用fast-json-patch库应用补丁
    // applyPatch会自动深拷贝原始对象，避免直接修改
    const result = applyPatch(state, delta, false, false);
    return result.newDocument;
  } catch (error) {
    console.warn('JSON Patch操作失败，返回原始状态:', error);
    // 如果应用补丁失败，返回原始状态的深拷贝
    return JSON.parse(JSON.stringify(state));
  }
}

/**
 * 安全解析JSON字符串的工具函数
 *
 * @param value 待解析的值，可能是字符串或已解析的对象
 * @param fallbackValue 解析失败时的回退值，默认为原值
 * @param errorContext 错误上下文，用于日志输出
 * @returns 解析后的值或回退值
 */
export function safeParseJSON<T = any>(value: any, fallbackValue?: T, errorContext?: string): T {
  if (typeof value !== 'string') {
    return value; // 如果不是字符串，直接返回
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    const context = errorContext ? ` (${errorContext})` : '';
    console.warn(`Failed to parse JSON${context}:`, error);
    return (fallbackValue !== undefined ? fallbackValue : value) as T;
  }
}

export function findTargetElement(event: MouseEvent, selector: string | string[]): HTMLElement | null {
  // 统一处理选择器输入格式（支持字符串或数组）
  const selectors = Array.isArray(selector) ? selector : selector.split(',').map((s) => s.trim());

  // 获取事件穿透路径（包含Shadow DOM内部元素）
  const eventPath = event.composedPath();

  // 遍历路径查找目标元素
  for (const el of eventPath) {
    // 类型安全判断 + 多选择器匹配
    if (el instanceof HTMLElement) {
      // 检查是否匹配任意一个选择器
      if (selectors.some((sel) => el.matches?.(sel))) {
        return el; // 找到即返回
      }
    }
  }

  return null; // 未找到返回null
}

// 类型守卫函数
export function isUserMessage(message: ChatMessagesData) {
  return message.role === 'user' && 'content' in message;
}

export function isAIMessage(message: ChatMessagesData) {
  return message.role === 'assistant';
}

export function isThinkingContent(content: AIMessageContent): content is ThinkingContent {
  return content.type === 'thinking';
}

export function isTextContent(content: AIMessageContent): content is TextContent {
  return content.type === 'text';
}

export function isMarkdownContent(content: AIMessageContent): content is MarkdownContent {
  return content.type === 'markdown';
}

export function isImageContent(content: AIMessageContent): content is ImageContent {
  return content.type === 'image';
}

export function isSearchContent(content: AIMessageContent): content is SearchContent {
  return content.type === 'search';
}

export function isSuggestionContent(content: AIMessageContent): content is SuggestionContent {
  return content.type === 'suggestion';
}

export function isAttachmentContent(content: UserMessageContent): content is AttachmentContent {
  return content.type === 'attachment';
}

export function isToolCallContent(content: AIMessageContent): content is ToolCallContent {
  return content.type === 'toolcall' || content.type.startsWith('toolcall-');
}

export function isActivityContent(content: AIMessageContent): content is ActivityContent {
  return content.type === 'activity' || content.type.startsWith('activity-');
}

export function isReasoningContent(content) {
  return content.type === 'reasoning';
}

/** 提取消息复制内容 */
export function getMessageContentForCopy(message: ChatMessagesData): string {
  if (!isAIMessage(message) || !message.content) {
    return '';
  }
  return message.content.reduce((pre: string, item: AIMessageContent) => {
    let append = '';
    if (isTextContent(item) || isMarkdownContent(item)) {
      append = item.data;
    } else if (isThinkingContent(item)) {
      append = item.data.text || '';
    }
    if (!pre) {
      return append;
    }
    return `${pre}\n${append}`;
  }, '');
}
