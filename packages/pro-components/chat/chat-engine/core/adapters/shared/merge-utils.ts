/**
 * 共享合并工具函数
 *
 * 从 AG-UI utils 中提取的协议无关的合并/更新函数，
 * 供 AG-UI 和 OpenClaw 等多个适配器共同使用。
 */
export {
  mergeStringContent,
  updateToolCall,
  handleSuggestionToolCall,
  parseSSEData,
} from '../agui/utils';
