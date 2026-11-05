import '../../__tests__/setup';

import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { get, queryAll, text } from '../../__tests__/helpers';
import { Filecard } from '../../chat-filecard';

describe('Filecard', () => {
  const item = { name: '报告.pdf', url: '/report.pdf', size: 2048 };

  describe('events', () => {
    test('fileClick and remove: report the selected file independently', async () => {
      const click = vi.fn();
      const remove = vi.fn();
      const { container } = render(<Filecard item={item} onFileClick={click} onRemove={remove} />);
      await waitFor(() => expect(text(container)).toContain('报告.pdf'));
      expect(text(container)).toContain('2 KB');
      fireEvent.click(get(container, '.t-filecard-overview'));
      expect(click).toHaveBeenCalledOnce();
      expect(click.mock.calls[0][0].detail).toEqual(item);
      fireEvent.click(get(container, '.t-filecard-remove'));
      expect(remove).toHaveBeenCalledOnce();
      expect(remove.mock.calls[0][0].detail).toEqual(item);
      expect(click).toHaveBeenCalledOnce();
    });
  });

  describe('props', () => {
    test.each([{ disabled: true }, { removable: false }])('removal: hidden with %j', async (props) => {
      const { container } = render(<Filecard item={item} {...props} />);
      await waitFor(() => expect(text(container)).toContain('报告.pdf'));
      expect(queryAll(container, '.t-filecard-remove')).toHaveLength(0);
    });

    test('item.status=progress: shows upload progress', async () => {
      const { container } = render(<Filecard item={{ ...item, status: 'progress', percent: 42 }} />);
      await waitFor(() => expect(text(container)).toContain('上传中...42%'));
    });

    test('item.description: shows the custom file description', async () => {
      const { container } = render(<Filecard item={{ ...item, description: '自定义描述' }} />);
      await waitFor(() => expect(text(container)).toContain('自定义描述'));
    });
  });
});
