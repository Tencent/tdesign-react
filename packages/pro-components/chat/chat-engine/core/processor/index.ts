/* eslint-disable class-methods-use-this */
import type {
  AIContentChunkUpdate,
  AIMessage,
  AIMessageContent,
  AttachmentItem,
  ChatMessagesData,
  ImageContent,
  MarkdownContent,
  SearchContent,
  TextContent,
  ThinkingContent,
  UserMessage,
} from '../type';
import type { MessageStore } from '../store/message';
import { isAIMessage } from '../utils';

export default class MessageProcessor {
  private contentHandlers: Map<string, (chunk: any, existing?: any) => any> = new Map();

  constructor() {
    this.registerDefaultHandlers();
  }

  public createUserMessage(content, attachments?: AttachmentItem[]): ChatMessagesData {
    const messageContent: UserMessage['content'] = [
      {
        type: 'text',
        data: content,
      },
    ];

    if (attachments?.length) {
      messageContent.push({
        type: 'attachment',
        data: attachments,
      });
    }

    return {
      id: this.generateID(),
      role: 'user',
      status: 'complete',
      datetime: `${Date.now()}`,
      content: messageContent,
    };
  }

  public createAssistantMessage(msg?: { content?: AIMessageContent[]; status?: AIMessage['status'] }): AIMessage {
    const { content = [], status = 'pending' } = msg || {};

    return {
      id: this.generateID(),
      role: 'assistant',
      content,
      status,
      datetime: new Date().toISOString(),
    };
  }

  // 处理内容更新（单个内容块的合并策略）
  public processContentUpdate(lastContent: AIMessageContent | undefined, newChunk: AIMessageContent): AIMessageContent {
    const handler = this.contentHandlers.get(newChunk.type);
    if (!lastContent) {
      return {
        ...newChunk,
        status: newChunk?.status || 'streaming',
      };
    }
    // 如果有注册的处理器且类型匹配
    if (handler && lastContent?.type === newChunk.type) {
      return handler(newChunk, lastContent);
    }
    // 没有处理器时的默认合并逻辑
    return {
      ...(lastContent || {}),
      ...newChunk,
      status: newChunk?.status || 'streaming',
    };
  }

  /**
   * 应用内容更新到消息存储
   *
   * 从 ChatEngine.processContentUpdate + processMessageResult 合并而来。
   * 统一处理单个/多个内容块的更新逻辑，包括 append/merge 策略判断。
   */
  public applyContentUpdate(
    messageStore: MessageStore,
    messageId: string,
    result: AIMessageContent | AIMessageContent[] | null,
  ): void {
    if (!result) return;

    // 根据原始类型选择更新方式
    if (Array.isArray(result)) {
      messageStore.updateMultipleContents(messageId, result);
    } else {
      this.applyChunkToMessage(messageStore, messageId, result);
    }
  }

  /**
   * 将单个内容块应用到指定消息
   *
   * 从 ChatEngine.processContentUpdate 移入。
   * 处理 append（新建内容块追加） 和 merge（按 type 查找并合并）两种策略。
   *
   * 跨消息查找：当 merge 策略在当前消息找不到匹配的内容块时，
   * 会向前查找历史 AI 消息。典型场景：交互式 Toolcall 的 start 在前一条消息中，
   * 用户回传后 sendAIMessage 创建了新消息，result 事件需要更新前一条消息的 toolcall。
   */
  private applyChunkToMessage(messageStore: MessageStore, messageId: string, rawChunk: AIContentChunkUpdate): void {
    const message = messageStore.messages.find((m) => m.id === messageId);
    if (!message || !isAIMessage(message) || !message.content) return;

    let targetIndex: number;
    let targetMessageId = messageId;

    // 作为新的内容块追加
    if ((rawChunk as any)?.strategy === 'append') {
      targetIndex = -1;
    } else {
      // merge 策略：按 type 查找最后一个匹配的类型
      targetIndex = this.findLastContentIndex(message.content, rawChunk.type);

      // 跨消息查找：当前消息没找到，向前搜索历史 AI 消息
      // 仅对 toolcall 类型生效。典型场景：交互式 Toolcall 的 start 在前一条消息中，
      // 用户回传后 sendAIMessage 创建了新消息，result 事件需要更新前一条消息的 toolcall。
      // 注意：Activity 类型不做跨消息查找，因为其 merge 语义是同一消息内的增量更新，
      // 跨消息时应由后端重新发 SNAPSHOT 创建新内容块。
      if (targetIndex === -1 && rawChunk.type.startsWith('toolcall-')) {
        const crossResult = this.findContentInPreviousMessages(messageStore, messageId, rawChunk.type);
        if (crossResult) {
          targetMessageId = crossResult.messageId;
          targetIndex = crossResult.contentIndex;
        }
      }
    }

    const existingContent = targetIndex !== -1
      ? (messageStore.messages.find((m) => m.id === targetMessageId) as any)?.content?.[targetIndex]
      : undefined;

    const processed = this.processContentUpdate(existingContent, rawChunk);
    messageStore.appendContent(targetMessageId, processed, targetIndex);
  }

  /**
   * 在消息内容数组中查找最后一个匹配 type 的索引
   */
  private findLastContentIndex(contents: AIMessageContent[], type: string): number {
    for (let i = contents.length - 1; i >= 0; i--) {
      if (contents[i].type === type) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 向前搜索历史 AI 消息中匹配指定 type 的内容块
   *
   * 典型场景：
   * 1. 交互式 Toolcall：start 在消息 A 中，用户回传后 sendAIMessage 创建消息 B，
   *    后端推送的 result 事件需要更新消息 A 中的 toolcall 内容块
   * 2. 跨消息的 Activity 更新（如 delta 事件对应的 snapshot 在前一条消息中）
   */
  private findContentInPreviousMessages(
    messageStore: MessageStore,
    currentMessageId: string,
    type: string,
  ): { messageId: string; contentIndex: number } | null {
    const messages = messageStore.messages;
    const currentIndex = messages.findIndex((m) => m.id === currentMessageId);
    if (currentIndex <= 0) return null;

    // 从当前消息的前一条开始向前搜索
    for (let i = currentIndex - 1; i >= 0; i--) {
      const msg = messages[i];
      if (!isAIMessage(msg) || !msg.content) continue;

      const contentIndex = this.findLastContentIndex(msg.content, type);
      if (contentIndex !== -1) {
        return { messageId: msg.id, contentIndex };
      }
    }

    return null;
  }

  // 通用处理器注册方法
  public registerHandler<T extends AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) {
    this.contentHandlers.set(type, handler);
  }

  private generateID() {
    return `msg_${Date.now()}_${Math.floor(Math.random() * 90000) + 10000}`;
  }

  // 注册默认支持的内容处理器
  private registerDefaultHandlers() {
    this.registerTextHandlers();
    this.registerThinkingHandler();
    this.registerImageHandler();
    this.registerSearchHandler();
  }

  // 通用处理器工厂
  private createContentHandler<T extends AIMessageContent>(
    mergeData: (existing: T['data'], incoming: T['data']) => T['data'],
  ): (chunk: T, existing?: T) => T {
    return (chunk: T, existing?: T): T => {
      if (existing?.type === chunk.type) {
        return {
          ...existing,
          data: mergeData(existing.data, chunk.data),
          status: chunk.status || 'streaming',
          // 合并ext字段，确保动态属性能够正确传递
          ext: {
            ...existing.ext,
            ...chunk.ext,
          },
        };
      }
      return {
        ...chunk,
        data: chunk.data,
        status: chunk.status || 'streaming',
      };
    };
  }

  // 文本类处理器（text/markdown）
  private registerTextHandlers() {
    // 创建类型安全的处理器
    const createTextHandler = <T extends TextContent | MarkdownContent>() =>
      this.createContentHandler<T>((existing: string, incoming: string) => existing + incoming);

    this.registerHandler<TextContent>('text', createTextHandler<TextContent>());
    this.registerHandler<MarkdownContent>('markdown', createTextHandler<MarkdownContent>());
  }

  // 思考过程处理器
  private registerThinkingHandler() {
    this.registerHandler<ThinkingContent>(
      'thinking',
      this.createContentHandler((existing, incoming) => ({
        ...existing,
        ...incoming,
        text: (existing?.text || '') + (incoming?.text || ''),
      })),
    );
  }

  // 图片处理器
  private registerImageHandler() {
    this.registerHandler<ImageContent>(
      'image',
      this.createContentHandler((existing, incoming) => ({ ...existing, ...incoming })),
    );
  }

  // 搜索处理器
  private registerSearchHandler() {
    this.registerHandler<SearchContent>(
      'search',
      this.createContentHandler((existing, incoming) => ({
        ...existing,
        ...incoming,
      })),
    );
  }
}
