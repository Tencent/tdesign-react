import './setup';

import React, { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { ChatList } from '../chatbot';
import { get, mountedRef, text } from './helpers';

import type { TdChatListApi } from '../chatbot';

describe('ChatList public props and ref', () => {
  it('preserves children and reports scroll position', async () => {
    const scroll = vi.fn();
    const { container } = render(
      <ChatList autoScroll={false} defaultScrollTo="top" onScroll={scroll}>
        <p>第一条</p>
        <p>第二条</p>
      </ChatList>,
    );
    await waitFor(() => expect(text(container)).toContain('第一条第二条'));
    const viewport = get(container, '.t-chat__list');
    fireEvent.scroll(viewport, { target: { scrollTop: 120 } });
    expect(scroll).toHaveBeenCalledWith(expect.objectContaining({ detail: { scrollTop: 120 } }));
  });

  it('honors explicit top and bottom scrolling through the ref', async () => {
    const ref = createRef<HTMLElement & TdChatListApi>();
    const { container } = render(
      <ChatList ref={ref} autoScroll={false}>
        <p>消息</p>
      </ChatList>,
    );
    await waitFor(() => expect(text(container)).toContain('消息'));
    const viewport = get(container, '.t-chat__list');
    // jsdom has no layout; only supply geometry for the public scroll command.
    Object.defineProperties(viewport, {
      scrollHeight: { configurable: true, value: 600 },
      clientHeight: { configurable: true, value: 200 },
    });
    act(() => mountedRef(ref).scrollList({ to: 'bottom', behavior: 'auto' }));
    expect(viewport.scrollTop).toBe(400);
    act(() => mountedRef(ref).scrollList({ to: 'top', behavior: 'auto' }));
    expect(viewport.scrollTop).toBe(0);
  });
});
