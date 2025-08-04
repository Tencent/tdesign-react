/* eslint-disable class-methods-use-this */
import { MessageStore } from './store/message';
import { LLMService } from './server';
import MessageProcessor from './processor';
import { AGUIAdapter } from './adapters/agui';
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

  private messageProcessor: MessageProcessor;

  private llmService!: LLMService;

  private config!: ChatServiceConfig;

  private lastRequestParams: ChatRequestParams | undefined;

  private stopReceive = false;

  private aguiAdapter: AGUIAdapter | null = null;

  constructor() {
    this.messageProcessor = new MessageProcessor();
    this.messageStore = new MessageStore();
  }

  public init(configSetter: ChatServiceConfigSetter, initialMessages?: ChatMessagesData[]) {
    this.messageStore.initialize(this.convertMessages(initialMessages));
    this.config = typeof configSetter === 'function' ? configSetter() : configSetter || {};
    this.llmService = new LLMService(this.config);
    // 初始化AGUI适配器
    if (this.config.protocol === 'agui') {
      this.aguiAdapter = new AGUIAdapter();
    }
  }

  public async sendUserMessage(requestParams: ChatRequestParams) {
    const { prompt, attachments } = requestParams;
    const userMessage = this.messageProcessor.createUserMessage(prompt, attachments);
    const aiMessage = this.messageProcessor.createAssistantMessage();
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

  // 继续上一轮对话
  public async continueChat(params: ChatRequestParams) {
    await this.sendRequest({
      ...this.lastRequestParams,
      ...params,
    });
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
    this.messageProcessor.registerHandler(type, handler);
  }

  public setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.messageStore.setMessages(messages, mode);
  }

  // 用户触发重新生成 -> 检查最后一条AI消息 ->
  // -> keepVersion=false: 删除旧消息 -> 创建新消息 -> 重新请求
  // -> keepVersion=true: 保留旧消息 -> 创建分支消息 -> 重新请求
  public async regenerateAIMessage(keepVersion = false) {
    const { lastAIMessage } = this.messageStore;
    if (!lastAIMessage) return;

    if (!keepVersion) {
      // 删除最后一条AI消息
      this.messageStore.removeMessage(lastAIMessage.id);
    } else {
      // todo: 保留历史版本，创建新分支
      this.messageStore.createMessageBranch(lastAIMessage.id);
    }

    // 创建新的AI消息
    const newAIMessage = this.messageProcessor.createAssistantMessage();
    this.messageStore.createMessage(newAIMessage);

    // 重新发起请求
    const params = {
      ...this.lastRequestParams,
      messageID: newAIMessage.id,
      prompt: this.lastRequestParams?.prompt ?? '',
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
    // 先调用用户自定义的 onComplete 回调，让业务层决定如何处理
    const customResult = this.config.onComplete?.(isAborted, params, chunk);

    // 如果用户返回了自定义内容，处理这些内容
    if (Array.isArray(customResult) || customResult?.status) {
      this.processMessageResult(id, customResult);
    } else {
      // 所有消息内容块都失败才算消息体失败
      const allContentFailed = this.messageStore.messages.every((content) => content.status === 'error');
      // eslint-disable-next-line no-nested-ternary
      this.setMessageStatus(id, isAborted ? 'stop' : allContentFailed ? 'error' : 'complete');
    }
  }

  /**
   * 处理流式请求
   * 根据协议类型选择不同的处理策略
   */
  private async handleStreamRequest(params: ChatRequestParams) {
    const id = params.messageID;
    const isAGUI = this.config.protocol === 'agui';

    if (id) {
      this.setMessageStatus(id, 'streaming');
    }

    // 根据协议类型选择处理策略
    if (isAGUI && this.aguiAdapter) {
      await this.handleAGUIStreamRequest(params, id);
    } else {
      await this.handleDefaultStreamRequest(params, id);
    }
  }

  /**
   * 处理AGUI协议的流式请求
   */
  private async handleAGUIStreamRequest(params: ChatRequestParams, messageId?: string) {
    await this.llmService.handleStreamRequest(params, {
      ...this.config,
      onMessage: (chunk: SSEChunkData) => {
        if (this.stopReceive || !messageId) return null;

        let result;

        // SSE数据 → AGUIEventMapper.mapEvent → 用户自定义onMessage(解析后数据 + 原始chunk)
        // 首先使用AGUI适配器进行通用协议解析
        if (this.aguiAdapter) {
          result = this.aguiAdapter.handleAGUIEvent(chunk, {
            onRunStart: (event) => this.config.onStart?.(JSON.stringify(event)),
            onRunComplete: (isAborted, params, event) => this.handleComplete(messageId, isAborted, params, event),
            onRunError: (error) => this.handleError(messageId, error),
          });
        }

        // 然后调用用户自定义的onMessage，传入解析后的结果和原始数据
        if (this.config.onMessage) {
          const userResult = this.config.onMessage(chunk, this.messageStore.getMessageByID(messageId), result);
          // 如果用户返回了自定义结果，使用用户的结果
          if (userResult) {
            result = userResult;
          }
        }

        // 处理消息结果
        this.processMessageResult(messageId, result);
        return result;
      },
      onError: (error) => {
        if (messageId) this.handleError(messageId, error);
      },
      onComplete: (isAborted) => {
        // AGUI的完成事件由AGUIAdapter内部处理，这里只处理中断情况
        if (isAborted && messageId) {
          this.handleComplete(messageId, isAborted, params);
        }
      },
    });
  }

  /**
   * 处理默认协议的流式请求
   */
  private async handleDefaultStreamRequest(params: ChatRequestParams, messageId?: string) {
    await this.llmService.handleStreamRequest(params, {
      ...this.config,
      onStart: (chunk) => {
        this.config.onStart?.(chunk);
      },
      onMessage: (chunk: SSEChunkData) => {
        if (this.stopReceive || !messageId) return null;

        let result = null;

        // 使用默认的消息处理
        if (this.config.onMessage) {
          result = this.config.onMessage(chunk, this.messageStore.getMessageByID(messageId));
        }

        // 处理消息结果
        this.processMessageResult(messageId, result);
        return result;
      },
      onError: (error) => {
        if (messageId) this.handleError(messageId, error);
      },
      onComplete: (isAborted) => {
        if (messageId) {
          this.handleComplete(messageId, isAborted, params);
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

    // 处理工具调用 - 仅在AGUI协议下处理
    // if (this.aguiAdapter) {
    //   const toolCalls = this.aguiAdapter.processToolCalls(result);
    //   if (toolCalls.length > 0) {
    //     this.messageStore.setMessageToolCalls(messageId, toolCalls);
    //   }
    // }

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
    if (!message || !isAIMessage(message) || !message.content) return;

    //  // 只需要处理最后一个内容快
    //  const lastContent = message.content.at(-1);
    //  const processed = this.messageProcessor.processContentUpdate(lastContent, rawChunk);
    //  this.messageStore.appendContent(messageId, processed);

    let targetIndex;
    // 作为新的内容块追加
    if (rawChunk?.strategy === 'append') {
      targetIndex = -1;
    } else {
      // 合并/替换到现有同类型内容中
      targetIndex = message.content.findIndex((content: AIMessageContent) => content.type === rawChunk.type);
      if (targetIndex !== -1) {
        // 找到最后一个匹配的类型
        for (let i = message.content.length - 1; i >= 0; i--) {
          if (message.content[i].type === rawChunk.type) {
            targetIndex = i;
            break;
          }
        }
      }
    }
    const processed = this.messageProcessor.processContentUpdate(
      targetIndex !== -1 ? message.content[targetIndex] : undefined,
      rawChunk,
    );

    this.messageStore.appendContent(messageId, processed, targetIndex);
  }
}

export * from './utils';
