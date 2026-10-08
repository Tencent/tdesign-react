import './setup';

import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useAgentActivity } from '../chat-engine/hooks/useAgentActivity';
import { useAgentToolcall } from '../chat-engine/hooks/useAgentToolcall';
import { useChat } from '../chat-engine/hooks/useChat';
import { history } from './helpers';

describe('Chat engine public hooks', () => {
  it('reflects defaultMessages and subsequent public engine updates', async () => {
    const config = { defaultMessages: history, chatServiceConfig: {} };
    const { result } = renderHook(() => useChat(config));
    await waitFor(() => expect(result.current.messages).toEqual(history));
    await act(async () => result.current.chatEngine.setMessages([history[0]], 'replace'));
    await waitFor(() => expect(result.current.messages).toEqual([history[0]]));
    await act(async () => result.current.chatEngine.clearMessages());
    await waitFor(() => expect(result.current.messages).toEqual([]));
    expect(result.current.status).toBe('idle');
  });

  it('registers and unregisters tool configurations through the public API', () => {
    const { result } = renderHook(() => useAgentToolcall());
    act(() =>
      result.current.register({ name: 'test-tool', description: '测试工具', component: () => <span>工具</span> }),
    );
    expect(result.current.isRegistered('test-tool')).toBe(true);
    expect(result.current.getRegistered()).toContain('test-tool');
    act(() => result.current.unregister('test-tool'));
    expect(result.current.isRegistered('test-tool')).toBe(false);
  });

  it('registers activity configurations and cleans up automatic registrations', () => {
    const config = { activityType: 'test-activity', component: () => <span>活动</span> };
    const { result, unmount } = renderHook(() => useAgentActivity(config));
    expect(result.current.isRegistered('test-activity')).toBe(true);
    unmount();
    expect(result.current.isRegistered('test-activity')).toBe(false);
  });
});
