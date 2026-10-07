import './setup';

import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ChatBot } from '../chatbot';
import { history, message, mountedRef } from './helpers';

import type React from 'react';
import type { TdChatbotApi } from '../_util/native-types';
// Message composition is tested separately from the real Cherry browser renderer.
vi.mock('../chat-markdown', async () => {
  const React = await import('react');
  return {
    ChatMarkdown: React.forwardRef((props: { content: string }, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref}>{props.content}</div>
    )),
    MarkdownEngine: class {},
  };
});

describe('chatbot public contracts', () => {
  it('keeps engine refs, state setters, prompts, actions and events functional', async () => {
    const ref = createRef<HTMLElement & TdChatbotApi>();
    const ready = vi.fn();
    const change = vi.fn();
    const action = vi.fn();
    render(
      <ChatBot
        ref={ref}
        defaultMessages={history}
        onChatReady={ready}
        onMessageChange={change}
        messageProps={{ assistant: { actions: true } }}
        onChatMessageAction={action}
      />,
    );
    await waitFor(() => expect(mountedRef(ref).isChatEngineReady).toBe(true));
    expect(ready).toHaveBeenCalledOnce();
    expect(screen.getByText('默认回答')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '点赞' }));
    expect(action.mock.calls[0][0].detail.data.message.id).toBe('a');
    act(() => mountedRef(ref).addPrompt('新问题'));
    expect(screen.getByRole('textbox')).toHaveValue('新问题');
    await act(async () => {
      mountedRef(ref).setMessages([{ ...message, id: 'b', content: [{ type: 'text', data: '追加' }] }], 'append');
    });
    expect(screen.getByText('追加')).toBeVisible();
    await act(async () => {
      mountedRef(ref).clearMessages();
    });
    expect(mountedRef(ref).chatMessageValue).toEqual([]);
    expect(screen.queryByText('追加')).toBeNull();
    expect(change.mock.calls[change.mock.calls.length - 1][0].detail).toEqual([]);
    await act(async () => {
      await mountedRef(ref).sendAIMessage({
        content: [{ type: 'text', data: '手动回答' }],
        sendRequest: false,
      });
    });
    expect(screen.getByText('手动回答')).toBeVisible();
  });
  it('replaces default messages including an explicit empty list', async () => {
    const view = render(<ChatBot defaultMessages={history} />);
    await screen.findByText('默认回答');
    view.rerender(<ChatBot defaultMessages={[]} />);
    await waitFor(() => expect(screen.queryByText('默认回答')).toBeNull());
  });
  it('composes sender and message props and preserves the public ref methods', async () => {
    const ref = createRef<HTMLElement & TdChatbotApi>();
    render(
      <ChatBot
        ref={ref}
        defaultMessages={history}
        senderProps={{ placeholder: '组合输入' }}
        messageProps={{ user: { name: '提问者' } }}
      />,
    );
    await waitFor(() => expect(mountedRef(ref).isChatEngineReady).toBe(true));
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', '组合输入');
    expect(screen.getByText('提问者')).toBeVisible();
    for (const method of [
      'sendUserMessage',
      'sendAIMessage',
      'sendSystemMessage',
      'abortChat',
      'addPrompt',
      'selectFile',
      'regenerate',
      'scrollList',
      'setMessages',
      'clearMessages',
    ] as const) {
      expect(typeof mountedRef(ref)[method]).toBe('function');
    }
  });
  it('emits afterSend with the public request after a real successful SSE response', async () => {
    const afterSend = vi.fn();
    const response = 'data: {"msg":"服务端回答"}\n\n';
    const fetch = vi.fn(async () => new Response(response, { headers: { 'content-type': 'text/event-stream' } }));
    vi.stubGlobal('fetch', fetch);
    const ref = createRef<HTMLElement & TdChatbotApi>();
    render(
      <ChatBot
        ref={ref}
        onChatAfterSend={afterSend}
        chatServiceConfig={{
          endpoint: 'https://example.invalid/chat',
          stream: true,
          onMessage: (chunk) => ({ type: 'markdown', data: chunk.data.msg }),
        }}
      />,
    );
    await waitFor(() => expect(mountedRef(ref).isChatEngineReady).toBe(true));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '请求内容' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    await screen.findByText('服务端回答');
    await waitFor(() => expect(afterSend).toHaveBeenCalledOnce());
    expect(afterSend.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
    expect(afterSend.mock.calls[0][0].detail).toEqual({ prompt: '请求内容', attachments: [] });
    expect(fetch).toHaveBeenCalledOnce();
  });
});
