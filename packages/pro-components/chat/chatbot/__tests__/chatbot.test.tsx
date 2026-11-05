import '../../__tests__/setup';

import React, { createRef } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { ChatBot } from '../..';
import { get, history, mountedRef, queryAll, text } from '../../__tests__/helpers';

import type { TdChatbotApi } from '../../chatbot';

describe('ChatBot', () => {
  describe('props', () => {
    test('defaultMessages: renders both messages in order and reports readiness', async () => {
      const ready = vi.fn();
      const change = vi.fn();
      const ref = createRef<HTMLElement & TdChatbotApi>();
      const { container } = render(
        <ChatBot ref={ref} defaultMessages={history} onChatReady={ready} onMessageChange={change} />,
      );
      await waitFor(() => expect(ready).toHaveBeenCalledOnce());
      await waitFor(() => expect(text(container)).toContain('助手回答'));
      expect(text(container)).toContain('用户问题');
      expect(text(container).indexOf('用户问题')).toBeLessThan(text(container).indexOf('助手回答'));
      expect(mountedRef(ref).isChatEngineReady).toBe(true);
      expect(mountedRef(ref).chatMessageValue).toEqual(history);
      expect(change).toHaveBeenCalledWith(expect.objectContaining({ detail: history }));
    });

    test('senderProps and messageProps: compose input and role-specific messages', async () => {
      const { container } = render(
        <ChatBot
          defaultMessages={history}
          senderProps={{ placeholder: '组合输入', disabled: true }}
          messageProps={{ user: { name: '提问者', variant: 'outline' }, assistant: { name: '回答者' } }}
        />,
      );
      await waitFor(() => expect(text(container)).toContain('回答者'));
      expect(text(container)).toContain('提问者');
      expect(get(container, 'textarea')).toHaveAttribute('placeholder', '组合输入');
      expect(get(container, 'textarea')).toBeDisabled();
      expect(get(container, '.t-chat__item--variant--outline')).toBeInTheDocument();
    });

    test('messageProps: derives settings from each message', async () => {
      const { container } = render(
        <ChatBot
          defaultMessages={history}
          messageProps={(message) => ({ name: `角色-${message.role}`, variant: 'outline' })}
        />,
      );
      await waitFor(() => expect(text(container)).toContain('角色-assistant'));
      expect(text(container)).toContain('角色-user');
      expect(queryAll(container, '.t-chat__item--variant--outline')).toHaveLength(2);
    });
  });

  describe('scenarios', () => {
    test('setMessages and clearMessages: preserve message order through the ref', async () => {
      const ref = createRef<HTMLElement & TdChatbotApi>();
      const { container } = render(<ChatBot ref={ref} />);
      await waitFor(() => expect(mountedRef(ref).isChatEngineReady).toBe(true));
      act(() => mountedRef(ref).setMessages([history[1]], 'replace'));
      await waitFor(() => expect(text(container)).toContain('助手回答'));
      act(() => mountedRef(ref).setMessages([history[0]], 'prepend'));
      await waitFor(() =>
        expect(mountedRef(ref).chatMessageValue.map((message) => message.id)).toEqual(['user-1', 'assistant-1']),
      );
      const next = { ...history[1], id: 'assistant-2', content: [{ type: 'text' as const, data: '追加回答' }] };
      act(() => mountedRef(ref).setMessages([next], 'append'));
      await waitFor(() => expect(text(container)).toContain('追加回答'));
      expect(mountedRef(ref).chatMessageValue).toEqual([...history, next]);
      act(() => mountedRef(ref).clearMessages());
      await waitFor(() => expect(mountedRef(ref).chatMessageValue).toEqual([]));
      expect(text(container)).not.toContain('助手回答');
    });

    test('addPrompt and senderProps: fill the configured sender', async () => {
      const ref = createRef<HTMLElement & TdChatbotApi>();
      const { container } = render(<ChatBot ref={ref} senderProps={{ placeholder: '请输入', actions: ['send'] }} />);
      await waitFor(() => expect(mountedRef(ref).isChatEngineReady).toBe(true));
      act(() => mountedRef(ref).addPrompt('预设问题'));
      await waitFor(() => expect(get(container, 'textarea')).toHaveValue('预设问题'));
      expect(get(container, 'textarea')).toHaveAttribute('placeholder', '请输入');
    });

    test('chatServiceConfig: sends the configured request and renders its SSE response', async () => {
      const fetch = vi
        .fn<typeof globalThis.fetch>()
        .mockImplementation(
          async () =>
            new Response('data: {"text":"服务端回答"}\n\n', { headers: { 'content-type': 'text/event-stream' } }),
        );
      vi.stubGlobal('fetch', fetch);
      const ref = createRef<HTMLElement & TdChatbotApi>();
      const { container } = render(
        <ChatBot
          ref={ref}
          chatServiceConfig={{
            endpoint: 'https://example.invalid/chat',
            stream: true,
            onRequest: ({ prompt }) => ({ method: 'POST', body: JSON.stringify({ prompt }) }),
            onMessage: (chunk) => ({ type: 'text', data: chunk.data.text }),
          }}
        />,
      );
      await waitFor(() => expect(mountedRef(ref).isChatEngineReady).toBe(true));
      fireEvent.input(get(container, 'textarea'), { target: { value: '请求内容' } });
      await waitFor(() => expect(get(container, 'button')).not.toBeDisabled());
      fireEvent.click(get(container, 'button'));
      await waitFor(() => expect(text(container)).toContain('服务端回答'));
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch.mock.calls[0][0]).toBe('https://example.invalid/chat');
      expect(fetch.mock.calls[0][1].method).toBe('POST');
      expect(text(container)).toContain('请求内容');
      expect(JSON.parse(fetch.mock.calls[0][1].body as string)).toMatchObject({ prompt: '请求内容' });
    });
  });
});
