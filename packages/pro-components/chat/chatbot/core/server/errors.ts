/* eslint-disable max-classes-per-file */
/**
 * Enhanced error classes for SSE client
 */

// 基础 SSE 错误类
export class SSEError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly isRetryable: boolean = false,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'SSEError';
  }
}

// 连接错误
export class ConnectionError extends SSEError {
  constructor(message: string, statusCode?: number, details?: any) {
    super(message, 'CONNECTION_ERROR', statusCode, true, details);
    this.name = 'ConnectionError';
  }
}

// 超时错误
export class TimeoutError extends SSEError {
  constructor(details?: any, message = '请求超时') {
    super(message, 'TIMEOUT_ERROR', undefined, true, details);
    this.name = 'TimeoutError';
  }
}

// 解析错误
export class ParseError extends SSEError {
  constructor(message: string, details?: any) {
    super(message, 'PARSE_ERROR', undefined, false, details);
    this.name = 'ParseError';
  }
}

// 验证错误
export class ValidationError extends SSEError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', undefined, false, details);
    this.name = 'ValidationError';
  }
}
