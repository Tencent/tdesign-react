import type { ChatMessagesData } from '@tdesign/ai-chat-engine';

export const message: ChatMessagesData = {
  id: 'a',
  role: 'assistant',
  status: 'complete',
  content: [{ type: 'text', data: '默认回答' }],
};
export const history: ChatMessagesData[] = [
  {
    id: 'u',
    role: 'user',
    status: 'complete',
    content: [{ type: 'text', data: '问题' }],
  },
  message,
];

export function mountedRef<T>(ref: { current: T | null }): T {
  if (!ref.current) throw new Error('Expected a mounted component ref');
  return ref.current;
}
