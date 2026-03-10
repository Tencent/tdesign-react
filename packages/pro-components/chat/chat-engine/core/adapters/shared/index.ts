/**
 * 共享适配器工具层
 *
 * 包含协议无关的通用函数和管理器，供多个适配器共同使用。
 * 这些工具从 AG-UI 的 utils 和 ActivityManager 中提取，
 * 避免 OpenClaw 等适配器直接依赖 agui 模块。
 */

// 内容创建工厂函数
export {
  createAIMessageContent,
  createToolCallContent,
  createActivityContent,
  createMarkdownContent,
  createTextContent,
  createThinkingContent,
  createReasoningContent,
  createSuggestionContent,
} from './content-factory';

// 合并/更新工具函数
export {
  mergeStringContent,
  updateToolCall,
  handleSuggestionToolCall,
  parseSSEData,
} from './merge-utils';

// Activity 管理器
export { ActivityManagerImpl, activityManager } from './activity-manager';
export type { ActivityManager } from './activity-manager';
