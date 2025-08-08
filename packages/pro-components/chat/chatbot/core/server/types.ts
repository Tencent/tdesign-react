/**
 * Enhanced server types for SSE client and LLM service
 */

import { ChatRequestParams } from '../type';

// 连接状态枚举
export enum SSEConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  CLOSING = 'closing',
  CLOSED = 'closed',
  ERROR = 'error',
}

// SSE 客户端配置
export interface SSEClientConfig extends Omit<RequestInit & ChatRequestParams, 'signal'> {
  timeout?: number;
}

// 事件接口
export interface SSEEvent {
  event?: string;
  data?: any;
  id?: string;
  retry?: number;
  timestamp?: number;
}

// 连接信息
export interface ConnectionInfo {
  id: string;
  retryCount: number;
  lastActivity: number;
  state?: SSEConnectionState; // 可选状态
  url?: string; // 可选URL
  createdAt?: number; // 可选创建时间
  error?: Error; // 可选错误信息
  stats: ConnectionStats; // 添加必需的统计信息属性
}

// 简化的连接状态信息
export interface ConnectionStatus {
  id: string;
  state: SSEConnectionState;
  error?: Error;
  lastActivity?: number;
}

// 简化的连接统计
export interface ConnectionStats {
  lastError?: Error;
  connectionTime?: number;
}

// 状态变化事件
export interface StateChangeEvent {
  connectionId: string;
  from: SSEConnectionState;
  to: SSEConnectionState;
  timestamp: number;
}

// 心跳事件
export interface HeartbeatEvent {
  connectionId: string;
  timestamp: number;
}

export const DEFAULT_SSE_CONFIG: SSEClientConfig = {
  timeout: 0,
  method: 'POST',
  headers: {
    Accept: 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
};
