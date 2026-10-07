import './setup';

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

import { ChatMarkdown } from '../chat-markdown';

const renderer = vi.hoisted(() => ({
  copy: undefined as undefined | ((event: { target: HTMLElement }, code: string) => string | false),
}));
vi.mock('../_util/markdown-engine.cjs', () => ({
  default: () =>
    class {
      constructor(options) {
        renderer.copy = options.callback.onCopyCode;
      }

      setMarkdown = vi.fn();

      destroy = vi.fn();
    },
}));

describe('chat-markdown public contracts', () => {
  it('copies the original code by default and honors custom transformations and cancellation', () => {
    const copied = vi.fn();
    const view = render(<ChatMarkdown content="```js\noriginal\n```" onCodeCopy={copied} />);
    const event = { target: document.createElement('div') };
    if (!renderer.copy) throw new Error('Markdown copy callback was not registered');
    expect(renderer.copy(event, 'original')).toBe('original');
    expect(copied).toHaveBeenLastCalledWith({ code: 'original' });

    const options = { callback: { onCopyCode: vi.fn(() => 'transformed') } };
    view.rerender(<ChatMarkdown content="code" options={options} onCodeCopy={copied} />);
    expect(renderer.copy(event, 'original')).toBe('transformed');
    expect(copied).toHaveBeenLastCalledWith({ code: 'transformed' });

    copied.mockClear();
    view.rerender(
      <ChatMarkdown content="code" options={{ callback: { onCopyCode: () => false } }} onCodeCopy={copied} />,
    );
    expect(renderer.copy(event, 'original')).toBe(false);
    expect(copied).not.toHaveBeenCalled();
  });
});
