import './setup';

import React, { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';

import { ChatList } from '../chatbot/list';
import { mountedRef } from './helpers';

import type { TdChatListApi } from '../_util/native-types';

describe('chat-list public contracts', () => {
  it('supports list scrolling and delivers the public scroll detail', () => {
    const ref = createRef<HTMLElement & TdChatListApi>();
    const onScroll = vi.fn();
    render(
      <ChatList ref={ref} onScroll={onScroll}>
        内容
      </ChatList>,
    );
    Object.defineProperty(ref.current, 'scrollHeight', {
      value: 700,
      configurable: true,
    });
    Object.defineProperty(ref.current, 'clientHeight', {
      value: 200,
      configurable: true,
    });
    act(() => mountedRef(ref).scrollList({ to: 'bottom' }));
    expect(mountedRef(ref).scrollTop).toBe(500);
    fireEvent.scroll(mountedRef(ref));
    expect(onScroll.mock.calls[0][0].detail).toEqual({ scrollTop: 500 });
    act(() => mountedRef(ref).scrollList({ to: 'top' }));
    expect(mountedRef(ref).scrollTop).toBe(0);
  });
});
