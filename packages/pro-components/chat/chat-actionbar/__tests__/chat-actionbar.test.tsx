import '../../__tests__/setup';

import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { get, queryAll, text } from '../../__tests__/helpers';
import { ChatActionBar } from '../../chat-actionbar';

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
    test('comment action: toggles the visible feedback state', async () => {
      const { container } = render(<ChatActionBar actionBar={['good']} />);
      await waitFor(() => expect(queryAll(container, '.t-chat-actions__item__wrapper')).toHaveLength(1));
      expect(queryAll(container, 't-icon-thumb-up-filled')).toHaveLength(0);
      fireEvent.click(get(container, '.t-chat-actions__item__wrapper'));
      await waitFor(() => expect(queryAll(container, 't-icon-thumb-up-filled')).toHaveLength(1));
      fireEvent.click(get(container, '.t-chat-actions__item__wrapper'));
      await waitFor(() => expect(queryAll(container, 't-icon-thumb-up-filled')).toHaveLength(0));
    });

    test('actionBar: custom React actions use the latest click handler', async () => {
      const firstClick = vi.fn();
      const nextClick = vi.fn();
      const view = render(
        <ChatActionBar
          actionBar={[
            <button key="custom" onClick={firstClick}>
              自定义操作
            </button>,
          ]}
        />,
      );
      await waitFor(() => expect(text(view.container)).toContain('自定义操作'));
      fireEvent.click(get(view.container, 'button'));
      expect(firstClick).toHaveBeenCalledOnce();
      view.rerender(
        <ChatActionBar
          actionBar={[
            <button key="custom" onClick={nextClick}>
              更新操作
            </button>,
          ]}
        />,
      );
      await waitFor(() => expect(text(view.container)).toContain('更新操作'));
      fireEvent.click(get(view.container, 'button'));
      expect(nextClick).toHaveBeenCalledOnce();
      expect(firstClick).toHaveBeenCalledOnce();
    });
  });
});
