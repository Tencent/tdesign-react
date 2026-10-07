// React hooks
export * from './hooks/useAgentActivity';
export * from './hooks/useAgentState';
export * from './hooks/useAgentToolcall';
export * from './hooks/useChat';
// React components
export * from './components';

// Re-export the framework independent engine API.
export { default as ChatEngine, ChatEngineEventType, ChatEventBus, createEventBus } from '@tdesign/ai-chat-engine';
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
  A2UIMessage,
  ActivityContent,
  ActivityData,
  AGUIActivityMessage,
  AGUIHistoryMessage,
  AIContentChunkUpdate,
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
