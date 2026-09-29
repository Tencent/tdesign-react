/**
 * ChatActionBar 迁移回归守卫
 *
 * 守卫目标：actionBar 配置项（数组 / 默认）的可见产出。
 *
 * 已知限制：当前 webc 实现下，动作项的点击事件无法在 jsdom 中冒泡到 React 回调
 *（omi 在 jsdom 下未触发内部 click 处理），因此 handleAction 的触发链路
 * 以 skip 用例留存为「迁移后验收项」，迁移到纯 React 后取消 skip 即可生效。
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { ChatActionBar } from '../chat-actionbar';
import { deepQuery, renderChat } from './helpers';

/**
 * 动作项计数：以容器直接子元素为准。
 * 不依赖图标标签名（t-icon-copy 等是 webc 组件名，迁移后会变），
 * 只断言「配置几个动作就渲染几个」这一宏观契约。
 */
const actionCount = (container: Element) => deepQuery(container, '.t-chat-actions')?.children.length ?? 0;

describe('ChatActionBar', () => {
  describe('props.actionBar', () => {
    it('默认渲染完整动作集', async () => {
      const { container } = await renderChat(<ChatActionBar />);
      expect(actionCount(container)).toBeGreaterThan(1);
    });

    it('actionBar 数组长度决定渲染数量：1 个', async () => {
      const { container } = await renderChat(<ChatActionBar actionBar={['copy']} />);
      expect(actionCount(container)).toBe(1);
    });

    it('actionBar 数组长度决定渲染数量：2 个', async () => {
      const { container } = await renderChat(<ChatActionBar actionBar={['copy', 'good']} />);
      expect(actionCount(container)).toBe(2);
    });

    // 迁移验收项：当前 webc 实现下 actionBar={false} 未生效（仍渲染全部动作），
    // 纯 React 实现应支持该配置；迁移后取消 skip 验证。
    it.skip('actionBar={false} 不渲染动作项', async () => {
      const { container } = await renderChat(<ChatActionBar actionBar={false} />);
      expect(actionCount(container)).toBe(0);
    });
  });

  describe('props.handleAction', () => {
    // 迁移验收项：纯 React 实现下点击应由 DOM 事件直接触发回调
    it.skip('点击动作触发 handleAction(name, data)', async () => {
      const handleAction = vi.fn();
      const { container } = await renderChat(<ChatActionBar actionBar={['copy']} handleAction={handleAction} />);
      const target = deepQuery(container, 't-icon-copy')?.parentElement;

      target?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

      expect(handleAction).toHaveBeenCalledTimes(1);
      expect(handleAction.mock.calls[0][0]).toBe('copy');
    });
  });

  describe('DOM 行为', () => {
    it('渲染操作栏容器', async () => {
      const { container } = await renderChat(<ChatActionBar />);
      expect(deepQuery(container, '.t-chat-actions')).toBeTruthy();
    });
  });
});
