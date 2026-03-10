/**
 * 共享内容工厂函数
 *
 * 从 AG-UI utils 中提取的协议无关的内容创建函数，
 * 供 AG-UI 和 OpenClaw 等多个适配器共同使用。
 */
export {
  createAIMessageContent,
  createToolCallContent,
  createActivityContent,
  createMarkdownContent,
  createTextContent,
  createThinkingContent,
  createReasoningContent,
  createSuggestionContent,
} from '../agui/utils';
