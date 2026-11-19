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
    test('useCollapse: switches between result card and expanded references', async () => {
      const view = render(<ChatSearchContent content={content} useCollapse={false} />);
      await waitFor(() => expect(text(view.container)).toContain('搜索结果'));
      expect(queryAll(view.container, 'a')).toHaveLength(0);
      view.rerender(<ChatSearchContent content={content} useCollapse collapsed={false} />);
      await waitFor(() => expect(text(view.container)).toContain('参考文档'));
      const link = get(view.container, 'a');
      expect(link).toHaveAttribute('href', '#reference');
      view.rerender(<ChatSearchContent content={content} useCollapse={false} />);
      await waitFor(() => expect(queryAll(view.container, 'a')).toHaveLength(0));
      expect(text(view.container)).toContain('搜索结果');
    });
  });
});
