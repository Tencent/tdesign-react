/* eslint-disable no-await-in-loop, max-classes-per-file */
import EventEmitter from '../utils/eventEmitter';
import { LoggerManager } from '../utils/logger';
import { ConnectionManager } from './connection-manager';
import { ConnectionError, TimeoutError } from './errors';
import { type SSEEvent, SSEParser } from './sse-parser';
import {
  type ConnectionInfo,
  DEFAULT_SSE_CONFIG,
  type SSEClientConfig,
  SSEConnectionState,
  type StateChangeEvent,
} from './types';

/**
 * SSE Client
 * 采用分层设计，分离了连接管理、状态管理、事件解析等职责
 */
export class SSEClient extends EventEmitter {
  public readonly connectionId: string;

  private state = SSEConnectionState.DISCONNECTED;

  private controller?: AbortController | null;

  private reader?: ReadableStreamDefaultReader<string>;

  private connectionManager: ConnectionManager;

  private parser: SSEParser;

  private timeoutTimer?: ReturnType<typeof setInterval>; // 统一超时定时器

  private config: SSEClientConfig;

  private logger = LoggerManager.getLogger();

  private url: string;

  private connectionInfo: ConnectionInfo;

  private firstTokenReceived = false;

  constructor(url: string) {
    super();
    this.url = url;
    this.connectionId = this.generateConnectionId();
    this.logger = LoggerManager.getLogger();
    this.connectionManager = new ConnectionManager(this.connectionId);

    // 初始化 SSE 解析器
    this.parser = new SSEParser();
    this.parser.onMessage = (event: SSEEvent) => {
      this.emit('message', event);
    };

    this.connectionInfo = {
      id: this.connectionId,
      url,
      state: this.state,
      createdAt: Date.now(),
      retryCount: 0,
      lastActivity: Date.now(),
      stats: {},
    };

    this.setupInternalEventHandlers();
  }

  /**
   * 连接 SSE 服务
   */
  async connect(config: SSEClientConfig): Promise<void> {
    if (this.state === SSEConnectionState.CONNECTED || this.state === SSEConnectionState.CONNECTING) {
      return;
    }

    this.config = {
      ...DEFAULT_SSE_CONFIG,
      ...config,
      headers: {
        ...DEFAULT_SSE_CONFIG.headers,
        ...config.headers,
      },
    };

    this.setState(SSEConnectionState.CONNECTING);
    this.connectionManager.startConnection();

    try {
      // 启动统一超时监控
      this.startTimeoutMonitor();

      await this.establishConnection();
      this.setState(SSEConnectionState.CONNECTED);
      this.connectionManager.onConnectionSuccess();
      await this.readStream();
    } catch (error) {
      this.handleConnectionError(error as Error);
    }
  }

  /**
   * 关闭连接
   */
  async abort(): Promise<void> {
    if (this.state === SSEConnectionState.DISCONNECTED || this.state === SSEConnectionState.CLOSING) {
      return;
    }

    this.setState(SSEConnectionState.CLOSING);

    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = undefined;
      }

      if (this.controller && !this.controller.signal.aborted) {
        this.controller.abort();
      }

      this.connectionManager.cleanup();
      this.resetParser();
      this.emit('complete', true);
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.logger.error('stream abort failed:', error);
        this.emit('error', error);
      }
    } finally {
      this.clearTimeouts();
      this.controller = null;
      this.setState(SSEConnectionState.CLOSED);
    }
  }

  /**
   * 获取连接状态
   */
  getStatus(): SSEConnectionState {
    return this.state;
  }

  /**
   * 获取连接信息
   */
  getInfo(): ConnectionInfo {
    return {
      ...this.connectionInfo,
      ...this.connectionManager.getConnectionInfo(),
    };
  }

  /**
   * 建立连接
   */
  private async establishConnection(): Promise<void> {
    this.controller = new AbortController();

    try {
      const response = await fetch(this.url, {
        ...this.config,
        signal: this.controller.signal,
        headers: {
          ...this.config.headers,
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.body || !response.ok) {
        this.emit(
          'error',
          new ConnectionError(`HTTP ${response.status}: ${response.statusText}`, response.status, response),
        );
        return;
      }
      this.reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        this.logger.error('sse request failed:', error);
        this.emit('error', error);
      }
    }
  }

  /**
   * 读取流数据
   */
  private async readStream(): Promise<void> {
    try {
      while (this.state === SSEConnectionState.CONNECTED && this.reader) {
        // eslint-disable no-await-in-loop
        const { done, value } = await this.reader.read();

        if (done) {
          this.logger.info(`Connection ${this.connectionId} stream ended normally`);
          this.emit('complete', false); // 发出流结束事件
          this.setState(SSEConnectionState.DISCONNECTED);
          this.clearTimeouts();
          return;
        }

        // 更新活动时间
        this.connectionInfo.lastActivity = Date.now();

        // 直接解析SSE数据
        this.parseSSEData(value);
      }
    } catch (error) {
      if (!this.controller?.signal.aborted) {
        this.logger.error(`Stream reading error for ${this.connectionId}:`, error);
        this.handleConnectionError(error as Error);
      } else {
        this.logger.debug(`Stream reading stopped for ${this.connectionId} (aborted)`);
      }
    }
  }

  /**
   * 启动统一超时监控
   */
  private startTimeoutMonitor(): void {
    if (!this.config.timeout || this.config.timeout <= 0) return;

    // 检查间隔为超时时间的一半，但不超过5秒
    const checkInterval = Math.min(this.config.timeout / 2, 5000);

    this.timeoutTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - this.connectionInfo.lastActivity;

      if (timeSinceLastActivity >= this.config.timeout!) {
        // 根据当前状态决定超时类型
        if (this.state === SSEConnectionState.CONNECTING) {
          this.logger.warn(`Connection ${this.connectionId} establishment timeout after ${this.config.timeout}ms`);
          this.emit('error', new TimeoutError(`Connection establishment timed out after ${this.config.timeout}ms`));
        } else {
          this.logger.warn(`Connection ${this.connectionId} receive timeout after ${this.config.timeout}ms`);
          this.emit('error', new TimeoutError(`No data received for ${this.config.timeout}ms`));
        }

        this.abort(); // 触发连接中断
      }
    }, checkInterval);
  }

  /**
   * 解析SSE数据
   */
  private parseSSEData(chunk: string): void {
    // 使用独立的 SSE 解析器处理数据
    this.parser.parse(chunk);
    if (!this.firstTokenReceived) {
      this.firstTokenReceived = true;
      this.emit('start', chunk); // 派发start事件
    }
  }

  /**
   * 简化的错误处理
   */
  private handleConnectionError(error: Error) {
    this.connectionInfo.error = error;
    this.connectionManager.handleConnectionError(error);
    this.setState(SSEConnectionState.ERROR);
    this.emit('error', error);
  }

  /**
   * 清理超时定时器
   */
  private clearTimeouts(): void {
    if (this.timeoutTimer) {
      clearInterval(this.timeoutTimer);
      this.timeoutTimer = undefined;
    }
  }

  /**
   * 设置连接状态
   */
  private setState(newState: SSEConnectionState) {
    const oldState = this.state;
    this.state = newState;
    this.connectionInfo.state = newState;

    const stateChangeEvent: StateChangeEvent = {
      connectionId: this.connectionId,
      from: oldState,
      to: newState,
      timestamp: Date.now(),
    };

    this.emit('stateChange', stateChangeEvent);
    this.logger.debug(`Connection ${this.connectionId} state: ${oldState} -> ${newState}`);
  }

  /**
   * 重置解析器状态
   */
  private resetParser(): void {
    this.parser.reset();
  }

  /**
   * 设置内部事件处理器
   */
  private setupInternalEventHandlers(): void {
    this.on('error', (error) => {
      this.logger.error(`SSE Client ${this.connectionId} error:`, error);
    });

    this.on('complete', (isAborted) => {
      this.logger.info(`SSE Client ${this.connectionId} completed, aborted: ${isAborted}`);
    });
  }

  /**
   * 生成连接ID
   */
  private generateConnectionId(): string {
    // 使用this来访问实例属性，满足linter要求
    const timestamp = this.connectionInfo?.createdAt || Date.now();
    return `sse_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
