import './setup';

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ChatActionBar } from '../chat-actionbar';

describe('chat-actionbar public contracts', () => {
  it('supports custom action nodes and mutually exclusive good/bad toggles', () => {
    const handler = vi.fn();
    render(
      <ChatActionBar actionBar={['good', 'bad', <button key="custom">自定义操作</button>]} handleAction={handler} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '点赞' }));
    expect(handler.mock.calls[0][1].active).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '点踩' }));
    expect(screen.getByRole('button', { name: '点赞' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', { name: '点踩' }));
    expect(handler.mock.calls[2][1].active).toBe(false);
    expect(screen.getByRole('button', { name: '自定义操作' })).toBeVisible();
  });
  it('disables all actions when actionBar is false', () => {
    render(<ChatActionBar actionBar={false} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
