import { AGUIEventMapper } from './agui-event-mapper';
import { ToolCallProcessor } from '../../processor/tool-call-processor';
import type { 
  SSEChunkData, 
  AIMessageContent, 
  ToolCall,
  ChatServiceConfig,
  ChatRequestParams
} from '../../type';
import { EventType } from './events';
import type { 
  RunStartedEvent, 
  RunFinishedEvent, 
  RunErrorEvent,
  BaseEvent 
} from './events';

/**
 * AGUI协议适配器回调接口
 */
export interface AGUIAdapterCallbacks {
  onRunStart?: (event: RunStartedEvent) => void;
  onRunComplete?: (isAborted: boolean, params: ChatRequestParams, event?: RunFinishedEvent) => void;
  onRunError?: (error: RunErrorEvent) => void;
}

/**
 * AGUI协议适配器
 * 1. 处理AGUI协议特定的事件（RUN_STARTED, RUN_FINISHED, RUN_ERROR）
 * 2. 管理工具调用的生命周期
 * 3. 将AGUI事件映射为ChatEngine可理解的消息内容
 */
export class AGUIAdapter {
  private aguiEventMapper: AGUIEventMapper;
  private toolCallProcessor: ToolCallProcessor;

  constructor() {
    this.aguiEventMapper = new AGUIEventMapper();
    this.toolCallProcessor = new ToolCallProcessor();
  }

  /**
   * 处理AGUI事件
   * 
   * 处理流程：
   * 1. 解析SSE数据（AG-UI后端返回标准SSE格式，data字段是JSON字符串）
   * 2. 处理AGUI特定事件（生命周期事件）
   * 3. 使用事件映射器转换为消息内容
   * 4. 同步工具调用状态
   * 
   * @param chunk SSE数据块
   * @param callbacks 回调函数
   * @returns 处理结果
   */
  handleAGUIEvent(
    chunk: SSEChunkData, 
    callbacks: AGUIAdapterCallbacks
  ): AIMessageContent | AIMessageContent[] | null {
    // AG-UI后端返回标准SSE格式，data字段是JSON字符串
    let event: BaseEvent;
    try {
      event = typeof chunk.data === 'string' ? JSON.parse(chunk.data) : chunk.data;
    } catch (error) {
      console.warn('Failed to parse AG-UI event data:', error);
      return null;
    }

    if (!event?.type) return null;

    // 处理AGUI特定事件（生命周期事件）
    const lifecycleHandled = this.handleAGUISpecificEvents(event, callbacks);
    
    // 如果是生命周期事件，不需要转换为消息内容
    if (lifecycleHandled) {
      return null;
    }

    // 使用事件映射器处理内容事件
    const result = this.aguiEventMapper.mapEvent(chunk);

    // 同步AGUI事件映射器中的工具调用到ToolCallProcessor
    this.syncToolCalls();

    return result;
  }

  /**
   * 处理AGUI特定事件
   * 
   * 处理RUN_STARTED、RUN_FINISHED、RUN_ERROR等生命周期事件
   * 这些事件用于通知外部系统状态变化，并执行相应的回调
   * 
   * @param event 解析后的事件对象
   * @param callbacks 回调函数
   * @returns 是否处理了生命周期事件
   */
  private handleAGUISpecificEvents(event: BaseEvent, callbacks: AGUIAdapterCallbacks): boolean {
    switch (event.type) {
      case EventType.RUN_STARTED:
        callbacks.onRunStart?.(event as RunStartedEvent);
        return true;
      case EventType.RUN_FINISHED:
        callbacks.onRunComplete?.(false, {} as ChatRequestParams, event as RunFinishedEvent);
        return true;
      case EventType.RUN_ERROR:
        callbacks.onRunError?.(event as RunErrorEvent);
        return true;
      default:
        return false; // 不是生命周期事件
    }
  }

  /**
   * 同步工具调用
   * 
   * 将AGUI事件映射器中的工具调用同步到ToolCallProcessor
   */
  private syncToolCalls(): void {
    const aguiToolCalls = this.aguiEventMapper.getToolCalls();
    aguiToolCalls.forEach((toolCall: ToolCall) => {
      this.toolCallProcessor.addToolCall(toolCall);
    });
  }

  /**
   * 处理工具调用内容
   * @param result 消息结果
   * @returns 去重后的工具调用数组
   */
  processToolCalls(result: AIMessageContent | AIMessageContent[] | null): ToolCall[] {
    return this.toolCallProcessor.processToolCalls(result);
  }

  /**
   * 获取工具调用处理器
   */
  get processor() {
    return this.toolCallProcessor;
  }

  /**
   * 获取AGUI事件映射器
   */
  get eventMapper() {
    return this.aguiEventMapper;
  }

  /**
   * 重置适配器状态
   */
  reset(): void {
    this.aguiEventMapper.reset();
    this.toolCallProcessor.clearAllToolCalls();
  }
} 