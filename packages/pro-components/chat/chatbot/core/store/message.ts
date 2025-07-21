import type {
  AIMessage,
  AIMessageContent,
  ChatMessagesData,
  ChatMessageSetterMode,
  ChatMessageStatus,
  ChatMessageStore,
  UserMessage,
} from '../type';
import { isAIMessage, isUserMessage } from '../utils';
import ReactiveState from './reactiveState';

// 专注消息生命周期管理
export class MessageStore extends ReactiveState<ChatMessageStore> {
  initialize(initialState?: Partial<ChatMessageStore>) {
    super.initialize({
      messageIds: [],
      messages: [],
      ...initialState,
    });
  }

  createMessage(message: ChatMessagesData) {
    const { id } = message;
    this.setState((draft) => {
      draft.messageIds.push(id);
      draft.messages.push(message);
    });
  }

  createMultiMessages(messages: ChatMessagesData[]) {
    this.setState((draft) => {
      messages.forEach((msg) => {
        draft.messageIds.push(msg.id);
      });
      draft.messages.push(...messages);
    });
  }

  setMessages(messages: ChatMessagesData[], mode: ChatMessageSetterMode = 'replace') {
    this.setState((draft) => {
      if (mode === 'replace') {
        draft.messageIds = messages.map((msg) => msg.id);
        draft.messages = [...messages];
      } else if (mode === 'prepend') {
        draft.messageIds = [...messages.map((msg) => msg.id), ...draft.messageIds];
        draft.messages = [...messages, ...draft.messages];
      } else {
        draft.messageIds.push(...messages.map((msg) => msg.id));
        draft.messages.push(...messages);
      }
    });
  }

  // 追加内容到指定类型的content
  appendContent(messageId: string, processedContent: AIMessageContent, targetIndex = -1) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (!message || !isAIMessage(message)) return;

      if (targetIndex >= 0 && targetIndex < message.content.length) {
        // 合并到指定位置
        message.content[targetIndex] = processedContent;
      } else {
        // 添加新内容块
        message.content.push(processedContent);
      }

      this.updateMessageStatusByContent(message);
    });
  }

  // 完整替换消息的content数组
  replaceContent(messageId: string, processedContent: AIMessageContent[]) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (!message || !isAIMessage(message)) return;
      message.content = processedContent;
    });
  }

  // 更新消息整体状态
  setMessageStatus(messageId: string, status: ChatMessagesData['status']) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (message) {
        message.status = status;
        if (isAIMessage(message) && message.content.length > 0) {
          message.content.at(-1).status = status;
        }
      }
    });
  }

  // 为消息设置扩展属性
  setMessageExt(messageId: string, attr = {}) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (message) {
        message.ext = { ...message.ext, ...attr };
      }
    });
  }

  clearHistory() {
    this.setState((draft) => {
      draft.messageIds = [];
      draft.messages = [];
    });
  }

  // 删除指定消息
  removeMessage(messageId: string) {
    this.setState((draft) => {
      // 从ID列表删除
      const idIndex = draft.messageIds.indexOf(messageId);
      if (idIndex !== -1) {
        draft.messageIds.splice(idIndex, 1);
      }

      // 从消息列表删除
      draft.messages = draft.messages.filter((msg) => msg.id !== messageId);
    });
  }

  // 创建消息分支（用于保留历史版本）
  createMessageBranch(messageId: string) {
    const original = this.getState().messages.find((m) => m.id === messageId);
    if (!original) return;

    // 克隆消息并生成新ID
    const branchedMessage = {
      ...original,
      content: original.content.map((c) => ({ ...c })),
    };

    this.createMessage(branchedMessage);
  }

  get messages() {
    return this.getState().messages;
  }

  getMessageByID(id: string) {
    return this.getState().messages.find((m) => m.id === id);
  }

  get currentMessage(): ChatMessagesData {
    const { messages } = this.getState();
    return messages.at(-1);
  }

  get lastAIMessage(): AIMessage | undefined {
    const { messages } = this.getState();
    const aiMessages = messages.filter((msg) => isAIMessage(msg));
    return aiMessages.at(-1);
  }

  get lastUserMessage(): UserMessage | undefined {
    const { messages } = this.getState();
    const userMessages = messages.filter((msg) => isUserMessage(msg));
    return userMessages.at(-1);
  }

  private resolvedStatus(content: AIMessageContent, status: ChatMessageStatus): ChatMessageStatus {
    return typeof content.status === 'function' ? content.status(status) : content.status;
  }

  // 更新消息整体状态
  private updateMessageStatusByContent(message: AIMessage) {
    // 优先处理错误状态
    if (message.content.some((c) => c.status === 'error')) {
      message.status = 'error';
      message.content.forEach((content) => {
        content.status = this.resolvedStatus(content, 'streaming') ? 'stop' : content.status;
      });
      return;
    }

    // 非最后一个内容块如果不是error|stop, 则设为content.status｜complete
    message.content
      .slice(0, -1) // 获取除最后一个元素外的所有内容
      .forEach((content) => {
        if (content.status !== 'error' && content.status !== 'stop') {
          content.status = this.resolvedStatus(content, 'complete');
        }
      });

    // 检查是否全部完成
    const allComplete = message.content.every(
      (c) => c.status === 'complete' || c.status === 'stop', // 包含停止状态
    );

    message.status = allComplete ? 'complete' : 'streaming';
  }

  /**
   * 更新多个内容块
   * @param messageId 消息ID
   * @param contents 要更新的内容块数组
   */
  updateMultipleContents(messageId: string, contents: AIMessageContent[]) {
    this.setState((draft) => {
      const message = draft.messages.find((m) => m.id === messageId);
      if (!message || !isAIMessage(message)) return;

      // 更新或添加每个内容块
      contents.forEach((content) => {
        const existingIndex = message.content.findIndex((c) => c.id === content.id || c.type === content.type);

        if (existingIndex >= 0) {
          // 更新现有内容块
          message.content[existingIndex] = {
            ...message.content[existingIndex],
            ...content,
          };
        } else {
          // 添加新内容块
          message.content.push(content);
        }
      });

      // 更新消息状态
      this.updateMessageStatusByContent(message);
    });
  }
}

// 订阅消息列表变化
// useEffect(() => {
//   return service.messageStore.subscribe(state => {
//     setMessages(state.messages);
//   });
// }, []);
