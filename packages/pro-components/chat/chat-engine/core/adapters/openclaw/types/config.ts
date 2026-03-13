/**
 * OpenClaw 配置类型定义（精简版）
 *
 * 设计原则：
 * - 只保留协议层必需的配置
 * - 业务参数（sessionKey、token、message 等）通过 onRequest 回调传入
 * - 通用网络配置（endpoint、maxRetries、timeout 等）复用外层 ChatNetworkConfig
 */

/**
 * OpenClaw 客户端标识配置
 * 用于 connect 握手时的客户端识别
 */
export interface OpenClawClientConfig {
  /** 客户端 ID，默认 'webchat' */
  id?: string;
  /** 客户端版本，默认 '1.0.0' */
  version?: string;
  /** 客户端模式，默认 'webchat' */
  mode?: string;
}

/**
 * OpenClaw 协议版本配置
 */
export interface OpenClawProtocolVersion {
  /** 最小支持的协议版本，默认 3 */
  min?: number;
  /** 最大支持的协议版本，默认 3 */
  max?: number;
}

/**
 * OpenClaw 专属配置
 * 只包含协议层必需的字段，业务参数通过 onRequest 传入
 */
export interface OpenClawConfig {
  /**
   * 心跳间隔（毫秒）
   * - 默认 30000 (30秒)
   * - 设置为 0 表示禁用心跳
   */
  heartbeatInterval?: number;

  /**
   * 客户端标识配置
   * 用于 connect 握手时的客户端识别
   */
  client?: OpenClawClientConfig;

  /**
   * 协议版本范围
   * 一般不需要修改，除非服务端有特殊要求
   */
  protocolVersion?: OpenClawProtocolVersion;

  /**
   * 设备认证配置
   * - true: 启用设备认证，使用 Ed25519 密钥对签名 nonce
   * - false: 禁用设备认证（默认）
   */
  deviceAuth?: boolean;

  /**
   * 连接认证信息
   * 在 connect 握手时传入 Gateway，通常包含 token 等
   *
   * @example
   * ```ts
   * openclaw: {
   *   auth: { token: 'your-token-here' }
   * }
   * ```
   */
  auth?: {
    token?: string;
    [key: string]: unknown;
  };
}

/**
 * OpenClaw 配置默认值
 */
export const DEFAULT_OPENCLAW_CONFIG: Required<OpenClawConfig> = {
  heartbeatInterval: 30000,
  client: {
    id: 'webchat',
    version: '1.0.0',
    mode: 'webchat',
  },
  protocolVersion: {
    min: 3,
    max: 3,
  },
  deviceAuth: false,
  auth: {},
};

/**
 * 合并 OpenClaw 配置与默认值
 */
export function mergeOpenClawConfig(config?: OpenClawConfig): Required<OpenClawConfig> {
  return {
    heartbeatInterval: config?.heartbeatInterval ?? DEFAULT_OPENCLAW_CONFIG.heartbeatInterval,
    client: {
      ...DEFAULT_OPENCLAW_CONFIG.client,
      ...config?.client,
    },
    protocolVersion: {
      ...DEFAULT_OPENCLAW_CONFIG.protocolVersion,
      ...config?.protocolVersion,
    },
    deviceAuth: config?.deviceAuth ?? DEFAULT_OPENCLAW_CONFIG.deviceAuth,
    auth: config?.auth ?? DEFAULT_OPENCLAW_CONFIG.auth,
  };
}
