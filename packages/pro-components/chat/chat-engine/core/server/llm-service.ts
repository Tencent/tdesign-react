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
   * 处理 OpenClaw WebSocket 流式请求
   */
  private async handleOpenClawStreamRequest(params: ChatRequestParams, config: ChatServiceConfig): Promise<void> {
    const openclawConfig = config.openclaw || {};

    // 构建适配器配置
    const adapterConfig: OpenClawAdapterConfig = {
      endpoint: config.endpoint!,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
      retryInterval: config.retryInterval,
      ...openclawConfig,
    };

    // 复用或创建适配器
    if (!this.openclawAdapter) {
      this.openclawAdapter = new OpenClawAdapter(adapterConfig);
    }

    // 设置回调
    this.openclawAdapter.setCallbacks({
      onConnected: () => {
        this.logger.info('OpenClaw connected, sending message...');
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
    });

    try {
      // 连接 WebSocket（如果未连接）
      if (!this.openclawAdapter.isAuthenticated()) {
        await this.openclawAdapter.connect();
      }

      // 通过 onRequest 获取用户自定义的业务参数
      const requestParams = (await config.onRequest?.(params)) || {};

      // 发送消息（requestParams 包含用户自定义的 sessionKey、token 等）
      await this.openclawAdapter.sendMessage(params, requestParams as Record<string, unknown>);
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
