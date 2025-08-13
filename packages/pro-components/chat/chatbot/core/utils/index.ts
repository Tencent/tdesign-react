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
 * 应用JSON Patch操作到状态对象
 * 实现RFC6902规范的JSON Patch操作
 * @param state 原始状态对象
 * @param delta 包含patch操作的数组
 * @returns 更新后的新状态对象
 */
export function applyJsonPatch(state: any, delta: any[]): any {
  // 深拷贝原始状态，避免直接修改原对象
  const newState = JSON.parse(JSON.stringify(state));

  delta.forEach(({ op, path, value }) => {
    try {
      // 解析路径，移除开头的斜杠
      const pathParts = path
        .slice(1)
        .split('/')
        .map((part: string) =>
          // 处理JSON Pointer转义字符
          part.replace(/~1/g, '/').replace(/~0/g, '~'),
        );

      // 找到目标对象
      let target = newState;

      // 遍历路径找到目标对象
      for (let i = 0; i < pathParts.length - 1; i++) {
        const pathSegment = pathParts[i];

        if (Array.isArray(target)) {
          const arrayIndex = parseInt(pathSegment, 10);

          // 检查数组索引是否在有效范围内
          if (arrayIndex >= target.length) {
            console.warn(`数组索引 ${arrayIndex} 超出范围，当前数组长度: ${target.length}，跳过此次更新`);
            return newState;
          }

          // 如果目标位置是null或undefined，根据下一个路径决定创建对象还是数组
          if (target[arrayIndex] === null || target[arrayIndex] === undefined) {
            const nextKey = pathParts[i + 1];
            const nextIsArrayIndex = /^\d+$/.test(nextKey);
            target[arrayIndex] = nextIsArrayIndex ? [] : {};
          }

          target = target[arrayIndex];
        } else {
          // 处理对象属性
          if (target[pathSegment] === undefined || target[pathSegment] === null) {
            if (op === 'remove') return newState; // 要删除的路径不存在，直接返回

            // 根据下一个路径决定创建对象还是数组
            const nextKey = pathParts[i + 1];
            const nextIsArrayIndex = /^\d+$/.test(nextKey);
            target[pathSegment] = nextIsArrayIndex ? [] : {};
          }
          target = target[pathSegment];
        }
      }

      const lastKey = pathParts[pathParts.length - 1];

      // 执行操作
      switch (op) {
        case 'add':
        case 'replace':
          if (Array.isArray(target)) {
            const arrayIndex = parseInt(lastKey, 10);
            // 检查数组索引是否在有效范围内
            if (arrayIndex >= target.length) {
              console.warn(`数组索引 ${arrayIndex} 超出范围，当前数组长度: ${target.length}，跳过此次更新`);
              return newState;
            }
            target[arrayIndex] = value;
          } else {
            target[lastKey] = value;
          }
          break;
        case 'remove':
          if (Array.isArray(target)) {
            const arrayIndex = parseInt(lastKey, 10);
            if (arrayIndex < target.length) {
              target.splice(arrayIndex, 1);
            }
          } else if (target && lastKey in target) {
            delete target[lastKey];
          }
          break;
        // 可以根据需要实现其他操作: test, move, copy
      }
    } catch (error) {
      console.error(`JSON Patch操作失败: ${op} ${path}`, error);
    }
  });

  return newState;
}

export function applyJsonPatch2(state: any, delta: any[]): any {
  const newState = { ...state };
  delta.forEach(({ op, path, value }) => {
    // 这里只实现 add/replace，remove 可按需补充
    const keys = path.slice(1).split('/');
    let target = newState;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) target[keys[i]] = {};
      target = target[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    if (op === 'replace' || op === 'add') {
      target[lastKey] = value;
    } else if (op === 'remove') {
      delete target[lastKey];
    }
  });
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
