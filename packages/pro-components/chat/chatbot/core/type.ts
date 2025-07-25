export type ChatMessageRole = 'user' | 'assistant' | 'system';
export type ChatMessageStatus = 'pending' | 'streaming' | 'complete' | 'stop' | 'error';
export type ChatStatus = 'idle' | ChatMessageStatus;
export type ChatContentType =
  | 'text'
  | 'markdown'
  | 'search'
  | 'attachment'
  | 'thinking'
  | 'image'
  | 'audio'
  | 'video'
  | 'suggestion';
export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';

// 基础类型
export interface ChatBaseContent<T extends string, TData> {
  type: T;
  data: TData;
  status?: ChatMessageStatus | ((currentStatus: ChatMessageStatus | undefined) => ChatMessageStatus);
  id?: string;
}

// 内容类型
export type TextContent = ChatBaseContent<'text', string>;

export type MarkdownContent = ChatBaseContent<'markdown', string>;

export type ImageContent = ChatBaseContent<
  'image',
  {
    name?: string;
    url?: string;
    width?: number;
    height?: number;
  }
>;

// 搜索
// 公共引用结构
export type ReferenceItem = {
  title: string;
  icon?: string;
  type?: string;
  url?: string;
  content?: string;
  site?: string;
  date?: string;
};
export type SearchContent = ChatBaseContent<
  'search',
  {
    title?: string;
    references?: ReferenceItem[];
  }
>;

export type SuggestionItem = {
  title: string;
  prompt?: string;
};
export type SuggestionContent = ChatBaseContent<'suggestion', SuggestionItem[]>;

// 附件消息
export type AttachmentItem = {
  fileType: AttachmentType;
  size?: number;
  name?: string;
  url?: string;
  isReference?: boolean; // 是否是引用
  width?: number;
  height?: number;
  extension?: string; // 自定义文件后缀，默认按照name文件名后缀识别
  metadata?: Record<string, any>;
};
export type AttachmentContent = ChatBaseContent<'attachment', AttachmentItem[]>;

// 思考过程
export type ThinkingContent = ChatBaseContent<
  'thinking',
  {
    text?: string;
    title?: string;
  }
>;

// 消息主体
// 基础消息结构

export interface ChatBaseMessage {
  id: string;
  status?: ChatMessageStatus;
  datetime?: string;
  ext?: any;
}

// 类型扩展机制
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AIContentTypeOverrides {}
}

type AIContentTypeMap = {
  text: TextContent;
  markdown: MarkdownContent;
  thinking: ThinkingContent;
  image: ImageContent;
  search: SearchContent;
  suggestion: SuggestionContent;
} & AIContentTypeOverrides;

// 自动生成联合类型
// export type AIMessageContent = AIContentTypeMap[keyof AIContentTypeMap];
// export type AIMessageContent = {
//   [K in keyof AIContentTypeMap]: AIContentTypeMap[K];
// }[keyof AIContentTypeMap];

export type AIContentType = keyof AIContentTypeMap;
export type AIMessageContent = AIContentTypeMap[AIContentType];
export type UserMessageContent = TextContent | AttachmentContent;

export interface UserMessage extends ChatBaseMessage {
  role: 'user';
  content: UserMessageContent[];
}

export type ChatComment = 'good' | 'bad' | '';

export interface AIMessage extends ChatBaseMessage {
  role: 'assistant';
  content?: AIMessageContent[];
  /** 点赞点踩 */
  comment?: ChatComment;
}

export interface SystemMessage extends ChatBaseMessage {
  role: 'system';
  content: TextContent[];
}

export type ChatMessagesData = UserMessage | AIMessage | SystemMessage;

// 回答消息体配置
export type SSEChunkData = {
  event?: string;
  data: any;
};

export interface ChatRequestParams extends RequestInit {
  prompt: string;
  messageID?: string;
  attachments?: AttachmentContent['data'];
}

// 基础配置类型
export type AIContentChunkUpdate = AIMessageContent & {
  // 将新内容块和入策略，merge表示和入到同类型内容中，append表示作为新的内容块，默认是merge
  strategy?: 'merge' | 'append';
};

// ============= TDesign 原生架构 =============
// 保持现有的TDesign类型不变，用于DefaultEngine

// 网络请求配置（TDesign原生）
export interface ChatNetworkConfig {
  /** 请求端点 */
  endpoint?: string;
  /** 是否启用流式传输 */
  stream?: boolean;
  /** 重试间隔（毫秒） */
  retryInterval?: number;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 请求超时时间（毫秒） */
  timeout?: number; // 添加timeout属性
  /** 协议类型 */
  protocol?: 'default' | 'agui';
}

// 添加EnhancedSSEClient接口定义
export interface IEnhancedSSEClient {
  close(): void;
  getStats(): any;
  // ... 其他方法 ...
}

// TDesign 默认引擎的回调配置
export interface DefaultEngineCallbacks {
  /** 请求发送前配置 */
  onRequest?: (params: ChatRequestParams) => RequestInit | Promise<RequestInit>;
  onStart?: (chunk: string) => void;
  /** 接收到消息数据块 - 用于解析和处理聊天内容 */
  onMessage?: (chunk: SSEChunkData, message?: ChatMessagesData) => AIContentChunkUpdate | AIMessageContent[] | null;
  onComplete?: (
    isAborted: boolean,
    params?: RequestInit,
    result?: any,
  ) => AIContentChunkUpdate | AIMessageContent[] | void;
  onAbort?: () => Promise<void>;
  /** 错误处理 */
  onError?: (err: Error | Response) => void;
}

// 默认引擎完整的服务配置
export interface ChatServiceConfig extends ChatNetworkConfig, DefaultEngineCallbacks {}

// 联合类型支持静态配置和动态生成
export type ChatServiceConfigSetter = ChatServiceConfig | ((params?: any) => ChatServiceConfig);

// ============= AG-UI 适配架构 =============
// AG-UI 服务配置（完全独立）
export interface AGUIServiceConfig {
  /** AG-UI 服务端点 */
  url: string;
  /** Agent ID */
  agentId?: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 初始状态 */
  initialState?: Record<string, any>;
  /** 线程ID */
  threadId?: string;
  /** 工具定义 */
  tools?: any[];
  /** 上下文信息 */
  context?: any[];
  /** 调试模式 */
  debug?: boolean;
}

// AG-UI 事件回调（基于AG-UI原生事件）
export interface AGUIEventCallbacks {
  /** 运行开始事件 */
  onRunStarted?: (threadId: string, runId: string) => void;
  /** 运行完成事件 */
  onRunFinished?: (threadId: string, runId: string, result?: any) => void;
  /** 运行错误事件 */
  onRunError?: (error: string, code?: string) => void;

  /** 文本消息开始 */
  onTextMessageStart?: (messageId: string) => void;
  /** 文本消息内容 */
  onTextMessageContent?: (messageId: string, delta: string) => void;
  /** 文本消息结束 */
  onTextMessageEnd?: (messageId: string) => void;

  /** 工具调用开始 */
  onToolCallStart?: (toolCallId: string, toolName: string, parentMessageId?: string) => void;
  /** 工具调用参数 */
  onToolCallArgs?: (toolCallId: string, delta: string) => void;
  /** 工具调用结束 */
  onToolCallEnd?: (toolCallId: string) => void;
  /** 工具调用结果 */
  onToolCallResult?: (messageId: string, toolCallId: string, content: string) => void;

  /** 状态快照 */
  onStateSnapshot?: (snapshot: any) => void;
  /** 状态增量 */
  onStateDelta?: (delta: any[]) => void;
  /** 消息快照 */
  onMessagesSnapshot?: (messages: any[]) => void;

  /** 自定义事件 */
  onCustomEvent?: (name: string, value: any) => void;
  /** 原始事件 */
  onRawEvent?: (event: any, source?: string) => void;
}

// ============= 引擎接口统一 =============
// 引擎模式
export type EngineMode = 'default' | 'agui';

// 统一的引擎接口
export interface IChatEngine {
  /** 引擎模式 */
  readonly mode: EngineMode;

  /** 初始化引擎 - 不同引擎使用不同的配置类型 */
  init(config?: any, messages?: ChatMessagesData[]): void;

  /** 发送用户消息 */
  sendUserMessage(params: ChatRequestParams): Promise<void>;

  /** 重新生成AI回复 */
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;

  /** 中止聊天 */
  abortChat(): Promise<void>;

  /** 设置消息 */
  setMessages(messages: ChatMessagesData[], mode?: ChatMessageSetterMode): void;

  /** 清空消息 */
  clearMessages(): void;

  /** 注册合并策略 */
  registerMergeStrategy<T extends AIMessageContent>(type: T['type'], handler: (chunk: T, existing?: T) => T): void;

  // 属性访问
  get messages(): ChatMessagesData[];
  get status(): ChatStatus;
  get messageStore(): any; // 抽象化，不同引擎可能有不同的store

  // 销毁
  destroy(): void;
}

// 消息相关状态
export interface ChatMessageStore {
  messageIds: string[];
  messages: ChatMessagesData[];
}

// 模型服务相关状态
export interface ModelParams {
  model?: string;
  useThink?: boolean;
  useSearch?: boolean;
}

export interface ModelServiceState extends ModelParams {
  config: ChatServiceConfig;
}

// 聚合根状态
export interface ChatState {
  message: ChatMessageStore;
  model: ModelServiceState;
}

export type ChatMessageSetterMode = 'replace' | 'prepend' | 'append';

export type AIContentHandler<T extends ChatBaseContent<any, any>> = (chunk: T, existing?: T) => T;

export interface ContentTypeDefinition<T extends string = string, D = any> {
  type: T;
  handler?: AIContentHandler<ChatBaseContent<T, D>>;
  renderer?: ContentRenderer<ChatBaseContent<T, D>>;
}

export type ContentRenderer<T extends ChatBaseContent<any, any>> = (content: T) => unknown;
