/**
 * OpenClaw 协议适配器
 *
 * 功能：
 * 1. 管理 WebSocket 连接生命周期
 * 2. 处理 OpenClaw 协议的握手和认证
 * 3. 将 OpenClaw 事件转换为 ChatEngine 统一的消息格式
 * 4. 提供与 AGUIAdapter 相似的接口，便于 ChatEngine 统一调度
 */
import EventEmitter from '../../utils/eventEmitter';
import { LoggerManager } from '../../utils/logger';
import { WebSocketClient, type WebSocketClientConfig, WebSocketConnectionState } from '../../server/websocket-client';
import type { AIMessageContent, ChatRequestParams, SSEChunkData } from '../../type';
import { OpenClawEventMapper, type EventMapResult } from './event-mapper';
import { OpenClawRPCHandler, RPCError } from './rpc-handler';
import type {
  OpenClawConfig,
  OpenClawFrame,
  OpenClawEventFrame,
  OpenClawResponseFrame,
  ConnectParams,
  ConnectChallengePayload,
} from './types';
import { mergeOpenClawConfig, DEFAULT_OPENCLAW_CONFIG } from './types/config';
import { OpenClawEventType, OpenClawConnectionState } from './types/events';
import {
  generateUUID,
  parseFrame,
  getPlatform,
  getUserAgent,
  getLocale,
  formatWebSocketUrl,
} from './utils';

// 重新导出类型
export * from './types';
export { OpenClawEventMapper, type EventMapResult } from './event-mapper';
export { OpenClawRPCHandler, RPCError } from './rpc-handler';

/**
 * OpenClaw 适配器回调接口
 */
export interface OpenClawAdapterCallbacks {
  /** 连接成功 */
  onConnected?: () => void;
  /** 连接断开 */
  onDisconnected?: (reason?: string) => void;
  /** 消息开始 */
  onStart?: () => void;
  /** 消息完成 */
  onComplete?: (isAborted: boolean, params?: ChatRequestParams) => void;
  /** 错误发生 */
  onError?: (error: Error) => void;
  /** 消息内容更新 */
  onMessage?: (content: AIMessageContent | AIMessageContent[]) => void;
}

/**
 * OpenClaw 适配器配置
 */
export interface OpenClawAdapterConfig extends OpenClawConfig {
  /** WebSocket 端点 */
  endpoint: string;
  /** 请求超时（毫秒） */
  timeout?: number;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试间隔（毫秒） */
  retryInterval?: number;
}

/**
 * OpenClaw 协议适配器
 */
export class OpenClawAdapter extends EventEmitter {
  private wsClient: WebSocketClient | null = null;

  private rpcHandler: OpenClawRPCHandler;

  private eventMapper: OpenClawEventMapper;

  private config: Required<OpenClawConfig>;

  private adapterConfig: OpenClawAdapterConfig;

  private connectionState = OpenClawConnectionState.DISCONNECTED;

  private instanceId: string;

  private logger = LoggerManager.getLogger();

  private callbacks: OpenClawAdapterCallbacks = {};

  private isStreaming = false;

  private currentRequestParams: ChatRequestParams | null = null;

  constructor(config: OpenClawAdapterConfig) {
    super();
    this.adapterConfig = config;
    this.config = mergeOpenClawConfig(config);
    this.instanceId = generateUUID();
    this.rpcHandler = new OpenClawRPCHandler({ timeout: config.timeout });
    this.eventMapper = new OpenClawEventMapper();
  }

  /**
   * 设置回调
   */
  setCallbacks(callbacks: OpenClawAdapterCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * 连接到 OpenClaw Gateway
   * 等待 WebSocket 连接建立并完成认证握手后才返回
   */
  async connect(): Promise<void> {
    if (this.connectionState === OpenClawConnectionState.AUTHENTICATED) {
      return;
    }

    this.connectionState = OpenClawConnectionState.CONNECTING;

    const url = formatWebSocketUrl(this.adapterConfig.endpoint);
    this.wsClient = new WebSocketClient(url);

    // 设置 RPC 发送函数
    this.rpcHandler.setSendFunction((frame) => {
      this.wsClient?.send(frame);
    });

    // 绑定事件处理
    this.setupEventHandlers();

    // 连接 WebSocket
    const wsConfig: WebSocketClientConfig = {
      timeout: this.adapterConfig.timeout,
      maxRetries: this.adapterConfig.maxRetries,
      retryInterval: this.adapterConfig.retryInterval,
      heartbeatInterval: this.config.heartbeatInterval,
    };

    await this.wsClient.connect(wsConfig);

    // 等待认证完成（connect.challenge 握手）
    await this.waitForAuthentication();
  }

  /**
   * 等待认证完成
   * WebSocket 连接建立后，服务器会发送 connect.challenge 事件，
   * 适配器会自动回复 connect 请求完成握手。
   * 此方法等待整个握手流程完成后再返回。
   */
  private waitForAuthentication(): Promise<void> {
    // 如果已经认证，直接返回
    if (this.connectionState === OpenClawConnectionState.AUTHENTICATED) {
      return Promise.resolve();
    }

    const timeout = this.adapterConfig.timeout || 30000;

    return new Promise<void>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | null = null;

      const cleanup = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        this.off('connected', onConnected);
        this.off('error', onError);
      };

      const onConnected = () => {
        cleanup();
        resolve();
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      this.once('connected', onConnected);
      this.once('error', onError);

      // 超时处理
      timer = setTimeout(() => {
        cleanup();
        reject(new Error(`OpenClaw authentication timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * 发送聊天消息
   */
  async sendMessage(params: ChatRequestParams, requestParams?: Record<string, unknown>): Promise<void> {
    if (this.connectionState !== OpenClawConnectionState.AUTHENTICATED) {
      throw new Error('Not authenticated. Please connect first.');
    }

    this.currentRequestParams = params;
    this.isStreaming = true;
    this.eventMapper.reset();

    // 合并用户自定义参数
    const chatParams = {
      message: params.prompt || '',
      idempotencyKey: generateUUID(),
      ...requestParams,
    };

    try {
      this.callbacks.onStart?.();
      await this.rpcHandler.chatSend(chatParams);
      // 响应会通过事件流返回，这里只是发送请求
    } catch (error) {
      this.isStreaming = false;
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * 处理 SSE 数据块（兼容 ChatEngine 接口）
   */
  handleEvent(chunk: SSEChunkData): AIMessageContent | AIMessageContent[] | null {
    // 将 SSE 格式转换为 OpenClaw 帧格式
    const frame = parseFrame(chunk.data);
    if (!frame || frame.type !== 'event') {
      return null;
    }

    const result = this.eventMapper.mapEvent(frame as OpenClawEventFrame);

    if (result.isFinal) {
      this.isStreaming = false;
      this.callbacks.onComplete?.(false, this.currentRequestParams || undefined);
    }

    if (result.hasError && result.errorMessage) {
      this.callbacks.onError?.(new Error(result.errorMessage));
    }

    return result.content;
  }

  /**
   * 调用 Action（供 Toolcall/Activity 组件的 respond/action 使用）
   *
   * 通过 OpenClaw 的 node.invoke RPC 方法上行，利用 WebSocket 双向通道
   * 将用户在交互式组件中的操作（respond/confirm/update 等）发送回 Agent 端。
   *
   * @param params.nodeId - toolCallId 或 activityType，标识目标节点
   * @param params.action - 操作类型，如 "respond" | "update" | "confirm"
   * @param params.payload - 用户操作数据
   * @returns Agent 端返回的响应数据
   *
   * @example
   * ```tsx
   * // 在 ToolCallRenderer 的 onRespond 中使用
   * <ToolCallRenderer
   *   toolCall={toolCall}
   *   onRespond={async (tc, response) => {
   *     await openclawAdapter.invokeAction({
   *       nodeId: tc.toolCallId,
   *       action: 'respond',
   *       payload: response,
   *     });
   *   }}
   * />
   * ```
   */
  async invokeAction(params: {
    nodeId: string;
    action: string;
    payload: unknown;
  }): Promise<unknown> {
    if (this.connectionState !== OpenClawConnectionState.AUTHENTICATED) {
      throw new Error('Not authenticated. Please connect first.');
    }

    return this.rpcHandler.nodeInvoke({
      ...params,
      runId: this.eventMapper.getCurrentRunId() || undefined,
    });
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    this.connectionState = OpenClawConnectionState.CLOSING;
    this.rpcHandler.cancelAll('Disconnecting');

    if (this.wsClient) {
      await this.wsClient.close();
      this.wsClient = null;
    }

    this.connectionState = OpenClawConnectionState.DISCONNECTED;
    this.callbacks.onDisconnected?.();
  }

  /**
   * 中止当前流式传输
   */
  abort(): void {
    if (this.isStreaming) {
      this.isStreaming = false;
      this.callbacks.onComplete?.(true, this.currentRequestParams || undefined);
    }
  }

  /**
   * 获取连接状态
   */
  getConnectionState(): OpenClawConnectionState {
    return this.connectionState;
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return this.connectionState === OpenClawConnectionState.AUTHENTICATED;
  }

  /**
   * 重置适配器状态
   */
  reset(): void {
    this.eventMapper.reset();
    this.rpcHandler.reset();
    this.isStreaming = false;
    this.currentRequestParams = null;
  }

  /**
   * 销毁适配器
   */
  async destroy(): Promise<void> {
    await this.disconnect();
    this.rpcHandler.destroy();
    this.removeAllListeners();
  }

  /**
   * 设置 WebSocket 事件处理器
   */
  private setupEventHandlers(): void {
    if (!this.wsClient) return;

    this.wsClient.on('message', (event: { event: string; data: unknown }) => {
      this.handleWebSocketMessage(event.data);
    });

    this.wsClient.on('error', (error: Error) => {
      this.logger.error('OpenClaw WebSocket error:', error);
      this.callbacks.onError?.(error);
    });

    this.wsClient.on('complete', (isAborted: boolean) => {
      if (this.isStreaming) {
        this.isStreaming = false;
        this.callbacks.onComplete?.(isAborted, this.currentRequestParams || undefined);
      }
      this.callbacks.onDisconnected?.(isAborted ? 'Aborted' : 'Connection closed');
    });

    this.wsClient.on('stateChange', (event: { from: WebSocketConnectionState; to: WebSocketConnectionState }) => {
      this.logger.debug(`WebSocket state: ${event.from} -> ${event.to}`);
      if (event.to === WebSocketConnectionState.CONNECTED) {
        this.connectionState = OpenClawConnectionState.HANDSHAKING;
      }
    });
  }

  /**
   * 处理 WebSocket 消息
   */
  private handleWebSocketMessage(data: unknown): void {
    const frame = parseFrame(data as string | object);
    if (!frame) {
      this.logger.warn('Failed to parse OpenClaw frame:', data);
      return;
    }

    // 处理响应帧
    if (frame.type === 'res') {
      this.rpcHandler.handleResponse(frame as OpenClawResponseFrame);
      return;
    }

    // 处理事件帧
    if (frame.type === 'event') {
      this.handleEventFrame(frame as OpenClawEventFrame);
    }
  }

  /**
   * 处理事件帧
   */
  private handleEventFrame(frame: OpenClawEventFrame): void {
    const { event, payload } = frame;

    // 处理连接挑战事件
    if (event === OpenClawEventType.CONNECT_CHALLENGE) {
      this.handleConnectChallenge(payload as ConnectChallengePayload);
      return;
    }

    // 流式消息事件
    if (this.isStreaming) {
      const result = this.eventMapper.mapEvent(frame);

      if (result.content) {
        this.callbacks.onMessage?.(result.content);
        this.emit('message', result.content);
      }

      if (result.isFinal) {
        this.isStreaming = false;
        this.callbacks.onComplete?.(false, this.currentRequestParams || undefined);
      }

      if (result.hasError && result.errorMessage) {
        this.callbacks.onError?.(new Error(result.errorMessage));
      }
    }
  }

  /**
   * 处理连接挑战（握手）
   */
  private async handleConnectChallenge(payload: ConnectChallengePayload): Promise<void> {
    this.logger.debug('Received connect.challenge, sending connect request');

    const connectParams: ConnectParams = {
      minProtocol: this.config.protocolVersion.min,
      maxProtocol: this.config.protocolVersion.max,
      client: {
        id: this.config.client.id,
        version: this.config.client.version,
        platform: getPlatform(),
        mode: this.config.client.mode,
        instanceId: this.instanceId,
      },
      role: 'operator',
      scopes: ['operator.admin'],
      caps: [],
      userAgent: getUserAgent(),
      locale: getLocale(),
    };

    try {
      const response = await this.rpcHandler.connect(connectParams);
      this.connectionState = OpenClawConnectionState.AUTHENTICATED;
      this.logger.info('OpenClaw authenticated successfully:', response);
      this.callbacks.onConnected?.();
      this.emit('connected', response);
    } catch (error) {
      this.connectionState = OpenClawConnectionState.ERROR;
      this.logger.error('OpenClaw authentication failed:', error);
      this.callbacks.onError?.(error as Error);
      this.emit('error', error);
    }
  }
}
