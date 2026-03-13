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

import {
  convertOpenClawHistory,
  convertOpenClawHistoryResponse,
  type OpenClawHistoryMessage,
  type OpenClawHistoryResponse,
  type ConvertHistoryOptions,
} from './history-converter';
import { DeviceKeyManager } from './device-key-manager';

// 重新导出类型
export * from './types';
export { OpenClawEventMapper, type EventMapResult } from './event-mapper';
export { OpenClawRPCHandler, RPCError } from './rpc-handler';
export { DeviceKeyManager, type DeviceKeyPair, type DeviceIdentity } from './device-key-manager';
export {
  convertOpenClawHistory,
  convertOpenClawHistoryResponse,
  type OpenClawHistoryMessage,
  type OpenClawHistoryResponse,
  type ConvertHistoryOptions,
} from './history-converter';

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
  /**
   * 历史消息加载完成
   *
   * OpenClaw Gateway 在 connect 响应中可能附带历史消息（messages 字段），
   * 当检测到历史消息时，适配器会自动将其转换为 ChatEngine 格式并触发此回调。
   * 上层可以通过 chatEngine.setMessages(messages, 'replace') 回填到对话界面。
   */
  onHistoryLoaded?: (messages: import('../../type').ChatMessagesData[]) => void;
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

  private deviceKeyManager: DeviceKeyManager | null = null;

  /** 动态传入的认证信息，用于 connect 握手（一次性使用） */
  private pendingAuth: Record<string, unknown> | null = null;

  constructor(config: OpenClawAdapterConfig) {
    super();
    this.adapterConfig = config;
    this.config = mergeOpenClawConfig(config);
    this.instanceId = generateUUID();
    this.rpcHandler = new OpenClawRPCHandler({ timeout: config.timeout });
    this.eventMapper = new OpenClawEventMapper();

    // 启用设备认证时，初始化密钥管理器
    if (this.config.deviceAuth) {
      this.deviceKeyManager = new DeviceKeyManager(this.config.client.id);
    }
  }

  /**
   * 设置回调
   */
  setCallbacks(callbacks: OpenClawAdapterCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * 设置连接认证信息（在 connect 之前调用）
   *
   * 传入的 auth 会在下一次 connect 握手时使用（一次性），
   * 用于从 onRequest 动态获取 token 等认证信息。
   */
  setConnectAuth(auth: Record<string, unknown>): void {
    this.pendingAuth = auth;
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

    // 合并用户自定义参数（剔除 auth，auth 仅用于 connect 握手）
    const { auth: _auth, ...sendParams } = requestParams || {};
    const chatParams = {
      message: params.prompt || '',
      idempotencyKey: generateUUID(),
      ...sendParams,
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
   * 获取会话历史消息
   *
   * 通过 OpenClaw 的 sessions.history RPC 方法获取指定会话的历史消息，
   * 并自动转换为 ChatEngine 的 ChatMessagesData 格式。
   *
   * @param sessionKey - 会话标识
   * @param options - 转换选项
   * @returns ChatEngine 格式的消息数组，可直接传给 chatEngine.setMessages() 或 useChat 的 defaultMessages
   *
   * @example
   * ```tsx
   * const messages = await adapter.fetchHistory('agent:main:main');
   * chatEngine.setMessages(messages, 'replace');
   * ```
   */
  async fetchHistory(
    sessionKey: string,
    options?: ConvertHistoryOptions,
  ): Promise<import('../../type').ChatMessagesData[]> {
    if (this.connectionState !== OpenClawConnectionState.AUTHENTICATED) {
      throw new Error('Not authenticated. Please connect first.');
    }

    const response = await this.rpcHandler.sessionsHistory({ sessionKey }) as OpenClawHistoryResponse;
    return convertOpenClawHistoryResponse(response, options);
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
      this.logger.error('[OpenClaw] WebSocket error:', error?.message || error);
      this.callbacks.onError?.(error);
    });

    this.wsClient.on('complete', (isAborted: boolean) => {
      console.warn(`[OpenClaw] WebSocket complete event! isAborted=${isAborted}, isStreaming=${this.isStreaming}`);
      if (this.isStreaming) {
        console.warn('[OpenClaw] ⚠️ WebSocket closed while still streaming! This caused onComplete to fire prematurely.');
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
    // DEBUG: 打印所有原始 WebSocket 消息（排查真实 OpenClaw 返回格式）
    const rawStr = typeof data === 'string' ? data : JSON.stringify(data);
    console.log(`[OpenClaw RAW] ${rawStr.slice(0, 800)}`);

    const frame = parseFrame(data as string | object);
    if (!frame) {
      console.warn('[OpenClaw] Failed to parse frame, raw data:', rawStr.slice(0, 500));
      return;
    }

    console.log(`[OpenClaw Frame] type="${frame.type}", event=${(frame as any).event}, isStreaming=${this.isStreaming}`);

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

    // 忽略心跳、健康检查等非业务事件
    if (event === OpenClawEventType.HEALTH || event === OpenClawEventType.HEARTBEAT || event === 'tick' as any) {
      console.log(`[OpenClaw] Skipping non-business event: "${event}"`);
      return;
    }

    // DEBUG: 打印所有业务事件，帮助排查真实 OpenClaw 的返回格式
    console.log(`[OpenClaw Event] event="${event}", isStreaming=${this.isStreaming}, payload=`, JSON.stringify(payload).slice(0, 500));

    // 流式消息事件
    if (this.isStreaming) {
      const result = this.eventMapper.mapEvent(frame);

      console.log(`[OpenClaw mapResult] content=${result.content ? JSON.stringify(result.content).slice(0, 200) : 'null'}, isFinal=${result.isFinal}, hasError=${result.hasError}`);

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
    } else {
      // 非流式状态下收到了业务事件，打印警告帮助排查
      console.warn(`[OpenClaw] Received event "${event}" but isStreaming=false, event may be lost. Payload:`, JSON.stringify(payload).slice(0, 300));
    }
  }

  /**
   * 处理连接挑战（握手）
   *
   * 认证成功后，如果 connect 响应中包含 messages 字段（历史消息），
   * 会自动转换为 ChatEngine 格式并触发 onHistoryLoaded 回调。
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
      userAgent: getUserAgent(),
      locale: getLocale(),
    };

    // 认证信息：优先使用动态传入的 auth，其次使用配置中的 auth
    const auth = this.pendingAuth || (Object.keys(this.config.auth).length > 0 ? this.config.auth : undefined);
    if (auth) {
      connectParams.auth = auth;
    }
    this.pendingAuth = null;

    // 设备认证：使用 nonce 签名生成 device 字段
    if (this.deviceKeyManager && payload.nonce) {
      try {
        await this.deviceKeyManager.initialize();
        const deviceIdentity = await this.deviceKeyManager.signChallenge(payload.nonce);
        connectParams.device = deviceIdentity;
        this.logger.debug(`Device auth: signed nonce, deviceId=${deviceIdentity.id}`);
      } catch (deviceError) {
        this.logger.warn('Device auth: failed to sign challenge, connecting without device identity:', deviceError);
      }
    }

    try {
      const response = await this.rpcHandler.connect(connectParams);
      this.connectionState = OpenClawConnectionState.AUTHENTICATED;
      this.logger.info('OpenClaw authenticated successfully:', response);
      this.callbacks.onConnected?.();
      this.emit('connected', response);

      // 检查 connect 响应中是否包含历史消息
      // OpenClaw Gateway 会在 connect 响应的 payload 中附带 messages 数组，
      // 用于页面刷新后自动回填历史对话记录（无需额外 RPC 请求）
      const connectPayload = response as Record<string, unknown>;
      if (Array.isArray(connectPayload?.messages) && connectPayload.messages.length > 0) {
        this.logger.info(`OpenClaw connect response contains ${connectPayload.messages.length} history messages, converting...`);
        try {
          const historyResponse = {
            sessionKey: (connectPayload.sessionKey as string) || '',
            sessionId: (connectPayload.sessionId as string) || '',
            messages: connectPayload.messages as OpenClawHistoryMessage[],
          };
          const convertedMessages = convertOpenClawHistory(historyResponse.messages);
          this.logger.info(`Converted ${convertedMessages.length} history messages`);
          this.callbacks.onHistoryLoaded?.(convertedMessages);
          this.emit('historyLoaded', convertedMessages);
        } catch (historyError) {
          this.logger.warn('Failed to convert history messages from connect response:', historyError);
          // 历史消息转换失败不影响正常连接
        }
      }
    } catch (error) {
      this.connectionState = OpenClawConnectionState.ERROR;
      this.logger.error('OpenClaw authentication failed:', error);
      this.callbacks.onError?.(error as Error);
      this.emit('error', error);
    }
  }
}
