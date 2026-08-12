// React hooks
export * from './hooks/useAgentActivity';
export * from './hooks/useAgentState';
export * from './hooks/useAgentToolcall';
export * from './hooks/useChat';
// React components
export * from './components';

// Re-export core API from @tdesign/ai-chat-engine
// For full core API, use: import { ... } from '@tdesign/ai-chat-engine'
export { default as ChatEngine } from '@tdesign/ai-chat-engine';
export { ChatEngineEventType, ChatEventBus, createEventBus } from '@tdesign/ai-chat-engine';
export { activityManager, AGUIAdapter, stateManager } from '@tdesign/ai-chat-engine';
export {
  applyJsonPatch,
  findTargetElement,
  getMessageContentForCopy,
  isActivityContent,
  isAIMessage,
  isAttachmentContent,
  isImageContent,
  isMarkdownContent,
  isSearchContent,
  isSuggestionContent,
  isTextContent,
  isThinkingContent,
  isToolCallContent,
  isUserMessage,
  safeParseJSON,
} from '@tdesign/ai-chat-engine';
export { AGUIEventType } from '@tdesign/ai-chat-engine';

// Re-export commonly used types
export type {
  ActivityContent,
  ActivityData,
  AGUIActivityMessage,
  AGUIHistoryMessage,
  AIMessage,
  AIMessageContent,
  AttachmentContent,
  AttachmentItem,
  ChatBaseContent,
  ChatContentType,
  ChatEventBusOptions,
  ChatMessageRole,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatMessageStatus,
  ChatRequestParams,
  ChatServiceConfig,
  ChatServiceConfigSetter,
  ChatStatus,
  IChatEngine,
  IChatEventBus,
  ImageContent,
  MarkdownContent,
  SearchContent,
  SSEChunkData,
  SuggestionContent,
  SystemMessage,
  TextContent,
  ThinkingContent,
  ToolCall,
  ToolCallContent,
  UserMessage,
  UserMessageContent,
} from '@tdesign/ai-chat-engine';
