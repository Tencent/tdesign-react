/**
 * OpenClaw 工具函数
 */
import type { OpenClawFrame, OpenClawRequestFrame, OpenClawResponseFrame, OpenClawEventFrame } from './types';

/**
 * 生成 UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 解析 OpenClaw 消息帧
 */
export function parseFrame(data: string | object): OpenClawFrame | null {
  try {
    const frame = typeof data === 'string' ? JSON.parse(data) : data;
    if (!frame || typeof frame !== 'object') {
      return null;
    }
    if (!['req', 'res', 'event'].includes(frame.type)) {
      return null;
    }
    return frame as OpenClawFrame;
  } catch {
    return null;
  }
}

/**
 * 创建请求帧
 */
export function createRequestFrame<T extends Record<string, unknown>>(
  method: string,
  params: T,
  id?: string,
): OpenClawRequestFrame<T> {
  return {
    type: 'req',
    id: id || generateUUID(),
    method,
    params,
  };
}

/**
 * 获取平台信息
 */
export function getPlatform(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.platform || 'web';
  }
  return 'web';
}

/**
 * 获取 User Agent
 */
export function getUserAgent(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.userAgent;
  }
  return 'TDesign-ChatEngine/1.0';
}

/**
 * 获取语言环境
 */
export function getLocale(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.language || 'en-US';
  }
  return 'en-US';
}

/**
 * 检查 WebSocket 是否可用
 */
export function isWebSocketSupported(): boolean {
  return typeof WebSocket !== 'undefined';
}

/**
 * 格式化 WebSocket URL
 * 确保 URL 使用正确的协议
 */
export function formatWebSocketUrl(url: string): string {
  if (url.startsWith('ws://') || url.startsWith('wss://')) {
    return url;
  }
  // 如果是 http/https，转换为 ws/wss
  if (url.startsWith('https://')) {
    return url.replace('https://', 'wss://');
  }
  if (url.startsWith('http://')) {
    return url.replace('http://', 'ws://');
  }
  // 默认添加 ws://
  return `ws://${url}`;
}

/**
 * 计算指数退避延迟
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number,
  maxDelay = 30000,
  jitter = true,
): number {
  let delay = baseDelay * Math.pow(1.5, attempt - 1);
  delay = Math.min(delay, maxDelay);
  
  if (jitter) {
    // 添加 ±10% 的抖动
    const jitterRange = delay * 0.1;
    delay += (Math.random() - 0.5) * 2 * jitterRange;
  }
  
  return Math.floor(delay);
}

/**
 * 安全的 JSON 解析
 */
export function safeJsonParse<T>(data: string, fallback: T): T {
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = result[key];
      const sourceValue = source[key];
      
      if (
        typeof targetValue === 'object' &&
        targetValue !== null &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(targetValue) &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>,
        ) as T[typeof key];
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue as T[typeof key];
      }
    }
  }
  
  return result;
}
