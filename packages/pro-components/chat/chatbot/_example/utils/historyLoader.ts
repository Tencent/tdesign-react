import type { ChatMessagesData, AGUIHistoryMessage } from '@tdesign-react/chat';
import { AGUIAdapter } from '@tdesign-react/chat';

// 加载历史消息的函数
export const loadHistoryMessages = async (): Promise<ChatMessagesData[]> => {
  try {
    const response = await fetch('https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/api/conversation/history');
    if (response.ok) {
      const result = await response.json();
      const historyMessages: AGUIHistoryMessage[] = result.data;

      // 使用AGUIAdapter的静态方法进行转换
      return AGUIAdapter.convertHistoryMessages(historyMessages);
    }
  } catch (error) {
    console.error('加载历史消息失败:', error);
  }
  return [];
};
