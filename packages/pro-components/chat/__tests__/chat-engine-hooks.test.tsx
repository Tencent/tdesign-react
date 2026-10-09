import './setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { act, render, renderHook, waitFor } from '@testing-library/react';

import { ActivityRenderer } from '../chat-engine/components/activity';
import { ToolCallRenderer } from '../chat-engine/components/toolcall';
import { useAgentActivity } from '../chat-engine/hooks/useAgentActivity';
import { useAgentToolcall } from '../chat-engine/hooks/useAgentToolcall';
import { useChat } from '../chat-engine/hooks/useChat';
import { history, text } from './helpers';

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

describe('useAgentToolcall', () => {
  describe('scenarios', () => {
    test('register: makes a toolcall available to its renderer and unregister removes it', async () => {
      const { result } = renderHook(() => useAgentToolcall());
      act(() =>
        result.current.register({
          name: 'test-tool',
          description: '测试工具',
          component: () => <span>工具已注册</span>,
        }),
      );
      expect(result.current.isRegistered('test-tool')).toBe(true);
      expect(result.current.getRegistered()).toContain('test-tool');
      const toolCall = { toolCallId: 'tool-1', toolCallName: 'test-tool', args: '{}' };
      const view = render(<ToolCallRenderer toolCall={toolCall} />);
      await waitFor(() => expect(text(view.container)).toContain('工具已注册'));
      act(() => result.current.unregister('test-tool'));
      expect(result.current.isRegistered('test-tool')).toBe(false);
      view.unmount();
      const afterUnregister = render(<ToolCallRenderer toolCall={toolCall} />);
      expect(text(afterUnregister.container)).not.toContain('工具已注册');
    });
  });
});

describe('useAgentActivity', () => {
  describe('scenarios', () => {
    test('automatic registration: renders activity content and cleans up on unmount', async () => {
      const config = { activityType: 'test-activity', component: () => <span>活动已注册</span> };
      const { result, unmount } = renderHook(() => useAgentActivity(config));
      expect(result.current.isRegistered('test-activity')).toBe(true);
      const activity = { activityType: 'test-activity', content: {}, messageId: 'message-1' };
      const view = render(<ActivityRenderer activity={activity} />);
      await waitFor(() => expect(text(view.container)).toContain('活动已注册'));
      unmount();
      expect(result.current.isRegistered('test-activity')).toBe(false);
      view.unmount();
      const afterUnmount = render(<ActivityRenderer activity={activity} />);
      expect(text(afterUnmount.container)).not.toContain('活动已注册');
    });
  });
});
