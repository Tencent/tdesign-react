import './setup';

import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

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
  it('renders metadata slots without props and lets them override props', () => {
    const children = (
      <>
        <span slot="name">插槽作者</span>
        <span slot="datetime">插槽时间</span>
      </>
    );
    const view = render(<ChatMessage message={message}>{children}</ChatMessage>);
    expect(screen.getByText('插槽作者')).toBeVisible();
    expect(screen.getByText('插槽时间')).toBeVisible();
    view.rerender(
      <ChatMessage message={message} name="属性作者" datetime="属性时间">
        {children}
      </ChatMessage>,
    );
    expect(screen.getByText('插槽作者')).toBeVisible();
    expect(screen.queryByText('属性作者')).toBeNull();
    expect(screen.queryByText('属性时间')).toBeNull();
  });
  it('defaults message search to a collapsed panel and accepts a card override', () => {
    const content = {
      title: '搜索资料',
      references: [{ title: '参考资料', url: '#reference' }],
    };
    const props = {
      content: [{ type: 'search' as const, data: content, status: 'complete' as const }],
    };
    const result = vi.fn();
    const view = render(<ChatMessage {...props} />);
    expect(screen.queryByRole('link', { name: /参考资料/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '搜索资料' }));
    expect(screen.getByRole('link', { name: /参考资料/ })).toBeVisible();
    view.rerender(
      <ChatMessage
        {...props}
        chatContentProps={{ search: { useCollapse: false } }}
        handleActions={{ searchResult: result }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '搜索资料' }));
    expect(result.mock.calls[0][0].content).toBe(content);
    expect(screen.queryByRole('link', { name: /参考资料/ })).toBeNull();
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
