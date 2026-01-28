/**
 * A2UI 绑定解析工具
 * 提供路径绑定和表达式绑定的运行时解析能力
 */

import { Parser, type Values } from 'expr-eval';
import type { PathBinding, ExprBinding, Bindable } from '../types/types';

// 创建 expr-eval Parser 实例
const parser = new Parser();

/**
 * 判断是否为路径绑定
 */
export function isPathBinding(value: unknown): value is PathBinding {
  return typeof value === 'object' && value !== null && 'path' in value && !('expr' in value);
}

/**
 * 判断是否为表达式绑定
 */
export function isExprBinding(value: unknown): value is ExprBinding {
  return typeof value === 'object' && value !== null && 'expr' in value;
}

/**
 * 解析绑定值
 */
export function resolveBinding<T>(
  value: Bindable<T>,
  data: Record<string, unknown>,
  contextPath = '/'
): T {
  // 表达式绑定
  if (isExprBinding(value)) {
    return resolveExprBinding(value, data, contextPath) as T;
  }
  
  // 路径绑定
  if (isPathBinding(value)) {
    return resolvePathBinding(value.path, data, contextPath) as T;
  }

  // 字面值
  return value;
}

/**
 * 解析路径绑定
 */
export function resolvePathBinding(
  path: string,
  data: Record<string, unknown>,
  contextPath: string
): unknown {
  // 处理路径
  let fullPath = path;
  
  if (!path.startsWith('/')) {
    // 相对路径，与 contextPath 结合
    if (!contextPath || contextPath === '/') {
      fullPath = `/${path}`;
    } else {
      fullPath = `${contextPath}/${path}`;
    }
  }

  // 规范化路径
  fullPath = fullPath.replace(/\/+/g, '/');

  const segments = fullPath.split('/').filter(Boolean);
  let result: unknown = data;

  for (const segment of segments) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = (result as Record<string, unknown>)[segment];
  }

  return result;
}

/**
 * 解析表达式绑定
 * 使用 expr-eval 库进行安全的表达式求值
 */
export function resolveExprBinding(
  binding: ExprBinding,
  data: Record<string, unknown>,
  contextPath: string
): unknown {
  const { expr, vars = {}, format } = binding;
  
  // 解析所有变量
  const resolvedVars: Record<string, unknown> = {};
  for (const [key, varBinding] of Object.entries(vars)) {
    if (isPathBinding(varBinding)) {
      resolvedVars[key] = resolvePathBinding(varBinding.path, data, contextPath);
    } else if (isExprBinding(varBinding)) {
      resolvedVars[key] = resolveExprBinding(varBinding, data, contextPath);
    } else {
      resolvedVars[key] = varBinding;
    }
  }
  
  // 执行表达式
  try {
    const result = evaluateExpression(expr, resolvedVars);
    
    // 应用格式化
    if (format && typeof result === 'number') {
      return formatValue(result, format);
    }
    
    return result;
  } catch (e) {
    console.warn('Expression evaluation error:', e);
    return undefined;
  }
}

/**
 * 使用 expr-eval 进行安全的表达式求值
 */
export function evaluateExpression(
  expr: string,
  vars: Record<string, unknown>
): unknown {
  // 预处理变量
  const processedVars: Values = {};
  let hasString = false;
  
  for (const [key, value] of Object.entries(vars)) {
    if (Array.isArray(value)) {
      processedVars[key] = value.length;
    } else if (typeof value === 'number') {
      processedVars[key] = value;
    } else if (typeof value === 'string') {
      processedVars[key] = value;
      hasString = true;
    } else if (typeof value === 'boolean') {
      processedVars[key] = value ? 1 : 0;
    } else if (value === null || value === undefined) {
      processedVars[key] = 0;
    } else {
      processedVars[key] = String(value);
      hasString = true;
    }
  }
  
  // 检测是否为字符串拼接表达式
  const hasStringLiteral = /"[^"]*"/.test(expr);
  
  if (hasString || hasStringLiteral) {
    return evaluateStringExpression(expr, processedVars);
  }
  
  // 纯数学表达式
  const parsedExpr = parser.parse(expr);
  return parsedExpr.evaluate(processedVars);
}

/**
 * 处理包含字符串的表达式
 */
function evaluateStringExpression(
  expr: string,
  vars: Values
): unknown {
  let processedExpr = expr;
  
  // 替换变量
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    if (typeof value === 'number') {
      processedExpr = processedExpr.replace(regex, String(value));
    } else if (typeof value === 'string') {
      processedExpr = processedExpr.replace(regex, `"${value}"`);
    }
  }
  
  // 安全检查
  const dangerousPatterns = [
    /\beval\b/i,
    /\bFunction\b/,
    /\bwindow\b/i,
    /\bdocument\b/i,
    /\bglobal\b/i,
    /\bprocess\b/i,
    /\brequire\b/i,
    /\bimport\b/i,
    /\bexport\b/i,
    /\b__proto__\b/,
    /\bconstructor\b/,
    /\bprototype\b/,
    /\bfetch\b/i,
    /\bXMLHttpRequest\b/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(processedExpr)) {
      throw new Error('Unsafe expression: contains forbidden pattern');
    }
  }
  
  // eslint-disable-next-line no-new-func
  return new Function(`return (${processedExpr})`)();
}

/**
 * 格式化数值
 */
export function formatValue(value: number, format: string): string {
  switch (format) {
    case 'currency':
      return `¥${value.toFixed(2)}`;
    case 'currency-int':
      return `¥${value}`;
    case 'percent':
      return `${(value * 100).toFixed(0)}%`;
    default:
      return String(value);
  }
}
