/**
 * 内容型子组件迁移回归守卫（ChatThinking / ChatMarkdown / Filecard）
 *
 * 这几个组件是消息内容的承载单元，迁移时最容易「换了实现但内容渲染不出来」。
 * 每条只守卫一个核心 prop，保证覆盖面而不铺开到全部 props。
 *
 * 注意：Attachments 未纳入本文件。原因是当前 webc 实现下 items 以 attribute
 * 形式传递，在 jsdom 中会在 connectedCallback 阶段抛错（items.map 崩溃），
 * 属当前实现缺陷；迁移到纯 React 后应正常，建议迁移完成后补充其用例。
 */
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Filecard } from '../chat-filecard';
import { ChatMarkdown } from '../chat-markdown';
import { ChatThinking } from '../chat-thinking';
import { deepText, renderChat } from './helpers';

describe('ChatThinking', () => {
  it('props.content.text 渲染思考内容', async () => {
    const { container } = await renderChat(
      <ChatThinking content={{ text: 'thinking-body', title: 'thinking-title' }} status="complete" />,
    );
    expect(deepText(container)).toContain('thinking-body');
  });
});

describe('ChatMarkdown', () => {
  it('props.content 渲染 Markdown 文本', async () => {
    const { container } = await renderChat(<ChatMarkdown content="markdown-body-text" />);
    expect(deepText(container)).toContain('markdown-body-text');
  });
});

describe('Filecard', () => {
  it('props.item.name 渲染文件名', async () => {
    const { container } = await renderChat(<Filecard item={{ name: 'report.pdf', url: 'u' } as any} />);
    expect(deepText(container)).toContain('report.pdf');
  });
});
