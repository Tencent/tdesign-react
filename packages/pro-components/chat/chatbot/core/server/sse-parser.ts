import { LoggerManager } from '../utils/logger';

/**
 * SSE 事件接口
 */
export interface SSEEvent {
  event?: string;
  data?: any;
  id?: string;
}

/**
 * SSE 事件流解析器
 */
export class SSEParser {
  private eventBuffer = '';

  private currentEvent: { event?: string; data?: string; id?: string } = {};

  private logger = LoggerManager.getLogger();

  // 事件回调函数
  onMessage?: (msg: SSEEvent) => void;

  /**
   * 解析SSE数据块
   */
  parse(chunk: string): void {
    this.eventBuffer += chunk;

    // 循环处理，直到缓冲区中再也找不到完整的行
    let newlineIndex;
    // eslint-disable-next-line no-cond-assign
    while ((newlineIndex = this.eventBuffer.indexOf('\n')) !== -1) {
      // 提取一行（包含 \r 如果有的话）
      const line = this.eventBuffer.slice(0, newlineIndex).replace(/\r$/, '');

      // 从缓冲区移除已处理的行和换行符
      this.eventBuffer = this.eventBuffer.slice(newlineIndex + 1);

      // 处理这一行
      this.processSSELine(line);
    }
  }

  /**
   * 处理SSE行数据
   */
  private processSSELine(line: string): void {
    if (line === '') {
      // 空行表示事件结束
      this.emitCurrentEvent();
      return;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === 0) {
      // 注释行，忽略
      return;
    }

    let field: string;
    let value: string;

    if (colonIndex === -1) {
      field = line.trim();
      value = '';
    } else {
      field = line.slice(0, colonIndex).trim();
      value = line.slice(colonIndex + 1).replace(/^ /, ''); // 移除开头空格
    }

    // 处理SSE字段
    switch (field) {
      case 'event':
        this.currentEvent.event = value;
        break;
      case 'data':
        if (this.currentEvent.data === undefined) {
          this.currentEvent.data = value;
        } else {
          this.currentEvent.data += `\n${value}`;
        }
        break;
      case 'id':
        this.currentEvent.id = value;
        break;
      default:
        // 忽略其他字段
        break;
    }
  }

  /**
   * 发送当前事件
   */
  private emitCurrentEvent(): void {
    if (this.currentEvent.data !== undefined && this.onMessage) {
      try {
        // 尝试解析JSON，失败则保持原始字符串
        let data: any;
        try {
          data = JSON.parse(this.currentEvent.data);
        } catch {
          data = this.currentEvent.data;
        }

        this.onMessage({
          event: this.currentEvent.event || '',
          data,
        });
      } catch (error) {
        this.logger.error('Error emitting event:', error);
      }
    }

    // 清理当前事件
    this.currentEvent = {};
  }

  /**
   * 重置解析器状态
   */
  reset(): void {
    this.eventBuffer = '';
    this.currentEvent = {};
  }

  /**
   * 获取当前缓冲区大小
   */
  getBufferSize(): number {
    return this.eventBuffer.length;
  }

  /**
   * 获取当前事件状态
   */
  getCurrentEvent(): { event?: string; data?: string; id?: string } {
    return { ...this.currentEvent };
  }

  /**
   * 检查是否有未完成的事件
   */
  hasIncompleteEvent(): boolean {
    return this.currentEvent.data !== undefined;
  }
}
