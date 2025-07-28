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
