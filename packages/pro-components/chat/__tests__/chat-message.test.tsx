import './setup';

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { ChatMessage } from '../chat-message';
import { get, queryAll, text } from './helpers';

import type { TdChatMessageProps } from '../chat-message';

const content: TdChatMessageProps['content'] = [{ type: 'text', data: '消息内容' }];

describe('ChatMessage public props', () => {
  it.each(['user', 'assistant', 'system'] as const)('renders content for role=%s', async (role) => {
    const { container } = render(<ChatMessage role={role} content={content} />);
    await waitFor(() => expect(text(container)).toContain('消息内容'));
    expect(get(container, `.t-chat__item__role--${role}`)).toBeInTheDocument();
  });

  it.each(['base', 'outline', 'text'] as const)('applies variant=%s to a message', async (variant) => {
    const { container } = render(<ChatMessage role="assistant" variant={variant} content={content} />);
    await waitFor(() => expect(text(container)).toContain('消息内容'));
    expect(get(container, `.t-chat__item--variant--${variant}`)).toBeInTheDocument();
  });

  it.each(['left', 'right'] as const)('applies placement=%s independently of role', async (placement) => {
    const { container } = render(<ChatMessage role="assistant" placement={placement} content={content} />);
    await waitFor(() => expect(get(container, `.t-chat__item__inner.${placement}`)).toBeInTheDocument());
  });

  it('renders multiple content blocks in order within the same message', async () => {
    const { container } = render(
      <ChatMessage
        role="assistant"
        content={[
          { type: 'text', data: '第一段' },
          { type: 'markdown', data: '**第二段**' },
        ]}
      />,
    );
    await waitFor(() => expect(text(container)).toContain('第一段第二段'));
    expect(get(container, 'strong')).toHaveTextContent('第二段');
  });

  it('combines metadata, placement and variant without losing content', async () => {
    const view = render(
      <ChatMessage
        role="assistant"
        name="助手"
        datetime="10:30"
        avatar="/avatar.png"
        variant="outline"
        placement="right"
        content={content}
      />,
    );
    await waitFor(() => expect(text(view.container)).toContain('助手'));
    expect(text(view.container)).toContain('10:30');
    expect(text(view.container)).toContain('消息内容');
    expect(get(view.container, 'img[src="/avatar.png"]')).toBeInTheDocument();
    expect(get(view.container, '.t-chat__item--variant--outline')).toBeInTheDocument();
    expect(get(view.container, '.t-chat__item__inner.right')).toBeInTheDocument();
    view.rerender(<ChatMessage role="assistant" name="更新后的助手" content={[{ type: 'text', data: '更新内容' }]} />);
    await waitFor(() => expect(text(view.container)).toContain('更新内容'));
    expect(text(view.container)).toContain('更新后的助手');
    expect(text(view.container)).not.toContain('消息内容');
  });

  it('combines pending status and animation, then renders the completed content', async () => {
    const view = render(<ChatMessage role="assistant" status="pending" animation="dots" content={[]} />);
    await waitFor(() => expect(get(view.container, '.t-chat-loading__dot')).toBeInTheDocument());
    view.rerender(<ChatMessage role="assistant" status="complete" content={content} />);
    await waitFor(() => expect(text(view.container)).toContain('消息内容'));
    expect(queryAll(view.container, '.t-chat-loading__dot')).toHaveLength(0);
  });

  it('forwards suggestion interactions through handleActions', async () => {
    const suggestion = { title: '继续了解', prompt: '详细说明' };
    const handler = vi.fn();
    const { container } = render(
      <ChatMessage
        role="assistant"
        content={[{ type: 'suggestion', data: [suggestion] }]}
        handleActions={{ suggestion: handler }}
      />,
    );
    await waitFor(() => expect(text(container)).toContain('继续了解'));
    fireEvent.click(get(container, '.t-chat__item__suggestion-item'));
    await waitFor(() => expect(handler).toHaveBeenCalledOnce());
    expect(handler.mock.calls[0][0].content).toEqual(suggestion);
  });

  it('composes thinking content with chatContentProps', async () => {
    const { container } = render(
      <ChatMessage
        role="assistant"
        content={[{ type: 'thinking', data: { title: '思考标题', text: '思考内容' } }]}
        chatContentProps={{ thinking: { layout: 'border', maxHeight: 80 } }}
      />,
    );
    await waitFor(() => expect(text(container)).toContain('思考内容'));
    expect(get(container, '.t-chat__item__think-layout-border')).toBeInTheDocument();
    expect(get(container, '.t-scroll__wrapper')).toHaveStyle({ maxHeight: '80px' });
  });
});
