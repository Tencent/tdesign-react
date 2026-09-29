/**
 * ChatSender 迁移回归守卫
 *
 * 守卫目标：输入区最容易被迁移破坏的链路——
 * 值（placeholder / value）→ 输入（onChange）→ 发送（onSend）→ 载荷形态。
 *
 * 说明：两类断言分工不同——
 * 1. 数据类断言用 callArg 解包，只校验「传出的数据」，不绑定传输形态；
 * 2. 「API 调用形态契约」一组断言刻意锁定带 detail 的事件形态，
 *    因为需求要求「保持现有 API 调用方式不变」，调用方现有的 e.detail 写法
 *    必须继续可用。这是需求要求不变的部分，不属于过度绑定实现。
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@test/utils';

import { ChatSender } from '../chat-sender';
import { callArg, deepQuery, flushRender, renderChat } from './helpers';

const getTextarea = (container: Element) => deepQuery(container, 'textarea') as HTMLTextAreaElement | null;

const getSendButton = (container: Element) => deepQuery(container, 'button') as HTMLButtonElement | null;

describe('ChatSender', () => {
  describe('props.placeholder', () => {
    it('透传给输入框', async () => {
      const { container } = await renderChat(<ChatSender placeholder="请输入问题" />);
      expect(getTextarea(container)?.getAttribute('placeholder')).toBe('请输入问题');
    });
  });

  describe('props.value', () => {
    it('受控值写入输入框', async () => {
      const { container } = await renderChat(<ChatSender value="controlled-value" />);
      expect(getTextarea(container)?.value).toBe('controlled-value');
    });
  });

  describe('props.disabled', () => {
    it('输入框与发送按钮同时进入禁用态', async () => {
      const { container } = await renderChat(<ChatSender disabled value="has-value" />);
      expect(getTextarea(container)?.disabled).toBe(true);
      expect(getSendButton(container)?.disabled).toBe(true);
    });
  });

  describe('props.loading 与 events.onStop', () => {
    it('loading 时点击触发 onStop 并传出当前输入值', async () => {
      const onStop = vi.fn();
      const { container } = await renderChat(<ChatSender loading value="stop-me" onStop={onStop} />);

      fireEvent.click(getSendButton(container));
      await flushRender();

      expect(onStop).toHaveBeenCalledTimes(1);
      expect(callArg(onStop)).toBe('stop-me');
    });
  });

  describe('events', () => {
    it('输入触发 onChange 并传出输入值', async () => {
      const onChange = vi.fn();
      const { container } = await renderChat(<ChatSender onChange={onChange} />);

      fireEvent.input(getTextarea(container), {
        target: { value: 'typed-value' },
      });
      await flushRender();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(callArg(onChange)).toBe('typed-value');
    });

    it('onChange 随多次输入连续触发并保留最新值', async () => {
      const onChange = vi.fn();
      const { container } = await renderChat(<ChatSender onChange={onChange} />);
      const textarea = getTextarea(container);

      fireEvent.input(textarea, { target: { value: 'a' } });
      await flushRender();
      fireEvent.input(textarea, { target: { value: 'ab' } });
      await flushRender();

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(callArg(onChange, 1)).toBe('ab');
    });
  });

  describe('关键 API 组合', () => {
    it('输入 → 发送按钮可用 → 点击 → onSend 载荷为 { value, attachments }', async () => {
      const onChange = vi.fn();
      const onSend = vi.fn();
      const { container } = await renderChat(<ChatSender onChange={onChange} onSend={onSend} />);

      fireEvent.input(getTextarea(container), { target: { value: 'send-me' } });
      await flushRender();

      const button = getSendButton(container);
      expect(button?.disabled).toBe(false);

      fireEvent.click(button);
      await flushRender();

      expect(onSend).toHaveBeenCalledTimes(1);
      const payload = callArg(onSend);
      expect(payload.value).toBe('send-me');
      expect(Array.isArray(payload.attachments)).toBe(true);
    });
  });

  describe('API 调用形态契约', () => {
    it('onChange 回调参数是带 detail 的事件，e.detail 为输入值', async () => {
      const onChange = vi.fn();
      const { container } = await renderChat(<ChatSender onChange={onChange} />);

      fireEvent.input(getTextarea(container), { target: { value: 'shape-x' } });
      await flushRender();

      const arg = onChange.mock.calls[0][0];
      expect(arg).toHaveProperty('detail');
      expect(arg.detail).toBe('shape-x');
    });

    it('onSend 回调参数是带 detail 的事件，e.detail 含 value 与 attachments', async () => {
      const onChange = vi.fn();
      const onSend = vi.fn();
      const { container } = await renderChat(<ChatSender onChange={onChange} onSend={onSend} />);

      fireEvent.input(getTextarea(container), { target: { value: 'shape-y' } });
      await flushRender();
      fireEvent.click(getSendButton(container));
      await flushRender();

      const arg = onSend.mock.calls[0][0];
      expect(arg).toHaveProperty('detail');
      expect(arg.detail).toMatchObject({ value: 'shape-y' });
      expect(Array.isArray(arg.detail.attachments)).toBe(true);
    });
  });

  describe('DOM 行为', () => {
    it('空内容时发送按钮禁用', async () => {
      const { container } = await renderChat(<ChatSender />);
      expect(getSendButton(container)?.disabled).toBe(true);
    });

    it('渲染出可输入的文本域', async () => {
      const { container } = await renderChat(<ChatSender />);
      expect(getTextarea(container)).toBeTruthy();
    });
  });
});
