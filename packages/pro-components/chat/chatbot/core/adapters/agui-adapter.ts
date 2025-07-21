/**
 * AG-UI Protocol Adapter
 *
 * AG-UI协议适配器 - 支持三种使用场景：
 * 1. 服务端完全按照AG-UI协议返回（直接解析AG-UI事件）
 * 2. 服务端未按照AG-UI协议，业务提供适配器转换
 * 3. 服务端未按照AG-UI协议，保持传统回调模式
 */

import type {
  AIContentChunkUpdate,
  ChatMessagesData,
  ChatRequestParams,
  ChatServiceConfig,
  SSEChunkData,
} from '../type';

// AG-UI适配器配置（前向声明）
export interface AGUIAdapterConfig {
  /** 是否启用AG-UI协议适配 */
  enabled: boolean;
  /** Agent ID，用于标识当前AI代理 */
  agentId?: string;
  /** 是否启用双向通信（支持INPUT_REQUEST） */
  bidirectional?: boolean;
  /** 自定义事件映射 */
  eventMapping?: Partial<Record<string, string>>;
  /** AG-UI事件处理器 */
  onProtocolEvent?: (event: any) => void;
  /** 发送AG-UI事件的处理器 */
  onExternalEvent?: (event: any) => void;
  /** AG-UI业务事件处理器 - AG-UI纯模式下替代传统callbacks */
  onBusinessEvent?: (event: any) => void;
}

// =============================================================================
// AG-UI 标准协议事件类型（严格遵循官方协议）
// =============================================================================

/** AG-UI协议标准事件类型 */
export type AGUIEventType =
  // 生命周期事件
  | 'RUN_STARTED' // 对话开始
  | 'RUN_FINISHED' // 对话完成
  | 'RUN_ERROR' // 对话出错
  | 'STEP_STARTED' // 步骤开始
  | 'STEP_FINISHED' // 步骤完成

  // 文本消息事件
  | 'TEXT_MESSAGE_START' // 文本消息开始
  | 'TEXT_MESSAGE_CHUNK' // 文本消息块（流式）
  | 'TEXT_MESSAGE_END' // 文本消息结束

  // 工具调用事件
  | 'TOOL_CALL_START' // 工具调用开始
  | 'TOOL_CALL_CHUNK' // 工具调用块
  | 'TOOL_CALL_END' // 工具调用结束

  // 状态管理事件
  | 'STATE_SNAPSHOT' // 状态快照
  | 'STATE_DELTA' // 状态增量更新
  | 'MESSAGES_SNAPSHOT' // 消息快照

  // 扩展事件
  | 'RAW' // 原始事件
  | 'CUSTOM'; // 自定义事件

// AG-UI 标准事件数据结构
export interface AGUIEvent<T = any> {
  type: AGUIEventType;
  data: T;
  timestamp?: number;
  runId?: string;
  agentId?: string;
  messageId?: string;
  threadId?: string;
  metadata?: Record<string, any>;
}

// =============================================================================
// AG-UI 使用配置
// =============================================================================

/** AG-UI使用模式 */
export type AGUIMode =
  | 'disabled' // 禁用AG-UI，使用传统回调
  | 'native' // 服务端原生AG-UI协议
  | 'adapter'; // 服务端非AG-UI，需要业务提供适配器

/** AG-UI配置 */
export interface AGUIConfig {
  /** 使用模式 */
  mode: AGUIMode;

  /** Agent ID */
  agentId?: string;

  /** 是否启用双向通信 */
  bidirectional?: boolean;

  /**
   * AG-UI事件处理器
   * - native模式：处理服务端直接返回的AG-UI事件
   * - adapter模式：处理适配器转换后的AG-UI事件
   */
  onEvent?: (event: AGUIEvent) => void;

  /**
   * 自定义内容解析器
   * 如果不提供，使用默认解析器将AG-UI事件转换为AIContentChunkUpdate
   */
  contentParser?: (event: AGUIEvent) => AIContentChunkUpdate | null;

  /**
   * 自定义适配器（adapter模式下必需）
   * 将业务自定义的chunk格式转换为AG-UI标准格式
   *
   * 注意：TDesign Chatbot本身没有标准的chunk格式，
   * 每个业务的chunk.data结构都不同，因此必须提供此函数
   */
  customAdapter?: (chunk: SSEChunkData) => AGUIEvent | null;
}

// =============================================================================
// 默认内容解析器：AG-UI事件 → AIContentChunkUpdate
// =============================================================================

/**
 * 默认AG-UI事件解析器
 * 将AG-UI标准事件转换为组件渲染需要的AIContentChunkUpdate结构
 */
export function parseAGUIEventToContent(event: AGUIEvent): AIContentChunkUpdate | null {
  switch (event.type) {
    case 'TEXT_MESSAGE_CHUNK':
      return {
        type: event.data.contentType === 'markdown' ? 'markdown' : 'text',
        data: event.data.content || event.data.text || '',
        strategy: 'append' as const,
      };

    case 'TEXT_MESSAGE_START':
      return {
        type: 'text',
        data: '',
        strategy: 'append' as const,
      };

    case 'TEXT_MESSAGE_END':
      return {
        type: 'text',
        data: event.data.finalContent || '',
        strategy: 'append' as const,
      };

    case 'TOOL_CALL_START':
    case 'TOOL_CALL_CHUNK':
    case 'TOOL_CALL_END':
      return {
        type: 'search',
        data: {
          title: event.data.toolName || 'Tool Call',
          references: [],
        },
        strategy: 'append' as const,
      };

    case 'RUN_ERROR':
      return {
        type: 'text',
        data: event.data.error || event.data.message || 'Unknown error',
        strategy: 'append' as const,
      };

    case 'CUSTOM':
      // 处理自定义事件，尝试解析为通用格式
      if (event.data.type === 'thinking') {
        return {
          type: 'thinking',
          data: {
            text: event.data.content || event.data.text || '',
            title: event.data.title,
          },
          strategy: 'append' as const,
        };
      }

      if (event.data.type === 'search') {
        return {
          type: 'search',
          data: {
            title: 'Search',
            references: [],
          },
          strategy: 'append' as const,
        };
      }

      return {
        type: 'text',
        data: event.data.content || event.data.text || JSON.stringify(event.data),
        strategy: 'append' as const,
      };

    default:
      // 忽略生命周期事件（RUN_STARTED, RUN_FINISHED等）
      return null;
  }
}

// =============================================================================
// AG-UI 适配器类
// =============================================================================

export class AGUIAdapter {
  private config: AGUIConfig;

  private currentRunId: string | null = null;

  constructor(config: AGUIConfig) {
    this.config = {
      agentId: 'tdesign-chatbot',
      bidirectional: false,
      ...config,
    };
  }

  /**
   * 包装ChatServiceConfig以支持AG-UI
   */
  public wrapConfig(originalConfig: ChatServiceConfig): ChatServiceConfig {
    if (this.config.mode === 'disabled') {
      return originalConfig;
    }

    // adapter模式下检查必需的customAdapter
    if (this.config.mode === 'adapter' && !this.config.customAdapter) {
      throw new Error(
        '[AGUIAdapter] adapter模式下必须提供customAdapter函数，' +
          '因为TDesign Chatbot本身没有标准的chunk格式，' +
          '每个业务的chunk.data结构都不同',
      );
    }

    return {
      ...originalConfig,
      callbacks: this.createAGUICallbacks(originalConfig),
    };
  }

  /**
   * 创建AG-UI模式的回调配置
   */
  private createAGUICallbacks(originalConfig: ChatServiceConfig) {
    return {
      onRequest: (params: ChatRequestParams) => {
        this.currentRunId = this.generateRunId();

        // 发送RUN_STARTED事件
        this.emitEvent({
          type: 'RUN_STARTED',
          data: {
            prompt: params.prompt,
            messageId: params.messageID,
            attachments: params.attachments,
          },
          runId: this.currentRunId,
          agentId: this.config.agentId,
        });

        return originalConfig.callbacks?.onRequest?.(params) || {};
      },

      onMessage: (chunk: SSEChunkData, message?: ChatMessagesData) => {
        const aguiEvent = this.processChunk(chunk);

        if (aguiEvent) {
          // 发送AG-UI事件
          this.emitEvent(aguiEvent);

          // 解析为内容并返回给组件
          const content = this.parseEventToContent(aguiEvent);
          if (content) {
            return content;
          }
        }

        // 如果AG-UI解析失败，回退到原有逻辑
        return originalConfig.callbacks?.onMessage?.(chunk, message);
      },

      onComplete: (isAborted: boolean, params: RequestInit, result?: any) => {
        // 发送RUN_FINISHED事件
        this.emitEvent({
          type: 'RUN_FINISHED',
          data: {
            success: !isAborted,
            reason: isAborted ? 'user_aborted' : 'completed',
            result,
          },
          runId: this.currentRunId,
          agentId: this.config.agentId,
        });

        this.currentRunId = null;
        return originalConfig.callbacks?.onComplete?.(isAborted, params, result);
      },

      onError: (err: Error | Response) => {
        // 发送RUN_ERROR事件
        this.emitEvent({
          type: 'RUN_ERROR',
          data: {
            error: err instanceof Error ? err.message : 'Request failed',
            details: err,
          },
          runId: this.currentRunId,
          agentId: this.config.agentId,
        });

        this.currentRunId = null;
        return originalConfig.callbacks?.onError?.(err);
      },

      onAbort: async () => {
        this.emitEvent({
          type: 'RUN_FINISHED',
          data: {
            success: false,
            reason: 'user_aborted',
          },
          runId: this.currentRunId,
          agentId: this.config.agentId,
        });

        this.currentRunId = null;
        return originalConfig.callbacks?.onAbort?.();
      },
    };
  }

  /**
   * 处理数据块，根据模式选择不同的处理方式
   */
  private processChunk(chunk: SSEChunkData): AGUIEvent | null {
    switch (this.config.mode) {
      case 'native':
        // 场景1：服务端直接返回AG-UI格式
        return this.parseNativeAGUIChunk(chunk);

      case 'adapter':
        // 场景2：需要业务提供适配转换
        return this.adaptChunkToAGUI(chunk);

      default:
        return null;
    }
  }

  /**
   * 解析原生AG-UI格式数据块
   * 服务端直接返回AG-UI标准格式：{type: 'TEXT_MESSAGE_CHUNK', data: {...}}
   */
  private parseNativeAGUIChunk(chunk: SSEChunkData): AGUIEvent | null {
    try {
      const chunkData = chunk.data;

      // 检查是否为AG-UI标准格式
      if (chunkData && typeof chunkData === 'object' && 'type' in chunkData) {
        return {
          type: chunkData.type as AGUIEventType,
          data: chunkData.data || chunkData,
          timestamp: chunkData.timestamp || Date.now(),
          runId: chunkData.runId || this.currentRunId,
          agentId: chunkData.agentId || this.config.agentId,
          messageId: chunkData.messageId,
          threadId: chunkData.threadId,
          metadata: chunkData.metadata,
        };
      }

      // 如果不是标准格式，当作TEXT_MESSAGE_CHUNK处理
      if (typeof chunkData === 'string') {
        return {
          type: 'TEXT_MESSAGE_CHUNK',
          data: { content: chunkData },
          timestamp: Date.now(),
          runId: this.currentRunId,
          agentId: this.config.agentId,
        };
      }
    } catch (error) {
      console.warn('[AGUIAdapter] 解析原生AG-UI数据失败:', error);
    }

    return null;
  }

  /**
   * 适配业务自定义格式到AG-UI格式
   * 业务必须提供customAdapter，因为TDesign没有标准chunk格式
   */
  private adaptChunkToAGUI(chunk: SSEChunkData): AGUIEvent | null {
    try {
      // 必须使用业务提供的自定义适配器
      if (this.config.customAdapter) {
        return this.config.customAdapter(chunk);
      }

      // 如果没有提供适配器，返回null（应该在wrapConfig时就检查了）
      console.warn('[AGUIAdapter] adapter模式下必须提供customAdapter');
      return null;
    } catch (error) {
      console.warn('[AGUIAdapter] 适配数据格式失败:', error);
      return null;
    }
  }

  /**
   * 将AG-UI事件解析为内容
   */
  private parseEventToContent(event: AGUIEvent): AIContentChunkUpdate | null {
    try {
      // 使用自定义解析器
      if (this.config.contentParser) {
        return this.config.contentParser(event);
      }

      // 使用默认解析器
      return parseAGUIEventToContent(event);
    } catch (error) {
      console.warn('[AGUIAdapter] 解析事件内容失败:', error);
      return null;
    }
  }

  /**
   * 发送AG-UI事件
   */
  private emitEvent(event: AGUIEvent): void {
    try {
      // 确保事件格式完整
      const completeEvent: AGUIEvent = {
        timestamp: Date.now(),
        runId: this.currentRunId,
        agentId: this.config.agentId,
        ...event,
      };

      // 调用事件处理器
      this.config.onEvent?.(completeEvent);
    } catch (error) {
      console.error('[AGUIAdapter] 发送AG-UI事件失败:', error);
    }
  }

  /**
   * 生成运行ID
   */
  private generateRunId(): string {
    return `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<AGUIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 获取当前运行ID
   */
  public getCurrentRunId(): string | null {
    return this.currentRunId;
  }
}

// =============================================================================
// 工厂函数和工具
// =============================================================================

/**
 * 创建AG-UI适配器
 */
export function createAGUIAdapter(config: AGUIConfig): AGUIAdapter {
  return new AGUIAdapter(config);
}

/**
 * AG-UI事件类型检查工具
 */
export const AGUIUtils = {
  isTextEvent: (event: AGUIEvent): boolean =>
    ['TEXT_MESSAGE_START', 'TEXT_MESSAGE_CHUNK', 'TEXT_MESSAGE_END'].includes(event.type),

  isToolEvent: (event: AGUIEvent): boolean =>
    ['TOOL_CALL_START', 'TOOL_CALL_CHUNK', 'TOOL_CALL_END'].includes(event.type),

  isLifecycleEvent: (event: AGUIEvent): boolean =>
    ['RUN_STARTED', 'RUN_FINISHED', 'RUN_ERROR', 'STEP_STARTED', 'STEP_FINISHED'].includes(event.type),

  isStateEvent: (event: AGUIEvent): boolean =>
    ['STATE_SNAPSHOT', 'STATE_DELTA', 'MESSAGES_SNAPSHOT'].includes(event.type),
};

// =============================================================================
// 业务适配器示例（仅供参考）
// =============================================================================

/**
 * 示例：某个具体业务的适配器
 * 这只是个示例，实际使用时业务需要根据自己的chunk格式编写
 */
export function createExampleBusinessAdapter() {
  return (chunk: SSEChunkData): AGUIEvent | null => {
    const chunkData = chunk.data;

    // 示例业务格式1：纯文本
    if (typeof chunkData === 'string') {
      return {
        type: 'TEXT_MESSAGE_CHUNK',
        data: {
          content: chunkData,
          contentType: 'text',
        },
        timestamp: Date.now(),
      };
    }

    // 示例业务格式2：结构化数据
    if (chunkData && typeof chunkData === 'object') {
      // 假设业务定义了这样的格式
      if (chunkData.msgType === 'text') {
        return {
          type: 'TEXT_MESSAGE_CHUNK',
          data: {
            content: chunkData.content,
            contentType: 'text',
          },
          timestamp: Date.now(),
        };
      }

      if (chunkData.msgType === 'thinking') {
        return {
          type: 'CUSTOM',
          data: {
            type: 'thinking',
            content: chunkData.thought,
            title: chunkData.thinkingTitle,
          },
          timestamp: Date.now(),
        };
      }

      // 处理其他业务自定义格式...
    }

    return null;
  };
}
