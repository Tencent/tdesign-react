/**
 * ChatBot 迁移回归守卫
 *
 * 守卫目标：
 * 1. defaultMessages —— 消息列表的初始渲染（最核心的数据入口）
 * 2. senderProps / messageProps —— 向内部 Sender / Message 的透传（组合类 API）
 * 3. ref 实例方法 —— 命令式 API，迁移最容易丢失的一层
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ChatBot } from '../chatbot';
import { callArg, deepQuery, deepQueryAll, deepText, flushRender, hasClassDeep, renderChat } from './helpers';

const userMessage = (id: string, data: string) =>
  ({
    id,
    role: 'user',
    status: 'complete',
    content: [{ type: 'text', data }],
  }) as any;

describe('ChatBot', () => {
  describe('props.defaultMessages', () => {
    it('按条数渲染消息项', async () => {
      const { container } = await renderChat(
        <ChatBot defaultMessages={[userMessage('m1', 'first-msg'), userMessage('m2', 'second-msg')]} />,
        500,
      );
      expect(deepQueryAll(container, '.t-chat__item__inner').length).toBe(2);
    });

    it('渲染消息内容文本', async () => {
      const { container } = await renderChat(<ChatBot defaultMessages={[userMessage('m1', 'bot-user-text')]} />, 500);
      expect(deepText(container)).toContain('bot-user-text');
    });
  });

  describe('关键 API 组合', () => {
    it('senderProps 透传到输入框 placeholder', async () => {
      const { container } = await renderChat(
        <ChatBot
          defaultMessages={[userMessage('m1', 'x')]}
          senderProps={{ placeholder: 'sender-placeholder' } as any}
        />,
        500,
      );
      expect(deepQuery(container, 'textarea')?.getAttribute('placeholder')).toBe('sender-placeholder');
    });

    it('messageProps 按角色透传到消息项 variant', async () => {
      const { container } = await renderChat(
        <ChatBot defaultMessages={[userMessage('m1', 'x')]} messageProps={{ user: { variant: 'outline' } } as any} />,
        500,
      );
      expect(hasClassDeep(container, 't-chat__item--variant--outline')).toBe(true);
    });

    it('defaultMessages + senderProps + messageProps 同时生效', async () => {
      const { container } = await renderChat(
        <ChatBot
          defaultMessages={[userMessage('m1', 'combo-text')]}
          senderProps={{ placeholder: 'combo-placeholder' } as any}
          messageProps={{ user: { variant: 'outline' } } as any}
        />,
        500,
      );

      expect(deepText(container)).toContain('combo-text');
      expect(deepQuery(container, 'textarea')?.getAttribute('placeholder')).toBe('combo-placeholder');
      expect(hasClassDeep(container, 't-chat__item--variant--outline')).toBe(true);
    });
  });

  describe('实例方法（ref）', () => {
    it('ref 暴露命令式 API', async () => {
      const ref = React.createRef<any>();
      await renderChat(<ChatBot ref={ref} defaultMessages={[userMessage('m1', 'x')]} />, 500);

      expect(ref.current).toBeTruthy();
      [
        'sendUserMessage',
        'sendAIMessage',
        'sendSystemMessage',
        'abortChat',
        'addPrompt',
        'selectFile',
        'regenerate',
        'scrollList',
      ].forEach((method) => {
        expect(typeof ref.current[method]).toBe('function');
      });
    });

    it('ref 暴露消息列表读取能力', async () => {
      const ref = React.createRef<any>();
      await renderChat(<ChatBot ref={ref} defaultMessages={[userMessage('m1', 'x')]} />, 500);

      const messages = ref.current?.chatMessageValue ?? ref.current?.messages;
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(1);
    });
  });

  describe('实例方法行为（ref）', () => {
    it('addPrompt 把预设提示写入输入框', async () => {
      const ref = React.createRef<any>();
      const { container } = await renderChat(<ChatBot ref={ref} defaultMessages={[userMessage('m1', 'x')]} />, 500);

      ref.current?.addPrompt('prompted-text');
      await flushRender();

      expect((deepQuery(container, 'textarea') as HTMLTextAreaElement | null)?.value).toBe('prompted-text');
    });

    it('setMessages 以 replace 模式替换消息列表', async () => {
      const ref = React.createRef<any>();
      const { container } = await renderChat(<ChatBot ref={ref} defaultMessages={[userMessage('m1', 'old')]} />, 500);

      ref.current?.setMessages([userMessage('n1', 'new-msg-1'), userMessage('n2', 'new-msg-2')], 'replace');
      await flushRender();

      expect(deepQueryAll(container, '.t-chat__item__inner').length).toBe(2);
      expect(deepText(container)).toContain('new-msg-1');
    });

    it('ref 暴露运行状态', async () => {
      const ref = React.createRef<any>();
      await renderChat(<ChatBot ref={ref} defaultMessages={[userMessage('m1', 'x')]} />, 500);

      expect(ref.current?.isChatEngineReady).toBe(true);
      expect(ref.current?.chatStatus).toBeTruthy();
    });
  });

  describe('props.chatServiceConfig 与会话事件', () => {
    it('onChatReady 在引擎就绪后触发', async () => {
      const onChatReady = vi.fn();
      await renderChat(<ChatBot onChatReady={onChatReady} />, 800);
      expect(onChatReady).toHaveBeenCalledTimes(1);
    });

    it('onMessageChange 传出消息列表', async () => {
      const onMessageChange = vi.fn();
      await renderChat(<ChatBot defaultMessages={[userMessage('m1', 'x')]} onMessageChange={onMessageChange} />, 800);

      expect(onMessageChange).toHaveBeenCalled();
      const messages = callArg(onMessageChange);
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(1);
    });

    it('chatServiceConfig 下正常渲染并就绪', async () => {
      const onChatReady = vi.fn();
      const { container } = await renderChat(
        <ChatBot
          chatServiceConfig={{ endpoint: 'https://example.invalid/api', stream: false } as any}
          onChatReady={onChatReady}
        />,
        800,
      );

      expect(deepQuery(container, 'textarea')).toBeTruthy();
      expect(onChatReady).toHaveBeenCalledTimes(1);
    });

    // 迁移验收项：需 mock 一次成功的 SSE 响应才会触发（失败路径不触发该回调）。
    // 迁移到纯 React 后建议用 mock service 补充此用例。
    it.skip('onChatAfterSend 在发送消息后触发', async () => {
      const onChatAfterSend = vi.fn();
      const ref = React.createRef<any>();
      await renderChat(
        <ChatBot
          ref={ref}
          chatServiceConfig={{ endpoint: 'https://example.invalid/api', stream: false } as any}
          onChatAfterSend={onChatAfterSend}
        />,
        800,
      );

      await ref.current?.sendUserMessage?.({ prompt: 'hello' });
      await flushRender(500);

      expect(onChatAfterSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('DOM 行为', () => {
    it('渲染消息列表与输入区', async () => {
      const { container } = await renderChat(<ChatBot defaultMessages={[userMessage('m1', 'x')]} />, 500);
      expect(deepQueryAll(container, '.t-chat__item__inner').length).toBeGreaterThan(0);
      expect(deepQuery(container, 'textarea')).toBeTruthy();
    });
  });
});
