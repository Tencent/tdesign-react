import './setup';

import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { Filecard } from '../chat-filecard';
import { ChatThinking } from '../chat-thinking';
import { ChatSearchContent, ChatSuggestionContent } from '../chatbot';
import { get, queryAll, text } from './helpers';

describe('ChatThinking', () => {
  describe('events', () => {
    test('collapsedChange: requests a change without overriding controlled collapsed=false', async () => {
      const change = vi.fn();
      const { container } = render(
        <ChatThinking content={{ title: '思考', text: '推理内容' }} collapsed={false} onCollapsedChange={change} />,
      );
      await waitFor(() => expect(text(container)).toContain('推理内容'));
      fireEvent.click(get(container, '.t-collapse-panel__header'));
      await waitFor(() => expect(change).toHaveBeenCalledOnce());
      expect(change.mock.calls[0][0].detail).toBe(true);
      fireEvent.click(get(container, '.t-collapse-panel__header'));
      await waitFor(() => expect(change).toHaveBeenCalledTimes(2));
      expect(change.mock.calls[1][0].detail).toBe(true);
    });
  });

  describe('props', () => {
    test('content and status: replace completed content with stopped content', async () => {
      const view = render(<ChatThinking content={{ title: '思考过程', text: '第一步\n第二步' }} status="complete" />);
      await waitFor(() => expect(text(view.container)).toContain('第一步第二步'));
      expect(text(view.container)).toContain('思考过程');
      view.rerender(<ChatThinking content={{ title: '思考过程', text: '更新内容' }} status="stop" />);
      await waitFor(() => expect(text(view.container)).toContain('思考已终止'));
      expect(text(view.container)).toContain('更新内容');
      expect(text(view.container)).not.toContain('第一步');
    });

    test('layout and maxHeight: preserve content when expanded', async () => {
      const content = { title: '思考过程', text: '推理内容' };
      const view = render(<ChatThinking content={content} layout="border" maxHeight={80} collapsed={false} />);
      await waitFor(() => expect(get(view.container, '.t-chat__item__think-layout-border')).toBeInTheDocument());
      await waitFor(() => expect(text(view.container)).toContain('推理内容'));
      expect(get(view.container, '.t-scroll__wrapper')).toHaveStyle({ maxHeight: '80px' });
    });
  });
});

describe('ChatSearchContent', () => {
  const reference = { title: '参考文档', url: '#reference' };
  const content = { title: '搜索结果', references: [reference] };

  describe('props', () => {
    test('useCollapse=false: renders a result card', async () => {
      const { container } = render(<ChatSearchContent content={content} useCollapse={false} />);
      await waitFor(() => expect(text(container)).toContain('搜索结果'));
      expect(queryAll(container, 'a')).toHaveLength(0);
    });

    test('useCollapse and collapsed=false: renders the reference link', async () => {
      const { container } = render(<ChatSearchContent content={content} useCollapse collapsed={false} />);
      await waitFor(() => expect(text(container)).toContain('参考文档'));
      const link = get(container, 'a');
      expect(link).toHaveAttribute('href', '#reference');
    });
  });
});

describe('ChatSuggestionContent', () => {
  describe('props', () => {
    test('content: keeps suggestion order and replaces updated items', async () => {
      const items = [
        { title: '方案一', prompt: '介绍方案一' },
        { title: '方案二', prompt: '介绍方案二' },
      ];
      const view = render(<ChatSuggestionContent content={items} />);
      await waitFor(() => expect(text(view.container)).toContain('方案一方案二'));
      view.rerender(<ChatSuggestionContent content={[{ title: '新方案' }]} />);
      await waitFor(() => expect(text(view.container)).toContain('新方案'));
      expect(text(view.container)).not.toContain('方案一');
    });
  });
});

describe('Filecard', () => {
  const item = { name: '报告.pdf', url: '/report.pdf', size: 2048 };

  describe('events', () => {
    test('fileClick and remove: report the selected file independently', async () => {
      const click = vi.fn();
      const remove = vi.fn();
      const { container } = render(<Filecard item={item} onFileClick={click} onRemove={remove} />);
      await waitFor(() => expect(text(container)).toContain('报告.pdf'));
      expect(text(container)).toContain('2 KB');
      fireEvent.click(get(container, '.t-filecard-overview'));
      expect(click).toHaveBeenCalledOnce();
      expect(click.mock.calls[0][0].detail).toEqual(item);
      fireEvent.click(get(container, '.t-filecard-remove'));
      expect(remove).toHaveBeenCalledOnce();
      expect(remove.mock.calls[0][0].detail).toEqual(item);
      expect(click).toHaveBeenCalledOnce();
    });
  });

  describe('props', () => {
    test.each([{ disabled: true }, { removable: false }])('removal: hidden with %j', async (props) => {
      const { container } = render(<Filecard item={item} {...props} />);
      await waitFor(() => expect(text(container)).toContain('报告.pdf'));
      expect(queryAll(container, '.t-filecard-remove')).toHaveLength(0);
    });

    test('item.status=progress: shows upload progress', async () => {
      const { container } = render(<Filecard item={{ ...item, status: 'progress', percent: 42 }} />);
      await waitFor(() => expect(text(container)).toContain('上传中...42%'));
    });

    test('item.description: shows the custom file description', async () => {
      const { container } = render(<Filecard item={{ ...item, description: '自定义描述' }} />);
      await waitFor(() => expect(text(container)).toContain('自定义描述'));
    });
  });
});
