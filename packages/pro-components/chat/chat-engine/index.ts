// React hooks
export * from './hooks/useChat';
export * from './hooks/useAgentToolcall';
export * from './hooks/useAgentState';
export * from './hooks/useAgentActivity';
// React components
export * from './components';

// Re-export core API from @tdesign/ai-chat-engine
// For full core API, use: import { ... } from '@tdesign/ai-chat-engine'
export { default as ChatEngine } from '@tdesign/ai-chat-engine';
export { ChatEngineEventType, ChatEventBus, createEventBus } from '@tdesign/ai-chat-engine';
export { AGUIAdapter, stateManager, activityManager } from '@tdesign/ai-chat-engine';
export {
  isAIMessage,
  isUserMessage,
  isTextContent,
  isMarkdownContent,
  isToolCallContent,
  isActivityContent,
  isThinkingContent,
  isReasoningContent,
  isSearchContent,
  isSuggestionContent,
  isAttachmentContent,
  isImageContent,
  applyJsonPatch,
  safeParseJSON,
  getMessageContentForCopy,
  findTargetElement,
} from '@tdesign/ai-chat-engine';
export { AGUIEventType } from '@tdesign/ai-chat-engine';

// Re-export commonly used types
export type {
  ChatMessagesData,
  ChatServiceConfig,
  ChatServiceConfigSetter,
  ChatStatus,
  ChatMessageStatus,
  ChatMessageRole,
  ChatRequestParams,
  ChatMessageSetterMode,
  AIMessageContent,
  UserMessageContent,
  SSEChunkData,
  IChatEngine,
  IChatEventBus,
  UserMessage,
  AIMessage,
  SystemMessage,
  ToolCall,
  ToolCallContent,
  ActivityData,
  ActivityContent,
  TextContent,
  MarkdownContent,
  ThinkingContent,
  ReasoningContent,
  SearchContent,
  SuggestionContent,
  ImageContent,
  AttachmentContent,
  AttachmentItem,
  ChatBaseContent,
  ChatContentType,
  ChatEventBusOptions,
  AGUIHistoryMessage,
  AGUIActivityMessage,
} from '@tdesign/ai-chat-engine';
