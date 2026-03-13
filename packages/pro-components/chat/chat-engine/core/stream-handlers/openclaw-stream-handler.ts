/**
 * OpenClaw 协议流式处理器
 *
 * 负责 OpenClaw WebSocket 连接的完整生命周期管理：
 * - 适配器创建与持有（从 LLMService 移入）
 * - 连接建立与认证
 * - 消息发送与流式响应
 * - 历史消息接收
 *
 * OpenClaw 的 chunk.data 已经是 AIMessageContent 格式（由 OpenClawAdapter 转换）
 */
import type { AIMessageContent, ChatRequestParams, ChatServiceConfig, SSEChunkData } from '../type';
import { ChatEngineEventType } from '../event-bus';
import { LoggerManager } from '../utils/logger';
import {
  OpenClawAdapter,
  type OpenClawAdapterConfig,
} from '../adapters/openclaw';
import type { IStreamHandler, StreamContext } from './types';
import type { LLMService } from '../server';

export interface OpenClawStreamHandlerOptions {
  /** LLM 服务引用（用于 SSE/Batch 的 abort） */
  llmService: LLMService;
}

export class OpenClawStreamHandler implements IStreamHandler {
  private openclawAdapter: OpenClawAdapter | null = null;
  private llmService: LLMService;
  private logger = LoggerManager.getLogger();

  constructor(options: OpenClawStreamHandlerOptions) {
    this.llmService = options.llmService;
  }

  /**
   * 初始化：在 ChatEngine.init() 阶段预建立 WebSocket 连接
   *
   * Gateway 会在 connect 响应中推送历史消息，通过 onHistoryLoaded 自动回填。
   */
  async initConnection(config: ChatServiceConfig, onHistoryLoaded?: (messages: any[]) => void): Promise<void> {
    this.ensureAdapter(config);
    this.updateCallbacks(config, onHistoryLoaded);

    try {
      if (!this.openclawAdapter!.isAuthenticated()) {
        // 在 connect 前获取认证信息（token 等），传给 adapter 用于握手
        await this.prepareConnectAuth(config);
        await this.openclawAdapter!.connect();
      }
    } catch (error) {
      config.onError?.(error as Error);
      // 连接失败不抛出，允许后续 sendMessage 时重试
      this.logger.error('OpenClaw pre-connect failed:', error);
    }
  }

  async handleStream(params: ChatRequestParams, context: StreamContext): Promise<void> {
    const { messageId, config } = context;

    this.ensureAdapter(config);
    this.updateStreamCallbacks(config, context);

    try {
      // 连接 WebSocket（如果未连接，比如 init 阶段连接失败需要重试）
      if (!this.openclawAdapter!.isAuthenticated()) {
        await this.prepareConnectAuth(config);
        await this.openclawAdapter!.connect();
      }

      // 通过 onRequest 获取用户自定义的业务参数
      const requestParams = (await config.onRequest?.(params)) || {};

      // 发送消息（requestParams 包含用户自定义的 sessionKey、token 等）
      await this.openclawAdapter!.sendMessage(params, requestParams as Record<string, unknown>);
    } catch (error) {
      if (messageId) {
        context.handleError(messageId, error);
      }
      throw error;
    }
  }

  /**
   * 中止当前请求
   */
  abort(): void {
    this.openclawAdapter?.abort();
  }

  /**
   * 销毁处理器，释放 OpenClaw 连接资源
   */
  async destroy(): Promise<void> {
    if (this.openclawAdapter) {
      await this.openclawAdapter.destroy();
      this.openclawAdapter = null;
    }
  }

  /**
   * 获取适配器实例（供外部调用 invokeAction 等）
   */
  getAdapter(): OpenClawAdapter | null {
    return this.openclawAdapter;
  }

  // ==================== 内部方法 ====================

  /**
   * 从 onRequest 获取认证信息，传给 adapter 用于 connect 握手
   *
   * onRequest 返回值中如果包含 `auth` 字段（如 `{ auth: { token: '...' } }`），
   * 会被提取出来作为 connect 握手的认证参数。
   * 其他字段（如 sessionKey、message）属于 sendMessage 阶段使用，不会传入 connect。
   */
  private async prepareConnectAuth(config: ChatServiceConfig): Promise<void> {
    if (!this.openclawAdapter || !config.onRequest) return;

    try {
      // 用空的 params 调用 onRequest，仅获取 auth 信息
      const requestParams = await config.onRequest({ prompt: '' } as ChatRequestParams);
      if (requestParams) {
        const { auth } = requestParams as Record<string, unknown>;
        if (auth && typeof auth === 'object') {
          this.openclawAdapter.setConnectAuth(auth as Record<string, unknown>);
        }
      }
    } catch (error) {
      this.logger.warn('Failed to get connect auth from onRequest:', error);
    }
  }

  /**
   * 确保 OpenClaw 适配器已创建
   */
  private ensureAdapter(config: ChatServiceConfig): void {
    if (this.openclawAdapter) return;

    const openclawConfig = config.openclaw || {};

    const adapterConfig: OpenClawAdapterConfig = {
      endpoint: config.endpoint!,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
      retryInterval: config.retryInterval,
      ...openclawConfig,
    };

    this.openclawAdapter = new OpenClawAdapter(adapterConfig);
  }

  /**
   * 更新 init 阶段的回调（连接 + 历史消息）
   */
  private updateCallbacks(config: ChatServiceConfig, onHistoryLoaded?: (messages: any[]) => void): void {
    if (!this.openclawAdapter) return;

    this.openclawAdapter.setCallbacks({
      onConnected: () => {
        this.logger.info('OpenClaw connected');
      },
      onStart: () => {
        config.onStart?.('openclaw:stream:start');
      },
      onMessage: () => {
        // init 阶段无需处理消息
      },
      onComplete: () => {
        // init 阶段无需处理完成
      },
      onError: (error) => {
        config.onError?.(error);
      },
      onHistoryLoaded: (messages) => {
        this.logger.info(`OpenClaw history loaded: ${messages.length} messages`);
        onHistoryLoaded?.(messages);
      },
    });
  }

  /**
   * 更新流式请求阶段的回调（消息处理 + 事件发布）
   */
  private updateStreamCallbacks(config: ChatServiceConfig, context: StreamContext): void {
    if (!this.openclawAdapter) return;

    const { messageId } = context;

    this.openclawAdapter.setCallbacks({
      onConnected: () => {
        this.logger.info('OpenClaw connected');
      },
      onStart: () => {
        config.onStart?.('openclaw:stream:start');
      },
      onMessage: (content) => {
        if (context.getStopReceive() || !messageId) return;

        // OpenClaw 的 content 已经是 AIMessageContent 格式（由 OpenClawAdapter 转换）
        const chunk: SSEChunkData = {
          event: 'openclaw',
          data: content,
        };
        let result: AIMessageContent | AIMessageContent[] | null = content;

        // 允许用户通过 onMessage 进行自定义处理
        if (config.onMessage) {
          const userResult = config.onMessage(chunk, context.messageStore.getMessageByID(messageId), result);
          if (userResult) {
            result = userResult;
          }
        }

        // 发布流数据事件
        context.eventBus.emit(ChatEngineEventType.REQUEST_STREAM, {
          messageId,
          chunk,
          content: result,
        });

        // 处理消息结果
        context.processMessageResult(messageId, result);
      },
      onComplete: (isAborted, requestParams) => {
        if (messageId) {
          context.handleComplete(messageId, isAborted, requestParams || context.config);
        }
      },
      onError: (error) => {
        if (messageId) context.handleError(messageId, error);
      },
      onHistoryLoaded: (messages) => {
        // 流式阶段不应再处理历史消息
        this.logger.info(`OpenClaw history loaded during stream: ${messages.length} messages (ignored)`);
      },
    });
  }
}
