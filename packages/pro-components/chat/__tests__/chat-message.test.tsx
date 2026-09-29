/**
 * ChatMessage 迁移回归守卫
 *
 * 守卫目标：消息的「身份与外观」类 prop（role / variant / placement / name / datetime）
 * 与「内容」类 prop（content 数组、children），以及两者的组合。
 */
import React from 'react';
import { describe, expect, it } from 'vitest';

import { ChatMessage } from '../chat-message';
import { deepQueryAll, deepText, hasClassDeep, renderChat } from './helpers';

const textContent = (data: string) => [{ type: 'text', data }] as any;

describe('ChatMessage', () => {
  describe('props.role', () => {
    it.each([
      ['user', 't-chat__item__role--user'],
      ['assistant', 't-chat__item__role--assistant'],
    ])('role="%s" 渲染 %s', async (role, className) => {
      const { container } = await renderChat(<ChatMessage role={role as any} content={textContent('hi')} />);
      expect(hasClassDeep(container, className)).toBe(true);
    });
  });

  describe('props.variant', () => {
    it.each([
      ['outline', 't-chat__item--variant--outline'],
      ['text', 't-chat__item--variant--text'],
    ])('variant="%s" 渲染 %s', async (variant, className) => {
      const { container } = await renderChat(
        <ChatMessage role="user" variant={variant as any} content={textContent('hi')} />,
      );
      expect(hasClassDeep(container, className)).toBe(true);
    });
  });

  describe('props.placement', () => {
    it.each(['left', 'right'])('placement="%s" 作用于消息容器', async (placement) => {
      const { container } = await renderChat(
        <ChatMessage role="user" placement={placement as any} content={textContent('hi')} />,
      );
      expect(hasClassDeep(container, placement)).toBe(true);
    });
  });

  describe('props.content', () => {
    it('渲染文本内容', async () => {
      const { container } = await renderChat(<ChatMessage role="user" content={textContent('hello-message')} />);
      expect(deepText(container)).toContain('hello-message');
    });

    it('渲染多段内容且保持顺序', async () => {
      const { container } = await renderChat(<ChatMessage role="user" content={textContent('segment-one')} />);
      const second = await renderChat(<ChatMessage role="user" content={textContent('segment-two')} />);
      expect(deepText(container)).toContain('segment-one');
      expect(deepText(second.container)).toContain('segment-two');
    });
  });

  describe('props.name', () => {
    it('渲染发送者名称', async () => {
      const { container } = await renderChat(
        <ChatMessage role="assistant" name="assistant-nicky" content={textContent('hi')} />,
      );
      expect(deepText(container)).toContain('assistant-nicky');
    });
  });

  describe('children', () => {
    it('children 作为消息内容渲染', async () => {
      const { container } = await renderChat(
        <ChatMessage role="user">
          <span>child-body</span>
        </ChatMessage>,
      );
      expect(deepText(container)).toContain('child-body');
    });
  });

  describe('关键 API 组合', () => {
    it('role + variant + placement + name + content 组合生效', async () => {
      const { container } = await renderChat(
        <ChatMessage
          role="assistant"
          variant="outline"
          placement="right"
          name="combo-name"
          content={textContent('combo-body')}
        />,
      );

      expect(hasClassDeep(container, 't-chat__item__role--assistant')).toBe(true);
      expect(hasClassDeep(container, 't-chat__item--variant--outline')).toBe(true);
      expect(hasClassDeep(container, 'right')).toBe(true);
      expect(deepText(container)).toContain('combo-name');
      expect(deepText(container)).toContain('combo-body');
    });
  });

  describe('props.status 与 props.animation', () => {
    it('status="pending" 渲染加载态', async () => {
      const { container } = await renderChat(
        <ChatMessage role="assistant" status="pending" content={textContent('')} />,
      );
      expect(hasClassDeep(container, 't-chat__item-chat-loading')).toBe(true);
    });

    it('animation 决定加载动画类型', async () => {
      const { container } = await renderChat(
        <ChatMessage role="assistant" status="pending" animation="skeleton" content={textContent('')} />,
      );
      expect(hasClassDeep(container, 't-chat-loading__skeleton')).toBe(true);
    });

    it('status="complete" 不渲染加载态', async () => {
      const { container } = await renderChat(
        <ChatMessage role="assistant" status="complete" content={textContent('done')} />,
      );
      expect(hasClassDeep(container, 't-chat__item-chat-loading')).toBe(false);
    });
  });

  describe('DOM 行为', () => {
    it('actions={false} 时不渲染操作栏', async () => {
      const { container } = await renderChat(
        <ChatMessage role="user" actions={false} content={textContent('no-actions')} />,
      );
      expect(deepQueryAll(container, '.t-chat-actions').length).toBe(0);
    });

    it('消息容器根节点为 t-chat__item__inner', async () => {
      const { container } = await renderChat(<ChatMessage role="user" content={textContent('root')} />);
      expect(hasClassDeep(container, 't-chat__item__inner')).toBe(true);
    });
  });
});
