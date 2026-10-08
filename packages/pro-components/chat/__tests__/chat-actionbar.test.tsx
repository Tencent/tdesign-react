import './setup';

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { ChatActionBar } from '../chat-actionbar';
import { get, queryAll, text } from './helpers';

describe('ChatActionBar public props', () => {
  it('renders only the configured actions', async () => {
    const { container } = render(<ChatActionBar actionBar={['replay', 'share']} />);
    await waitFor(() => expect(queryAll(container, '.t-chat-actions__item__wrapper')).toHaveLength(2));
  });

  it('updates the configured action set', async () => {
    const view = render(<ChatActionBar actionBar={['good']} />);
    await waitFor(() => expect(queryAll(view.container, '.t-chat-actions__item__wrapper')).toHaveLength(1));
    view.rerender(<ChatActionBar actionBar={['good', 'bad', 'share']} />);
    await waitFor(() => expect(queryAll(view.container, '.t-chat-actions__item__wrapper')).toHaveLength(3));
  });

  it('keeps custom React actions interactive', async () => {
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
