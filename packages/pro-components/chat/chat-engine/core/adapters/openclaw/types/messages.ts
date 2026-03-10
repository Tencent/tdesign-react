/**
 * OpenClaw 消息格式类型定义
 *
 * OpenClaw 采用 RPC 风格的消息通信，有三种消息类型：
 * - req: 客户端向 Gateway 发起的请求
 * - res: Gateway 返回的响应
 * - event: 服务端主动推送的事件
 */

/**
 * OpenClaw 消息类型
 */
export type OpenClawMessageType = 'req' | 'res' | 'event';

/**
 * OpenClaw 请求帧
 */
export interface OpenClawRequestFrame<TParams = Record<string, unknown>> {
  type: 'req';
  /** 请求唯一标识，用于匹配响应 */
  id: string;
  /** RPC 方法名 */
  method: string;
  /** 请求参数 */
  params: TParams;
}

/**
 * OpenClaw 响应帧
 */
export interface OpenClawResponseFrame<TPayload = unknown> {
  type: 'res';
  /** 请求唯一标识，与请求帧的 id 对应 */
  id: string;
  /** 是否成功 */
  ok: boolean;
  /** 成功时的响应数据 */
  payload?: TPayload;
  /** 失败时的错误信息 */
  error?: OpenClawError;
}

/**
 * OpenClaw 事件帧
 */
export interface OpenClawEventFrame<TPayload = unknown> {
  type: 'event';
  /** 事件名称 */
  event: string;
  /** 事件序号 */
  seq?: number;
  /** 事件数据 */
  payload?: TPayload;
}

/**
 * OpenClaw 错误信息
 */
export interface OpenClawError {
  /** 错误码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 详细信息 */
  details?: unknown;
}

/**
 * OpenClaw 消息帧（联合类型）
 */
export type OpenClawFrame<T = unknown> =
  | OpenClawRequestFrame<T extends Record<string, unknown> ? T : Record<string, unknown>>
  | OpenClawResponseFrame<T>
  | OpenClawEventFrame<T>;

// ============= RPC 方法参数类型 =============

/**
 * connect 方法参数
 */
export interface ConnectParams {
  /** 最小协议版本 */
  minProtocol: number;
  /** 最大协议版本 */
  maxProtocol: number;
  /** 客户端信息 */
  client: {
    id: string;
    version: string;
    platform: string;
    mode: string;
    instanceId: string;
  };
  /** 角色 */
  role?: string;
  /** 权限范围 */
  scopes?: string[];
  /** 能力列表 */
  caps?: string[];
  /** 认证信息（可选，由 onRequest 传入） */
  auth?: {
    token?: string;
    [key: string]: unknown;
  };
  /** User Agent */
  userAgent?: string;
  /** 语言环境 */
  locale?: string;
}

/**
 * connect 方法响应
 */
export interface ConnectResponse {
  /** 协商后的协议版本 */
  protocol: number;
  /** 会话 ID */
  sessionId: string;
  /** 服务端版本 */
  serverVersion?: string;
  /** 支持的能力列表 */
  capabilities?: string[];
}

/**
 * chat.send 方法参数（基础结构，具体字段由 onRequest 传入）
 */
export interface ChatSendParams {
  /** 消息内容 */
  message: string;
  /** 会话标识 */
  sessionKey?: string;
  /** 幂等键 */
  idempotencyKey?: string;
  /** 其他自定义参数 */
  [key: string]: unknown;
}

/**
 * chat.send 方法响应
 */
export interface ChatSendResponse {
  /** 运行 ID */
  runId: string;
  /** 状态 */
  status: string;
}

// ============= 事件类型 =============

/**
 * connect.challenge 事件数据
 */
export interface ConnectChallengePayload {
  /** 随机数 */
  nonce: string;
  /** 协议版本 */
  protocolVersion?: number;
}

/**
 * chat 事件数据
 */
export interface ChatEventPayload {
  /** 运行 ID */
  runId?: string;
  /** 会话标识 */
  sessionKey?: string;
  /** 消息状态: delta(增量) | final(完成) | error(错误) | aborted(中止) */
  state: 'delta' | 'final' | 'error' | 'aborted';
  /** 消息内容 */
  message?: {
    role: 'assistant' | 'user' | 'system';
    content: Array<{
      type: string;
      text?: string;
      [key: string]: unknown;
    }>;
  };
  /** 错误消息 */
  errorMessage?: string;
}

/**
 * agent 事件数据
 *
 * 实际 OpenClaw agent 事件示例：
 * {
 *   "type": "event",
 *   "event": "agent",
 *   "payload": {
 *     "runId": "b7dfa37d-...",
 *     "stream": "assistant",
 *     "data": { "text": "全量快照文本", "delta": "本次增量" },
 *     "sessionKey": "agent:main:main",
 *     "seq": 12,
 *     "ts": 1772612049089
 *   },
 *   "seq": 16278
 * }
 */
export interface AgentEventPayload {
  /** 运行 ID */
  runId?: string;
  /** 流类型: assistant | tool | system */
  stream?: string;
  /** 事件子类型（可选，实际 agent 流式事件中通常不存在） */
  type?: string;
  /** 数据内容 */
  data?: {
    /** 全量文本快照（包含到当前为止的所有文本） */
    text?: string;
    /** 本次增量文本 */
    delta?: string;
    [key: string]: unknown;
  };
  /** payload 内序号（agent 事件流内的顺序） */
  seq?: number;
  /** 时间戳 */
  ts?: number;
  /** 会话标识 */
  sessionKey?: string;
}

/**
 * 类型守卫：判断是否为请求帧
 */
export function isRequestFrame(frame: OpenClawFrame): frame is OpenClawRequestFrame {
  return frame.type === 'req';
}

/**
 * 类型守卫：判断是否为响应帧
 */
export function isResponseFrame(frame: OpenClawFrame): frame is OpenClawResponseFrame {
  return frame.type === 'res';
}

/**
 * 类型守卫：判断是否为事件帧
 */
export function isEventFrame(frame: OpenClawFrame): frame is OpenClawEventFrame {
  return frame.type === 'event';
}
