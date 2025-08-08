import type { AIMessageContent, ChatRequestParams, ChatServiceConfig, SSEChunkData } from '../type';
import { LoggerManager } from '../utils/logger';
import { BatchClient } from './batch-client';
import { SSEClient } from './sse-client';

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
    this.sseClient = new SSEClient(config.endpoint);

    const req = (await config.onRequest?.(params)) || {};

    // 设置事件处理器
    this.sseClient.on('start', (chunk) => {
      config.onStart?.(chunk);
    });

    this.sseClient.on('message', (msg) => {
      config.onMessage?.(msg as SSEChunkData);
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
    this.logger.info('Enhanced LLM Service destroyed');
  }
}
