import { LoggerManager } from '../utils/logger';
import { TimeoutError } from './errors';
import { ConnectionInfo, ConnectionStats, SSEConnectionState } from './types';

/**
 * 连接管理器 - 直接使用全局Logger
 */
export class ConnectionManager {
  private connectionStartTime = 0;

  private stats: ConnectionStats;

  private logger = LoggerManager.getLogger(); // 直接使用全局Logger

  constructor(private connectionId: string) {
    this.stats = {};
  }

  /**
   * 处理连接错误
   */
  handleConnectionError(error: Error): boolean {
    this.logger.error(`Connection ${this.connectionId} error:`, error);
    this.stats.lastError = error;

    if (error instanceof TimeoutError) {
      this.logger.info('Timeout error occurred, no retry will be attempted');
    }

    this.cleanup();
    return false;
  }

  /**
   * 开始连接计时
   */
  startConnection(): void {
    this.connectionStartTime = Date.now();
    this.logger.debug(`Connection ${this.connectionId} started`);
  }

  /**
   * 连接成功
   */
  onConnectionSuccess(): void {
    const duration = Date.now() - this.connectionStartTime;
    this.logger.info(`Connection established in ${duration}ms`);
    this.stats.connectionTime = duration;
  }

  /**
   * 更新连接状态并记录统计信息
   */
  updateState(state: SSEConnectionState, error?: Error): void {
    if (error) {
      this.stats.lastError = error;
    }

    this.logger.debug(`State updated to ${state}`);
  }

  /**
   * 获取连接信息
   */
  getConnectionInfo(): ConnectionInfo {
    return {
      id: this.connectionId,
      retryCount: 0,
      lastActivity: Date.now(),
      stats: { ...this.stats },
    };
  }

  /**
   * 获取连接统计
   */
  getStats(): ConnectionStats {
    return { ...this.stats };
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.stats = {};
    this.logger.debug(`Connection manager ${this.connectionId} cleaned up`);
  }
}
