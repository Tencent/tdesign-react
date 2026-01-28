/**
 * A2UI 协议解析容错工具
 * 提供数据验证、默认值填充、错误恢复等能力
 */

import type { A2UIComponent, A2UIOperation, A2UIAction } from '../types';

// ============= 错误类型 =============

export type A2UIValidationErrorType =
  | 'INVALID_COMPONENT'
  | 'INVALID_OPERATION'
  | 'INVALID_SURFACE'
  | 'INVALID_ACTION'
  | 'MISSING_REQUIRED_FIELD'
  | 'TYPE_MISMATCH'
  | 'UNKNOWN_COMPONENT_TYPE';

export interface A2UIValidationError {
  type: A2UIValidationErrorType;
  message: string;
  path?: string;
  value?: unknown;
  recoverable: boolean;
}

export interface A2UIValidationResult<T> {
  success: boolean;
  data?: T;
  errors: A2UIValidationError[];
  /** 是否进行了自动修复 */
  repaired: boolean;
}

// ============= 配置 =============

export interface A2UIValidationOptions {
  /** 是否严格模式（默认 false，宽松模式会尝试修复） */
  strict?: boolean;
  /** 是否输出警告日志（默认 true） */
  logWarnings?: boolean;
  /** 已知的组件类型列表（用于校验） */
  knownComponentTypes?: string[];
}

const DEFAULT_OPTIONS: A2UIValidationOptions = {
  strict: false,
  logWarnings: true,
  knownComponentTypes: ['Text', 'Button', 'Input', 'Card', 'Row', 'Column', 'RadioGroup', 'CheckboxGroup'],
};

// ============= 组件验证 =============

/**
 * 验证并修复组件数据
 */
export function validateComponent(
  component: unknown,
  options: A2UIValidationOptions = {}
): A2UIValidationResult<A2UIComponent> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: A2UIValidationError[] = [];
  let repaired = false;

  // 基础类型检查
  if (!component || typeof component !== 'object') {
    return {
      success: false,
      errors: [{
        type: 'INVALID_COMPONENT',
        message: 'Component must be an object',
        value: component,
        recoverable: false,
      }],
      repaired: false,
    };
  }

  const comp = component as Record<string, unknown>;

  // 必须有 component 字段
  if (!comp.component || typeof comp.component !== 'string') {
    if (opts.strict) {
      return {
        success: false,
        errors: [{
          type: 'MISSING_REQUIRED_FIELD',
          message: 'Component must have a "component" field',
          path: 'component',
          value: comp.component,
          recoverable: false,
        }],
        repaired: false,
      };
    }

    // 宽松模式：尝试推断组件类型
    if (comp.text !== undefined) {
      comp.component = 'Text';
      repaired = true;
    } else if (comp.label !== undefined && comp.action !== undefined) {
      comp.component = 'Button';
      repaired = true;
    } else {
      // 无法推断，使用 Text 作为默认
      comp.component = 'Text';
      repaired = true;
      errors.push({
        type: 'MISSING_REQUIRED_FIELD',
        message: 'Component type missing, defaulting to "Text"',
        path: 'component',
        recoverable: true,
      });
    }
  }

  // 检查组件类型是否已知
  if (opts.knownComponentTypes && !opts.knownComponentTypes.includes(comp.component as string)) {
    errors.push({
      type: 'UNKNOWN_COMPONENT_TYPE',
      message: `Unknown component type: ${comp.component}`,
      path: 'component',
      value: comp.component,
      recoverable: true,
    });
  }

  // 确保有 id（如果没有，生成一个）
  if (!comp.id) {
    comp.id = `auto_${comp.component}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    repaired = true;
  }

  // 递归验证子组件
  if (Array.isArray(comp.children)) {
    const validatedChildren: A2UIComponent[] = [];
    for (let i = 0; i < comp.children.length; i++) {
      const childResult = validateComponent(comp.children[i], opts);
      if (childResult.success && childResult.data) {
        validatedChildren.push(childResult.data);
      } else {
        errors.push(...childResult.errors.map(e => ({
          ...e,
          path: `children[${i}]${e.path ? '.' + e.path : ''}`,
        })));
        // 宽松模式下跳过无效子组件
        if (!opts.strict && childResult.data) {
          validatedChildren.push(childResult.data);
          repaired = true;
        }
      }
      if (childResult.repaired) repaired = true;
    }
    comp.children = validatedChildren;
  }

  // 输出警告
  if (opts.logWarnings && errors.length > 0) {
    console.warn('[A2UI] Component validation warnings:', errors);
  }

  return {
    success: errors.filter(e => !e.recoverable).length === 0,
    data: comp as A2UIComponent,
    errors,
    repaired,
  };
}

// ============= 操作验证 =============

/**
 * 验证并修复操作数据
 */
export function validateOperation(
  operation: unknown,
  options: A2UIValidationOptions = {}
): A2UIValidationResult<A2UIOperation> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: A2UIValidationError[] = [];
  let repaired = false;

  if (!operation || typeof operation !== 'object') {
    return {
      success: false,
      errors: [{
        type: 'INVALID_OPERATION',
        message: 'Operation must be an object',
        value: operation,
        recoverable: false,
      }],
      repaired: false,
    };
  }

  const op = operation as Record<string, unknown>;

  // 验证 type
  const validTypes = ['create', 'update', 'patch', 'delete', 'action'];
  if (!op.type || !validTypes.includes(op.type as string)) {
    if (opts.strict) {
      return {
        success: false,
        errors: [{
          type: 'INVALID_OPERATION',
          message: `Invalid operation type: ${op.type}. Must be one of: ${validTypes.join(', ')}`,
          path: 'type',
          value: op.type,
          recoverable: false,
        }],
        repaired: false,
      };
    }

    // 宽松模式：根据 payload 推断类型
    if (op.payload && typeof op.payload === 'object') {
      op.type = 'update';
      repaired = true;
      errors.push({
        type: 'MISSING_REQUIRED_FIELD',
        message: 'Operation type missing, defaulting to "update"',
        path: 'type',
        recoverable: true,
      });
    }
  }

  // 验证 surfaceId
  if (!op.surfaceId || typeof op.surfaceId !== 'string') {
    errors.push({
      type: 'MISSING_REQUIRED_FIELD',
      message: 'Operation must have a surfaceId',
      path: 'surfaceId',
      value: op.surfaceId,
      recoverable: false,
    });
    return { success: false, errors, repaired };
  }

  // patch 操作需要 componentId
  if (op.type === 'patch' && !op.componentId) {
    errors.push({
      type: 'MISSING_REQUIRED_FIELD',
      message: 'Patch operation requires componentId',
      path: 'componentId',
      recoverable: false,
    });
    if (opts.strict) {
      return { success: false, errors, repaired };
    }
  }

  // 验证 payload（如果有）
  if (op.payload && ['create', 'update'].includes(op.type as string)) {
    const payloadResult = validateComponent(op.payload, opts);
    if (payloadResult.data) {
      op.payload = payloadResult.data;
    }
    errors.push(...payloadResult.errors.map(e => ({
      ...e,
      path: `payload${e.path ? '.' + e.path : ''}`,
    })));
    if (payloadResult.repaired) repaired = true;
  }

  if (opts.logWarnings && errors.length > 0) {
    console.warn('[A2UI] Operation validation warnings:', errors);
  }

  return {
    success: errors.filter(e => !e.recoverable).length === 0,
    data: op as unknown as A2UIOperation,
    errors,
    repaired,
  };
}

// ============= Action 验证 =============

/**
 * 验证 Action 数据
 */
export function validateAction(
  action: unknown,
  options: A2UIValidationOptions = {}
): A2UIValidationResult<A2UIAction> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: A2UIValidationError[] = [];

  if (!action || typeof action !== 'object') {
    return {
      success: false,
      errors: [{
        type: 'INVALID_ACTION',
        message: 'Action must be an object',
        value: action,
        recoverable: false,
      }],
      repaired: false,
    };
  }

  const act = action as Record<string, unknown>;

  // 验证 type
  if (!act.type || typeof act.type !== 'string') {
    errors.push({
      type: 'MISSING_REQUIRED_FIELD',
      message: 'Action must have a type',
      path: 'type',
      value: act.type,
      recoverable: false,
    });
    return { success: false, errors, repaired: false };
  }

  // payload 应该是对象（如果存在）
  if (act.payload !== undefined && typeof act.payload !== 'object') {
    errors.push({
      type: 'TYPE_MISMATCH',
      message: 'Action payload should be an object',
      path: 'payload',
      value: act.payload,
      recoverable: true,
    });
  }

  if (opts.logWarnings && errors.length > 0) {
    console.warn('[A2UI] Action validation warnings:', errors);
  }

  return {
    success: errors.filter(e => !e.recoverable).length === 0,
    data: act as A2UIAction,
    errors,
    repaired: false,
  };
}

// ============= 数据绑定验证 =============

/**
 * 验证数据绑定路径
 */
export function validateBindingPath(path: unknown): { valid: boolean; path?: string; error?: string } {
  if (typeof path !== 'string') {
    return { valid: false, error: 'Binding path must be a string' };
  }

  // 路径应该以 / 开头
  if (!path.startsWith('/')) {
    // 自动补全
    return { valid: true, path: '/' + path };
  }

  // 验证路径格式
  const pathRegex = /^\/[a-zA-Z0-9_\-./]*$/;
  if (!pathRegex.test(path)) {
    return { valid: false, error: `Invalid binding path format: ${path}` };
  }

  return { valid: true, path };
}

/**
 * 安全解析 JSON
 */
export function safeParseJSON<T = unknown>(
  json: string,
  fallback: T
): { success: boolean; data: T; error?: Error } {
  try {
    const data = JSON.parse(json);
    return { success: true, data };
  } catch (error) {
    console.warn('[A2UI] JSON parse error:', error);
    return { success: false, data: fallback, error: error as Error };
  }
}

// ============= 批量验证 =============

/**
 * 批量验证操作列表
 */
export function validateOperations(
  operations: unknown[],
  options: A2UIValidationOptions = {}
): { valid: A2UIOperation[]; invalid: Array<{ index: number; errors: A2UIValidationError[] }> } {
  const valid: A2UIOperation[] = [];
  const invalid: Array<{ index: number; errors: A2UIValidationError[] }> = [];

  for (let i = 0; i < operations.length; i++) {
    const result = validateOperation(operations[i], options);
    if (result.success && result.data) {
      valid.push(result.data);
    } else {
      invalid.push({ index: i, errors: result.errors });
    }
  }

  return { valid, invalid };
}

// ============= 错误报告 =============

/**
 * 格式化验证错误为可读字符串
 */
export function formatValidationErrors(errors: A2UIValidationError[]): string {
  return errors
    .map(e => `[${e.type}]${e.path ? ` at ${e.path}` : ''}: ${e.message}`)
    .join('\n');
}
