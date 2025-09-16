import type { ChatMessagesData, AGUIHistoryMessage } from '@tdesign-react/aigc';
import { AGUIAdapter } from '@tdesign-react/aigc';

// 加载历史消息的函数
export const loadHistoryMessages = async (): Promise<ChatMessagesData[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/conversation/history');
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
