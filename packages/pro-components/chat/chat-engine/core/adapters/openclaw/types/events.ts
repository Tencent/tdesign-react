/**
 * OpenClaw 事件类型定义
 */

/**
 * OpenClaw 核心事件类型
 */
export enum OpenClawEventType {
  // ============= 连接相关 =============
  /** 连接挑战（握手第一步） */
  CONNECT_CHALLENGE = 'connect.challenge',
  /** 连接成功 */
  CONNECT_SUCCESS = 'connect.success',
  /** 连接断开 */
  CONNECT_DISCONNECT = 'connect.disconnect',

  // ============= 聊天相关 =============
  /** 聊天消息 */
  CHAT = 'chat',
  /** 聊天状态更新 */
  CHAT_STATUS = 'chat.status',

  // ============= Agent 相关 =============
  /** Agent 事件（通用） */
  AGENT = 'agent',
  /** Agent 开始 */
  AGENT_START = 'agent.start',
  /** Agent 完成 */
  AGENT_COMPLETE = 'agent.complete',
  /** Agent 错误 */
  AGENT_ERROR = 'agent.error',

  // ============= 存在状态 =============
  /** 在线状态 */
  PRESENCE = 'presence',

  // ============= 健康检查 =============
  /** 健康检查 */
  HEALTH = 'health',
  /** 心跳 */
  HEARTBEAT = 'heartbeat',

  // ============= Canvas/A2UI =============
  /** Canvas 更新 */
  CANVAS = 'canvas',
  /** A2UI 活动 */
  A2UI_ACTIVITY = 'a2ui.activity',
}

/**
 * Chat 事件状态
 */
export enum ChatEventState {
  /** 增量更新（流式传输中） */
  DELTA = 'delta',
  /** 最终完成 */
  FINAL = 'final',
  /** 错误 */
  ERROR = 'error',
  /** 中止 */
  ABORTED = 'aborted',
}

/**
 * Agent 流类型
 */
export enum AgentStreamType {
  /** 助手流 */
  ASSISTANT = 'assistant',
  /** 工具流 */
  TOOL = 'tool',
  /** 生命周期流（agent 启动/停止等，不包含文本内容） */
  LIFECYCLE = 'lifecycle',
}

/**
 * Agent 数据类型
 */
export enum AgentDataType {
  /** 文本快照 */
  TEXT_SNAPSHOT = 'text_snapshot',
  /** 文本增量 */
  TEXT_DELTA = 'text_delta',
  /** 工具调用 */
  TOOL_CALL = 'tool_call',
  /** 工具结果 */
  TOOL_RESULT = 'tool_result',
  /** 完成 */
  DONE = 'done',
  /** 错误 */
  ERROR = 'error',
}

/**
 * OpenClaw RPC 方法名
 */
export enum OpenClawMethod {
  /** 连接认证 */
  CONNECT = 'connect',
  /** 发送聊天消息 */
  CHAT_SEND = 'chat.send',
  /** 会话补丁更新 */
  SESSIONS_PATCH = 'sessions.patch',
  /** 会话列表 */
  SESSIONS_LIST = 'sessions.list',
  /** 会话历史消息 */
  SESSIONS_HISTORY = 'sessions.history',
  /** 心跳 */
  HEARTBEAT = 'heartbeat',
  /** 节点列表 */
  NODE_LIST = 'node.list',
  /** 节点描述 */
  NODE_DESCRIBE = 'node.describe',
  /** 节点调用 */
  NODE_INVOKE = 'node.invoke',
}

/**
 * 连接状态
 */
export enum OpenClawConnectionState {
  /** 已断开 */
  DISCONNECTED = 'disconnected',
  /** 连接中 */
  CONNECTING = 'connecting',
  /** 已连接（握手中） */
  HANDSHAKING = 'handshaking',
  /** 已认证（可用） */
  AUTHENTICATED = 'authenticated',
  /** 重连中 */
  RECONNECTING = 'reconnecting',
  /** 关闭中 */
  CLOSING = 'closing',
  /** 已关闭 */
  CLOSED = 'closed',
  /** 错误 */
  ERROR = 'error',
}
