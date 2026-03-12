/**
 * 流式处理策略接口
 *
 * 将不同协议（Default/AGUI/OpenClaw）的流式处理逻辑从 ChatEngine 中抽出，
 * 遵循策略模式，使 ChatEngine 专注于编排，新协议无需修改 ChatEngine。
 */
import type {
  AIMessageContent,
  ChatRequestParams,
  ChatServiceConfig,
  SSEChunkData,
  ChatMessagesData,
} from '../type';
import type { IChatEventBus } from '../event-bus';
import type { MessageStore } from '../store/message';
import type MessageProcessor from '../processor';

/**
 * 流式处理上下文
 *
 * 由 ChatEngine 构建，提供 StreamHandler 所需的引擎能力
 */
export interface StreamContext {
  /** 当前 AI 消息 ID */
  messageId?: string;
  /** 聊天服务配置 */
  config: ChatServiceConfig;
  /** 是否停止接收 */
  getStopReceive: () => boolean;
  /** 处理消息结果（内容更新 + 事件发布） */
  processMessageResult: (messageId: string, result: AIMessageContent | AIMessageContent[] | null) => void;
  /** 错误处理 */
  handleError: (messageId: string, error: unknown) => void;
  /** 完成处理 */
  handleComplete: (messageId: string, isAborted: boolean, params: ChatRequestParams, chunk?: unknown) => void;
  /** 消息存储（用于获取消息） */
  messageStore: MessageStore;
  /** 事件总线 */
  eventBus: IChatEventBus;
}

/**
 * 流式处理策略接口
 */
export interface IStreamHandler {
  /**
   * 处理流式请求
   * @param params 请求参数
   * @param context 流式处理上下文
   */
  handleStream(params: ChatRequestParams, context: StreamContext): Promise<void>;

  /**
   * 销毁处理器，释放资源
   */
  destroy?(): void | Promise<void>;
}
