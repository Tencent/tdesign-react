import './setup';

import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { ChatActionBar } from '../chat-actionbar';
import { get, queryAll, text } from './helpers';

describe('ChatActionBar', () => {
  describe('props', () => {
    test('actionBar: renders the configured actions in order', async () => {
      const { container } = render(<ChatActionBar actionBar={['replay', 'share']} tooltipProps={{ visible: true }} />);
      await waitFor(() => expect(queryAll(container, '.t-chat-actions__item__wrapper')).toHaveLength(2));
      await waitFor(() => expect(text(document.body)).toContain('重新生成分享'));
    });

    test('actionBar: replaces and reorders actions on update', async () => {
      const view = render(<ChatActionBar actionBar={['good', 'share']} tooltipProps={{ visible: true }} />);
      await waitFor(() => expect(text(document.body)).toContain('点赞分享'));
      view.rerender(<ChatActionBar actionBar={['share', 'bad', 'good']} tooltipProps={{ visible: true }} />);
      await waitFor(() => expect(queryAll(view.container, '.t-chat-actions__item__wrapper')).toHaveLength(3));
      await waitFor(() => expect(text(document.body)).toContain('分享点踩点赞'));
    });
  });

  describe('scenarios', () => {
    test('actionBar: custom React actions remain interactive', async () => {
      const click = vi.fn();
      const { container } = render(
        <ChatActionBar
          actionBar={[
            <button key="custom" onClick={click}>
              自定义操作
            </button>,
          ]}
        />,
      );
      await waitFor(() => expect(text(container)).toContain('自定义操作'));
      fireEvent.click(get(container, 'button'));
      expect(click).toHaveBeenCalledOnce();
    });
  });
});
