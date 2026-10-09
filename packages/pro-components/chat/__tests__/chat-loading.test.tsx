import './setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { ChatLoading } from '../chat-loading';
import { get, queryAll, text } from './helpers';

describe('ChatLoading', () => {
  describe('props', () => {
    test.each([
      ['skeleton', 'skeleton'],
      ['moving', 'moving'],
      ['gradient', 'gradient'],
      ['dots', 'dot'],
      ['circle', 'circle'],
    ] as const)('animation: renders %s', async (animation, modifier) => {
      const { container } = render(<ChatLoading animation={animation} />);
      await waitFor(() => expect(queryAll(container, `.t-chat-loading__${modifier}`).length).toBeGreaterThan(0));
    });

    test('animation and text: display the loading message', async () => {
      const { container } = render(<ChatLoading animation="dots" text="正在生成" />);
      await waitFor(() => expect(text(container)).toContain('正在生成'));
      expect(get(container, '.t-chat-loading__dot')).toBeInTheDocument();
    });
  });
});
