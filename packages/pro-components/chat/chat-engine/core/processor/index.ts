/* eslint-disable class-methods-use-this */
import type {
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

  // 处理内容更新
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
