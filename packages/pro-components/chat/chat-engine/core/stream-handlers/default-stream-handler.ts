/**
 * 默认协议流式处理器
 *
 * SSE 原始数据 → 用户自定义 onMessage → processMessageResult
 */
import type { SSEChunkData } from '../type';
import { ChatEngineEventType } from '../event-bus';
import { LLMService } from '../server';
import type { IStreamHandler, StreamContext } from './types';

export class DefaultStreamHandler implements IStreamHandler {
  private llmService: LLMService;

  constructor(llmService: LLMService) {
    this.llmService = llmService;
  }

  async handleStream(params, context: StreamContext): Promise<void> {
    const { messageId, config } = context;

    await this.llmService.handleStreamRequest(params, {
      ...config,
      onStart: (chunk) => {
        config.onStart?.(chunk);
      },
      onMessage: (chunk: SSEChunkData) => {
        if (context.getStopReceive() || !messageId) return null;

        let result = null;

        // 使用默认的消息处理
        if (config.onMessage) {
          result = config.onMessage(chunk, context.messageStore.getMessageByID(messageId));
        }

        // 发布流数据事件
        context.eventBus.emit(ChatEngineEventType.REQUEST_STREAM, {
          messageId,
          chunk,
          content: result,
        });

        // 处理消息结果
        context.processMessageResult(messageId, result);
        return result;
      },
      onError: (error) => {
        if (messageId) context.handleError(messageId, error);
      },
      onComplete: (isAborted) => {
        if (messageId) {
          context.handleComplete(messageId, isAborted, params);
        }
      },
    });
  }
}
