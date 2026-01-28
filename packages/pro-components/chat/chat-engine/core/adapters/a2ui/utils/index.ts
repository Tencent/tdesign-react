/**
 * A2UI 工具函数导出
 */

// 绑定解析
export {
  isPathBinding,
  isExprBinding,
  resolveBinding,
  resolvePathBinding,
  resolveExprBinding,
  evaluateExpression,
  formatValue,
} from './binding';

// 验证工具
export {
  validateComponent,
  validateOperation,
  validateAction,
  validateBindingPath,
  validateOperations,
  safeParseJSON,
  formatValidationErrors,
  type A2UIValidationError,
  type A2UIValidationErrorType,
  type A2UIValidationResult,
  type A2UIValidationOptions,
} from './validation';
