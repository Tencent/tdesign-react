import '../../../__tests__/setup';

import { describe, expect, test } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { history } from '../../../__tests__/helpers';
import { useChat } from '../useChat';

describe('useChat', () => {
  describe('scenarios', () => {
    test('defaultMessages: reflects subsequent public engine updates', async () => {
      const config = { defaultMessages: history, chatServiceConfig: {} };
      const { result } = renderHook(() => useChat(config));
      await waitFor(() => expect(result.current.messages).toEqual(history));
      await act(async () => result.current.chatEngine.setMessages([history[0]], 'replace'));
      await waitFor(() => expect(result.current.messages).toEqual([history[0]]));
      await act(async () => result.current.chatEngine.clearMessages());
      await waitFor(() => expect(result.current.messages).toEqual([]));
      expect(result.current.status).toBe('idle');
    });
  });
});
