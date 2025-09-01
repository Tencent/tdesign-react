import type { ToolCallEventType } from './adapters/agui/events';

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
  | 'suggestion'
  | 'reasoning'
  | 'toolcall';

export type AttachmentType = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'ppt' | 'txt';

// 基础类型
export interface ChatBaseContent<T extends string, TData> {
  type: T;
  data: TData;
  status?: ChatMessageStatus;
  id?: string;
  strategy?: 'merge' | 'append';
  ext?: Record<string, any>;
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

// 推理过程 - 支持混合内容类型
export type ReasoningContent = ChatBaseContent<'reasoning', AIMessageContent[]>;

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

export type ToolCall = {
  toolCallId: string;
  toolCallName: string;
  eventType?: ToolCallEventType;
  parentMessageId?: string;
  args?: string; // 对应TOOL_CALL_ARGS事件返回的delta合并后的结果
  chunk?: string; // 对应TOOL_CALL_CHUNK事件返回的delta合并后的结果
  result?: string; // 对应TOOL_CALL_RESULT事件返回的content合并后的结果
};

export type ToolCallContent = ChatBaseContent<'toolcall', ToolCall>;

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
  reasoning: ReasoningContent;
  toolcall: ToolCallContent;
} & AIContentTypeOverrides;

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
  history?: AIMessageContent[][];
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

export interface ChatRequestParams {
  prompt?: string;
  messageID?: string;
  attachments?: AttachmentContent['data'];
  [key: string]: any;
}

// 基础配置类型
export type AIContentChunkUpdate = AIMessageContent;

// ============= TDesign 原生架构 =============
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

// TDesign 默认引擎的回调配置
export interface DefaultEngineCallbacks {
  /** 请求发送前配置 */
  onRequest?: (
    params: ChatRequestParams,
  ) => (ChatRequestParams & RequestInit) | Promise<ChatRequestParams & RequestInit>;
  onStart?: (chunk: string) => void;
  /** 接收到消息数据块 - 用于解析和处理聊天内容 */
  onMessage?: (
    chunk: SSEChunkData,
    message?: ChatMessagesData,
    parsedResult?: AIMessageContent | AIMessageContent[] | null,
  ) => AIMessageContent | AIMessageContent[] | null;
  onComplete?: (
    isAborted: boolean,
    params?: ChatRequestParams,
    result?: any,
  ) => AIMessageContent | AIMessageContent[] | void;
  onAbort?: () => Promise<void>;
  /** 错误处理 */
  onError?: (err: Error | Response) => void;
}

// 默认引擎完整的服务配置
export interface ChatServiceConfig extends ChatNetworkConfig, DefaultEngineCallbacks {}

// 联合类型支持静态配置和动态生成
export type ChatServiceConfigSetter = ChatServiceConfig | ((params?: any) => ChatServiceConfig);

// 统一的引擎接口
export interface IChatEngine {
  /**
   * 初始化聊天引擎
   * @param config 聊天服务配置或配置生成函数，包含网络请求配置和回调函数
   * @param messages 初始消息列表，用于恢复历史对话
   * @description 必须在使用其他方法前调用此方法进行初始化
   */
  init(config?: any, messages?: ChatMessagesData[]): void;

  /**
   * 发送用户消息并获取AI回复
   * @param params 请求参数，包含用户输入的文本和附件
   * @description 创建用户消息和AI消息，并发送请求获取AI回复
   */
  sendUserMessage(params: ChatRequestParams): Promise<void>;

  /**
   * 重新生成AI回复
   * @param keepVersion 是否保留历史版本，默认为false
   * @description
   * - 当keepVersion=false时：删除最后一条AI消息，创建新消息并重新请求
   * - 当keepVersion=true时：保留旧消息，创建分支消息并重新请求
   */
  regenerateAIMessage(keepVersion?: boolean): Promise<void>;

  /**
   * 中止当前进行中的聊天请求
   * @description 停止接收流式响应，关闭连接，并调用配置的onAbort回调
   */
  abortChat(): Promise<void>;

  /**
   * 设置消息列表
   * @param messages 要设置的消息数组
   * @param mode 设置模式：'replace'(替换)、'prepend'(前置)、'append'(追加)，默认为'replace'
   * @description 用于批量更新消息，如加载历史消息或重置对话
   */
  setMessages(messages: ChatMessagesData[], mode?: ChatMessageSetterMode): void;

  /**
   * 清空所有消息
   * @description 清除消息存储中的所有历史记录
   */
  clearMessages(): void;

  /**
   * 注册内容块合并策略
   * @param type 内容类型，如'text'、'markdown'等
   * @param handler 合并处理函数，接收新块和现有块，返回合并后的内容块
   * @description 用于自定义不同类型内容的增量更新逻辑
   */
  registerMergeStrategy<T extends AIMessageContent>(type: T['type'], handler: (chunk: T, existing?: T) => T): void;

  // 属性访问
  /**
   * 获取当前所有消息
   * @returns 消息数组
   */
  get messages(): ChatMessagesData[];

  /**
   * 获取当前聊天状态
   * @returns 聊天状态：'idle'、'pending'、'streaming'、'complete'、'stop'或'error'
   */
  get status(): ChatStatus;

  /**
   * 获取消息存储实例
   * @returns 消息存储对象
   */
  get messageStore(): any; // 抽象化，不同引擎可能有不同的store

  /**
   * 销毁聊天引擎实例
   * @description 中止请求，清理消息存储和适配器，释放资源
   */
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
