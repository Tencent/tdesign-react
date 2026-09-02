// React hooks
export * from './hooks/useAgentActivity';
export * from './hooks/useAgentState';
export * from './hooks/useAgentToolcall';
export * from './hooks/useChat';
// React components
export * from './components';

// Re-export core API from @tdesign/web-components-chat
// （@tdesign/web-components-chat 已透传 @tdesign/ai-chat-engine 的全部导出，
//   pro-components 不再直接依赖 @tdesign/ai-chat-engine）
export { ChatEngine, ChatEngineEventType, ChatEventBus, createEventBus } from '@tdesign/web-components-chat';
export { activityManager, AGUIAdapter, stateManager } from '@tdesign/web-components-chat';
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
} from '@tdesign/web-components-chat';
export { AGUIEventType } from '@tdesign/web-components-chat';

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
} from '@tdesign/web-components-chat';
