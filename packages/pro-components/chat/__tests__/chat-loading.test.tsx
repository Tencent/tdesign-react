/**
 * ChatLoading 迁移回归守卫
 *
 * 守卫目标：animation / text 两个 prop 的可见表现。
 * 断言只针对「用户能看到的类名与文案」，不关心内容挂在 light DOM 还是 shadow DOM。
 */
import React from 'react';
import { describe, expect, it } from 'vitest';

import { ChatLoading } from '../chat-loading';
import { deepText, hasClassDeep, renderChat } from './helpers';

describe('ChatLoading', () => {
  describe('props.animation', () => {
    const animationCases: [string, string][] = [
      ['skeleton', 't-chat-loading__skeleton'],
      ['moving', 't-chat-loading__moving'],
      ['gradient', 't-chat-loading__gradient'],
      ['dots', 't-chat-loading__dot'],
      ['circle', 't-chat-loading__circle'],
    ];

    animationCases.forEach(([animation, className]) => {
      it(`animation="${animation}" 渲染 ${className}`, async () => {
        const { container } = await renderChat(<ChatLoading animation={animation as any} />);
        expect(hasClassDeep(container, className)).toBe(true);
      });
    });
  });

  describe('props.text', () => {
    it('text 渲染为加载文案', async () => {
      const { container } = await renderChat(<ChatLoading text="加载中" />);
      expect(deepText(container)).toContain('加载中');
    });

    it('text 缺省时仍渲染加载容器', async () => {
      const { container } = await renderChat(<ChatLoading />);
      expect(hasClassDeep(container, 't-chat-loading')).toBe(true);
    });
  });

  describe('DOM 行为', () => {
    it('默认（moving）与其他动画互斥：一次只出现一种动画类名', async () => {
      const { container } = await renderChat(<ChatLoading animation="circle" />);
      expect(hasClassDeep(container, 't-chat-loading__circle')).toBe(true);
      expect(hasClassDeep(container, 't-chat-loading__moving')).toBe(false);
    });
  });
});
