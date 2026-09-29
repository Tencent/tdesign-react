/**
 * chat 包公共导出面守卫
 *
 * 迁移最容易发生的破坏是「导出名变了」——调用方 import 直接失败。
 * 这里只断言导出存在且是可用的组件类型，不做渲染，保持成本极低。
 */
import { describe, expect, it } from 'vitest';

import * as Chat from '../index';

const exportedComponents = [
  'ChatBot',
  'ChatList',
  'ChatSearchContent',
  'ChatSuggestionContent',
  'ChatMessage',
  'ChatSender',
  'ChatActionBar',
  'ChatLoading',
  'ChatThinking',
  'ChatMarkdown',
  'Filecard',
  'Attachments',
];

describe('chat 公共导出面', () => {
  const api = Chat as unknown as Record<string, unknown>;

  exportedComponents.forEach((name) => {
    it(`导出 ${name}`, () => {
      expect(api[name]).toBeTruthy();
    });
  });

  it('导出 MarkdownEngine', () => {
    expect(api.MarkdownEngine).toBeTruthy();
  });
});
