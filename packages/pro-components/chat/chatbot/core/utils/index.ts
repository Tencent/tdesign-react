import type {
  AIMessageContent,
  AttachmentContent,
  ChatMessagesData,
  ImageContent,
  MarkdownContent,
  SearchContent,
  SuggestionContent,
  TextContent,
  ThinkingContent,
  UserMessageContent,
  ToolCallContent,
} from '../type';

/**
 * 解析JSON Pointer路径
 */
function parseJsonPointerPath(path: string): string[] {
  return path
    .slice(1) // 移除开头的斜杠
    .split('/')
    .map((part: string) =>
      // 处理JSON Pointer转义字符
      part.replace(/~1/g, '/').replace(/~0/g, '~'),
    );
}

/**
 * 检查是否为数组索引
 */
function isArrayIndex(key: string): boolean {
  return /^\d+$/.test(key);
}

/**
 * 扩展数组到指定长度
 */
function extendArrayToIndex(array: any[], targetIndex: number): void {
  while (array.length <= targetIndex) {
    array.push(undefined);
  }
}

/**
 * 处理数组路径导航
 */
function navigateArrayPath(target: any[], pathSegment: string, nextKey: string, operation: string): any {
  const arrayIndex = parseInt(pathSegment, 10);

  // 验证索引范围
  if (operation !== 'add' && arrayIndex >= target.length) {
    throw new Error(`数组索引 ${arrayIndex} 超出范围，当前数组长度: ${target.length}`);
  }

  // 扩展数组（如果需要）
  if (operation === 'add' && arrayIndex >= target.length) {
    extendArrayToIndex(target, arrayIndex);
  }

  // 创建中间对象（如果不存在）
  if (target[arrayIndex] == null) {
    target[arrayIndex] = isArrayIndex(nextKey) ? [] : {};
  }

  return target[arrayIndex];
}

/**
 * 处理对象路径导航
 */
function navigateObjectPath(target: any, pathSegment: string, nextKey: string, operation: string): any {
  if (target[pathSegment] === undefined || target[pathSegment] === null) {
    if (operation === 'remove') {
      throw new Error('要删除的路径不存在');
    }
    // 创建中间对象
    target[pathSegment] = isArrayIndex(nextKey) ? [] : {};
  }
  return target[pathSegment];
}

/**
 * 导航到目标路径
 */
function navigateToTarget(root: any, pathParts: string[], operation: string): any {
  let target = root;

  for (let i = 0; i < pathParts.length - 1; i++) {
    const pathSegment = pathParts[i];
    const nextKey = pathParts[i + 1];

    if (Array.isArray(target)) {
      target = navigateArrayPath(target, pathSegment, nextKey, operation);
    } else {
      target = navigateObjectPath(target, pathSegment, nextKey, operation);
    }
  }

  return target;
}

/**
 * 执行数组操作
 */
function executeArrayOperation(target: any[], lastKey: string, operation: string, value: any): void {
  const arrayIndex = parseInt(lastKey, 10);

  switch (operation) {
    case 'add':
      if (arrayIndex >= target.length) {
        extendArrayToIndex(target, arrayIndex);
      }
      target[arrayIndex] = value;
      break;
    case 'replace':
      if (arrayIndex >= target.length) {
        throw new Error(`数组索引 ${arrayIndex} 超出范围，当前数组长度: ${target.length}`);
      }
      target[arrayIndex] = value;
      break;
    case 'remove':
      if (arrayIndex < target.length) {
        target.splice(arrayIndex, 1);
      }
      break;
  }
}

/**
 * 执行对象操作
 */
function executeObjectOperation(target: any, lastKey: string, operation: string, value: any): void {
  switch (operation) {
    case 'add':
    case 'replace':
      target[lastKey] = value;
      break;
    case 'remove':
      if (target && lastKey in target) {
        delete target[lastKey];
      }
      break;
  }
}

/**
 * 执行JSON Patch操作
 */
function executeOperation(target: any, lastKey: string, operation: string, value: any): void {
  if (Array.isArray(target)) {
    executeArrayOperation(target, lastKey, operation, value);
  } else {
    executeObjectOperation(target, lastKey, operation, value);
  }
}

/**
 * 应用JSON Patch操作到状态对象
 * 实现RFC6902规范的JSON Patch操作
 * @param state 原始状态对象
 * @param delta 包含patch操作的数组
 * @returns 更新后的新状态对象
 */
export function applyJsonPatch(state: any, delta: any[]): any {
  // 深拷贝原始状态，避免直接修改原对象
  const newState = JSON.parse(JSON.stringify(state));

  for (const { op, path, value } of delta) {
    try {
      // 解析路径
      const pathParts = parseJsonPointerPath(path);
      if (pathParts.length === 0) continue;

      // 导航到目标对象
      const target = navigateToTarget(newState, pathParts, op);
      const lastKey = pathParts[pathParts.length - 1];

      // 执行操作
      executeOperation(target, lastKey, op, value);
    } catch (error) {
      console.warn(`JSON Patch操作跳过: ${op} ${path} - ${error}`);
      // 继续处理下一个操作，而不是中断整个过程
    }
  }

  return newState;
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
  return content.type === 'toolcall';
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
