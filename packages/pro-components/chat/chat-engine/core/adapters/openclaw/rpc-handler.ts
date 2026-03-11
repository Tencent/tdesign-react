/**
 * OpenClaw RPC 请求/响应处理器
 *
 * 管理请求队列、响应匹配、超时和错误处理
 */
import type {
  OpenClawRequestFrame,
  OpenClawResponseFrame,
  OpenClawEventFrame,
  OpenClawFrame,
  OpenClawError,
  ConnectParams,
  ConnectResponse,
  ChatSendParams,
  ChatSendResponse,
} from './types';
import { OpenClawMethod } from './types/events';

/**
 * 待处理请求信息
 */
interface PendingRequest<T = unknown> {
  resolve: (payload: T) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
  method: string;
  createdAt: number;
}

/**
 * RPC 处理器配置
 */
export interface RPCHandlerConfig {
  /** 请求超时时间（毫秒），默认 30000 */
  timeout?: number;
  /** 是否自动重试失败的请求，默认 false */
  autoRetry?: boolean;
  /** 最大重试次数，默认 3 */
  maxRetries?: number;
}

/**
 * RPC 错误类
 */
export class RPCError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'RPCError';
  }
}

/**
 * OpenClaw RPC 处理器
 *
 * 功能：
 * - 管理请求队列
 * - 匹配响应到对应的请求
 * - 处理超时
 * - 提供便捷的 RPC 方法调用
 */
export class OpenClawRPCHandler {
  private pendingRequests = new Map<string, PendingRequest>();

  private config: Required<RPCHandlerConfig>;

  private sendFn: ((frame: OpenClawRequestFrame) => void) | null = null;

  private seq = 0;

  constructor(config?: RPCHandlerConfig) {
    this.config = {
      timeout: config?.timeout ?? 30000,
      autoRetry: config?.autoRetry ?? false,
      maxRetries: config?.maxRetries ?? 3,
    };
  }

  /**
   * 设置发送函数
   */
  setSendFunction(fn: (frame: OpenClawRequestFrame) => void): void {
    this.sendFn = fn;
  }

  /**
   * 生成唯一请求 ID
   */
  generateRequestId(): string {
    this.seq++;
    return `req_${Date.now()}_${this.seq}_${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * 发送 RPC 请求
   */
  async request<TParams extends Record<string, unknown>, TResult>(
    method: string,
    params: TParams,
  ): Promise<TResult> {
    if (!this.sendFn) {
      throw new RPCError('Send function not set', 'SEND_NOT_CONFIGURED');
    }

    const id = this.generateRequestId();
    const frame: OpenClawRequestFrame<TParams> = {
      type: 'req',
      id,
      method,
      params,
    };

    return new Promise<TResult>((resolve, reject) => {
      // 设置超时
      const timeoutId = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new RPCError(`Request timeout: ${method}`, 'TIMEOUT'));
        }
      }, this.config.timeout);

      // 存储待处理请求
      this.pendingRequests.set(id, {
        resolve: resolve as (payload: unknown) => void,
        reject,
        timeoutId,
        method,
        createdAt: Date.now(),
      });

      // 发送请求
      try {
        this.sendFn!(frame);
      } catch (error) {
        this.pendingRequests.delete(id);
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * 处理响应帧
   */
  handleResponse(frame: OpenClawResponseFrame): boolean {
    const pending = this.pendingRequests.get(frame.id);
    if (!pending) {
      // 没有找到对应的请求，可能已超时
      return false;
    }

    // 清理
    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(frame.id);

    if (frame.ok) {
      pending.resolve(frame.payload);
    } else {
      const error = frame.error || { code: 'UNKNOWN', message: 'Unknown error' };
      pending.reject(new RPCError(error.message, error.code, error.details));
    }

    return true;
  }

  /**
   * 处理接收到的消息帧
   * 自动区分响应和事件
   */
  handleFrame(frame: OpenClawFrame): { type: 'response' | 'event'; handled: boolean; data?: unknown } {
    if (frame.type === 'res') {
      const handled = this.handleResponse(frame as OpenClawResponseFrame);
      return { type: 'response', handled };
    }

    if (frame.type === 'event') {
      // 事件帧，返回给调用者处理
      return { type: 'event', handled: false, data: frame };
    }

    return { type: 'response', handled: false };
  }

  // ============= 便捷方法 =============

  /**
   * 发送连接认证请求
   */
  async connect(params: ConnectParams): Promise<ConnectResponse> {
    return this.request<ConnectParams, ConnectResponse>(OpenClawMethod.CONNECT, params);
  }

  /**
   * 发送聊天消息
   */
  async chatSend(params: ChatSendParams): Promise<ChatSendResponse> {
    return this.request<ChatSendParams, ChatSendResponse>(OpenClawMethod.CHAT_SEND, params);
  }

  /**
   * 发送心跳
   */
  async heartbeat(): Promise<{ ts: number }> {
    return this.request<{ ts: number }, { ts: number }>(OpenClawMethod.HEARTBEAT, { ts: Date.now() });
  }

  /**
   * 节点调用（用于 Toolcall/Activity 的 action 上行）
   *
   * 遵循 OpenClaw 的 node.invoke RPC 方法，通过 WebSocket 双向通道
   * 将用户在 Toolcall/Activity 组件中的操作（respond/confirm/update 等）
   * 发送回 Agent 端处理。
   *
   * @param params.nodeId - toolCallId 或 activityType，标识目标节点
   * @param params.action - 操作类型，如 "respond" | "update" | "confirm"
   * @param params.payload - 用户操作数据
   * @param params.runId - 关联的运行 ID（可选）
   */
  async nodeInvoke(params: {
    nodeId: string;
    action: string;
    payload: unknown;
    runId?: string;
  }): Promise<unknown> {
    return this.request(OpenClawMethod.NODE_INVOKE, params as unknown as Record<string, unknown>);
  }

  /**
   * 获取会话历史消息
   *
   * 通过 OpenClaw 的 sessions.history RPC 方法获取指定会话的历史消息。
   * 返回的消息需要通过 convertOpenClawHistory 转换为 ChatEngine 格式。
   *
   * @param params.sessionKey - 会话标识
   * @returns 包含 sessionKey, sessionId, messages 的响应对象
   */
  async sessionsHistory(params: {
    sessionKey: string;
    [key: string]: unknown;
  }): Promise<unknown> {
    return this.request(OpenClawMethod.SESSIONS_HISTORY, params as unknown as Record<string, unknown>);
  }

  /**
   * 取消所有待处理的请求
   */
  cancelAll(reason = 'Cancelled'): void {
    this.pendingRequests.forEach((pending, id) => {
      clearTimeout(pending.timeoutId);
      pending.reject(new RPCError(reason, 'CANCELLED'));
    });
    this.pendingRequests.clear();
  }

  /**
   * 获取待处理请求数量
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * 重置处理器状态
   */
  reset(): void {
    this.cancelAll('Handler reset');
    this.seq = 0;
  }

  /**
   * 销毁处理器
   */
  destroy(): void {
    this.cancelAll('Handler destroyed');
    this.sendFn = null;
  }
}
