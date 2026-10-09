import '../../__tests__/setup';

import React from 'react';
import { describe, expect, test } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { get, queryAll, text } from '../../__tests__/helpers';
import { ChatSearchContent } from '../../chatbot';

describe('ChatSearchContent', () => {
  const reference = { title: '参考文档', url: '#reference' };
  const content = { title: '搜索结果', references: [reference] };

  describe('props', () => {
    test('useCollapse=false: renders a result card', async () => {
      const { container } = render(<ChatSearchContent content={content} useCollapse={false} />);
      await waitFor(() => expect(text(container)).toContain('搜索结果'));
      expect(queryAll(container, 'a')).toHaveLength(0);
    });

    test('useCollapse and collapsed=false: renders the reference link', async () => {
      const { container } = render(<ChatSearchContent content={content} useCollapse collapsed={false} />);
      await waitFor(() => expect(text(container)).toContain('参考文档'));
      const link = get(container, 'a');
      expect(link).toHaveAttribute('href', '#reference');
    });
  });
});
