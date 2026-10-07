import './setup';

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ChatMessage } from '../chat-message';
import { ChatList } from '../chatbot/list';
import { message } from './helpers';

import type React from 'react';
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

describe('chat-message public contracts', () => {
  it('composes messages through ChatList children, including empty fragments', () => {
    render(
      <ChatList>
        <>
          <ChatMessage message={message} />
          {null}
          {false}
          <ChatMessage role="user" content={[{ type: 'text', data: '输入' }]} />
        </>
      </ChatList>,
    );
    expect(screen.getByText('默认回答')).toBeVisible();
    expect(screen.getByText('输入')).toBeVisible();
  });
  it('supports metadata React nodes, overrides and custom segment slots', () => {
    const view = render(
      <ChatMessage message={message} content={[{ type: 'text', data: '覆盖' }]} name={<b>作者</b>} datetime="今天" />,
    );
    expect(screen.getByText('作者')).toBeVisible();
    expect(screen.getByText('覆盖')).toBeVisible();
    expect(screen.queryByText('默认回答')).toBeNull();
    view.rerender(
      <ChatMessage message={message}>
        <div slot="text-0">自定义</div>
      </ChatMessage>,
    );
    expect(screen.getByText('自定义')).toBeVisible();
    expect(screen.queryByText('默认回答')).toBeNull();
  });
  it('reports pending and error states and updates into complete content', () => {
    const view = render(<ChatMessage role="assistant" status="pending" />);
    expect(screen.getByRole('status')).toBeVisible();
    view.rerender(<ChatMessage role="assistant" status="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('请求出错');
    view.rerender(<ChatMessage message={message} />);
    expect(screen.getByText('默认回答')).toBeVisible();
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('keeps two segments in order within the same message', () => {
    render(
      <ChatMessage
        role="user"
        content={[
          { type: 'text', data: '第一段' },
          { type: 'text', data: '第二段' },
        ]}
      />,
    );
    const first = screen.getByText('第一段');
    const second = screen.getByText('第二段');
    expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
