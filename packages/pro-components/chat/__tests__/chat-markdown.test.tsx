import './setup';

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { ChatMarkdown } from '../chat-markdown';
import { get, queryAll, text } from './helpers';

describe('ChatMarkdown public props', () => {
  it('renders formatted content and links', async () => {
    const { container } = render(<ChatMarkdown content={'# 标题\n\n**重点**和[文档](https://tdesign.tencent.com)'} />);
    await waitFor(() => expect(get(container, 'h1')).toHaveTextContent('标题'));
    expect(get(container, 'strong')).toHaveTextContent('重点');
    expect(get(container, 'a[href="https://tdesign.tencent.com"]')).toHaveTextContent('文档');
  });

  it('updates and clears content without leaving old markup', async () => {
    const view = render(<ChatMarkdown content="**初始内容**" />);
    await waitFor(() => expect(get(view.container, 'strong')).toHaveTextContent('初始内容'));
    view.rerender(<ChatMarkdown content="**初始内容**，追加内容" />);
    await waitFor(() => expect(text(view.container)).toContain('追加内容'));
    view.rerender(<ChatMarkdown content="" />);
    await waitFor(() => expect(queryAll(view.container, 'strong')).toHaveLength(0));
    expect(text(view.container)).not.toContain('初始内容');
  });

  it('combines content and options to control Markdown parsing', async () => {
    const { container } = render(
      <ChatMarkdown
        content="[文档](https://tdesign.tencent.com)"
        options={{ engine: { syntax: { link: { target: '_self' } } } }}
      />,
    );
    await waitFor(() => expect(get(container, 'a')).toHaveTextContent('文档'));
    expect(get(container, 'a')).toHaveAttribute('target', '_self');
  });
});
