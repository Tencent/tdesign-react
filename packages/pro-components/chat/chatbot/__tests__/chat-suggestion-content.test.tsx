import '../../__tests__/setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { text } from '../../__tests__/helpers';
import { ChatSuggestionContent } from '../../chatbot';

describe('ChatSuggestionContent', () => {
  describe('props', () => {
    test('content: keeps suggestion order and replaces updated items', async () => {
      const items = [
        { title: '方案一', prompt: '介绍方案一' },
        { title: '方案二', prompt: '介绍方案二' },
      ];
      const view = render(<ChatSuggestionContent content={items} />);
      await waitFor(() => expect(text(view.container)).toContain('方案一方案二'));
      view.rerender(<ChatSuggestionContent content={[{ title: '新方案' }]} />);
      await waitFor(() => expect(text(view.container)).toContain('新方案'));
      expect(text(view.container)).not.toContain('方案一');
    });
  });
});
