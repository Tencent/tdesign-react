import './setup';

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { ChatLoading } from '../chat-loading';
import { get, queryAll, text } from './helpers';

describe('ChatLoading public props', () => {
  it.each([
    ['skeleton', 'skeleton'],
    ['moving', 'moving'],
    ['gradient', 'gradient'],
    ['dots', 'dot'],
    ['circle', 'circle'],
  ] as const)('renders animation=%s', async (animation, modifier) => {
    const { container } = render(<ChatLoading animation={animation} />);
    await waitFor(() => expect(queryAll(container, `.t-chat-loading__${modifier}`).length).toBeGreaterThan(0));
  });

  it('combines loading text with an animation', async () => {
    const { container } = render(<ChatLoading animation="dots" text="正在生成" />);
    await waitFor(() => expect(text(container)).toContain('正在生成'));
    expect(get(container, '.t-chat-loading__dot')).toBeInTheDocument();
  });
});
