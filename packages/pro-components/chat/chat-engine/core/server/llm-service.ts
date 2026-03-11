import type { AIMessageContent, ChatRequestParams, ChatServiceConfig, SSEChunkData } from '../type';
import { LoggerManager } from '../utils/logger';
import { BatchClient } from './batch-client';
import { SSEClient } from './sse-client';
import {
  OpenClawAdapter,
  type OpenClawAdapterConfig,
} from '../adapters/openclaw';

// 与原有接口保持兼容
export interface ILLMService {
  /**
   * 处理批量请求（非流式）
   */
  handleBatchRequest(
    params: ChatRequestParams,
    config: ChatServiceConfig,
  ): Promise<AIMessageContent | AIMessageContent[]>;

  /**
   * 处理流式请求
   */
  handleStreamRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<void>;
}

/**
 * Enhanced LLM Service with error handling and connection management
 */
export class LLMService implements ILLMService {
  private sseClient: SSEClient | null = null;

  private batchClient: BatchClient | null = null;

  private openclawAdapter: OpenClawAdapter | null = null;

  private isDestroyed = false;

  private logger = LoggerManager.getLogger();

  /**
   * 处理批量请求（非流式）
   */
  async handleBatchRequest(
    params: ChatRequestParams,
    config: ChatServiceConfig,
  ): Promise<AIMessageContent | AIMessageContent[]> {
    // 确保只有一个客户端实例
    this.batchClient = this.batchClient || new BatchClient();
    this.batchClient.on('error', (error) => {
      config.onError?.(error);
    });

    const req = (await config.onRequest?.(params)) || params;

    try {
      const data = await this.batchClient.request<AIMessageContent>(
        config.endpoint!,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...req.headers,
          },
          body: req.body,
        },
        config.timeout, // 现在timeout属性已存在
      );
      if (data) {
        const result = config.onComplete?.(false, req, data);
        // 如果onComplete返回了内容，使用它；否则使用原始data
        return result || data;
      }
      // 如果没有data，返回空数组
      return [];
    } catch (error) {
      config.onError?.(error as Error | Response);
      throw error;
    }
  }

  /**
   * 处理流式请求
   */
  async handleStreamRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<void> {
    if (!config.endpoint) return;

    // OpenClaw WebSocket 协议
    if (config.protocol === 'openclaw') {
      await this.handleOpenClawStreamRequest(params, config);
      return;
    }

    this.sseClient = new SSEClient(config.endpoint);

    const req = (await config.onRequest?.(params)) || {};

    // 设置事件处理器
    this.sseClient.on('start', (chunk) => {
      config.onStart?.(chunk);
    });

    this.sseClient.on('message', (msg) => {
      const chunk = msg as SSEChunkData;
      // 如果配置了 isValidChunk 且返回 false，则跳过该 chunk
      if (config.isValidChunk && !config.isValidChunk(chunk)) return;
      config.onMessage?.(chunk);
    });

    this.sseClient.on('error', (error) => {
      config.onError?.(error);
    });

    this.sseClient.on('complete', (isAborted) => {
      config.onComplete?.(isAborted, req);
    });

    await this.sseClient.connect(req);
  }

  /**
   * 提前初始化 OpenClaw 适配器并建立 WebSocket 连接
   *
   * 在 ChatEngine.init() 阶段调用，使得页面加载时就建立连接、完成握手，
   * 并自动接收 Gateway 在 connect 响应中推送的历史消息。
   * 后续 sendMessage 时可直接复用已认证的连接，无需等待。
   */
  async connectOpenClaw(config: ChatServiceConfig): Promise<void> {
    this.ensureOpenClawAdapter(config);
    this.updateOpenClawCallbacks(config);

    try {
      if (!this.openclawAdapter!.isAuthenticated()) {
        await this.openclawAdapter!.connect();
      }
    } catch (error) {
      config.onError?.(error as Error);
      // 连接失败不抛出，允许后续 sendMessage 时重试
      this.logger.error('OpenClaw pre-connect failed:', error);
    }
  }

  /**
   * 确保 OpenClaw 适配器已创建
   * 只负责创建适配器实例，不设置回调（回调由调用方通过 updateOpenClawCallbacks 设置）
   */
  private ensureOpenClawAdapter(config: ChatServiceConfig): void {
    if (this.openclawAdapter) return;

    const openclawConfig = config.openclaw || {};

    // 构建适配器配置
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
   * 更新 OpenClaw 适配器的回调
   *
   * 每次进入新的阶段（init 连接 / 发送消息）都需要更新回调，
   * 确保 onMessage、onComplete 等指向当前阶段的正确处理函数。
   */
  private updateOpenClawCallbacks(config: ChatServiceConfig): void {
    if (!this.openclawAdapter) return;

    this.openclawAdapter.setCallbacks({
      onConnected: () => {
        this.logger.info('OpenClaw connected');
      },
      onStart: () => {
        config.onStart?.('openclaw:stream:start');
      },
      onMessage: (content) => {
        // 将 OpenClaw 事件转换为 SSEChunkData 格式，保持与 ChatEngine 的兼容性
        const chunk: SSEChunkData = {
          event: 'openclaw',
          data: content,
        };
        config.onMessage?.(chunk);
      },
      onComplete: (isAborted, requestParams) => {
        config.onComplete?.(isAborted, requestParams);
      },
      onError: (error) => {
        config.onError?.(error);
      },
      onHistoryLoaded: (messages) => {
        // 桥接 OpenClaw connect 响应中推送的历史消息到上层
        this.logger.info(`OpenClaw history loaded: ${messages.length} messages`);
        config.onHistoryLoaded?.(messages);
      },
    });
  }

  /**
   * 处理 OpenClaw WebSocket 流式请求
   */
  private async handleOpenClawStreamRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<void> {
    // 确保适配器已创建（如果 init 阶段已 connectOpenClaw 过，这里会直接复用）
    this.ensureOpenClawAdapter(config);
    // 关键：更新回调，让 onMessage/onComplete 等指向发送阶段的处理函数
    this.updateOpenClawCallbacks(config);

    try {
      // 连接 WebSocket（如果未连接，比如 init 阶段连接失败需要重试）
      if (!this.openclawAdapter!.isAuthenticated()) {
        await this.openclawAdapter!.connect();
      }

      // 通过 onRequest 获取用户自定义的业务参数
      const requestParams = (await config.onRequest?.(params)) || {};

      // 发送消息（requestParams 包含用户自定义的 sessionKey、token 等）
      await this.openclawAdapter!.sendMessage(params, requestParams as Record<string, unknown>);
    } catch (error) {
      config.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * 关闭所有客户端连接
   */
  closeConnect(): void {
    if (this.sseClient) {
      this.sseClient.abort();
      this.sseClient = null;
    }
    if (this.batchClient) {
      this.batchClient.abort();
      this.batchClient = null;
    }
    if (this.openclawAdapter) {
      this.openclawAdapter.abort();
    }
  }

  /**
   * 获取连接统计
   */
  getSSEStats(): { id: string; status: string; info: any } | null {
    if (!this.sseClient) return null;

    return {
      id: this.sseClient.connectionId,
      status: this.sseClient.getStatus(),
      info: this.sseClient.getInfo(),
    };
  }

  /**
   * 销毁服务
   */
  async destroy(): Promise<void> {
    this.isDestroyed = true;
    this.closeConnect();
    if (this.openclawAdapter) {
      await this.openclawAdapter.destroy();
      this.openclawAdapter = null;
    }
    this.logger.info('Enhanced LLM Service destroyed');
  }
}
