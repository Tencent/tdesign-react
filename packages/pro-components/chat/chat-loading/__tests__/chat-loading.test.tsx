import '../../__tests__/setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { queryAll, text } from '../../__tests__/helpers';
import { ChatLoading } from '../../chat-loading';

describe('ChatLoading', () => {
  describe('props', () => {
    test.each([
      ['skeleton', 't-skeleton'],
      ['moving', '.t-chat-loading__moving'],
      ['gradient', '.t-chat-loading__gradient'],
      ['dots', '.t-chat-loading__dot'],
      ['circle', '.t-chat-loading__circle'],
    ] as const)('animation=%s: creates its indicator', async (animation, indicator) => {
      const { container } = render(<ChatLoading animation={animation} />);
      await waitFor(() => expect(queryAll(container, indicator).length).toBeGreaterThan(0));
    });

    test('animation and text: update and clear the loading message', async () => {
      const view = render(<ChatLoading animation="dots" text="正在生成" />);
      await waitFor(() => expect(text(view.container)).toContain('正在生成'));
      view.rerender(<ChatLoading animation="dots" text="继续生成" />);
      await waitFor(() => expect(text(view.container)).toContain('继续生成'));
      expect(text(view.container)).not.toContain('正在生成');
      view.rerender(<ChatLoading animation="dots" text="" />);
      await waitFor(() => expect(text(view.container)).not.toContain('继续生成'));
    });

    test('animation: replaces the previous indicator when the prop changes', async () => {
      const view = render(<ChatLoading animation="skeleton" />);
      await waitFor(() => expect(queryAll(view.container, 't-skeleton')).toHaveLength(1));
      view.rerender(<ChatLoading animation="dots" />);
      await waitFor(() => expect(queryAll(view.container, '.t-chat-loading__dot')).toHaveLength(1));
      expect(queryAll(view.container, 't-skeleton')).toHaveLength(0);
      view.rerender(<ChatLoading animation="circle" />);
      await waitFor(() => expect(queryAll(view.container, '.t-chat-loading__circle')).toHaveLength(1));
      expect(queryAll(view.container, '.t-chat-loading__dot')).toHaveLength(0);
    });
  });
});
