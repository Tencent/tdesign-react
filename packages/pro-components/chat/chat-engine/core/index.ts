/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { AGUIAdapter } from './adapters/agui';
import { MessageStore } from './store/message';
import type { ChatEventBusOptions, IChatEventBus } from './event-bus';
import { ChatEngineEventType, ChatEventBus } from './event-bus';
import MessageProcessor from './processor';
import { LLMService } from './server';
import type {
  AIContentChunkUpdate,
  AIMessageContent,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatRequestParams,
  ChatServiceConfig,
  ChatServiceConfigSetter,
  ChatStatus,
  IChatEngine,
  SSEChunkData,
  SystemMessage,
  ToolCall,
} from './type';
import { isAIMessage } from './utils';

export default class ChatEngine implements IChatEngine {
  public messageStore: MessageStore;

  /**
   * 事件总线实例
   * @description 用于发布/订阅引擎事件，支持无 UI 场景下的事件分发
   */
  public readonly eventBus: IChatEventBus;

  private messageProcessor: MessageProcessor;

  private llmService!: LLMService;

  private config!: ChatServiceConfig;

  private lastRequestParams: ChatRequestParams | undefined;

  private stopReceive = false;

  private aguiAdapter: AGUIAdapter | null = null;

  constructor(eventBusOptions?: ChatEventBusOptions) {
    this.messageProcessor = new MessageProcessor();
    this.messageStore = new MessageStore();
    this.eventBus = new ChatEventBus(eventBusOptions);
  }

  /**
   * 获取当前所有消息
   * @returns 消息数组
   * @description 返回消息存储中的所有消息
   */
  get messages(): ChatMessagesData[] {
    return this.messageStore.messages;
  }

  /**
   * 获取当前聊天状态
   * @returns 聊天状态：'idle'、'pending'、'streaming'、'complete'、'stop'或'error'
   * @description 返回最后一条消息的状态，如果没有消息则返回'idle'
   */
  get status(): ChatStatus {
    return this.messages.at(-1)?.status || 'idle';
  }

  /**
   * 销毁聊天引擎实例
   * @description 中止请求，清理消息存储和适配器，释放资源
   */
  destroy(): void {
    // 发布销毁事件
    this.eventBus.emit(ChatEngineEventType.ENGINE_DESTROY, {
      timestamp: Date.now(),
    });

    // 中止当前请求
    this.abortChat();

    // 清理消息存储
    this.messageStore.clearHistory();
    this.messageStore.destroy();

    // 清理适配器
    this.aguiAdapter = null;

    // 销毁事件总线
    this.eventBus.destroy();
  }

  /**
   * 初始化聊天引擎
   * @param configSetter 聊天服务配置或配置生成函数
   * @param initialMessages 初始消息列表，用于恢复历史对话
   * @description 设置初始消息、配置服务参数，并根据协议类型初始化适配器
   */
  public init(configSetter: ChatServiceConfigSetter, initialMessages?: ChatMessagesData[]) {
    this.messageStore.initialize(this.convertMessages(initialMessages));
    this.config = typeof configSetter === 'function' ? configSetter() : configSetter || {};
    this.llmService = new LLMService();

    // 初始化AGUI适配器
    if (this.config.protocol === 'agui') {
      this.aguiAdapter = new AGUIAdapter();
    }

    // OpenClaw 协议：立即建立 WebSocket 连接并完成握手
    // Gateway 会在 connect 响应中推送历史消息，通过 onHistoryLoaded 自动回填
    if (this.config.protocol === 'openclaw' && this.config.endpoint) {
      this.llmService.connectOpenClaw({
        ...this.config,
        onHistoryLoaded: (historyMessages) => {
          if (historyMessages && historyMessages.length > 0) {
            this.messageStore.setMessages(historyMessages, 'replace');
            this.config.onHistoryLoaded?.(historyMessages);
          }
        },
      });
    }

    // 发布初始化事件
    this.eventBus.emit(ChatEngineEventType.ENGINE_INIT, {
      timestamp: Date.now(),
    });
  }

  /**
   * 发送用户消息并获取AI回复
   * @param requestParams 请求参数，包含用户输入的文本和附件
   * @param sendRequest 是否立即发送
   * @description 创建用户消息和AI消息，并发送请求获取AI回复
   */
  public async sendUserMessage(requestParams: ChatRequestParams, sendRequest = true) {
    const { prompt, attachments, ...customParams } = requestParams;

    // 检查条件：prompt和attachments至少传入一个，且如果设置了就不能为空
    const hasValidPrompt = prompt && prompt.trim() !== '';
    const hasValidAttachments = Array.isArray(attachments) && attachments.length > 0;

    // 如果两者都没有有效值，则直接返回
    if (!hasValidPrompt && !hasValidAttachments) {
      console.warn('[ChatEngine] sendUserMessage: 必须提供有效的prompt或attachments');
      return;
    }

    const userMessage = this.messageProcessor.createUserMessage(prompt, attachments);
    const aiMessage = this.messageProcessor.createAssistantMessage();
    this.messageStore.createMultiMessages([userMessage, aiMessage]);

    // 发布消息创建事件
    this.eventBus.emit(ChatEngineEventType.MESSAGE_CREATE, {
      message: userMessage,
      messages: this.messages,
    });

    if (sendRequest) {
      const params = {
        ...requestParams,
        messageID: aiMessage.id,
        ...customParams, // 透传用户自定义参数
      };
      this.sendRequest(params);
    }
  }

  /**
   * 发送系统消息
   * @param msg 系统消息文本内容
   * @description 创建并存储一条系统消息，通常用于设置上下文或控制对话流程
   */
  public async sendSystemMessage(msg: string) {
    const systemMessage = {
      role: 'system',
      content: [
        {
          type: 'text',
          data: msg,
        },
      ],
    } as SystemMessage;
    this.messageStore.createMessage(systemMessage);

    // 发布消息创建事件
    this.eventBus.emit(ChatEngineEventType.MESSAGE_CREATE, {
      message: systemMessage,
      messages: this.messages,
    });
  }

  /**
   * 手动发送AI消息
   * @param options 包含请求参数params、发送消息内容content和是否发送请求的标志sendRequest
   * @description 创建并存储一条AI消息，可选择是否同时发送请求
   */
  public async sendAIMessage(
    options: { params?: ChatRequestParams; content?: AIMessageContent[]; sendRequest?: boolean } = {},
  ) {
    const { params = {}, content, sendRequest = true } = options;
    const newAIMessage = this.messageProcessor.createAssistantMessage({
      content,
      status: sendRequest ? 'pending' : 'complete',
    });
    this.messageStore.createMessage(newAIMessage);

    // 发布消息创建事件
    this.eventBus.emit(ChatEngineEventType.MESSAGE_CREATE, {
      message: newAIMessage,
      messages: this.messages,
    });

    if (sendRequest) {
      params.messageID = newAIMessage.id;
      await this.sendRequest(params);
    }
  }

  /**
   * 中止当前进行中的聊天请求
   * @description 停止接收流式响应，关闭连接，并调用配置的onAbort回调
   */
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
          const messageId = this.messageStore.lastAIMessage.id;
          this.messageStore.removeMessage(messageId);

          // 发布消息删除事件
          this.eventBus.emit(ChatEngineEventType.MESSAGE_DELETE, {
            messageId,
            messages: this.messages,
          });
        }
      }
    } catch (error) {
      console.warn('Error during service cleanup:', error);
    }
  }

  /**
   * 注册内容块合并策略
   * @param type 内容类型，如'text'、'markdown'等
   * @param handler 合并处理函数，接收新块和现有块，返回合并后的内容块
   * @description 用于自定义不同类型内容的增量更新逻辑
   */
  public registerMergeStrategy<T extends AIMessageContent>(
    type: T['type'], // 使用类型中定义的type字段作为参数类型
    handler: (chunk: T, existing?: T) => T,
  ) {
    this.messageProcessor.registerHandler(type, handler);
  }

  /**
   * 设置消息列表
   * @param messages 要设置的消息数组
   * @param mode 设置模式：'replace'(替换)、'prepend'(前置)、'append'(追加)，默认为'replace'
   * @description 用于批量更新消息，如加载历史消息或重置对话
   */
  public setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.messageStore.setMessages(messages, mode);
  }

  /**
   * 清空所有消息
   * @description 清除消息存储中的所有历史记录
   */
  public clearMessages(): void {
    this.messageStore.clearHistory();

    // 发布消息清空事件
    this.eventBus.emit(ChatEngineEventType.MESSAGE_CLEAR, {
      timestamp: Date.now(),
    });
  }

  /**
   * 重新生成AI回复
   * @param keepVersion 是否保留历史版本，默认为false
   * @description
   * - 当keepVersion=false时：删除最后一条AI消息，创建新消息并重新请求
   * - 当keepVersion=true时：保留旧消息，创建分支消息并重新请求
   */
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
      ...(this.lastRequestParams || {}),
      messageID: newAIMessage.id,
      prompt: this.lastRequestParams?.prompt ?? '',
    };

    await this.sendRequest(params);
  }

  /**
   * 发送请求获取AI回复
   * @param params 请求参数
   * @description 根据配置选择流式或批量请求模式，处理响应并更新消息状态
   */
  public async sendRequest(params: ChatRequestParams) {
    const { messageID: id } = params;

    // 发布请求开始事件
    this.eventBus.emit(ChatEngineEventType.REQUEST_START, {
      params,
      messageId: id,
    });

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

      // 发布请求错误事件
      this.eventBus.emit(ChatEngineEventType.REQUEST_ERROR, {
        messageId: id!,
        error,
        params,
      });

      throw error;
    }
  }

  /**
   * 根据名称获取工具调用
   * @param name 工具调用名称
   * @returns 匹配的工具调用对象，如果未找到则返回undefined
   * @description 用于获取特定名称的工具调用信息，仅在AGUI协议下可用
   */
  public getToolcallByName(name: string): ToolCall | undefined {
    return this.aguiAdapter?.getToolcallByName(name);
  }

  private async handleBatchRequest(params: ChatRequestParams) {
    const id = params.messageID;
    if (!id) return;
    this.setMessageStatus(id, 'pending');
    const result = await this.llmService.handleBatchRequest(params, this.config);
    if (result) {
      this.processMessageResult(id, result);
      this.setMessageStatus(id, 'complete');

      // 发布请求完成事件
      const message = this.messageStore.getMessageByID(id);
      if (message) {
        this.eventBus.emit(ChatEngineEventType.REQUEST_COMPLETE, {
          messageId: id,
          params,
          message,
        });
      }
    } else {
      this.setMessageStatus(id, 'error');

      // 发布请求错误事件
      this.eventBus.emit(ChatEngineEventType.REQUEST_ERROR, {
        messageId: id,
        error: new Error('Batch request returned empty result'),
        params,
      });
    }
  }

  private handleError(id: string, error: unknown) {
    this.setMessageStatus(id, 'error');
    this.config.onError?.(error as Error);

    // 发布请求错误事件
    this.eventBus.emit(ChatEngineEventType.REQUEST_ERROR, {
      messageId: id,
      error,
    });
  }

  private handleComplete(id: string, isAborted: boolean, params: ChatRequestParams, chunk?: unknown) {
    // 先调用用户自定义的 onComplete 回调，让业务层决定如何处理
    const customResult = this.config.onComplete?.(isAborted, params, chunk);
    // 如果用户返回了自定义内容，处理这些内容
    if (Array.isArray(customResult) || (customResult && 'status' in customResult)) {
      this.processMessageResult(id, customResult);
    } else {
      // 所有消息内容块检查，只要有一个失败，消息的status就是失败
      const allContentFailed = this.messageStore.messages.find((content) => content.status === 'error');
      // eslint-disable-next-line no-nested-ternary
      this.setMessageStatus(id, isAborted ? 'stop' : allContentFailed ? 'error' : 'complete');
    }

    // 发布请求完成/中止事件
    const message = this.messageStore.getMessageByID(id);
    if (message) {
      if (isAborted) {
        this.eventBus.emit(ChatEngineEventType.REQUEST_ABORT, {
          messageId: id,
          params,
        });
      } else {
        this.eventBus.emit(ChatEngineEventType.REQUEST_COMPLETE, {
          messageId: id,
          params,
          message,
        });
      }
    }
  }

  /**
   * 处理流式请求
   * 根据协议类型选择不同的处理策略
   * SSE 原始数据 → isValidChunk验证 → onMessage解析 → processMessageResult
   */
  private async handleStreamRequest(params: ChatRequestParams) {
    const id = params.messageID;
    const isAGUI = this.config.protocol === 'agui';
    const isOpenClaw = this.config.protocol === 'openclaw';

    if (id) {
      this.setMessageStatus(id, 'streaming');
    }

    // 根据协议类型选择处理策略
    if (isAGUI && this.aguiAdapter) {
      await this.handleAGUIStreamRequest(params, id);
    } else if (isOpenClaw) {
      await this.handleOpenClawStreamRequest(params, id);
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

        let result: AIMessageContent | AIMessageContent[] | null = null;

        // SSE数据 → AGUIEventMapper.mapEvent → 用户自定义onMessage(解析后数据 + 原始chunk)
        // 首先使用AGUI适配器进行通用协议解析
        if (this.aguiAdapter) {
          result = this.aguiAdapter.handleAGUIEvent(chunk, {
            onRunStart: (event) => {
              // 重置适配器状态，确保新一轮对话从干净状态开始
              this.aguiAdapter?.reset();
              this.config.onStart?.(JSON.stringify(event));
              // 发布 AGUI 运行开始事件
              this.eventBus.emit(ChatEngineEventType.AGUI_RUN_START, {
                runId: event.runId || '',
                threadId: event.threadId,
                timestamp: Date.now(),
              });
            },
            onRunComplete: (isAborted, requestParams, event) => {
              this.handleComplete(messageId, isAborted, requestParams, event);
              // 发布 AGUI 运行完成事件
              if (!isAborted) {
                this.eventBus.emit(ChatEngineEventType.AGUI_RUN_COMPLETE, {
                  runId: event?.runId || '',
                  threadId: event?.threadId,
                  timestamp: Date.now(),
                });
              }
            },
            onRunError: (error) => {
              this.handleError(messageId, error);
              // 发布 AGUI 运行错误事件
              this.eventBus.emit(ChatEngineEventType.AGUI_RUN_ERROR, {
                error,
              });
            },
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

        // 发布流数据事件
        this.eventBus.emit(ChatEngineEventType.REQUEST_STREAM, {
          messageId,
          chunk,
          content: result,
        });

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

        // 发布流数据事件
        this.eventBus.emit(ChatEngineEventType.REQUEST_STREAM, {
          messageId,
          chunk,
          content: result,
        });

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
   * 处理 OpenClaw 协议的流式请求
   *
   * OpenClaw 使用 WebSocket 连接，消息流由 LLMService 内部的 OpenClawAdapter 处理。
   * Adapter 将 OpenClaw 事件转换为 AIMessageContent 后，通过 onMessage 回调传递给 ChatEngine。
   *
   * 注意：WebSocket 连接已在 init() 阶段建立，历史消息也在那时自动回填，
   * 这里只处理消息发送和流式响应。
   */
  private async handleOpenClawStreamRequest(params: ChatRequestParams, messageId?: string) {
    await this.llmService.handleStreamRequest(params, {
      ...this.config,
      onStart: (chunk) => {
        this.config.onStart?.(chunk);
      },
      onMessage: (chunk: SSEChunkData) => {
        if (this.stopReceive || !messageId) return null;

        // OpenClaw 的 chunk.data 已经是 AIMessageContent 格式（由 OpenClawAdapter 转换）
        let result: AIMessageContent | AIMessageContent[] | null = chunk.data;

        // 允许用户通过 onMessage 进行自定义处理
        if (this.config.onMessage) {
          const userResult = this.config.onMessage(chunk, this.messageStore.getMessageByID(messageId), result);
          if (userResult) {
            result = userResult;
          }
        }

        // 发布流数据事件
        this.eventBus.emit(ChatEngineEventType.REQUEST_STREAM, {
          messageId,
          chunk,
          content: result,
        });

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

    // 根据原始类型选择更新方式
    Array.isArray(result)
      ? this.messageStore.updateMultipleContents(messageId, result)
      : this.processContentUpdate(messageId, result);

    // 发布消息更新事件
    const message = this.messageStore.getMessageByID(messageId);
    if (message) {
      this.eventBus.emit(ChatEngineEventType.MESSAGE_UPDATE, {
        messageId,
        content: result,
        message,
      });

      // AG-UI 协议：发布细粒度事件
      if (this.aguiAdapter) {
        this.emitAGUIDetailEvents(messageId, result);
      }
    }
  }

  /**
   * 发布 AG-UI 细粒度事件
   * 根据内容类型分发到对应的事件通道
   * todo: 这里的类型 any问题
   */
  private emitAGUIDetailEvents(messageId: string, result: AIMessageContent | AIMessageContent[]) {
    const contents = Array.isArray(result) ? result : [result];
    for (const content of contents) {
      // Activity 事件
      if ((content as any).data.activityType) {
        this.eventBus.emit(ChatEngineEventType.AGUI_ACTIVITY, {
          activityType: (content as any).data.activityType,
          messageId,
          content: (content as any)?.data?.content,
        });
      }

      // ToolCall 事件
      if ((content as any)?.data?.eventType?.startsWith('TOOL_CALL')) {
        this.eventBus.emit(ChatEngineEventType.AGUI_TOOLCALL, {
          toolCall: (content as any).data,
          eventType: (content as any).data.eventType,
        });
      }
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
    const previousStatus = this.messageStore.getMessageByID(messageId)?.status;
    this.messageStore.setMessageStatus(messageId, status);

    // 发布消息状态变化事件
    if (status) {
      this.eventBus.emit(ChatEngineEventType.MESSAGE_STATUS_CHANGE, {
        messageId,
        status,
        previousStatus,
      });
    }
  }

  // 处理内容更新逻辑
  private processContentUpdate(messageId: string, rawChunk: AIContentChunkUpdate) {
    const message = this.messageStore.messages.find((m) => m.id === messageId);
    if (!message || !isAIMessage(message) || !message.content) return;

    let targetIndex: number;
    // 作为新的内容块追加
    if ((rawChunk as any)?.strategy === 'append') {
      targetIndex = -1;
    } else {
      // merge 策略：按 type 查找最后一个匹配的类型
      // 通过 type (如 toolcall-${toolCallName}) 来定位要更新的内容块
      targetIndex = message.content.findIndex((content: AIMessageContent) => content.type === rawChunk.type);
      if (targetIndex !== -1) {
        // 找到最后一个匹配的类型（从后往前查找）
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
export * from './adapters';
export * from './event-bus';
export * from './adapters';
export type * from './type';
