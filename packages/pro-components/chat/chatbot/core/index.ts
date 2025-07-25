/* eslint-disable class-methods-use-this */
import { AGUIEventMapper } from './adapters/agui/agui-event-mapper';
import { MessageStore } from './store/message';
import { LLMService } from './server';
import MessageProcessor from './processor';
import type {
  AIContentChunkUpdate,
  AIMessageContent,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatRequestParams,
  ChatServiceConfig,
  ChatServiceConfigSetter,
  SSEChunkData,
  SystemMessage,
} from './type';
import { isAIMessage } from './utils';
import { EventType } from './adapters/agui/events';

export interface IChatEngine {
  init(config?: any, messages?: ChatMessagesData[]): void;
  sendUserMessage(params: ChatRequestParams): Promise<void>;
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;
  abortChat(): Promise<void>;
  setMessages(messages: ChatMessagesData[], mode?: ChatMessageSetterMode): void;
  registerMergeStrategy<T extends AIMessageContent>(type: T['type'], handler: (chunk: T, existing?: T) => T): void;

  // 属性访问
  get messageStore(): MessageStore;
}

export default class ChatEngine implements IChatEngine {
  public messageStore: MessageStore;

  private processor: MessageProcessor;

  private llmService: LLMService;

  private config: ChatServiceConfig;

  private lastRequestParams: ChatRequestParams | undefined;

  private stopReceive = false;

  private aguiEventMapper: AGUIEventMapper | null = null;

  constructor() {
    this.processor = new MessageProcessor();
    this.messageStore = new MessageStore();
  }

  public init(configSetter: ChatServiceConfigSetter, initialMessages?: ChatMessagesData[]) {
    this.messageStore.initialize(this.convertMessages(initialMessages));
    this.config = typeof configSetter === 'function' ? configSetter() : configSetter || {};
    this.llmService = new LLMService(this.config);
    // 初始化AG-UI事件映射器
    if (this.config.protocol === 'agui') {
      this.aguiEventMapper = new AGUIEventMapper();
    }
  }

  public async sendUserMessage(requestParams: ChatRequestParams) {
    const { prompt, attachments } = requestParams;
    const userMessage = this.processor.createUserMessage(prompt, attachments);
    const aiMessage = this.processor.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);
    const params = {
      prompt,
      attachments,
      messageID: aiMessage.id,
    };
    this.sendRequest(params);
  }

  public async sendSystemMessage(msg: string) {
    this.messageStore.createMessage({
      role: 'system',
      content: [
        {
          type: 'text',
          data: msg,
        },
      ],
    } as SystemMessage);
  }

  public async abortChat() {
    this.stopReceive = true;

    if (this.config?.onAbort) {
      await this.config.onAbort();
    }

    try {
      this.llmService.closeConnect();
      if (!this.config.stream) {
        // 只有在批量模式下才删除最后一条AI消息
        if (this.messageStore.lastAIMessage?.id) {
          this.messageStore.removeMessage(this.messageStore.lastAIMessage.id);
        }
      }
    } catch (error) {
      console.warn('Error during service cleanup:', error);
    }
  }

  public registerMergeStrategy<T extends AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) {
    this.processor.registerHandler(type, handler);
  }

  public setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.messageStore.setMessages(messages, mode);
  }

  // 用户触发重新生成 -> 检查最后一条AI消息 ->
  // -> keepVersion=false: 删除旧消息 -> 创建新消息 -> 重新请求
  // -> keepVersion=true: 保留旧消息 -> 创建分支消息 -> 重新请求
  public async regenerateAIMessage(keepVersion = false) {
    const { lastAIMessage, lastUserMessage } = this.messageStore;
    if (!lastAIMessage) return;

    if (!this.lastRequestParams && lastUserMessage) {
      // 应对历史消息也有重新生成的情况
      const { content, id } = lastUserMessage;
      this.lastRequestParams = {
        prompt: content.filter((c) => c.type === 'text')[0].data,
        attachments: content.filter((c) => c.type === 'attachment')?.[0]?.data,
        messageID: id,
      };
    }
    if (!keepVersion) {
      // 删除最后一条AI消息
      this.messageStore.removeMessage(lastAIMessage.id);
    } else {
      // todo: 保留历史版本，创建新分支
      this.messageStore.createMessageBranch(lastAIMessage.id);
    }

    // 创建新的AI消息
    const newAIMessage = this.processor.createAssistantMessage();
    this.messageStore.createMessage(newAIMessage);

    // 重新发起请求
    const params = {
      ...this.lastRequestParams,
      messageID: newAIMessage.id,
      prompt: this.lastRequestParams?.prompt ?? ''
    };

    await this.sendRequest(params);
  }

  public async sendRequest(params: ChatRequestParams) {
    const { messageID: id } = params;
    try {
      if (this.config.stream) {
        // 处理sse流式响应模式
        this.stopReceive = false;
        await this.handleStreamRequest(params);
      } else {
        // 处理批量响应模式
        await this.handleBatchRequest(params);
      }
      this.lastRequestParams = params;
    } catch (error) {
      this.setMessageStatus(id!, 'error');
      throw error;
    }
  }

  private async handleBatchRequest(params: ChatRequestParams) {
    const id = params.messageID;
    if (!id) return;
    this.setMessageStatus(id, 'pending');
    const result = await this.llmService.handleBatchRequest(params, this.config);
    if (result) {
      this.processMessageResult(id, result);
      this.setMessageStatus(id, 'complete');
    } else {
      this.setMessageStatus(id, 'error');
    }
  }

  private handleError(id: string, error: any) {
    this.setMessageStatus(id, 'error');
    this.config.onError?.(error);
  }

  private handleComplete(id: string, isAborted: boolean, params: ChatRequestParams, chunk?: any) {
    // 所有消息内容块都失败才算消息体失败
    const allContentFailed = this.messageStore.messages.every((content) => content.status === 'error');
    // eslint-disable-next-line no-nested-ternary
    this.setMessageStatus(id, isAborted ? 'stop' : allContentFailed ? 'error' : 'complete');

    // 返回空数组以满足类型要求
    return this.config.onComplete?.(isAborted, params, chunk);
  }

  private async handleStreamRequest(params: ChatRequestParams) {
    const id = params.messageID;
    const isAGUI = this.config.protocol === 'agui';
    this.setMessageStatus(id, 'streaming'); // todo: 这里应该在建立连接后在streaming
    await this.llmService.handleStreamRequest(params, {
      ...this.config,
      onStart: (chunk) => {
        if (!isAGUI) this.config.onStart?.(chunk);
      },
      onMessage: (chunk: SSEChunkData) => {
        if (this.stopReceive) return null;
        let result = null;
        if (this.config.onMessage) {
          result = this.config.onMessage(chunk, this.messageStore.getMessageByID(id));
        }
        // 统一处理 AG-UI 协议
        if (isAGUI && this.aguiEventMapper) {
          const event = chunk.data;
          if (!event?.type) return null;
          switch (event.type) {
            case EventType.RUN_STARTED:
              this.config.onStart?.(event);
              break;
            case EventType.RUN_FINISHED:
              this.handleComplete(id, false, params, event);
              break;
            case EventType.RUN_ERROR:
              this.handleError(id, event);
              break;
          }
          // 如果用户未处理，使用默认映射器
          if (!result) {
            result = this.aguiEventMapper.mapEvent(chunk);
          }
        }
        // 统一处理结果
        this.processMessageResult(id!, result);
        return result;
      },
      onError: (error) => {
        this.handleError(id!, error);
      },
      onComplete: (isAborted) => {
        if (!isAGUI || isAborted) {
          return this.handleComplete(id!, isAborted, params);
        }
      },
    });
  }

  /**
   * 统一处理消息结果
   * 支持单个内容块、多个内容块和增量更新
   */
  private processMessageResult(messageId: string, result: AIMessageContent | AIMessageContent[] | null) {
    if (!result) return;

    if (Array.isArray(result)) {
      // 处理多个内容块
      this.messageStore.updateMultipleContents(messageId, result);
    } else {
      // 处理单个内容块
      this.processContentUpdate(messageId, result);
    }
  }

  private convertMessages(messages?: ChatMessagesData[]) {
    if (!messages) return { messageIds: [], messages: [] };

    return {
      messageIds: messages.map((msg) => msg.id),
      messages,
    };
  }

  private setMessageStatus(messageId: string, status: ChatMessagesData['status']) {
    this.messageStore.setMessageStatus(messageId, status);
  }

  // 处理内容更新逻辑
  private processContentUpdate(messageId: string, rawChunk: AIContentChunkUpdate) {
    const message = this.messageStore.messages.find((m) => m.id === messageId);
    if (!message || !isAIMessage(message)) return;

    //  // 只需要处理最后一个内容快
    //  const lastContent = message.content.at(-1);
    //  const processed = this.processor.processContentUpdate(lastContent, rawChunk);
    //  this.messageStore.appendContent(messageId, processed);

    let targetIndex;
    // 作为新的内容块追加
    if (rawChunk?.strategy === 'append') {
      targetIndex = -1;
    } else {
      // 合并/替换到现有同类型内容中
      targetIndex = message.content.findLastIndex((content) => content.type === rawChunk.type);
    }
    const processed = this.processor.processContentUpdate(
      targetIndex !== -1 ? message.content[targetIndex] : undefined,
      rawChunk,
    );

    this.messageStore.appendContent(messageId, processed, targetIndex);
  }
}

export * from './utils';

// ... existing code ...
// export default class ChatEngine implements IChatEngine {
//   // 移除原有的 processor 实例

//   public registerMergeStrategy<T extends AIMessageContent>(
//     type: T['type'],
//     handler: (chunk: T, existing?: T) => T
//   ) {
//     // 直接注册到策略中心
//     strategyRegistry.register(type, handler);
//   }

//   // 修改 processContentUpdate 方法
//   private processContentUpdate(messageId: string, rawChunk: AIContentChunkUpdate) {
//     // ... 原有逻辑 ...
//     // 替换为：
//     const strategy = strategyRegistry.get(rawChunk.type);
//     const processed = strategy
//       ? strategy(rawChunk, lastContent)
//       : this.defaultMerge(rawChunk, lastContent);
//     // ...
//   }
// }

// 使用：注册自定义策略
// chatEngine.registerMergeStrategy('agent', (chunk, existing) => {
//   const updated = { ...existing, ...chunk };
//   // 自定义合并逻辑...
//   return updated;
// });
