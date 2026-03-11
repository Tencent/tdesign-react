/**
 * StreamHandler 模块
 *
 * 统一导出 + 工厂函数
 */
export type { IStreamHandler, StreamContext } from './types';
export { DefaultStreamHandler } from './default-stream-handler';
export { AGUIStreamHandler } from './agui-stream-handler';
export { OpenClawStreamHandler } from './openclaw-stream-handler';

import type { AGUIAdapter } from '../adapters/agui';
import { LLMService } from '../server';
import type { IStreamHandler } from './types';
import { DefaultStreamHandler } from './default-stream-handler';
import { AGUIStreamHandler } from './agui-stream-handler';
import { OpenClawStreamHandler } from './openclaw-stream-handler';

export interface CreateStreamHandlerOptions {
  protocol?: 'default' | 'agui' | 'openclaw';
  llmService: LLMService;
  aguiAdapter?: AGUIAdapter | null;
}

/**
 * 工厂函数：根据协议类型创建对应的 StreamHandler
 */
export function createStreamHandler(options: CreateStreamHandlerOptions): IStreamHandler {
  const { protocol, llmService, aguiAdapter } = options;

  switch (protocol) {
    case 'agui':
      if (!aguiAdapter) {
        throw new Error('AGUIAdapter is required for agui protocol');
      }
      return new AGUIStreamHandler(llmService, aguiAdapter);

    case 'openclaw':
      return new OpenClawStreamHandler({ llmService });

    default:
      return new DefaultStreamHandler(llmService);
  }
}
