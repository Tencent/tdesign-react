import '../../__tests__/setup';

import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { get, text } from '../../__tests__/helpers';
import { ChatThinking } from '../../chat-thinking';

describe('ChatThinking', () => {
  describe('events', () => {
    test('collapsedChange: requests a change without overriding controlled collapsed=false', async () => {
      const change = vi.fn();
      const view = render(
        <ChatThinking content={{ title: '思考', text: '推理内容' }} collapsed={false} onCollapsedChange={change} />,
      );
      await waitFor(() => expect(text(view.container)).toContain('推理内容'));
      fireEvent.click(get(view.container, '.t-collapse-panel__header'));
      await waitFor(() => expect(change).toHaveBeenCalledOnce());
      expect(change.mock.calls[0][0].detail).toBe(true);
      fireEvent.click(get(view.container, '.t-collapse-panel__header'));
      await waitFor(() => expect(change).toHaveBeenCalledTimes(2));
      expect(change.mock.calls[1][0].detail).toBe(true);
      view.rerender(
        <ChatThinking content={{ title: '思考', text: '推理内容' }} collapsed onCollapsedChange={change} />,
      );
      fireEvent.click(get(view.container, '.t-collapse-panel__header'));
      await waitFor(() => expect(change).toHaveBeenCalledTimes(3));
      expect(change.mock.calls[2][0].detail).toBe(false);
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
